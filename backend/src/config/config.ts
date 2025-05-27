// src/config/config.ts
import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000),
  MONGODB_URL: Joi.string().required().description('Mongo DB url'),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(43200),

  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  CLOUDINARY_URL: Joi.string().required(),
  ADMIN_EMAIL: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),

  // JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
  // JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),
  // JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10),
  // SMTP_HOST: Joi.string(),
  // SMTP_PORT: Joi.number(),
  // SMTP_USERNAME: Joi.string(),
  // SMTP_PASSWORD: Joi.string(),
  // EMAIL_FROM: Joi.string(),
  // ONESIGNAL_APP_ID: Joi.string(),
  // ONESIGNAL_REST_API: Joi.string(),
}).unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV as 'production' | 'development' | 'test',
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      serverSelectionTimeoutMS: 5000,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    //   refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    //   resetPasswordExpirationMinutes:
    //     envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    //   verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
    url: envVars.CLOUDINARY_URL,
  },
  adminEmail: envVars.ADMIN_EMAIL,
  adminPassword: envVars.ADMIN_PASSWORD,
  // oneSignalKeys: {
  //   appId: envVars.ONESIGNAL_APP_ID,
  //   restApiKey: envVars.ONESIGNAL_REST_API,
  // },
  // email: {
  //   smtp: {
  //     host: envVars.SMTP_HOST,
  //     port: envVars.SMTP_PORT,
  //     auth: {
  //       user: envVars.SMTP_USERNAME,
  //       pass: envVars.SMTP_PASSWORD,
  //     },
  //   },
  //   from: envVars.EMAIL_FROM,
  // },
};
