import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const useProjects = (limit = null) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('projects')
          .select('*')
          .order('project_date', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;

        setProjects(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [limit]);

  return { projects, loading, error };
};

export default useProjects;
