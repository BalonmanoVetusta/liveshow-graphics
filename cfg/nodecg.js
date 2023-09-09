// import { randomBytes } from "node:crypto";

const config = {
  host: "0.0.0.0",
  port: 9090,
  developer: true,
  login: {
    enabled: false,
    sessionSecret: process.env.NODECG_SESSION_SECRET ?? "notsecure", // randomBytes(128).toString("hex"),
  },
  logging: {
    replicants: false,
    console: {
      enabled: true,
      timestamps: false,
      level: "trace",
    },
    file: {
      enabled: true,
      timestamps: true,
      path: "logs/server.log",
      level: "info",
    },
  },
  //   ssl: {
  //     enabled: false,
  //     keyPath: "",
  //     certificatePath: "",
  //   },
  //   sentry: {
  //     enabled: false,
  //     dsn: "https://xxx:yyy@sentry.io/zzz",
  //     publicDsn: "https://xxx@sentry.io/zzz",
  //   },
};

// Check if we are in production mode
if (!process.env.NODE_ENV?.toLowerCase().startsWith("prod")) {
  config.developer = true;
  config.login.enabled = false;
  config.login.twitch.enabled = false;
  config.login.steam.enabled = false;
  config.logging.console.level = "debug";
  config.logging.file.level = "debug";
  config.sentry.enabled = false;
}

if (!config.developer) {
  if (process.env.NODECG_HOST) {
    config.host = process.env.NODECG_HOST;
  }

  // Basic auth
  if (process.env.NODECG_BASIC_USERS) {
    const allowedUsers = process.env.NODECG_BASIC_USERS.split(",")
      .map((userPassword) => {
        const [username, password] = userPassword.split(":");
        if (username.length > 0 && password.length > 0)
          // Not empty users or passwords allowed
          return { username, password };
      })
      .filter(Boolean);

    if (allowedUsers.length > 0) {
      console.info("Basic auth enabled");
      config.login.enabled = true;
      config.login.local = {
        enabled: true,
        allowedUsers,
      };
    }
  }

  // Twitch auth
  if (
    process.env.NODECG_TWITCH_CLIENT_ID &&
    process.env.NODECG_TWITCH_CLIENT_SECRET &&
    process.env.NODECG_TWITCH_ALLOWED_USERNAMES
  ) {
    const allowedUsernames = process.env.NODECG_TWITCH_ALLOWED_USERNAMES.split(",").filter((id) => id.length > 0);

    if (allowedUsernames.length > 0) {
      console.info("Twitch auth enabled");
      config.login.enabled = true;
      config.login.twitch = {
        enabled: true,
        clientID: process.env.NODECG_TWITCH_CLIENT_ID,
        clientSecret: process.env.NODECG_TWITCH_CLIENT_SECRET,
        scope: "user_read",
        allowedUsernames,
      };
    }
  }

  // Discord auth
  if (
    process.env.NODECG_DISCORD_CLIENT_ID &&
    process.env.NODECG_DISCORD_CLIENT_SECRET &&
    process.env.NODECG_DISCORD_ALLOWED_USERNAMES
  ) {
    const allowedUsernames = process.env.NODECG_DISCORD_ALLOWED_USERNAMES.split(",").filter((id) => id.length > 0);

    if (allowedUsernames.length > 0) {
      console.info("Discord auth enabled");
      config.login.enabled = true;
      config.login.discord = {
        enabled: true,
        clientID: process.env.NODECG_DISCORD_CLIENT_ID,
        clientSecret: process.env.NODECG_DISCORD_CLIENT_SECRET,
        scope: "identify",
        allowedUsernames,
      };
    }
  }

  // Steam auth
  if (process.env.NODECG_STEAM_API_KEY && process.env.NODECG_STEAM_ALLOWED_IDS) {
    const allowedIds = process.env.NODECG_STEAM_ALLOWED_IDS.split(",").filter((id) => id.length > 0);

    if (allowedIds.length > 0) {
      config.login.enabled = true;
      config.login.steam = {
        enabled: true,
        apiKey: process.env.NODECG_STEAM_API_KEY,
        allowedIds,
      };
    }
  }
}

if (process.env.NODECG_PORT) {
  config.port = process.env.NODECG_PORT;
}
module.exports = config;
