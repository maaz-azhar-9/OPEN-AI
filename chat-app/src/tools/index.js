import OpenAI from "openai";

const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY
})

function getTimeOfDay(){
    return "5:45";
}

function getOrderStatus(orderId){
    const orderNumber = parseInt(orderId);
    return (orderNumber%2) === 0 ? "IN_PROGRESS" : "COMPLETED";
}

async function callOpenAiWithTools() {
    const context = [{
        role: "system",
        content: "you are helpful assistant who give the information about time of day and order status"
    },
    {
        role: "user",
        content: "what is the status of order 1233?"
    }
    ]
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: context,
        tools: [{
            type: "function",
            function: {
                name: 'getTimeOfDay',
                description: "Get the time of day"
            }
        },
        {
            type: 'function',
            function:{
                name: 'getOrderStatus',
                description: 'Returns the status of order',
                parameters:{
                    type:'object',
                    properties: {
                        orderId:{
                            type: 'string',
                            description: "the Id of the order to get the status of"
                        }
                    },
                    required:['orderId']
                }
            }
        }],
        tool_choice: "auto"
    })
    // console.log(response.choices[0].message.content)
    const willInvokeFunction = response.choices?.[0].finish_reason == 'tool_calls';

    const toolCall = response.choices[0].message.tool_calls[0]

    if (willInvokeFunction) {
        const toolName = toolCall.function.name;
        if (toolName == "getTimeOfDay") {
            const toolResponse = getTimeOfDay();
            context.push(response.choices[0].message);
            context.push({
                role: "tool",
                content: toolResponse,
                tool_call_id: toolCall.id
            })
        }
        if (toolName == "getOrderStatus") {
            const rawArguments = toolCall.function.arguments;
            const parsedRawArguments = JSON.parse(rawArguments);
            const toolResponse = getOrderStatus(parsedRawArguments.orderId);
            context.push(response.choices[0].message);
            context.push({
                role: "tool",
                content: toolResponse,
                tool_call_id: toolCall.id
            })
        }
    }

    const secondResponse = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages: context,
    })

    console.log(`${secondResponse.choices?.[0].message.content}`)
}


callOpenAiWithTools();