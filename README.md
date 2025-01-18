# CodeCat-Run
- An endless running game about a cute cat that jumps over programming stuff.
- Made with Kaplay https://kaplayjs.com

## To Do
- Show the character cat
- Add the floor and the gravity so the cat rests in the floor
- Add the obstacles

# Folder structure

- `src` - source code for your kaplay project
- `dist` - distribution folder, contains your index.html, built js bundle and static assets


## Development

```sh
$ npm run dev
```

will start a dev server at http://localhost:8000

## Distribution

```sh
$ npm run build
```

will build your js files into `dist/`

```sh
$ npm run zip
```

will build your game and package into a .zip file, you can upload to your server or itch.io / newground etc.