module.exports = {
  apps: [
    {
      name: "handball-liveshow-spain",
      script: "bun",
      args: "run standalone:start",
      instances: 1,
      autorestart: true,
      watch: ["dashboard", "extension", "graphics"],
      ignore_watch: ["node_modules", "src"],
      // watch: ["src"],
      // ignore_watch: ["node_modules", "dashboard", "extension", "graphics"],
      watch_delay: 10000,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
