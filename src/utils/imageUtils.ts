// Utility functions for handling images

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

/**
 * Constructs full image URL from image path
 * @param imagePath - The image path from API response
 * @returns Full image URL or null if no image
 */
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null

  // If it's already a full URL (starts with http/https), return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  // If it's a base64 image, return as is
  if (imagePath.startsWith("data:")) {
    return imagePath
  }

  // If it's a relative path, prepend the base URL
  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`
  }

  // If it doesn't start with /, add both base URL and /
  return `${API_BASE_URL}/${imagePath}`
}

/**
 * Handles image load error by hiding the image and showing fallback
 * @param e - Image error event
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement
  target.style.display = "none"

  // Show the fallback div if it exists
  const fallbackDiv = target.nextElementSibling as HTMLElement
  if (fallbackDiv) {
    fallbackDiv.style.display = "flex"
  }
}

/**
 * Safe image error handler that prevents infinite loops
 * @param e - Image error event
 * @param fallbackUrl - Fallback URL to use (optional)
 */
export const handleImageErrorSafe = (e: React.SyntheticEvent<HTMLImageElement>, fallbackUrl?: string) => {
  const target = e.target as HTMLImageElement

  // Only set fallback if current src doesn't already contain it
  if (fallbackUrl && !target.src.includes(fallbackUrl)) {
    target.src = fallbackUrl
  } else {
    // Hide the image if fallback also fails
    target.style.display = "none"

    // Show fallback div if exists
    const fallbackDiv = target.nextElementSibling as HTMLElement
    if (fallbackDiv) {
      fallbackDiv.style.display = "flex"
    }
  }
}
