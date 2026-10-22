import { createContext, useContext, useEffect, useState } from 'react';
import { request } from '../api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('church_token');
    if (!token) return setLoading(false);
    request('/auth/me').then(({ user }) => setUser(user)).catch(() => localStorage.removeItem('church_token')).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('church_token', data.token);
    setUser(data.user);
    return data.user;
  };

const add_members = async (memberData) => {
  try {
    console.log(memberData);
    const data = await request('/add-members', {
      method: 'POST',
    
      body: JSON.stringify(memberData) 
    });

    if (data) {
      console.log("Member added successfully:", data);
    }
  } catch (error) {
    console.error("Failed to add member:", error.message);
    throw error;
  }
}

const get_members=async ()=>{
  try{
  const data= await request('/get-members');
      console.log("members auth",data);
    console.log(data);
  return data;
  }
  catch(error){
    console.log(error.message);
  }
}
  const logout = () => {
    localStorage.removeItem('church_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, loading, login, logout, add_members, get_members }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
