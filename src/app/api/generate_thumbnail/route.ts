import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024', // closest available to a 16:9 ratio
      response_format: 'url',
    });

    const imageUrl = response.data?.[0]?.url;
    return NextResponse.json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
  }
}
