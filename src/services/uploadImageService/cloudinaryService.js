const { cloudinary } = require('../../config/cloudinary.config');
const ApiError = require('../../errors/ApiError');
const fs = require('fs');

const extractPublicId = (url) => {
  return url.split('/').slice(-2).join('/').split('.')[0];
};

const searchCloudinaryImgByPublicId = async (next, imgPublicId) => {
  try {
    const { resources } = await cloudinary.search.expression(`public_id:${imgPublicId}`).execute();
    return resources;
  } catch (e) {
    console.log(e);
  }
};

const destroyCloudinaryImgService = async (next, imgUrl) => {
  try {
    let imageDestroyResponse = { result: 'not found' };
    let cloudinaryImage = null;
    let imgPublicId = extractPublicId(imgUrl);
    if (imgUrl.indexOf('res.cloudinary.com')) {
      cloudinaryImage = await searchCloudinaryImgByPublicId(next, extractPublicId(imgPublicId));
    }
    if (cloudinaryImage && cloudinaryImage.length > 0) {
      imageDestroyResponse = await destroyCloudinaryImgByPublicIdService(next, imgPublicId);
    }
    return imageDestroyResponse;
  } catch (e) {
    console.log(e);
  }
};

const destroyCloudinaryImgByPublicIdService = async (next, imgPublicId) => {
  try {
    const imageDestroyResponse = await cloudinary.uploader.destroy(imgPublicId);
    return imageDestroyResponse;
  } catch (err) {
    console.log(err);
    return next(ApiError.internal('Server error'));
  }
};

const uploadCloudinaryService = async (
  next,
  imageFile,
  maxFileSize = 1000,
  validFileExtensions = ['jpg', 'png', 'gif'],
  folder = 'gobybus'
) => {
  // Validate Image
  const fileSize = imageFile.size / 1000;
  const fileExt = imageFile.originalname.split('.')[1];
  if (fileSize > maxFileSize) {
    return next(ApiError.wrongValue('File size must be lower than 500kb'));
  }
  if (!validFileExtensions.includes(fileExt)) {
    return next(ApiError.wrongValue('File extension must be jpg or png'));
  }

  return await cloudinary.uploader.upload(
    imageFile.path,
    {
      upload_preset: folder,
    },
    async (err, image) => {
      fs.unlink(imageFile.path, (err) => {
        if (err) {
          console.log(err);
          return next(ApiError.internal('Server error'), err);
        }
      });
      if (err) {
        console.log(err);
        return next(ApiError.internal('Cloudinary server error'));
      }
    }
  );
};

module.exports = {
  uploadCloudinaryService,
  destroyCloudinaryImgService,
  extractPublicId,
};
