require('dotenv').config(); // Load environment variables from .env file
const { Configuration, OpenAIApi } = require('openai');

try {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(configuration);
    
    exports.createCompletionApi = async (userInput = 'What is AI?') => {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: userInput,
            max_tokens: 100,
            temperature: 0
        });
        // console.log(response.data.choices[0].text);
        return response.data.choices[0].text;
    };
    
    exports.createChatCompletionApi = async (userInput = 'What is the capital of India?') => {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: userInput }]
        });
        // console.log(completion.data.choices[0].message.content);
        return completion.data.choices[0].message.content;
    };
    
    exports.createImageApi = async (userInput = 'bird with laptop') => {
        const openai = new OpenAIApi(configuration);
        const response = await openai.createImage({
            prompt: userInput,
            n: 2,
            size: '256x256'
        });
        // console.log(response.data);
        return response.data.data[0].url;
    };
    
    // exports.createImageEditApi = async (userInput = 'A cute baby sea otter wearing a beret') => {
    //     const openai = new OpenAIApi(configuration);
    //     const response = await openai.createImageEdit(
    //         fs.createReadStream('otter.png'), // Pass as argument
    //         fs.createReadStream('mask.png'),
    //         userInput,
    //         2,
    //         '256x256'
    //     );
    
    //     return response.data[0].url;
    // };
    
    // exports.createImageEditApi = async (userInput) => {
    //     const response = await openai.createImageVariation(
    //         fs.createReadStream('otter.png'), // Pass as argument
    //         2,
    //         '1024x1024'
    //     );
    
    //     return response.data[0].url;
    // };
    
} catch (error) {
    console.error('Error calling OpenAI API:', error.message);
}

