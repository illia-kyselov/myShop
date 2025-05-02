import { User } from "@/types/types";
import { createStore } from "redux";

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authReducer = (state = initialState, action: any): AuthState => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        default:
            return state;
    }
};

export type RootState = {
    [x: string]: any;
    auth: AuthState;
};

export const store = createStore(authReducer);
