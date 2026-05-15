import { defaultConfig; type Config } "mo:openai-client/Config";
import ChatApi "mo:openai-client/Apis/ChatApi";
import CreateChatCompletionRequest "mo:openai-client/Models/CreateChatCompletionRequest";
import ChatCompletionRequestUserMessage "mo:openai-client/Models/ChatCompletionRequestUserMessage";
import Runtime "mo:core/Runtime";

module {
  public func configForKey(key : Text) : Config {
    {
      defaultConfig with
      auth = ?#bearer key;
      is_replicated = ?false;
    };
  };

  public func buildPrompt(
    niche : Text,
    platform : Text,
    audience : Text,
    tone : Text,
    goal : Text,
  ) : Text {
    "You are an expert content strategist for " # niche # " creators.\n\n" #
    "Platform: " # platform # "\n" #
    "Target Audience: " # audience # "\n" #
    "Tone: " # tone # "\n" #
    "Content Goal: " # goal # "\n\n" #
    "Generate 5 high-quality, viral content ideas with:\n" #
    "1. A compelling hook or title\n" #
    "2. Brief concept description (2-3 sentences)\n" #
    "3. Key talking points (3 bullet points)\n" #
    "4. A strong CTA suggestion\n\n" #
    "Format each idea clearly numbered. Make them specific, actionable, and optimized for engagement on " # platform # ".";
  };

  public func runChatCompletion(config : Config, prompt : Text) : async* Text {
    let userMessage = ChatCompletionRequestUserMessage.JSON.init({
      content = #string(prompt);
      role = #user;
    });
    let req = CreateChatCompletionRequest.JSON.init({
      messages = [#user(userMessage)];
      model = "gpt-4o-mini";
    });
    let resp = await* ChatApi.createChatCompletion(config, req);
    if (resp.choices.size() == 0) {
      Runtime.trap("OpenAI returned no choices");
    };
    switch (resp.choices[0].message.content) {
      case (?text) text;
      case null Runtime.trap("OpenAI returned no text content");
    };
  };
}
