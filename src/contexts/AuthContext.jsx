import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
        if (mounted && loading) {
            console.warn('Auth: Forced loading completion due to timeout');
            setLoading(false);
        }
    }, 3000);

    const initializeAuth = async () => {
      try {
        console.log('Auth: Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          console.log('Auth: Session found via getSession');
          if (mounted) await fetchProfile(session.user);
        } else {
             // If no session, we just wait for onAuthStateChange or timeout
             // But we can set loading false here if we want to be fast
             // Let's rely on onAuthStateChange to confirm 'SIGNED_OUT' or similar
        }
      } catch (err) {
        console.error('Auth: Error checking session:', err);
        // Don't kill loading here, let the listener or timeout handle it to avoid flickering
      }
    };

    initializeAuth();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth: State Change Event: ${event}`);
      
      if (session?.user) {
         if (mounted) {
             console.log('Auth: Session active from listener');
             // We pass true to indicate this comes from event, to potentially debounce
             await fetchProfile(session.user);
         }
      } else {
        if (mounted) {
          console.log('Auth: Signed out or no session');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (authUser) => {
    try {
      console.log('Auth: Fetching profile...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      console.log('Auth: Profile data from DB:', data);

      const userData = {
        ...authUser,
        ...data, // This includes role from 'profiles' table
      };
      
      // Explicitly ensure the role comes from the profile if available, otherwise fallback to 'member'
      // Supabase auth user object also has a 'role' field (usually 'authenticated'), so we must be careful.
      if (data?.role) {
          userData.role = data.role;
      } else {
          userData.role = 'member'; // Default if no profile found
      }

      console.log('Auth: Final User Data with Role:', userData.role);

      setUser(userData);
      console.log('Auth: Profile loaded');
    } catch (error) {
      if (error.name === 'AbortError') {
          console.log('Auth: Fetch aborted (likely unmount or network)');
          // Emergency Override
          if (authUser.email === 'codes.unlu@gmail.com') {
             console.warn('Auth: Forcing Admin due to AbortError');
             const fallbackUser = { ...authUser, role: 'admin' };
             setUser(fallbackUser);
             setIsAuthenticated(true);
             return; // Stop here
          }
      }
      console.error('Error fetching profile:', error);
      
      // Fallback
      let fallbackUser = { ...authUser, role: 'member' };
      
      // Emergency Override for generic error too
      if (authUser.email === 'codes.unlu@gmail.com') {
          console.warn('Auth: Forcing Admin due to Fetch Error');
          fallbackUser.role = 'admin';
      }
      
      setUser(fallbackUser);
      setIsAuthenticated(true);
    } finally {
      // Always clear loading
      setLoading((prev) => {
          if (prev) console.log('Auth: Loading finished');
          return false;
      });
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    
    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_blog'],
      editor: ['read', 'write', 'manage_blog'],
      member: ['read']
    };
    
    return permissions[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

