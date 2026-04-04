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

    const fetchProfile = async (authUser) => {
      try {
        console.log('Auth: Intentando cargar perfil para:', authUser.email);
        
        // Creamos una promesa que resuelve la consulta a Supabase
        const profilePromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        // Creamos una promesa de tiempo de espera (1.5 segundos)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('TIMEOUT_DB')), 1500)
        );

        // Corremos ambas y vemos cual gana
        const { data, error } = await Promise.race([profilePromise, timeoutPromise]);

        if (error && error.code !== 'PGRST116') {
          console.warn('Auth: Error controlado al cargar perfil:', error.message);
          throw error;
        }

        console.log('Auth: Respuesta recibida de la DB:', data || 'No hay perfil');

        const userData = {
          ...authUser,
          ...data,
          role: data?.role || 'member'
        };

        if (mounted) {
          setUser(userData);
          setIsAuthenticated(true);
          console.log('Auth: ¡Éxito! Perfil cargado y autenticado.');
        }
      } catch (error) {
        console.warn('Auth: Usando perfil de respaldo (Fallback) debido a:', error.message || error);
        
        if (mounted) {
          // Si es el admin principal, le damos privilegios aunque falle la DB
          const isAdmin = authUser.email === 'presidencia@codesunlu.tech' || authUser.email === 'sistemas@codesunlu.tech';
          
          let fallbackUser = { 
            ...authUser, 
            role: isAdmin ? 'admin' : 'member' 
          };
          
          setUser(fallbackUser);
          setIsAuthenticated(true);
          console.log('Auth: Entrando con perfil de respaldo. Rol:', fallbackUser.role);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('Auth: Finalizado proceso de carga.');
        }
      }
    };

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
          if (mounted) setLoading(false);
        }
      } catch (err) {
        console.error('Auth: Error checking session:', err);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth: State Change Event: ${event}`);
      
      if (session?.user) {
         if (mounted) {
             console.log('Auth: Session active from listener');
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
  }, []); // Re-render logic handled by Supabase listeners

  // Auth functions remains in AuthProvider scope
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

