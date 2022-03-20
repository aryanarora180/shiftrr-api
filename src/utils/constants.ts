import dotenv from 'dotenv';

export const NODE_ENV = process.env.NODE_ENV;

dotenv.config({ path: `.env.${NODE_ENV}` });

export const IS_PROD_ENV = NODE_ENV === 'production';
export const IS_DEV_ENV = NODE_ENV === 'dev';

export const SERVER_PORT = process.env.PORT;

export const SESSION_SECRET = process.env.SESSION_SECRET;
export const MONGO_BASE_URI = process.env.MONGO_BASE_URI;

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DBNAME = process.env.MONGO_DBNAME;

export const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_BASE_URI}/${MONGO_DBNAME}?retryWrites=true&w=majority`;

console.table({ NODE_ENV, SERVER_PORT, SESSION_SECRET, MONGO_BASE_URI });

export const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
export const GOOGLE_OAUTH_CLIENT_SECRET =
  process.env.GOOGLE_OAUTH_CLIENT_SECRET;

export const UI_BASE_URL = process.env.UI_BASE_URL;
export const API_BASE_URL = process.env.API_BASE_URL;
