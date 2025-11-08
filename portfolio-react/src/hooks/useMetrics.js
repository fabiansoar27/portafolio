import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Custom hook for fetching metrics from Supabase
 * Returns metrics data, loading state, and error state
 */
export const useMetrics = () => {
  const [metrics, setMetrics] = useState({
    visits: 0,
    downloads: 0,
    projects: 0,
    testimonials: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch visits count
      const { count: visitsCount, error: visitsError } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true });

      if (visitsError) throw visitsError;

      // Fetch downloads count
      const { count: downloadsCount, error: downloadsError } = await supabase
        .from('cv_downloads')
        .select('*', { count: 'exact', head: true });

      if (downloadsError) throw downloadsError;

      // Fetch projects count
      const { count: projectsCount, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      if (projectsError) throw projectsError;

      // Fetch testimonials count
      const { count: testimonialsCount, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*', { count: 'exact', head: true });

      if (testimonialsError) throw testimonialsError;

      setMetrics({
        visits: visitsCount || 0,
        downloads: downloadsCount || 0,
        projects: projectsCount || 0,
        testimonials: testimonialsCount || 0
      });

    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, refetch: fetchMetrics };
};
