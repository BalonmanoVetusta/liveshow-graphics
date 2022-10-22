## Stuff no compatible with bun

`npm run build:schema` is not compatible for any reason with `bun.sh`

## Executing

If you change anything in `package.json` file you will need a full restart. If you change schemas you will need to build manually and restart.

```bash
bun run build:schemas
bun run dev
```

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
