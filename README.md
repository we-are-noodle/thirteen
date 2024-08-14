# thirteen 🍭

### Development Setup

Install and use the required node version. This uses [nvm](https://github.com/nvm-sh/nvm) and the
`.nvmrc` file.

```
nvm install
nvm use
```

Install the dependencies.

```
npm install
```

Start the development server and go to http://localhost:40001 in your browser.

```
npm start
```

### Linting

To lint the project, run:

```
npm run lint
```

This will run prettier and eslint to make sure everything stays shiny.

### Building

To build the project, run:

```
./bin/build.sh
```

This will build and bundle the project into the `build/zipped/thirteen.zip` file.

Make sure we don't go over 13kb. You can see this in the output of the build script, for example:

```
build/zipped/thirteen.zip @ 3326 byte / 24.98% of 13312 bytes
```

This means the package is 3326 bytes, which is 24.98% of the 13kb limit.
