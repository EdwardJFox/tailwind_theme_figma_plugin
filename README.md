# Tailwind Theme Export Figma Plugin

Built for Tailwind 4 (alpha), this Figma plugin creates CSS variables from your design documents Local styles.

## Setup

First clone the repo onto your machine, then run the following command to install packages (project made with `bun`).

```
bun install
```

## Build

There's currently no HMR in the project, so to see the plugin you need to rebuild. Luckily it's nice and small, and takes no time at all!

```
bun run build
```

## Running tests

Tests have the following file format `*.test.ts`. You can run the tests with the following command:

```
bun run test
```