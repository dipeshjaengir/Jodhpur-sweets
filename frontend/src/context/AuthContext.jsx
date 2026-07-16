import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { toast } from '../utils/toast.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Immediate Toast Feedback
      toast(`Welcome back, ${response.user.name}!`);
      
      // Update central sim_users table for customer metrics in simulation mode
      const simUsers = JSON.parse(localStorage.getItem('sim_users')) || [];
      const userExists = simUsers.some(u => u.email === response.user.email);
      if (!userExists) {
        simUsers.push({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          role: response.user.role,
          joined: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('sim_users', JSON.stringify(simUsers));
      }

      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, password) => {
    setLoading(true);
    try {
      const response = await api.register(name, email, phone, password);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast(`Account created! Welcome, ${response.user.name}!`);

      // Add to simulated customers ledger
      const simUsers = JSON.parse(localStorage.getItem('sim_users')) || [];
      simUsers.push({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        role: response.user.role,
        joined: new Date().toISOString().split('T')[0]
      });
      localStorage.setItem('sim_users', JSON.stringify(simUsers));

      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (phone) => {
    try {
      return await api.requestOTP(phone);
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (phone, otp) => {
    setLoading(true);
    try {
      const response = await api.verifyOTP(phone, otp);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast(`Welcome back, ${response.user.name}!`);

      // Add to simulated customers ledger
      const simUsers = JSON.parse(localStorage.getItem('sim_users')) || [];
      const userExists = simUsers.some(u => u.email === response.user.email);
      if (!userExists) {
        simUsers.push({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          role: response.user.role,
          joined: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('sim_users', JSON.stringify(simUsers));
      }

      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, requestOTP, verifyOTP, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
