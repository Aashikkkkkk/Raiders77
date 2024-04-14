/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  user: any;
}

const useAuth = create<AuthState & any>(
  devtools((set) => ({
    setToken: (token: string | null) => set({ token }),
    clearToken: () => set({ token: null }),
    token: localStorage.getItem('token') || null,
    setUser: (user: any) => set({ user }),
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null,
  }))
);

export default useAuth;
