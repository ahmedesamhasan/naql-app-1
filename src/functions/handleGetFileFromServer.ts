/**
 * Get full image URL for preview.
 * Handles both relative paths and full URLs from backend.
 * 
 * Backend returns:
 * - Full URLs (if already full URL in database or remote storage like S3) - use as is
 * - Relative paths starting with "/storage/" (if local storage) - prepend VITE_BACKEND_URL
 * 
 * @param file - The image path or URL from backend
 * @returns Full URL for image preview
 */
export const handleGetFileFromServer = (file: string | null | undefined): string | null => {
  if (!file || file.trim() === '') {
    return null;
  }

  // If it's already a full URL (http/https), use it as is
  if (file.startsWith('http://') || file.startsWith('https://')) {
    return file;
  }

  // It's a relative path (e.g., "/storage/users/xxx.jpg")
  // Get backend URL from env and prepend it
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  
  // Remove trailing slash from backend URL if present
  const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  
  // Ensure path starts with / if it doesn't already
  const path = file.startsWith('/') ? file : `/${file}`;
  
  // Construct full URL
  return `${cleanBackendUrl}${path}`;
};
