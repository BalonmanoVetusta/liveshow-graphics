DISCLAIMER: This project is intendeed to run in local. The API is exposed publicly without security so run this in a public server will make it available publicly by any others who knows the url make it possible to modify your expected behaviour.

## Stuff no compatible with bun

`npm run build:schema` is not compatible for any reason with `bun.sh`

## Executing

If you change anything in `package.json` file you will need a full restart. If you change schemas you will need to build manually and restart.

```bash
npm install
npm run build:schemas
npm run dev
```

If you want to use assets and mounts and you are using include-nodecg with version 1.9.0 you should patch with this fix [#607](https://github.com/nodecg/nodecg/pull/607) manually.


## Kiosk Mode (Untested yet)

Was thinked to be run on Raspberry Pi or any Debian based Linux with chromium.

## Fonts

Best way to have custom fonts running with sharp is by installing the font on the system, I did not find out a best way to do it. Even with css `@font-face` it was not working.

To install fonts on linux you can do it in two ways:
- System wide install on `/usr/share/fonts`
- User install on `~/.fonts`

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


## LICENSE

MIT, see [LICENSE](./LICENSE) file.

[Alumni Sans Font](https://github.com/googlefonts/alumni) is licensed under [SIL Open Font License]([./assets/fonts/alumni-sans/LICENSE.txt](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL)). See [README.md](./assets/fonts/alumni-sans/README.md) file on [assets/fonts/alumni-sans](./assets/fonts/alumni-sans) folder.

[Cursed Timer Ulil Font](https://www.fontspace.com/cursed-timer-ulil-font-f29411) is licensed under Freeware License. See [README.md](./assets/fonts/CursedTimerUlil-Aznm/README.md) file on [assets/fonts/CursedTimerUlil-Aznm](./assets/fonts/CursedTimerUlil-Aznm) folder.
