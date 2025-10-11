import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './authActions';
import { User } from '@/types/types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutSuccess(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('user');
        },
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        loadUserFromStorage(state) {
            const stored = localStorage.getItem('user');
            if (stored) {
                state.user = JSON.parse(stored);
                state.isAuthenticated = true;
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loginUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'Login error';
            })
            .addCase(registerUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'Registration error';
            });
    },
});

export const { logoutSuccess, setUser, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
