import { supabase } from '../supabaseClient';

/**
 * Service for tracking metrics (visits and downloads)
 */

/**
 * Track a visit to the portfolio
 * Uses localStorage with timestamp to prevent duplicate counts within 24 hours
 * @returns {Promise} - Insert response
 */
export const trackVisit = async () => {
  try {
    // Check if visit already tracked recently
    const lastVisit = localStorage.getItem('last_visit_tracked');
    
    if (lastVisit) {
      const lastVisitTime = new Date(lastVisit);
      const now = new Date();
      const hoursSinceLastVisit = (now - lastVisitTime) / (1000 * 60 * 60);
      
      // Only track if more than 24 hours have passed
      if (hoursSinceLastVisit < 24) {
        console.log('Visit already tracked in the last 24 hours');
        return { success: false, message: 'Already tracked recently' };
      }
    }

    // Insert visit record
    const { data, error } = await supabase
      .from('visits')
      .insert([{ visited_at: new Date().toISOString() }]);

    if (error) throw error;

    // Mark visit as tracked with current timestamp
    localStorage.setItem('last_visit_tracked', new Date().toISOString());
    console.log('Visit tracked successfully');

    return { success: true, data };
  } catch (error) {
    console.error('Error tracking visit:', error);
    return { success: false, error };
  }
};

/**
 * Track a CV download
 * Uses localStorage with timestamp to prevent duplicate counts within 24 hours
 * @returns {Promise} - Insert response
 */
export const trackDownload = async () => {
  try {
    // Check if download already tracked recently
    const lastDownload = localStorage.getItem('last_download_tracked');
    
    if (lastDownload) {
      const lastDownloadTime = new Date(lastDownload);
      const now = new Date();
      const hoursSinceLastDownload = (now - lastDownloadTime) / (1000 * 60 * 60);
      
      // Only track if more than 24 hours have passed
      if (hoursSinceLastDownload < 24) {
        console.log('Download already tracked in the last 24 hours');
        return { success: false, message: 'Already tracked recently' };
      }
    }

    // Insert download record
    const { data, error } = await supabase
      .from('cv_downloads')
      .insert([{ downloaded_at: new Date().toISOString() }]);

    if (error) throw error;

    // Mark download as tracked with current timestamp
    localStorage.setItem('last_download_tracked', new Date().toISOString());
    console.log('Download tracked successfully');

    return { success: true, data };
  } catch (error) {
    console.error('Error tracking download:', error);
    return { success: false, error };
  }
};

/**
 * Reset tracking flags (useful for testing)
 * This clears the localStorage timestamps
 */
export const resetTracking = () => {
  localStorage.removeItem('last_visit_tracked');
  localStorage.removeItem('last_download_tracked');
  console.log('Tracking flags reset');
};

/**
 * Check when was the last visit tracked
 * @returns {string|null} - ISO date string or null
 */
export const getLastVisitTracked = () => {
  return localStorage.getItem('last_visit_tracked');
};

/**
 * Check when was the last download tracked
 * @returns {string|null} - ISO date string or null
 */
export const getLastDownloadTracked = () => {
  return localStorage.getItem('last_download_tracked');
};
