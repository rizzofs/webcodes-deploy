
import { supabase } from '../supabaseClient';

// Helper to get session token robustly
const getSessionToken = async () => {
    // 1. Try to get token from Supabase client
    try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.access_token) return data.session.access_token;
    } catch { /* ignore */ }

    // 2. Fallback to LocalStorage
    try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const projectRef = url.match(/https:\/\/([^.]+)\./)?.[1];
        if (projectRef) {
            const stored = localStorage.getItem(`sb-${projectRef}-auth-token`);
            if (stored) return JSON.parse(stored).access_token;
        }
    } catch { /* ignore */ }
    
    return null;
};

// Helper for headers
const getHeaders = (token) => {
    const headers = {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
    }
    return headers;
};

const newsService = {
  // Obtener todas las noticias (Raw Fetch)
  // Obtener todas las noticias (Raw Fetch)
  getAll: async (onlyPublished = true) => {
    const token = await getSessionToken();
    
    // Intenta traer todo (incluyendo categoría y autor)
    // Si falla por timeout o error de columna, el UI debería intentar getAllSimple
    let url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news?select=*,author:profiles(full_name,avatar_url)&order=created_at.desc`;
    if (onlyPublished) {
        url += '&published=eq.true';
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token)
    });

    if (!response.ok) throw new Error(`Fetch Error: ${response.status} ${await response.text()}`);
    return await response.json();
  },

  // Método de respaldo para cuando falla la estructura de datos (ej. columna faltante)
  getAllSimple: async (onlyPublished = true) => {
    const token = await getSessionToken();
    // Solo trae campos básicos standart que seguro existen
    let url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news?select=id,title,slug,excerpt,image_url,created_at,published&order=created_at.desc`;
    if (onlyPublished) {
        url += '&published=eq.true';
    }

    const response = await fetch(url, { method: 'GET', headers: getHeaders(token) });
    if (!response.ok) throw new Error(`Fetch Error: ${response.status}`);
    return await response.json();
  },

  // Obtener una noticia por slug (Raw Fetch)
  getBySlug: async (slug) => {
    const token = await getSessionToken();
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news?select=*,author:profiles(full_name,avatar_url)&slug=eq.${slug}&limit=1`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            ...getHeaders(token),
            'Accept': 'application/vnd.pgrst.object+json' // Request single object
        }
    });

    if (!response.ok) {
        // Handle 406 (Not Acceptable) if no result found -> return null or throw?
        // Supabase returns 406 if result is empty and object requested.
        // Better to request array and check length.
    }
    
    // Safer approach: request array standard
    const safeResponse = await fetch(url, { method: 'GET', headers: getHeaders(token) });
    if (!safeResponse.ok) throw new Error(`Fetch Error: ${safeResponse.status}`);
    
    const data = await safeResponse.json();
    return data.length > 0 ? data[0] : null;
  },

  // Crear noticia (Raw Fetch)
  create: async (newsData) => {
    const token = await getSessionToken();
    if (!token) throw new Error('No auth token available');

    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news`;
    const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(newsData)
    });

    if (!response.ok) throw new Error(`Fetch Error: ${response.status} ${await response.text()}`);
    const json = await response.json();
    return Array.isArray(json) ? json[0] : json;
  },

  // Actualizar noticia (Raw Fetch)
  update: async (id, newsData) => {
    const token = await getSessionToken();
    if (!token) throw new Error('No auth token available');

    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news?id=eq.${id}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(newsData)
    });

    if (!response.ok) throw new Error(`Fetch Error: ${response.status} ${await response.text()}`);
    const json = await response.json();
    return Array.isArray(json) ? json[0] : json;
  },

  // Eliminar noticia (Raw Fetch)
  delete: async (id) => {
    const token = await getSessionToken();
    if (!token) throw new Error('No auth token available');

    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/news?id=eq.${id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders(token)
    });

    if (!response.ok) throw new Error(`Fetch Error: ${response.status} ${await response.text()}`);
    return true;
  }
};

export default newsService;
