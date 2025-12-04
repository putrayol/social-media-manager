module.exports = {
  apps: [
    {
      name: 'narativa-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      cwd: '/home/narativa',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      exp_backoff_restart_delay: 100,
      restart_delay: 3000,
      max_restarts: 5,
      min_uptime: '30s',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/home/narativa/logs/error.log',
      out_file: '/home/narativa/logs/out.log',
      merge_logs: true,
      kill_timeout: 10000,
      listen_timeout: 15000,
      wait_ready: true
    }
  ]
};
