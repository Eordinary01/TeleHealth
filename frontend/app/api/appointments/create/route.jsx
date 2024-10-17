import { NextResponse } from 'next/server';

export async function POST(request) {
  const token = request.headers.get('authorization');
  const body = await request.json();

  try {
    const response = await fetch(`http://127.0.0.1:8080/appointment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },    
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
