export interface User {
    id: number;
    login: string;
    password: string;
    is_admin: boolean;
    avatar?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface Product {
    id: number
    name: string
    image_url: string
    price: number
    discount: number
    description: string
}