'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { User } from '@/payload-types';

type Login = (args: { email: string; password: string }) => Promise<User>; // eslint-disable-line no-unused-vars
type Logout = () => Promise<void>;
type UseAuth = () => AuthContext;

type AuthContext = {
  login: Login;
  logout: Logout;
  status: 'loggedIn' | 'loggedOut' | undefined;
  user?: User | null;
};

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>();
  const [status, setStatus] = useState<'loggedIn' | 'loggedOut' | undefined>();

  const login = useCallback<Login>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
        body: JSON.stringify({
          email: args.email,
          password: args.password,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (res.ok) {
        const { errors, user } = await res.json();
        if (errors) throw new Error(errors[0].message);
        setUser(user);
        setStatus('loggedIn');
        return user;
      }
      throw new Error('Invalid login');
    } catch (e) {
      throw new Error('An error occurred while attempting to login.');
    }
  }, []);

  const logout = useCallback<Logout>(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (res.ok) {
        setUser(null);
        setStatus('loggedOut');
      } else {
        throw new Error('An error occurred while attempting to logout.');
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to logout.');
    }
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });
        if (res.ok) {
          const { user: meUser } = await res.json();
          setUser(meUser || null);
          setStatus(meUser ? 'loggedIn' : 'loggedOut');
        } else {
          throw new Error('An error occurred while fetching your account.');
        }
      } catch (e) {
        setUser(null);
        throw new Error('An error occurred while fetching your account.');
      }
    };
    void fetchMe();
  }, []);

  return (
    <Context.Provider
      value={{
        login,
        logout,
        status,
        user,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAuth: UseAuth = () => useContext(Context);
