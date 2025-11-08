import { supabase } from '../supabaseClient';

/**
 * Utility function to set up user profile with display name
 * Run this once after logging in to set your display name
 * 
 * Usage:
 * 1. Import this function in your component
 * 2. Call it: await setupUserProfile("Fabián")
 * 3. Refresh the page to see the changes
 */
export const setupUserProfile = async (displayName) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        display_name: displayName
      }
    });

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }

    console.log('Profile updated successfully!', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error };
  }
};

/**
 * Alternative: Set display name directly in Supabase Dashboard
 * 
 * Steps:
 * 1. Go to your Supabase project
 * 2. Authentication → Users
 * 3. Click on your user
 * 4. In "User Metadata" section, add:
 *    {
 *      "display_name": "Fabián"
 *    }
 * 5. Save changes
 * 6. Logout and login again to see the changes
 */
