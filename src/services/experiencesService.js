import { supabase } from '../supabaseClient';

/**
 * Service for managing experiences (formerly testimonials) CRUD operations
 */

/**
 * Get all experiences
 * @returns {Promise} - Array of experiences
 */
export const getExperiences = async () => {
    const { data, error } = await supabase
        .from('experiences')
        .select('*, projects(title)')
        .order('created_at', { ascending: false });

    return { data, error };
};

/**
 * Get single experience by ID
 * @param {string} id - Experience ID
 * @returns {Promise} - Experience object
 */
export const getExperienceById = async (id) => {
    const { data, error } = await supabase
        .from('experiences')
        .select('*, projects(title)')
        .eq('id', id)
        .single();

    return { data, error };
};

/**
 * Create new experience
 * @param {Object} experience - Experience data
 * @returns {Promise} - Created experience
 */
export const createExperience = async (experience) => {
    const { data, error } = await supabase
        .from('experiences')
        .insert([experience])
        .select()
        .single();

    return { data, error };
};

/**
 * Update existing experience
 * @param {string} id - Experience ID
 * @param {Object} updates - Experience updates
 * @returns {Promise} - Updated experience
 */
export const updateExperience = async (id, updates) => {
    const { data, error } = await supabase
        .from('experiences')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    return { data, error };
};

/**
 * Delete experience
 * @param {string} id - Experience ID
 * @returns {Promise} - Delete response
 */
export const deleteExperience = async (id) => {
    const { data, error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

    return { data, error };
};

/**
 * Upload image to Supabase Storage (reusing existing bucket)
 * @param {File} file - Image file
 * @returns {Promise} - Public URL of uploaded image
 */
export const uploadImage = async (file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `testimonials/${fileName}`; // Keeping same folder structure

        const { data, error } = await supabase.storage
            .from('portfolio-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

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
        const urlParts = imageUrl.split('/storage/v1/object/public/portfolio-images/');
        if (urlParts.length < 2) return { data: null, error: null }; // Verify valid URL

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
 * Get experiences by status
 * @param {string} status - Status filter ('new', 'published', 'archived', or 'all')
 * @returns {Promise} - Array of experiences
 */
export const getExperiencesByStatus = async (status = 'all') => {
    let query = supabase
        .from('experiences')
        .select('*, projects(title)')
        .order('created_at', { ascending: false });

    if (status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    return { data, error };
};

/**
 * Get experiences linked to a specific project
 * @param {string} projectId - Project ID
 * @returns {Promise} - Array of experiences
 */
export const getExperiencesByProjectId = async (projectId) => {
    const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('project_id', projectId)
        .eq('status', 'published') // Only show published ones
        .order('created_at', { ascending: false });

    return { data, error };
};
