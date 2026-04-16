import React, { createContext, useContext, useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { apiJson } from '../services/api';
import { toast } from 'react-toastify';

interface AuthContextData {
  token: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('@Auth:token'));
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const tokenFirebase = await result.user.getIdToken();

      const response = await apiJson<{ token: string }>('auth/google', {
        method: 'POST',
        json: { tokenFirebase }
      });

      if (response && response.token) {
        setToken(response.token);
        localStorage.setItem('@Auth:token', response.token);
        toast.success("Login efetuado com sucesso!");
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      const message = error.message || "Ocorreu um erro ao fazer login.";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setToken(null);
    localStorage.removeItem('@Auth:token');
  };

  return (
    <AuthContext.Provider value={{ token, signInWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
