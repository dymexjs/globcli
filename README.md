# Dymexjs - @dymexjs/globcli

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/14dbc81adf924a61a80e7f0c95cad6c1)](https://app.codacy.com/gh/dymexjs/globcli/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/14dbc81adf924a61a80e7f0c95cad6c1)](https://app.codacy.com/gh/dymexjs/globcli/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![Released under the MIT license.](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](./CODE_OF_CONDUCT.md)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![All Contributors](https://img.shields.io/github/all-contributors/dymexjs/globcli?color=ee8449&style=flat-square)](#contributors-)

Same as [globstar](https://www.npmjs.com/package/globstar) but newer

Run programs with glob support, especially on Windows within npm scripts.

<!-- omit in toc -->
## Table of Contents

- [Dymexjs - @dymexjs/globcli](#dymexjs---dymexjsglobcli)
  - [Install](#install)
  - [Usage](#usage)
    - [Npm Scripts](#npm-scripts)
  - [Options](#options)
  - [Code of Conduct](#code-of-conduct)
  - [How to Contribute](#how-to-contribute)
  - [License 📝](#license-)
  - [Contributors ✨](#contributors-)

## Install

```sh
npm install @dymexjs/globcli

or

npm install @dymexjs/globcli --global
```

## Usage

```sh
> globcli -- echo "./REA*.md"
README.md
```

Please note the `--` and that globcli uses forward slashes.

Under the hood globcli uses [yargs](https://www.npmjs.com/package/yargs) to parse cli arguments and [glob](https://www.npmjs.com/package/glob) to parse the patterns.

It also uses [debug](https://www.npmjs.com/package/debug) for debugging purposes, to see the debug messages just set `DEBUG` env var to `DEBUG=dymexjs:globcli`

### Npm Scripts

```sh
npm install @dymexjs/globcli -D
```

```json
"scripts": {
  "test": "globcli -- tsx --test \"tests/**/*.test.ts\"",
}
```

## Options

```sh
Run programs with globcli support.

Usage: index.js [OPTION]... -- COMMAND [ARG]...
Note the -- between the index.js OPTIONS and the COMMAND and its argumen
ts

Options:
      --version  Show version number                                   [boolean]
      --nodir    glob patterns do not match directories, only files    [boolean]
  -i, --ignore   add glob pattern to exclude from matches                [array]
  -n, --node     same as `--ignore "node_modules/**"`                  [boolean]
      --help     Show help                                             [boolean]

Use 'DEBUG=dymexjs:globcli' to see debug messages
```

## Code of Conduct

We expect everyone to abide by our [**Code of Conduct**](./CODE_OF_CONDUCT.md). Please read it.

## How to Contribute

Check out our [**Contributing Guide**](./CONTRIBUTING.md) for information on contributing.

## License 📝

Licensed under the [MIT License](./LICENSE).

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/n3okill"><img src="https://avatars.githubusercontent.com/u/1280607?v=4?s=50" width="50px;" alt="João Parreira"/><br /><sub><b>João Parreira</b></sub></a><br /><a href="#maintenance-n3okill" title="Maintenance">🚧</a> <a href="https://github.com/dymexjs/globcli/commits?author=n3okill" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
