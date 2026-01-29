// Runtime assertion for required environment variables
// This file is imported early in the server runtime to fail fast when required envs are missing.

const required = ['JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} not set. Add it to .env.local or set it in your environment.`);
  }
}

export {};
