import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken' 

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
  });

async function main(){
    const response  = await openai.chat.completions.create({
        model:"chatgpt-4o-latest",
        messages: [{
            role:"system",
            content:"You respond like a cool bro"
        },
        {
            role: 'user', 
            content: "how tall is mount everest?"
        }]
    })

    console.log(response.choices[0].message.content)
}

function encodePromt(){
    const prompt = "How are you today?";
    const encoder = encoding_for_model("gpt-3.5-turbo");
    const words = encoder.encode(prompt);
    console.log(words);
}

main()
// encodePromt();