import { NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from 'langchain';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const model = new ChatOpenAI({
      model: "qwen-max",
      apiKey: process.env.DASHSCOPE_API_KEY,
      temperature: 0.1,
       modelKwargs: {
        max_tokens: 1000,  // ← 注意是 max_tokens，不是 maxTokens
      },
      configuration: {
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      },

    });

    const agent = createAgent({
      model,
      tools: [],
    });

    const res =await agent.invoke({
      messages: [{ role: "user", content: message }]
    })
    console.log(res,'res')
    const messages = res.messages || [];
    const lastMessage = messages[messages.length - 1];
    const reply = lastMessage?.content || JSON.stringify(res);
     return NextResponse.json({
      success: true,
      reply: reply,  // 如果没有 content 就返回整个对象
    });

  } catch (err) {
     console.error('Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : '服务器内部错误',
      },
      { status: 500 }
    );

  }
}