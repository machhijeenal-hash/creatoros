import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import ProductivityTypes "../types/productivity";
import ContentTypes "../types/content";
import CommonTypes "../types/common";
import ProductivityLib "../lib/productivity";

mixin (
  accessControlState : AccessControl.AccessControlState,
  sessions : List.List<ProductivityTypes.ProductivitySession>,
  tasks : List.List<ProductivityTypes.DailyTask>,
  generations : List.List<ContentTypes.AIGeneration>,
  contentItems : List.List<ContentTypes.ContentItem>,
  state : {
    var nextSessionId : Nat;
    var nextTaskId : Nat;
  },
) {
  public query ({ caller }) func listProductivitySessions(
    limit : Nat,
  ) : async [ProductivityTypes.ProductivitySession] {
    ProductivityLib.listSessions(sessions, caller, limit);
  };

  public shared ({ caller }) func logProductivitySession(
    durationMinutes : Nat,
    sessionType : ProductivityTypes.SessionType,
  ) : async CommonTypes.Result<ProductivityTypes.ProductivitySession, Text> {
    if (caller.isAnonymous()) {
      return #err "Authentication required";
    };
    ProductivityLib.logSession(sessions, state, caller, durationMinutes, sessionType);
  };

  public query ({ caller }) func listDailyTasks(
    date : CommonTypes.Timestamp,
  ) : async [ProductivityTypes.DailyTask] {
    ProductivityLib.listTasks(tasks, caller, date);
  };

  public shared ({ caller }) func createDailyTask(
    title : Text,
    date : CommonTypes.Timestamp,
  ) : async CommonTypes.Result<ProductivityTypes.DailyTask, Text> {
    if (caller.isAnonymous()) {
      return #err "Authentication required";
    };
    ProductivityLib.createTask(tasks, state, caller, title, date);
  };

  public shared ({ caller }) func toggleDailyTask(
    id : Nat,
  ) : async CommonTypes.Result<Bool, Text> {
    ProductivityLib.toggleTask(tasks, caller, id);
  };

  public shared ({ caller }) func deleteDailyTask(
    id : Nat,
  ) : async CommonTypes.Result<Bool, Text> {
    ProductivityLib.deleteTask(tasks, caller, id);
  };

  public query ({ caller }) func getDashboardMetrics() : async ProductivityTypes.DashboardMetrics {
    ProductivityLib.computeMetrics(sessions, tasks, generations, contentItems, caller);
  };
}
