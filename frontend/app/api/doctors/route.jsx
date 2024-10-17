

import { NextResponse } from 'next/server';

export async function GET(request) {
  const token = request.headers.get('authorization');

  try {
    const response = await fetch(`http://127.0.0.1:8080/doctor`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch doctors');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}





// export async function GET(request, { params }) {
//   const token = request.headers.get('authorization');
//   const { id } = params;

//   try {
//     const response = await fetch(`http://127.0.0.1:8080/doctors/${id}`, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch doctor');
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error fetching doctor:', error);
//     return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
//   }
// }