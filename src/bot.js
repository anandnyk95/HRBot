const { ActivityTypes, ActivityHandler, MessageFactory, ConversationState, TurnContext, UserState, CardFactory } = require('botbuilder');
const { DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');
// const { CardFactory } = require('botbuilder-ai');
const { HRDialog } = require('./dialogs/hrDialog');
const { HelpDialog } = require('./dialogs/helpDialog');
const welcomeCard = require('./welcomeCard.json'); // Import the welcome card from the JSON file

class HRBot extends ActivityHandler {
  constructor(conversationState, userState) {
    super();

    // Set up state management
    this.conversationState = conversationState;
    this.userState = userState;

    // Add dialogs
    this.dialogs = new DialogSet(this.conversationState.createProperty('dialogState'));
    this.dialogs.add(new HRDialog('hrDialog'));
    this.dialogs.add(new HelpDialog('helpDialog'));
    // Add other dialogs here

    // Handle incoming activities
    this.onMessage(async (context, next) => {
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
  }
}

module.exports.HRBot = HRBot;
