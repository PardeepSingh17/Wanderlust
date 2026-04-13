const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "Wanderlust_DEV",
      format: file.mimetype.split("/")[1], // dynamic format
      public_id: Date.now() + "-" + file.originalname
    };
  }
});

module.exports = {
  cloudinary,
  storage
};
