'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { loadCart } from '@/store/cartSlice';
import store from '@/store';
import { loadUserFromStorage } from '@/store/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(loadUserFromStorage());
        store.dispatch(loadCart());
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
