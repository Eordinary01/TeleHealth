import { NextResponse } from 'next/server';

export async function GET(request) {
  const token = request.headers.get('authorization');

  try {
    const response = await fetch(`http://127.0.0.1:8080/appointment`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
