import List "mo:core/List";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import ContentTypes "../types/content";
import CommonTypes "../types/common";
import UserTypes "../types/users";
import ContentLib "../lib/content";
import OpenAILib "../lib/openai";

mixin (
  accessControlState : AccessControl.AccessControlState,
  generations : List.List<ContentTypes.AIGeneration>,
  contentItems : List.List<ContentTypes.ContentItem>,
  profiles : Map.Map<Principal, UserTypes.UserProfile>,
  openAIApiKey : { var value : ?Text },
  state : {
    var nextGenId : Nat;
    var nextItemId : Nat;
  },
) {
  public query ({ caller }) func listGenerations() : async [ContentTypes.AIGeneration] {
    ContentLib.listGenerations(generations, caller);
  };

  public shared ({ caller }) func createGeneration(
    params : ContentTypes.AIGenerationParams,
  ) : async CommonTypes.Result<ContentTypes.AIGeneration, Text> {
    if (caller.isAnonymous()) {
      return #err "Authentication required";
    };
    let apiKey = switch (openAIApiKey.value) {
      case (?k) k;
      case null return #err "AI service not configured";
    };
    // Determine tier limit (Free = 20/month)
    let tier : CommonTypes.SubscriptionTier = switch (profiles.get(caller)) {
      case (?p) p.tier;
      case null #Free;
    };
    let tierLimit : ?Nat = switch (tier) {
      case (#Free) ?20;
      case (#Pro) null;
      case (#Elite) null;
    };
    // Count generations this calendar month
    let now = Time.now();
    // Approximate month start: 30 days ago as conservative bound
    let monthStart = now - 30 * 86_400_000_000_000;
    let monthCount = ContentLib.countGenerationsThisMonth(generations, caller, monthStart);
    // Build prompt and call OpenAI
    let prompt = OpenAILib.buildPrompt(
      params.niche,
      params.platform,
      params.audience,
      params.tone,
      params.goal,
    );
    let config = OpenAILib.configForKey(apiKey);
    let outputText = await* OpenAILib.runChatCompletion(config, prompt);
    ContentLib.createGeneration(
      generations,
      state,
      caller,
      params,
      outputText,
      tierLimit,
      monthCount,
    );
  };

  public shared ({ caller }) func updateGenerationSaved(
    id : Nat,
    saved : Bool,
  ) : async CommonTypes.Result<Bool, Text> {
    ContentLib.updateGenerationSaved(generations, caller, id, saved);
  };

  public shared ({ caller }) func updateGenerationFavorite(
    id : Nat,
    favorite : Bool,
  ) : async CommonTypes.Result<Bool, Text> {
    ContentLib.updateGenerationFavorite(generations, caller, id, favorite);
  };

  public query ({ caller }) func listContentItems() : async [ContentTypes.ContentItem] {
    ContentLib.listContentItems(contentItems, caller);
  };

  public shared ({ caller }) func createContentItem(
    title : Text,
    platform : ContentTypes.Platform,
    status : ContentTypes.ContentStatus,
    deadline : ?CommonTypes.Timestamp,
    notes : Text,
  ) : async CommonTypes.Result<ContentTypes.ContentItem, Text> {
    if (caller.isAnonymous()) {
      return #err "Authentication required";
    };
    ContentLib.createContentItem(contentItems, state, caller, title, platform, status, deadline, notes);
  };

  public shared ({ caller }) func updateContentItem(
    id : Nat,
    title : Text,
    platform : ContentTypes.Platform,
    status : ContentTypes.ContentStatus,
    deadline : ?CommonTypes.Timestamp,
    notes : Text,
  ) : async CommonTypes.Result<ContentTypes.ContentItem, Text> {
    ContentLib.updateContentItem(contentItems, caller, id, title, platform, status, deadline, notes);
  };

  public shared ({ caller }) func deleteContentItem(
    id : Nat,
  ) : async CommonTypes.Result<Bool, Text> {
    ContentLib.deleteContentItem(contentItems, caller, id);
  };
}
