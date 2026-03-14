import defaultAvatar from "../assets/images/default_employee_male_avatar.webp";
import { handleGetFileFromServer } from "../functions/handleGetFileFromServer";

/**
 * Get avatar URL with fallback to default avatar.
 * Replaces http/https URLs with default avatar.
 * 
 * @param url - The image path or URL
 * @returns Avatar URL (default avatar for http/https URLs or processed relative paths)
 */
export const getAvatarUrl = (url: string | null | undefined): string => {
  if (!url || url.trim() === '') {
    return defaultAvatar;
  }
  
  // Replace http/https URLs with default avatar
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return defaultAvatar;
  }
  
  // Handle relative paths
  const processedUrl = handleGetFileFromServer(url);
  return processedUrl || defaultAvatar;
};

/**
 * Get image URL for non-avatar images.
 * Similar to getAvatarUrl but can be extended for different logic.
 * 
 * @param url - The image path or URL
 * @returns Image URL (default avatar for http/https URLs or processed relative paths)
 */
export const getImageUrl = (url: string | null | undefined): string => {
  return getAvatarUrl(url);
};

