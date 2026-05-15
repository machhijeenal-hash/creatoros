import CommonTypes "common";

module {
  public type UserProfile = {
    principal : CommonTypes.UserId;
    displayName : Text;
    email : Text;
    tier : CommonTypes.SubscriptionTier;
    createdAt : CommonTypes.Timestamp;
    updatedAt : CommonTypes.Timestamp;
  };

  public type UserSettings = {
    aiModel : Text;
    temperature : Float;
    maxTokens : Nat;
    focusDuration : Nat;
    breakDuration : Nat;
    darkMode : Bool;
  };

  public type Subscription = {
    tier : CommonTypes.SubscriptionTier;
    stripeSubscriptionId : Text;
    stripeCustomerId : Text;
    active : Bool;
    currentPeriodStart : CommonTypes.Timestamp;
    currentPeriodEnd : CommonTypes.Timestamp;
  };
}
