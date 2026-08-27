import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveFileToCloudinary(buffer) {
  const options = {
    folder: "shirts-shop/products",
    resource_type: "image",
    transformation: [
      { width: 1000, height: 1000, crop: "limit" },
      { fetch_format: "auto", quality: "auto" },
    ],
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};
