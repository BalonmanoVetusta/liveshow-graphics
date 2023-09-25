// import { randomBytes } from "node:crypto";

const { env = {} } = process ?? {};

const config = {
  host: "0.0.0.0",
  port: 9090,
  login: {
    enabled: false,
    sessionSecret: env.NODECG_SESSION_SECRET ?? "notsecure", // randomBytes(128).toString("hex"),
  },
};

if (env.NODE_ENV?.toLowerCase().startsWith("prod")) {
  if (env.NODECG_HOST) {
    config.host = env.NODECG_HOST;
  }

  // Basic auth
  if (env.NODECG_BASIC_USERS) {
    const allowedUsers = env.NODECG_BASIC_USERS.split(",")
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
  if (env.NODECG_TWITCH_CLIENT_ID && env.NODECG_TWITCH_CLIENT_SECRET && env.NODECG_TWITCH_ALLOWED_USERNAMES) {
    const allowedUsernames = env.NODECG_TWITCH_ALLOWED_USERNAMES.split(",").filter((id) => id.length > 0);

    if (allowedUsernames.length > 0) {
      console.info("Twitch auth enabled");
      config.login.enabled = true;
      config.login.twitch = {
        enabled: true,
        clientID: env.NODECG_TWITCH_CLIENT_ID,
        clientSecret: env.NODECG_TWITCH_CLIENT_SECRET,
        scope: "user_read",
        allowedUsernames,
      };
    }
  }

  // Discord auth
  if (env.NODECG_DISCORD_CLIENT_ID && env.NODECG_DISCORD_CLIENT_SECRET && env.NODECG_DISCORD_ALLOWED_USERNAMES) {
    const allowedUserIDs = env.NODECG_DISCORD_ALLOWED_USERIDS.split(",").filter(Boolean);

    if (allowedUserIDs.length > 0) {
      console.info("Discord auth enabled");
      config.login.enabled = true;
      config.login.discord = {
        enabled: true,
        clientID: env.NODECG_DISCORD_CLIENT_ID,
        clientSecret: env.NODECG_DISCORD_CLIENT_SECRET,
        scope: "identify",
        allowedUserIDs,
      };
    }
  }

  // Steam auth
  if (env.NODECG_STEAM_API_KEY && env.NODECG_STEAM_ALLOWED_IDS) {
    const allowedIds = env.NODECG_STEAM_ALLOWED_IDS.split(",").filter((id) => id.length > 0);

    if (allowedIds.length > 0) {
      config.login.enabled = true;
      config.login.steam = {
        enabled: true,
        apiKey: env.NODECG_STEAM_API_KEY,
        allowedIds,
      };
    }
  }
}

if (env.NODECG_PORT) {
  config.port = env.NODECG_PORT ?? 9090;
}

// if (env.NODECG_BASEURL || env.NODECG_DOMAIN) {
//   config.baseUrl = env.NODECG_BASEURL || `${env.HTTP_SCHEME ?? "https"}://${env.NODECG_DOMAIN}`;
// }
module.exports = config;
