const { ActivityTypes, ActivityHandler, MessageFactory, ConversationState, TurnContext, UserState, CardFactory } = require('botbuilder');
const { DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');
const { HRDialog } = require('./dialogs/hrDialog');
const { HelpDialog } = require('./dialogs/helpDialog');
const welcomeCard = require('../resources/welcomeCard.json');
const openai = require('../resources/apiServices/open_ai_api');

class HRBot extends ActivityHandler {
  constructor(conversationState, userState) {
    super();

    // Create and add conversation state
    this.conversationState = conversationState;
    this.conversationStateAccessor = this.conversationState.createProperty('conversationState');
    this.userState = userState;

    // Add dialogs
    this.dialogs = new DialogSet(this.conversationState.createProperty('dialogState'));
    this.dialogs.add(new HRDialog('hrDialog'));
    this.dialogs.add(new HelpDialog('helpDialog'));
    // Add other dialogs here

    // Handle incoming activities
    this.onMessage(async (context, next) => {
      // Check if the message is an adaptive card action
      if (context.activity.type === ActivityTypes.Message && context.activity.value && context.activity.value.action) {
        // Handle the adaptive card action based on the action value
        switch (context.activity.value.action) {
          case 'HRServices':
            await this.sendHRServices(context);
            break;
          case 'Help':
            await this.sendHelp(context);
            break;
          case 'OpenAI':
            // // Start the user input dialog
            // const dc = await this.dialogs.createContext(context);
            // await dc.beginDialog('userInputDialog');
            await this.handleOpenAI(context);
            break;
          default:
            // Handle unknown action
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

  // Handle Open AI API
  async handleOpenAI(context) {
    try {
      const response = await openai.createCompletionApi();
      await context.sendActivity(`OpenAI Response: ${response}`);
    } catch (error) {
      console.error('Error calling OpenAI API:', error.message);
      await context.sendActivity('Sorry, something went wrong while processing your request.');
    }
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
  }
}

module.exports.HRBot = HRBot;
