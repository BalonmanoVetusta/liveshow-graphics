const scheme = process.env.NODECG_SCHEME ?? "http";
const host = process.env.NODECG_HOST ?? "localhost";
const port = process.env.NODECG_PORT ?? "9090";
export const nodecgEndpoint = process.env.BASE_URL ?? `${scheme}://${host}:${port}`;
export const bundleName = process.env.BUNDLE_NAME ?? "handball-liveshow-spain";
