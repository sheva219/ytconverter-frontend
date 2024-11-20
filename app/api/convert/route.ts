import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url, format } = await req.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, format }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Conversion failed');
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to convert video' },
      { status: 500 }
    );
  }
}