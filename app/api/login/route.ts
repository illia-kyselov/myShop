import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db/postgres';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const userResult = await pool.query('SELECT * FROM users WHERE login = $1', [email]);
        if (userResult.rows.length === 0) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }
        const user = userResult.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }
        const jwtSecret = process.env.JWT_SECRET || 'cbacbf18832a1bdf854592b7c4ecd7e90228e7feb794f34972a3e8658a51df43';
        const jwtToken = jwt.sign(
            { id: user.id, login: user.login, is_admin: user.is_admin },
            jwtSecret,
            { expiresIn: '1d' }
        );
        const response = NextResponse.json({ user }, { status: 200 });
        response.cookies.set('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
            path: '/',
        });
        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Login error' }, { status: 500 });
    }
}
