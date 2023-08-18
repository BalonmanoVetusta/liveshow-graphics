docker: install clean build
	podman build . --tag hls

install:
	npx --yes pnpm install

build: clean
	npm run build:schemas
	npm run build:dashboard
	npm run build:graphics
	npm run build:extension

clean:
	npm run build:clean
