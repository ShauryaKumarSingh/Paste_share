// Check required environment variables using .env.local
require('dotenv').config({ path: '.env.local' });
const required = ['JWT_SECRET'];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('Missing required env vars:', missing.join(', '));
  process.exit(1);
}
console.log('env ok');
