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
    testimonials: 0,
    newExperiences: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async (dateRange = 'all') => {
    try {
      setLoading(true);
      setError(null);

      // Calculate start date for filtering
      let startDate = null;
      const now = new Date();

      if (dateRange === '7d') {
        startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
      } else if (dateRange === '15d') {
        startDate = new Date(now.setDate(now.getDate() - 15)).toISOString();
      } else if (dateRange === '30d') {
        startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
      }

      // 1. Fetch visits count (filtered)
      let visitsQuery = supabase
        .from('visits')
        .select('*', { count: 'exact', head: true });

      if (startDate) {
        visitsQuery = visitsQuery.gte('visited_at', startDate);
      }

      const { count: visitsCount, error: visitsError } = await visitsQuery;
      if (visitsError) throw visitsError;

      // 2. Fetch downloads count (filtered)
      let downloadsQuery = supabase
        .from('cv_downloads')
        .select('*', { count: 'exact', head: true });

      if (startDate) {
        downloadsQuery = downloadsQuery.gte('downloaded_at', startDate);
      }

      const { count: downloadsCount, error: downloadsError } = await downloadsQuery;
      if (downloadsError) throw downloadsError;

      // 3. Fetch projects count (Total - always shows all)
      const { count: projectsCount, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      if (projectsError) throw projectsError;

      // 4. Fetch experiences count (Total active/published)
      const { count: experiencesCount, error: experiencesError } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      if (experiencesError) throw experiencesError;

      // 5. Fetch NEW/Pending experiences for the feed
      const { data: newExperiences, error: newExperiencesError } = await supabase
        .from('experiences')
        .select('*')
        .eq('status', 'new')
        .order('created_at', { ascending: false })
        .limit(5);

      if (newExperiencesError) throw newExperiencesError;

      setMetrics({
        visits: visitsCount || 0,
        downloads: downloadsCount || 0,
        projects: projectsCount || 0,
        testimonials: experiencesCount || 0,
        newExperiences: newExperiences || []
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
