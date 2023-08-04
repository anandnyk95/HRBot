const { WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');

class HRDialog extends ComponentDialog {
  constructor(id) {
    super(id || 'hrDialog');

    this.addDialog(new WaterfallDialog('hrDialog', [
      async (step) => {
        await step.context.sendActivity('Welcome to the HR bot! How can I assist you with HR-related queries?');
        return await step.endDialog();
      }
    ]));
  }
}

module.exports = { HRDialog }; // Export as an object
