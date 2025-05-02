import { User } from '@/types/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface LoginData { email: string; password: string; token?: string }
interface RegisterData { email: string; password: string; name?: string; token?: string }

export const loginUser = createAsyncThunk<User, LoginData>(
    'auth/loginUser',
    async ({ email, password, token }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, token })
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const errorMsg = errorData.error || 'Ошибка входа';
                return rejectWithValue(errorMsg);
            }
            const data = await res.json();
            return data.user as User;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const registerUser = createAsyncThunk<User, RegisterData>(
    'auth/registerUser',
    async ({ name, email, password, token }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, token, name })
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const errorMsg = errorData.error || 'Ошибка регистрации';
                return rejectWithValue(errorMsg);
            }
            const data = await res.json();
            return data.user as User;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);
