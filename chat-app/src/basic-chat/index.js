import OpenAI from 'openai';
import { encoding_for_model } from 'tiktoken' 


const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
  });

const MAX_TOKEN = 700;

const encoder = encoding_for_model('gpt-3.5-turbo')

const context = [{
    role: "system",
    content: "you are a helpful chatbot" 
}];

async function  createChatCompletetion(){
    const response = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages: context
    })

    const responseMessage = response.choices[0].message;

    if(response?.usage.total_tokens > MAX_TOKEN){
        deleteOlderMessages();
    }

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

function deleteOlderMessages(){
    let contextLength = getContextLength();

    while(contextLength > MAX_TOKEN){
        for(let i=0; i<context.length;i++){
            if(context[i].role!=="system"){
                context.splice(i,1);
                contextLength = getContextLength();
                console.log("new context length : ", contextLength);
                break;
            }
        }
    }
}

function getContextLength(){
    let length = 0;
    for(let i=0 ; i<context.length;i++){
        if(typeof context[i].content === "string"){
            length += encoder.encode(context[i].content).length;
        }
        else if(Array.isArray(context[i].content)){
            context[i].content.forEach((messageContent) => {
                length += encoder.encode(messageContent.content).length;
            })
        }
    }
    return length;
}