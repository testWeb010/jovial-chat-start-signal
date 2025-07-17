import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import { Readable } from 'stream';

// Configure Cloudinary (you'll need to set these environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Convert buffer to WebP format using Sharp
 * @param {Buffer} buffer - The image buffer
 * @param {number} quality - WebP quality (1-100)
 * @returns {Promise<Buffer>} - The converted WebP buffer
 */
export const convertToWebP = async (buffer, quality = 80) => {
  try {
    return await sharp(buffer)
      .webp({ quality })
      .toBuffer();
  } catch (error) {
    throw new Error(`Failed to convert image to WebP: ${error.message}`);
  }
};

/**
 * Upload image to Cloudinary
 * @param {Buffer} buffer - The image buffer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export const uploadToCloudinary = async (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: options.folder || 'acrossmedia',
        public_id: options.public_id,
        transformation: [
          { width: 1200, height: 900, crop: 'limit' },
          { quality: 'auto:good' },
          { format: 'webp' }
        ],
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Failed to delete image from Cloudinary: ${error.message}`);
  }
};

/**
 * Process multiple images and upload to Cloudinary
 * @param {Array} files - Array of file objects from multer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Array>} - Array of uploaded image URLs
 */
export const processAndUploadImages = async (files, folder = 'acrossmedia/projects') => {
  const uploadPromises = files.map(async (file, index) => {
    try {
      // Convert to WebP
      const webpBuffer = await convertToWebP(file.buffer);
      
      // Upload to Cloudinary
      const result = await uploadToCloudinary(webpBuffer, {
        folder,
        public_id: `${Date.now()}_${index}`,
      });
      
      return result.secure_url;
    } catch (error) {
      console.error(`Failed to process image ${file.originalname}:`, error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
};