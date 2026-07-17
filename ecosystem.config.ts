module.exports = {
  apps: [
    {
      name: 'illovo-ims',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 1290,
        VITE_API_BASE: 'https://egenco.imosys.mw/api', // set your real backend URL
      },
    },
  ],
};