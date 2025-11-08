import { supabase } from '../supabaseClient';

/**
 * Service for managing testimonials CRUD operations
 */

/**
 * Get all testimonials
 * @returns {Promise} - Array of testimonials
 */
export const getTestimonials = async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

/**
 * Get single testimonial by ID
 * @param {string} id - Testimonial ID
 * @returns {Promise} - Testimonial object
 */
export const getTestimonialById = async (id) => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
};

/**
 * Create new testimonial
 * @param {Object} testimonial - Testimonial data
 * @returns {Promise} - Created testimonial
 */
export const createTestimonial = async (testimonial) => {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([testimonial])
    .select()
    .single();

  return { data, error };
};

/**
 * Update existing testimonial
 * @param {string} id - Testimonial ID
 * @param {Object} updates - Testimonial updates
 * @returns {Promise} - Updated testimonial
 */
export const updateTestimonial = async (id, updates) => {
  const { data, error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

/**
 * Delete testimonial
 * @param {string} id - Testimonial ID
 * @returns {Promise} - Delete response
 */
export const deleteTestimonial = async (id) => {
  const { data, error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  return { data, error };
};

/**
 * Upload image to Supabase Storage
 * @param {File} file - Image file
 * @returns {Promise} - Public URL of uploaded image
 */
export const uploadImage = async (file) => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `testimonials/${fileName}`;

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    return { publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { publicUrl: null, error };
  }
};

/**
 * Delete image from Supabase Storage
 * @param {string} imageUrl - Full image URL
 * @returns {Promise} - Delete response
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/storage/v1/object/public/portfolio-images/');
    if (urlParts.length < 2) {
      throw new Error('Invalid image URL');
    }
    const filePath = urlParts[1];

    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .remove([filePath]);

    return { data, error };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { data: null, error };
  }
};

/**
 * Approve testimonial (change status to 'approved')
 * @param {string} id - Testimonial ID
 * @returns {Promise} - Updated testimonial
 */
export const approveTestimonial = async (id) => {
  return updateTestimonial(id, { status: 'approved' });
};

/**
 * Reject testimonial (change status to 'rejected')
 * @param {string} id - Testimonial ID
 * @returns {Promise} - Updated testimonial
 */
export const rejectTestimonial = async (id) => {
  return updateTestimonial(id, { status: 'rejected' });
};

/**
 * Get testimonials by status
 * @param {string} status - Status filter ('pending', 'approved', 'rejected', or 'all')
 * @returns {Promise} - Array of testimonials
 */
export const getTestimonialsByStatus = async (status = 'all') => {
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  return { data, error };
};
