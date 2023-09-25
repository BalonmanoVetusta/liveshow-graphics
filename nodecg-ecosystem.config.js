module.exports = {
  apps: [
    {
      name: "nodecg",
      script: "node",
      args: "index.js",
      instances: 1,
      autorestart: true,
      watch: ["bundles"],
      watch_delay: 10000,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        NODECG_HOST: "0.0.0.0",
        NODECG_PORT: "9090",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
