import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import UserTypes "types/users";
import ContentTypes "types/content";
import ProductivityTypes "types/productivity";
import MixinUsersApi "mixins/users-api";
import MixinContentApi "mixins/content-api";
import MixinProductivityApi "mixins/productivity-api";

actor {
  // --- Authorization ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- User state ---
  let profiles = Map.empty<Principal, UserTypes.UserProfile>();
  let userSettings = Map.empty<Principal, UserTypes.UserSettings>();
  let subscriptions = Map.empty<Principal, UserTypes.Subscription>();

  // --- Content state ---
  let generations = List.empty<ContentTypes.AIGeneration>();
  let contentItems = List.empty<ContentTypes.ContentItem>();

  // --- Productivity state ---
  let sessions = List.empty<ProductivityTypes.ProductivitySession>();
  let tasks = List.empty<ProductivityTypes.DailyTask>();

  // --- Shared mutable counters ---
  let contentState = { var nextGenId = 0; var nextItemId = 0 };
  let productivityState = { var nextSessionId = 0; var nextTaskId = 0 };

  // --- OpenAI admin key (record wrapper so mixin shares the same mutable cell) ---
  let openAIApiKey = { var value : ?Text = null };

  // --- Stripe config ---
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  // --- Mixins ---
  include MixinUsersApi(accessControlState, profiles, userSettings, subscriptions);
  include MixinContentApi(accessControlState, generations, contentItems, profiles, openAIApiKey, contentState);
  include MixinProductivityApi(accessControlState, sessions, tasks, generations, contentItems, productivityState);

  // --- OpenAI (direct actor methods — required by extension) ---
  public query func isOpenAIConfigured() : async Bool {
    openAIApiKey.value != null;
  };

  public shared ({ caller }) func setOpenAIApiKey(key : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can set the OpenAI API key");
    };
    openAIApiKey.value := ?key;
  };

  // --- Stripe (direct actor methods — required by extension) ---
  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(
    config : Stripe.StripeConfiguration,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(
    items : [Stripe.ShoppingItem],
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    let config = switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?c) { c };
    };
    await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    let config = switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?c) { c };
    };
    await Stripe.getSessionStatus(config, sessionId, transform);
  };

  public query func transform(
    input : OutCall.TransformationInput,
  ) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
