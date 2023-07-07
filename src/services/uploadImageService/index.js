const {
  uploadCloudinaryService: uploadImageService,
  destroyCloudinaryImgService: destroyImageService,
  extractPublicId,
} = require('./cloudinaryService');

module.exports = {
  uploadImageService,
  destroyImageService,
  extractPublicId,
};
