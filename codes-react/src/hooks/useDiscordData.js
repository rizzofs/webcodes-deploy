import { useState, useEffect } from 'react';
import discordAPI from '../services/discordAPI';

export const useDiscordData = () => {
  const [serverStats, setServerStats] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscordData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener estadísticas del servidor
        const stats = await discordAPI.getServerStats();
        if (stats) {
          setServerStats(stats);
          setChannels(stats.channels || []);
        } else {
          setError('No se pudo obtener información del servidor de Discord');
        }
      } catch (err) {
        setError('Error al conectar con Discord: ' + err.message);
        console.error('Discord API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const stats = await discordAPI.getServerStats();
      if (stats) {
        setServerStats(stats);
        setChannels(stats.channels || []);
      }
    } catch (err) {
      setError('Error al actualizar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    serverStats,
    channels,
    loading,
    error,
    refreshData
  };
};

export const useChannelActivity = (channelId) => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkActivity = async () => {
      if (!channelId) return;
      
      try {
        setLoading(true);
        const active = await discordAPI.isChannelActive(channelId);
        setIsActive(active);
      } catch (err) {
        console.error('Error checking channel activity:', err);
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    };

    checkActivity();
  }, [channelId]);

  return { isActive, loading };
};