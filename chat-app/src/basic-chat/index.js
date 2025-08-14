import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
  });

const context = [{
    role: "system",
    content: "you are a helpful chatbot" 
}];

async function  createChatCompletetion(){
    const response = await openai.chat.completions.create({
        model:"chatgpt-4o-latest",
        messages: context
    })

    const responseMessage = response.choices[0].message;

    context.push({
        role:"assistant",
        content: responseMessage.content,
    })

    console.log(`${response.choices[0].message.role} : ${response.choices[0].message.content}`)
}

process.stdin.addListener('data', async function (input){
    const userInput = input.toString().trim();

    context.push({
        role:"user",
        content: userInput
    })

    await createChatCompletetion();
})