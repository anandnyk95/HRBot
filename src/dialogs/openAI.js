const { WaterfallDialog, ComponentDialog } = require('botbuilder-dialogs');
const openai = require('../../resources/apiServices/open_ai_api');

class OpenAI extends ComponentDialog {
  constructor(id) {
    super(id || 'openAI');

    this.addDialog(new WaterfallDialog('openAI', [
      async (step) => {
        await this.handleOpenAI(step);
        return await step.endDialog();
      }
    ]));
  }

  // Handle Open AI API
  async handleOpenAI(step) {
    try {
      const response = await openai.createCompletionApi();
      await step.context.sendActivity(`OpenAI Response: ${response}`);
    } catch (error) {
      console.error('Error calling OpenAI API:', error.message);
      await step.context.sendActivity('Sorry, something went wrong while processing your request.');
    }
  }
}

module.exports = { OpenAI }; // Export as an object