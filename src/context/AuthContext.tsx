import { createContext } from 'react';

type AuthContextType = {
  token: string;
  userId: string | null;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: number;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  setFullName: (v: string) => void;
  setPhone: (v: string) => void;
  setAddress: (v: string) => void;
  setAvatar: (v: number) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
