import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import UserTypes "../types/users";
import CommonTypes "../types/common";
import UsersLib "../lib/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles : Map.Map<Principal, UserTypes.UserProfile>,
  settings : Map.Map<Principal, UserTypes.UserSettings>,
  subscriptions : Map.Map<Principal, UserTypes.Subscription>,
) {
  public query ({ caller }) func getUserProfile() : async ?UserTypes.UserProfile {
    UsersLib.getProfile(profiles, caller);
  };

  public shared ({ caller }) func createOrUpdateUser(
    displayName : Text,
    email : Text,
  ) : async CommonTypes.Result<UserTypes.UserProfile, Text> {
    if (caller.isAnonymous()) {
      return #err "Anonymous callers cannot create profiles";
    };
    UsersLib.createOrUpdate(profiles, settings, subscriptions, caller, displayName, email);
  };

  public shared ({ caller }) func updateUserSettings(
    newSettings : UserTypes.UserSettings,
  ) : async CommonTypes.Result<Bool, Text> {
    if (caller.isAnonymous()) {
      return #err "Anonymous callers cannot update settings";
    };
    UsersLib.updateSettings(settings, caller, newSettings);
  };

  public shared ({ caller }) func updateSubscriptionTier(
    target : Principal,
    tier : CommonTypes.SubscriptionTier,
    stripeSubId : Text,
    stripeCustomerId : Text,
    periodStart : CommonTypes.Timestamp,
    periodEnd : CommonTypes.Timestamp,
  ) : async CommonTypes.Result<Bool, Text> {
    // Only the target user themselves or admins can update subscription
    if (
      not Principal.equal(caller, target) and
      not AccessControl.hasPermission(accessControlState, caller, #admin)
    ) {
      Runtime.trap("Unauthorized: Cannot update subscription for another user");
    };
    UsersLib.updateSubscription(
      profiles,
      subscriptions,
      target,
      tier,
      stripeSubId,
      stripeCustomerId,
      periodStart,
      periodEnd,
    );
  };
}
