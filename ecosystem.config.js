module.exports = {
  apps: [
    {
      name: 'narativa-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      cwd: '/home/narativa',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Restart settings
      exp_backoff_restart_delay: 100,
      restart_delay: 1000,
      max_restarts: 10,
      min_uptime: '10s',
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/home/narativa/logs/error.log',
      out_file: '/home/narativa/logs/out.log',
      merge_logs: true,
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000
    }
  ]
};
