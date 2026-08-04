// PM2 process config — Hostinger VPS par app isi se chalta hai.
// Usage: pm2 start ecosystem.config.js && pm2 save
module.exports = {
  apps: [
    {
      name: 'sathimate',
      script: '.next/standalone/server.js',
      cwd: '/var/www/sathimate',
      instances: 1,           // KVM 2 ya usse bade plan par 'max' kar sakte ho
      exec_mode: 'fork',      // 'max' instances ke saath 'cluster' karna
      autorestart: true,
      max_memory_restart: '600M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
      },
      error_file: '/var/log/sathimate/error.log',
      out_file: '/var/log/sathimate/out.log',
      time: true,
    },
  ],
};
