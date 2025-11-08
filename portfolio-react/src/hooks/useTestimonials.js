import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'approved') // Solo testimonios aprobados en el frontend público
          .order('created_at', { ascending: true });

        if (error) throw error;

        setTestimonials(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
};

export default useTestimonials;
