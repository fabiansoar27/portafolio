import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Custom hook for managing authentication state
 * Provides user state, auth status, and auth functions
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Supabase auth response
   */
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  /**
   * Logout current user
   * @returns {Promise} - Supabase auth response
   */
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  /**
   * Get current user
   * @returns {Object|null} - Current user object or null
   */
  const getUser = () => {
    return user;
  };

  /**
   * Update user profile metadata
   * @param {Object} metadata - User metadata to update (e.g., { display_name: "Fabián" })
   * @returns {Promise} - Supabase auth response
   */
  const updateProfile = async (metadata) => {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });
    return { data, error };
  };

  return { 
    user, 
    loading, 
    login, 
    logout, 
    getUser,
    updateProfile
  };
};
