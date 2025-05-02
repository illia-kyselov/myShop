import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    response.cookies.set('token', '', { path: '/', expires: new Date(0) });
    return response;
}
