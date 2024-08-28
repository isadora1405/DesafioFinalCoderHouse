const dotenv = require('dotenv');

const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;
dotenv.config({ path: envFile });

module.exports = process.env;
