const { ActivityTypes, ActivityHandler, MessageFactory, ConversationState, TurnContext, UserState, CardFactory } = require('botbuilder');
const { DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');
const { HRDialog } = require('./dialogs/hrDialog');
const { HelpDialog } = require('./dialogs/helpDialog');
const welcomeCard = require('../resources/welcomeCard.json');
const { OpenAI } = require('./dialogs/openAI');

class HRBot extends ActivityHandler {
  constructor(conversationState, userState) {
    super();

    // Create and add conversation state
    this.conversationState = conversationState;
    this.conversationStateAccessor = this.conversationState.createProperty('conversationState');
    this.userState = userState;
    this.userProfileAccessor = this.userState.createProperty('userProfile');

    // Add dialogs
    this.dialogs = new DialogSet(this.conversationState.createProperty('dialogState'));
    // Add the TextPrompt for capturing user's name
    const textPrompt = new TextPrompt('textPrompt');
    this.dialogs.add(textPrompt);

    this.dialogs.add(new HRDialog('hrDialog'));
    this.dialogs.add(new HelpDialog('helpDialog'));
    this.dialogs.add(new OpenAI('openAI'));
    // Add other dialogs here

    // Handle incoming activities
    this.onMessage(async (context, next) => {
      const dc = await this.dialogs.createContext(context);
      const dialogResult = await dc.continueDialog();
      if (!context.responded) {
        // Check if the user's name has been captured
        if (dialogResult.status === DialogTurnStatus.complete && dialogResult.result) {
          // Store the captured name in user state or any other preferred location
          const userName = dialogResult.result;
          const userProfile = await this.userProfileAccessor.get(context, {}); // Get the user's profile from userState
          userProfile.name = userName; // Save the captured name to the profile
          await this.userProfileAccessor.set(context, userProfile); // Save the updated profile back to userState
          // Now you can proceed with the rest of the logic based on the captured name
        } 
          // Check if the message is an adaptive card action
        else if (context.activity.type === ActivityTypes.Message && context.activity.value && context.activity.value.action) {
          // Handle the adaptive card action based on the action value
          switch (context.activity.value.action) {
            case 'HRServices':
              await dc.beginDialog('hrDialog');
              break;
            case 'Help':
              await dc.beginDialog('helpDialog');
              break;
            case 'OpenAI':
              await dc.beginDialog('openAI');
              break;
            default:
              // Handle unknown action
              await context.sendActivity("Sorry, I didn't understand that. Please try again.");
              break;
          }
        } else {
          // Handle regular messages with dialogs
          const dc = await this.dialogs.createContext(context);
          const dialogResult = await dc.continueDialog();
          if (!context.responded) {
            switch (dialogResult.status) {
              case DialogTurnStatus.empty:
                // Fallback to HR dialog as the default
                await dc.beginDialog('hrDialog');
                break;
              case DialogTurnStatus.complete:
                // End of turn
                await dc.endDialog();
                break;
            }
          }
        }
      }
      await next();
    });

    // Handle other activity types (e.g., welcome, conversationUpdate)
    this.onConversationUpdate(async (context, next) => {
      if (context.activity.membersAdded) {
        for (const member of context.activity.membersAdded) {
          if (member.id !== context.activity.recipient.id) {
            await this.sendWelcomeMessage(context);
          }
        }
      }

      await next();
    });

    // Add other activity handlers here...

  }

  async sendWelcomeMessage(context) {
    // Create an Adaptive Card attachment
    const cardAttachment = CardFactory.adaptiveCard(welcomeCard.adaptiveCard);

    // Create a message activity with the Adaptive Card attachment
    const welcomeMessageActivity = {
      text: welcomeCard.text,
      type: ActivityTypes.Message,
      attachments: [cardAttachment]
    };

    await context.sendActivity(welcomeMessageActivity);
    // Prompt the user for their name
    await this.promptForName(context);
  }

  async promptForName(context) {
    const dc = await this.dialogs.createContext(context);
  
    // Begin the TextPrompt dialog to capture the user's name
    await dc.beginDialog('textPrompt', { prompt: "Before we start, could you please tell me your name?" });
  }
}

module.exports.HRBot = HRBot;
