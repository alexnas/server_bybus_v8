require('dotenv').config();

const accessToken_secret = process.env.JWT_ACCESS_SECRET;
const refreshToken_secret = process.env.JWT_REFRESH_SECRET;

module.exports = {
  accessToken_secret,
  refreshToken_secret,
};
