import { supabase } from '../supabaseClient';

/**
 * Service for managing projects CRUD operations
 */

/**
 * Get all projects
 * @returns {Promise} - Array of projects
 */
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

/**
 * Get single project by ID
 * @param {string} id - Project ID
 * @returns {Promise} - Project object
 */
export const getProjectById = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
};

/**
 * Create new project
 * @param {Object} project - Project data
 * @returns {Promise} - Created project
 */
export const createProject = async (project) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();

  return { data, error };
};

/**
 * Update existing project
 * @param {string} id - Project ID
 * @param {Object} updates - Project updates
 * @returns {Promise} - Updated project
 */
export const updateProject = async (id, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

/**
 * Delete project
 * @param {string} id - Project ID
 * @returns {Promise} - Delete response
 */
export const deleteProject = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  return { data, error };
};

/**
 * Upload image to Supabase Storage
 * @param {File} file - Image file
 * @param {string} folder - Storage folder (default: 'projects')
 * @returns {Promise} - Public URL of uploaded image
 */
export const uploadImage = async (file, folder = 'projects') => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

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
 * Upload multiple images to Supabase Storage
 * @param {FileList|Array} files - Array of image files
 * @param {string} folder - Storage folder (default: 'projects')
 * @returns {Promise} - Array of public URLs
 */
export const uploadMultipleImages = async (files, folder = 'projects') => {
  try {
    const uploadPromises = Array.from(files).map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    
    const urls = results
      .filter(result => result.publicUrl)
      .map(result => result.publicUrl);
    
    const errors = results
      .filter(result => result.error)
      .map(result => result.error);

    return { urls, errors: errors.length > 0 ? errors : null };
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return { urls: [], errors: [error] };
  }
};
