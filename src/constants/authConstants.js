const DEFAULT_ROLE = 'user';
// const ACCESS_TIMEOUT = '15s'; // '15m'
const ACCESS_TIMEOUT = '15m';
// const REFRESH_TIMEOUT = '30s'; // '30d'
const REFRESH_TIMEOUT = '30d';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

module.exports = {
  DEFAULT_ROLE,
  ACCESS_TIMEOUT,
  REFRESH_TIMEOUT,
  COOKIE_MAX_AGE,
};
