import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import CommonTypes "../types/common";
import ContentTypes "../types/content";

module {
  public func listGenerations(
    generations : List.List<ContentTypes.AIGeneration>,
    caller : Principal,
  ) : [ContentTypes.AIGeneration] {
    let filtered = generations.filter(
      func(g) { Principal.equal(g.userPrincipal, caller) }
    );
    filtered.toArray();
  };

  public func createGeneration(
    generations : List.List<ContentTypes.AIGeneration>,
    state : { var nextGenId : Nat },
    caller : Principal,
    params : ContentTypes.AIGenerationParams,
    outputText : Text,
    tierLimit : ?Nat,
    currentMonthCount : Nat,
  ) : CommonTypes.Result<ContentTypes.AIGeneration, Text> {
    switch (tierLimit) {
      case (?limit) {
        if (currentMonthCount >= limit) {
          return #err(
            "Monthly AI generation limit of " # limit.toText() # " reached. Upgrade to Pro for unlimited generations."
          );
        };
      };
      case null {};
    };
    let id = state.nextGenId;
    state.nextGenId += 1;
    let gen : ContentTypes.AIGeneration = {
      id;
      userPrincipal = caller;
      niche = params.niche;
      platform = params.platform;
      audience = params.audience;
      tone = params.tone;
      goal = params.goal;
      outputText;
      createdAt = Time.now();
      saved = false;
      favorite = false;
    };
    generations.add(gen);
    #ok gen;
  };

  public func countGenerationsThisMonth(
    generations : List.List<ContentTypes.AIGeneration>,
    caller : Principal,
    monthStart : CommonTypes.Timestamp,
  ) : Nat {
    var count = 0;
    generations.forEach(func(g) {
      if (Principal.equal(g.userPrincipal, caller) and g.createdAt >= monthStart) {
        count += 1;
      };
    });
    count;
  };

  public func updateGenerationSaved(
    generations : List.List<ContentTypes.AIGeneration>,
    caller : Principal,
    id : Nat,
    saved : Bool,
  ) : CommonTypes.Result<Bool, Text> {
    var found = false;
    generations.mapInPlace(func(g) {
      if (g.id == id and Principal.equal(g.userPrincipal, caller)) {
        found := true;
        { g with saved };
      } else { g };
    });
    if (found) #ok true else #err "Generation not found";
  };

  public func updateGenerationFavorite(
    generations : List.List<ContentTypes.AIGeneration>,
    caller : Principal,
    id : Nat,
    favorite : Bool,
  ) : CommonTypes.Result<Bool, Text> {
    var found = false;
    generations.mapInPlace(func(g) {
      if (g.id == id and Principal.equal(g.userPrincipal, caller)) {
        found := true;
        { g with favorite };
      } else { g };
    });
    if (found) #ok true else #err "Generation not found";
  };

  public func listContentItems(
    items : List.List<ContentTypes.ContentItem>,
    caller : Principal,
  ) : [ContentTypes.ContentItem] {
    items.filter(
      func(i) { Principal.equal(i.userPrincipal, caller) }
    ).toArray();
  };

  public func createContentItem(
    items : List.List<ContentTypes.ContentItem>,
    state : { var nextItemId : Nat },
    caller : Principal,
    title : Text,
    platform : ContentTypes.Platform,
    status : ContentTypes.ContentStatus,
    deadline : ?CommonTypes.Timestamp,
    notes : Text,
  ) : CommonTypes.Result<ContentTypes.ContentItem, Text> {
    let now = Time.now();
    let id = state.nextItemId;
    state.nextItemId += 1;
    let item : ContentTypes.ContentItem = {
      id;
      userPrincipal = caller;
      title;
      platform;
      status;
      deadline;
      notes;
      createdAt = now;
      updatedAt = now;
    };
    items.add(item);
    #ok item;
  };

  public func updateContentItem(
    items : List.List<ContentTypes.ContentItem>,
    caller : Principal,
    id : Nat,
    title : Text,
    platform : ContentTypes.Platform,
    status : ContentTypes.ContentStatus,
    deadline : ?CommonTypes.Timestamp,
    notes : Text,
  ) : CommonTypes.Result<ContentTypes.ContentItem, Text> {
    var result : CommonTypes.Result<ContentTypes.ContentItem, Text> = #err "Content item not found";
    let now = Time.now();
    items.mapInPlace(func(item) {
      if (item.id == id and Principal.equal(item.userPrincipal, caller)) {
        let updated = { item with title; platform; status; deadline; notes; updatedAt = now };
        result := #ok updated;
        updated;
      } else { item };
    });
    result;
  };

  public func deleteContentItem(
    items : List.List<ContentTypes.ContentItem>,
    caller : Principal,
    id : Nat,
  ) : CommonTypes.Result<Bool, Text> {
    let before = items.size();
    let kept = items.filter(
      func(i) { not (i.id == id and Principal.equal(i.userPrincipal, caller)) }
    );
    items.clear();
    items.append(kept);
    if (items.size() < before) #ok true else #err "Content item not found";
  };
}
