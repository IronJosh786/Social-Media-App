import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    fs.unlinkSync(localFilePath);
  }
};

const deleteImagesFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      type: "upload",
      resource_type: "image",
    });
  } catch (error) {
    console.log("Error while deleting image", error);
  }
};

export { uploadOnCloudinary, deleteImagesFromCloudinary };
