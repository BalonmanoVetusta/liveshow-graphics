module.exports = {
  apps: [
    {
      name: "watcher-dashboard",
      script: "bun",
      args: "watch:dashboard",
      instances: 1,
    },
    {
      name: "watcher-graphics",
      script: "bun",
      args: "watch:graphics",
      instances: 1,
    },
    {
      name: "watcher-extension",
      script: "bun",
      args: "watch:extension",
      instances: 1,
    },
    // {
    //   name: "watcher-schemas",
    //   script: "bun",
    //   args: "build:schemas",
    //   instances: 1,
    //   autorestart: true,
    //   watch: ["./schemas"],
    //   watch_delay: 1000,
    // },
    {
      name: "handball-liveshow-spain",
      script: "npm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: ["dashboard", "extension", "graphics"],
      ignore_watch: ["node_modules", "src"],
      // watch: ["src"],
      // ignore_watch: ["node_modules", "dashboard", "extension", "graphics"],
      watch_delay: 10000,
      max_memory_restart: "500M",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
