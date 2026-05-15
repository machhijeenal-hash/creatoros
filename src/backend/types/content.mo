import CommonTypes "common";

module {
  public type Platform = {
    #YouTube;
    #TikTok;
    #Instagram;
    #Twitter;
    #Blog;
    #Other;
  };

  public type ContentStatus = {
    #Idea;
    #Scripting;
    #Editing;
    #Scheduled;
    #Posted;
  };

  public type AIGeneration = {
    id : Nat;
    userPrincipal : CommonTypes.UserId;
    niche : Text;
    platform : Text;
    audience : Text;
    tone : Text;
    goal : Text;
    outputText : Text;
    createdAt : CommonTypes.Timestamp;
    saved : Bool;
    favorite : Bool;
  };

  public type AIGenerationParams = {
    niche : Text;
    platform : Text;
    audience : Text;
    tone : Text;
    goal : Text;
  };

  public type ContentItem = {
    id : Nat;
    userPrincipal : CommonTypes.UserId;
    title : Text;
    platform : Platform;
    status : ContentStatus;
    deadline : ?CommonTypes.Timestamp;
    notes : Text;
    createdAt : CommonTypes.Timestamp;
    updatedAt : CommonTypes.Timestamp;
  };
}
