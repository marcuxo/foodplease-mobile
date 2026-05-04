import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthContextType, AuthUser } from '../types/index';
import { mockUsers, validateEmail } from '../utils/mocks';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('foodplease_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch {
        await AsyncStorage.removeItem('foodplease_user');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (correo: string, clave: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!correo || !clave) throw new Error('Correo y contraseña son requeridos');
      if (!validateEmail(correo)) throw new Error('Formato de correo inválido');

      const foundUser = mockUsers.find((u) => u.correo === correo && u.clave === clave);
      if (!foundUser) throw new Error('Correo o contraseña incorrectos');

      const authUser: AuthUser = {
        id: foundUser.id,
        nombre: foundUser.nombre,
        correo: foundUser.correo,
        rol: foundUser.rol,
      };

      setUser(authUser);
      await AsyncStorage.setItem('foodplease_user', JSON.stringify(authUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nombre: string, correo: string, clave: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!nombre || !correo || !clave) throw new Error('Todos los campos son requeridos');
      if (!validateEmail(correo)) throw new Error('Formato de correo inválido');
      if (clave.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

      const exists = mockUsers.find((u) => u.correo === correo);
      if (exists) throw new Error('El correo ya está registrado');

      const authUser: AuthUser = {
        id: Math.random().toString(36).substring(2),
        nombre,
        correo,
        rol: 'user',
      };

      setUser(authUser);
      await AsyncStorage.setItem('foodplease_user', JSON.stringify(authUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('foodplease_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
