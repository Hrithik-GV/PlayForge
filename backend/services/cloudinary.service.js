import { v2 as cloudinary } from 'cloudinary';
import config from '../config/index.js';

// Configure Cloudinary only if credentials are provided
const isCloudinaryConfigured = 
  config.cloudinary.cloudName && 
  config.cloudinary.apiKey && 
  config.cloudinary.apiSecret;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  console.log('  ✅ Cloudinary service configured successfully');
} else {
  console.warn('  ⚠️  Cloudinary credentials not set in environment variables. Running in fallback mode.');
}

/**
 * Upload an SVG string to Cloudinary as a thumbnail image.
 * If Cloudinary is not configured, it returns a local base64 data URI as fallback.
 *
 * @param {string} svgContent - The raw SVG string
 * @param {string} gameTitle - The title of the game (used for folder/public_id naming)
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadThumbnail = async (svgContent, gameTitle) => {
  const cleanTitle = (gameTitle || 'game')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const base64Data = Buffer.from(svgContent.trim()).toString('base64');
  const dataURI = `data:image/svg+xml;base64,${base64Data}`;

  if (!isCloudinaryConfigured) {
    console.log('[Cloudinary] Using base64 data URI fallback (credentials not configured)');
    return dataURI;
  }

  try {
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'playforge/thumbnails',
      public_id: `${cleanTitle}-${Date.now()}`,
      resource_type: 'image',
    });

    console.log(`[Cloudinary] Successfully uploaded thumbnail for "${gameTitle}": ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error('[Cloudinary] Upload failed, falling back to data URI:', err.message);
    return dataURI;
  }
};
