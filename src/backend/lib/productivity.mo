import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Int "mo:core/Int";
import CommonTypes "../types/common";
import ProductivityTypes "../types/productivity";
import ContentTypes "../types/content";
import Array "mo:core/Array";

module {
  public func listSessions(
    sessions : List.List<ProductivityTypes.ProductivitySession>,
    caller : Principal,
    limit : Nat,
  ) : [ProductivityTypes.ProductivitySession] {
    let mine = sessions.filter(
      func(s) { Principal.equal(s.userPrincipal, caller) }
    );
    let arr = mine.toArray();
    let len = arr.size();
    if (limit == 0 or len <= limit) { arr } else {
      let start = len - limit;
      arr.sliceToArray(start, len);
    };
  };

  public func logSession(
    sessions : List.List<ProductivityTypes.ProductivitySession>,
    state : { var nextSessionId : Nat },
    caller : Principal,
    durationMinutes : Nat,
    sessionType : ProductivityTypes.SessionType,
  ) : CommonTypes.Result<ProductivityTypes.ProductivitySession, Text> {
    let id = state.nextSessionId;
    state.nextSessionId += 1;
    let session : ProductivityTypes.ProductivitySession = {
      id;
      userPrincipal = caller;
      durationMinutes;
      completedAt = Time.now();
      sessionType;
    };
    sessions.add(session);
    #ok session;
  };

  public func listTasks(
    tasks : List.List<ProductivityTypes.DailyTask>,
    caller : Principal,
    date : CommonTypes.Timestamp,
  ) : [ProductivityTypes.DailyTask] {
    let dayNs : Int = 86_400_000_000_000;
    tasks.filter(
      func(t) {
        Principal.equal(t.userPrincipal, caller) and
        t.createdDate >= date and
        t.createdDate < date + dayNs
      }
    ).toArray();
  };

  public func createTask(
    tasks : List.List<ProductivityTypes.DailyTask>,
    state : { var nextTaskId : Nat },
    caller : Principal,
    title : Text,
    date : CommonTypes.Timestamp,
  ) : CommonTypes.Result<ProductivityTypes.DailyTask, Text> {
    let id = state.nextTaskId;
    state.nextTaskId += 1;
    let task : ProductivityTypes.DailyTask = {
      id;
      userPrincipal = caller;
      title;
      completed = false;
      createdDate = date;
    };
    tasks.add(task);
    #ok task;
  };

  public func toggleTask(
    tasks : List.List<ProductivityTypes.DailyTask>,
    caller : Principal,
    id : Nat,
  ) : CommonTypes.Result<Bool, Text> {
    var found = false;
    tasks.mapInPlace(func(t) {
      if (t.id == id and Principal.equal(t.userPrincipal, caller)) {
        found := true;
        { t with completed = not t.completed };
      } else { t };
    });
    if (found) #ok true else #err "Task not found";
  };

  public func deleteTask(
    tasks : List.List<ProductivityTypes.DailyTask>,
    caller : Principal,
    id : Nat,
  ) : CommonTypes.Result<Bool, Text> {
    let before = tasks.size();
    let kept = tasks.filter(
      func(t) { not (t.id == id and Principal.equal(t.userPrincipal, caller)) }
    );
    tasks.clear();
    tasks.append(kept);
    if (tasks.size() < before) #ok true else #err "Task not found";
  };

  public func computeMetrics(
    sessions : List.List<ProductivityTypes.ProductivitySession>,
    tasks : List.List<ProductivityTypes.DailyTask>,
    generations : List.List<ContentTypes.AIGeneration>,
    items : List.List<ContentTypes.ContentItem>,
    caller : Principal,
  ) : ProductivityTypes.DashboardMetrics {
    let now = Time.now();
    let weekNs : Int = 7 * 86_400_000_000_000;
    let weekStart = now - weekNs;
    let dayNs : Int = 86_400_000_000_000;

    // Focus hours this week
    var focusMinutes : Nat = 0;
    sessions.forEach(func(s) {
      if (Principal.equal(s.userPrincipal, caller) and s.sessionType == #Focus and s.completedAt >= weekStart) {
        focusMinutes += s.durationMinutes;
      };
    });
    let focusHoursThisWeek : Float = focusMinutes.toFloat() / 60.0;

    // Weekly content count
    var weeklyContentCount : Nat = 0;
    items.forEach(func(i) {
      if (Principal.equal(i.userPrincipal, caller) and i.updatedAt >= weekStart) {
        weeklyContentCount += 1;
      };
    });

    // Task completion rate this week
    var totalTasks : Nat = 0;
    var completedTasks : Nat = 0;
    tasks.forEach(func(t) {
      if (Principal.equal(t.userPrincipal, caller) and t.createdDate >= weekStart) {
        totalTasks += 1;
        if (t.completed) { completedTasks += 1 };
      };
    });
    let taskCompletionRate : Float =
      if (totalTasks == 0) 0.0
      else completedTasks.toFloat() / totalTasks.toFloat();

    // Productivity score (0-100)
    var sessionsThisWeek : Nat = 0;
    sessions.forEach(func(s) {
      if (Principal.equal(s.userPrincipal, caller) and s.sessionType == #Focus and s.completedAt >= weekStart) {
        sessionsThisWeek += 1;
      };
    });
    let sessionScore : Nat = if (sessionsThisWeek >= 10) 40 else sessionsThisWeek * 4;
    let taskScore : Nat = if (totalTasks == 0) 0 else completedTasks * 40 / totalTasks;
    let contentScore : Nat = if (weeklyContentCount >= 5) 20 else weeklyContentCount * 4;
    let productivityScore : Nat = sessionScore + taskScore + contentScore;

    // Content streak: consecutive days with content activity
    var streak : Nat = 0;
    var checking = true;
    var dayOffset : Int = 0;
    label streakLoop loop {
      if (not checking or dayOffset >= 30) { break streakLoop };
      let dayStart = now - (dayOffset + 1) * dayNs;
      let dayEnd = now - dayOffset * dayNs;
      var hasActivity = false;
      items.forEach(func(i) {
        if (
          Principal.equal(i.userPrincipal, caller) and
          i.updatedAt >= dayStart and i.updatedAt < dayEnd
        ) {
          hasActivity := true;
        };
      });
      generations.forEach(func(g) {
        if (
          Principal.equal(g.userPrincipal, caller) and
          g.createdAt >= dayStart and g.createdAt < dayEnd
        ) {
          hasActivity := true;
        };
      });
      if (hasActivity) {
        streak += 1;
        dayOffset += 1;
      } else {
        checking := false;
      };
    };

    // Recent generations (last 5)
    let myGens = generations.filter(
      func(g) { Principal.equal(g.userPrincipal, caller) }
    );
    let gensArr = myGens.toArray();
    let gLen = gensArr.size();
    let recentGenerations =
      if (gLen <= 5) gensArr
      else gensArr.sliceToArray(gLen - 5, gLen);

    // Next scheduled content
    let nextScheduledContent : ?ContentTypes.ContentItem = items.find(
      func(i) {
        Principal.equal(i.userPrincipal, caller) and
        i.status == #Scheduled and
        (switch (i.deadline) { case (?d) d >= now; case null false })
      }
    );

    {
      contentStreak = streak;
      productivityScore;
      weeklyContentCount;
      focusHoursThisWeek;
      taskCompletionRate;
      recentGenerations;
      nextScheduledContent;
    };
  };
}
