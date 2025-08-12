import { OpenAI } from 'openai';

// const openai = new OpenAI();
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
  });

async function main(){
    const response  = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages: [{
            role: 'user',
            content: "how tall is mount everest?"
        }]
    })

    console.log(response.choices[0].message.content)
}

main()