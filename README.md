## Stuff no compatible with bun

`npm run build:schema` is not compatible for any reason with `bun.sh`

## About the copied source code

The hooks:

- [`useReplicant`](https://github.com/Hoishin/use-nodecg/blob/master/src/use-replicant.ts)
- [`useReplicantOnce`](https://github.com/Hoishin/use-nodecg/blob/master/src/use-replicant-once.ts)

Were copied from project [use-nodecg](https://github.com/Hoishin/use-nodecg). The `useReplicant` were modified to delete the depency of lodash library.

## API REST

### `/{bundle-name}/api/stopwatch/{action}`

#### action

- `start`
- `stop`
- `reset`

### `/{bundle-name}/api/score/{team}/{action}`

#### team

- `LOCAL`
- `VISITOR`

#### action

- `add`
- `substract`
