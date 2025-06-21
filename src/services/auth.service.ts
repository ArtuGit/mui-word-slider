import { supabase } from '../lib/supabaseClient';
import { AuthCredentials } from '../types/auth.types';

export const authService = {
  signUp: async (credentials: AuthCredentials) => {
    if (!credentials.password) throw new Error('Password is required for sign up');
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) throw error;
    return data;
  },

  signIn: async (credentials: AuthCredentials) => {
    if (!credentials.password) throw new Error('Password is required for sign in');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
};
