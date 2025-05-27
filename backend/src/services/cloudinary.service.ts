import { Readable } from 'stream';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
): Promise<Pick<UploadApiResponse, 'public_id' | 'secure_url'>> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          public_id: result!.public_id,
          secure_url: result!.secure_url,
        });
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    // log or rethrow
    console.error('Cloudinary delete error:', err);
    throw err;
  }
}
export default {
  uploadToCloudinary,
  deleteImage,
};
