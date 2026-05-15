import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import CommonTypes "../types/common";
import UserTypes "../types/users";

module {
  public func getProfile(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    caller : Principal,
  ) : ?UserTypes.UserProfile {
    profiles.get(caller);
  };

  public func createOrUpdate(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    settings : Map.Map<Principal, UserTypes.UserSettings>,
    _subscriptions : Map.Map<Principal, UserTypes.Subscription>,
    caller : Principal,
    displayName : Text,
    email : Text,
  ) : CommonTypes.Result<UserTypes.UserProfile, Text> {
    let now = Time.now();
    let profile : UserTypes.UserProfile = switch (profiles.get(caller)) {
      case (?existing) {
        { existing with displayName; email; updatedAt = now };
      };
      case null {
        {
          principal = caller;
          displayName;
          email;
          tier = #Free;
          createdAt = now;
          updatedAt = now;
        };
      };
    };
    profiles.add(caller, profile);
    // Create default settings if not present
    if (settings.get(caller) == null) {
      settings.add(caller, {
        aiModel = "gpt-4o-mini";
        temperature = 0.7;
        maxTokens = 2048;
        focusDuration = 25;
        breakDuration = 5;
        darkMode = true;
      });
    };
    #ok profile;
  };

  public func updateSettings(
    settings : Map.Map<Principal, UserTypes.UserSettings>,
    caller : Principal,
    newSettings : UserTypes.UserSettings,
  ) : CommonTypes.Result<Bool, Text> {
    settings.add(caller, newSettings);
    #ok true;
  };

  public func updateSubscription(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    subscriptions : Map.Map<Principal, UserTypes.Subscription>,
    target : Principal,
    tier : CommonTypes.SubscriptionTier,
    stripeSubId : Text,
    stripeCustomerId : Text,
    periodStart : CommonTypes.Timestamp,
    periodEnd : CommonTypes.Timestamp,
  ) : CommonTypes.Result<Bool, Text> {
    let sub : UserTypes.Subscription = {
      tier;
      stripeSubscriptionId = stripeSubId;
      stripeCustomerId;
      active = true;
      currentPeriodStart = periodStart;
      currentPeriodEnd = periodEnd;
    };
    subscriptions.add(target, sub);
    // Update profile tier
    switch (profiles.get(target)) {
      case (?p) { profiles.add(target, { p with tier; updatedAt = Time.now() }) };
      case null {};
    };
    #ok true;
  };

  public func getTier(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    caller : Principal,
  ) : CommonTypes.SubscriptionTier {
    switch (profiles.get(caller)) {
      case (?p) p.tier;
      case null #Free;
    };
  };
}
