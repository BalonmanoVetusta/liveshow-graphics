DISCLAIMER: This project is intendeed to run in local. The API is exposed publicly without security so run this in a public server will make it available publicly by any others who knows the url make it possible to modify your expected behaviour.

## Stuff no compatible with bun

`npm run build:schema` is not compatible for any reason with `bun.sh`

## Executing

If you change anything in `package.json` file you will need a full restart. If you change schemas you will need to build manually and restart.

```bash
npm install
bun run build:schemas
bun run dev
```

If you want to use assets and mounts and you are using include-nodecg with version 1.9.0 you should patch with this fix [#607](https://github.com/nodecg/nodecg/pull/607) manually.

### Development (re)start

```bash
bun run dev
```

#### View logs

```bash
bun run viewlogs -- handball-liveshow-spain
bun run viewlogs -- watcher-dashboard
bun run viewlogs -- watcher-extension
bun run viewlogs -- watcher-graphics
```

## Kiosk Mode (Untested yet)

Was thinked to be run on Raspberry Pi or any Debian based Linux with chromium.

### Setup

You need to manually activate auto login on Raspberry Pi by using `raspi-config`. You will need to config hdmi resolution and recommended to setup overscan to avoid a black line around the image.

After that you can use:

```bash
KIOSK_URL="http://localhost:9090/bundles/handball-liveshow-spain/graphics/match.html" ./bin/kiosk-mode --setup
```

After that if you restart the pi should see the webpage configured in `KIOSK_URL` variable.

## About the copied source code

The hooks:

- [`useReplicant`](https://github.com/Hoishin/use-nodecg/blob/master/src/use-replicant.ts)
- [`useReplicantOnce`](https://github.com/Hoishin/use-nodecg/blob/master/src/use-replicant-once.ts)

Were copied from project [use-nodecg](https://github.com/Hoishin/use-nodecg). The `useReplicant` were modified to delete the depency of lodash library.

## API REST

### `/{bundle-name}/stopwatch/{action}`

#### action

- `start`
- `stop`
- `reset`
- `toggle`

### `/{bundle-name}/scoreboard/{team}/{action}`

#### team

- `LOCAL`
- `VISITOR`

#### action

- `add`
- `remove`
