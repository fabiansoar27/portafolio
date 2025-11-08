import { supabase } from '../supabaseClient';

/**
 * Storage Service
 * Handles image uploads and deletions in Supabase Storage
 */

const BUCKET_NAME = 'portfolio-images';

/**
 * Upload an image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - Optional folder name (e.g., 'projects', 'testimonials')
 * @returns {Promise<{url: string, path: string}>} - The public URL and storage path
 */
export const uploadImage = async (file, folder = '') => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Supabase Storage
 * @param {File[]} files - Array of image files to upload
 * @param {string} folder - Optional folder name
 * @returns {Promise<string[]>} - Array of public URLs
 */
export const uploadMultipleImages = async (files, folder = '') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.url);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

/**
 * Delete an image from Supabase Storage
 * @param {string} url - The public URL of the image
 * @returns {Promise<void>}
 */
export const deleteImage = async (url) => {
  try {
    // Extract file path from URL
    const urlParts = url.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
    if (urlParts.length < 2) {
      throw new Error('Invalid image URL');
    }
    
    const filePath = urlParts[1];

    // Delete file from Supabase Storage
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Delete multiple images from Supabase Storage
 * @param {string[]} urls - Array of public URLs
 * @returns {Promise<void>}
 */
export const deleteMultipleImages = async (urls) => {
  try {
    const deletePromises = urls.map(url => deleteImage(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    throw error;
  }
};

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns {boolean} - True if valid, throws error if invalid
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  // Check if file exists
  if (!file) {
    throw new Error('No se seleccionó ningún archivo');
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)');
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
  }

  return true;
};
