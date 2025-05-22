// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { router } from 'expo-router';
// import { api } from '../services/api';
// import * as SecureStore from 'expo-secure-store';

// interface User {
//   id: number;
//   email: string;
//   role: 'customer' | 'driver' | 'admin';
//   name: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (data: any) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is logged in
//     const checkAuth = async () => {
//       try {
//         const token = await SecureStore.getItemAsync('authToken');
//         if (token) {
//           // Verify token and get user data
//           const response = await api.get('/api/auth/me/');
//           setUser(response.data);
//         }
//       } catch (error) {
//         console.error('Auth check failed:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await api.post('/api/auth/login/', { email, password });
//       const { token, user } = response.data;
      
//       await SecureStore.setItemAsync('authToken', token);
//       setUser(user);
      
//       // Navigate based on role
//       if (user.role === 'driver') {
//         router.replace('/(driver)');
//       } else {
//         router.replace('/(customer)');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       throw error;
//     }
//   };

//   const register = async (data: any) => {
//     try {
//       const response = await api.post('/api/auth/register/', data);
//       const { token, user } = response.data;
      
//       await SecureStore.setItemAsync('authToken', token);
//       setUser(user);
      
//       // Navigate based on role
//       if (user.role === 'driver') {
//         router.replace('/(driver)');
//       } else {
//         router.replace('/(customer)');
//       }
//     } catch (error) {
//       console.error('Registration failed:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await SecureStore.deleteItemAsync('authToken');
//       setUser(null);
//       router.replace('/(auth)/login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }
