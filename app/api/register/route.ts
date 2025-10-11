import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db/postgres';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const existingUser = await pool.query('SELECT id FROM users WHERE login = $1', [email]);
        if (existingUser.rows.length > 0) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertResult = await pool.query(
            `INSERT INTO users (login, password, is_admin)
             VALUES ($1, $2, $3)
             RETURNING id, login, is_admin`,
            [email, hashedPassword, false]
        );
        const user = insertResult.rows[0];
        const jwtSecret = process.env.JWT_SECRET || 'cbacbf18832a1bdf854592b7c4ecd7e90228e7feb794f34972a3e8658a51df43';
        const jwtToken = jwt.sign(
            { id: user.id, login: user.login, is_admin: user.is_admin },
            jwtSecret,
            { expiresIn: '1d' }
        );
        const response = NextResponse.json({ user }, { status: 201 });
        response.cookies.set('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
            path: '/',
        });
        return response;
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ message: 'Registration error' }, { status: 500 });
    }
}
