
```markdown
# HR Chatbot

![Bot Framework Version](https://img.shields.io/badge/bot%20framework-v4.16.0-green)
![Node.js Version](https://img.shields.io/badge/node.js-v14.17.5-green)

## Description

The HR Chatbot is an enterprise-level chatbot developed in Node.js using the Microsoft Bot Framework. The chatbot is designed to assist HR personnel and employees with HR-related queries, provide information about HR services, and offer general help.

## Features

- Proactive welcome message with Adaptive Card interface.
- Dialog-based conversation flow for HR-related queries and help.
- Integrated state management for conversation and user state.
- Basic user authentication placeholder using middleware.

## Prerequisites

- Node.js (version 14.17.5 or later)
- Bot Framework Emulator (for local testing)

## How to Use

1. Clone the repository:

```bash
git clone https://github.com/anandnyk95/HRBot.git
cd HRBot
```

2. Install dependencies:

```bash
npm install
```

3. Set up Environment Variables:

Create a `.env` file in the project root and provide the following variables:

```env
MicrosoftAppId=YOUR_MICROSOFT_APP_ID
MicrosoftAppPassword=YOUR_MICROSOFT_APP_PASSWORD
```

4. Run the Bot:

```bash
node app.js
```

5. Test the Bot:

Open Bot Framework Emulator and connect to `http://localhost:3978/api/messages`.

## Folder Structure

- `src/`: Contains the bot implementation and dialogs.
- `dialogs/`: Custom dialog classes for HR and Help functionality.
- `middleware/`: Custom middleware for authentication (placeholder).
- `app.js`: Main entry point for the bot.
- `welcomeMessage.json`: Welcome message and Adaptive Card definition.

## Author

Anand Nayak (GitHub: [your-username](https://github.com/your-username))

## License

This project is licensed under the [MIT License](LICENSE).
```
