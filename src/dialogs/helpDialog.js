const { WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');

class HelpDialog extends ComponentDialog {
  constructor(id) {
    super(id || 'helpDialog');

    this.addDialog(new WaterfallDialog('helpDialog', [
      async (step) => {
        await step.context.sendActivity('You can ask me HR-related questions or seek help with our services.');
        return await step.endDialog();
      }
    ]));
  }
}

module.exports = { HelpDialog }; // Export as an object
