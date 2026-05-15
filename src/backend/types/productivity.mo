import CommonTypes "common";
import ContentTypes "content";

module {
  public type SessionType = {
    #Focus;
    #Break;
  };

  public type ProductivitySession = {
    id : Nat;
    userPrincipal : CommonTypes.UserId;
    durationMinutes : Nat;
    completedAt : CommonTypes.Timestamp;
    sessionType : SessionType;
  };

  public type DailyTask = {
    id : Nat;
    userPrincipal : CommonTypes.UserId;
    title : Text;
    completed : Bool;
    createdDate : CommonTypes.Timestamp;
  };

  public type DashboardMetrics = {
    contentStreak : Nat;
    productivityScore : Nat;
    weeklyContentCount : Nat;
    focusHoursThisWeek : Float;
    taskCompletionRate : Float;
    recentGenerations : [ContentTypes.AIGeneration];
    nextScheduledContent : ?ContentTypes.ContentItem;
  };
}
