Paw API Blueprint Importer Extension
====================================

[![Build Status](http://img.shields.io/travis/apiaryio/Paw-APIBlueprintImporter/master.svg?style=flat)](https://travis-ci.org/apiaryio/Paw-APIBlueprintImporter)

This extension depends on a pre-released version of Paw and is not yet ready
for public consumption.

### Installation

The [Paw extension](https://luckymarmot.com/paw/extensions/APIBlueprintImporter) can be installed from the [Paw extensions page](https://luckymarmot.com/paw/extensions/APIBlueprintImporter).

#### Development Instructions

If you would like to develop the extension, you have follow these steps to get a development environment setup.

##### Clone

First of all, clone this repository in any convenient location (e.g `~/Desktop`).

```bash
$ git clone https://github.com/apiaryio/Paw-APIBlueprintImporter
```

##### Prerequisites

Install `npm` if needed (e.g. below using [Homebrew](http://brew.sh/)):

```bash
$ brew install npm
```

Install dependencies using `npm`:

```bash
$ npm install
```

##### Development Installation

During development, build the `.js` script using:

```bash
$ npm run build
```

To install into the Paw Extension directory:

```bash
$ npm run install
```

Alternatively, use the `watch` command to automatically build and install when a file has been modified:

```bash
$ npm run watch
```

##### Tests

Run the tests:

```bash
$ npm test
```

### License

MIT License. See the [LICENSE](LICENSE) file.
