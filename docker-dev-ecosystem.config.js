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
    {
      name: "watcher-schemas",
      script: "bun",
      args: "build:schemas",
      instances: 1,
      watch: ["schemas"],
      watch_delay: 1000,
    },
  ],
};
