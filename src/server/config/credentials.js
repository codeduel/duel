module.exports = {

  //duel-dev credentials for testing
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || 'bb04ce8a602b35e1d50d',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '17717edfb46f9e7260d7e0223b3c80e2d58532e8',
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback'
};
