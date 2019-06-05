Paw API Blueprint Importer Extension
====================================

[![Build Status](http://img.shields.io/travis/apiaryio/Paw-APIBlueprintImporter/master.svg?style=flat)](https://travis-ci.org/apiaryio/Paw-APIBlueprintImporter)

### Installation

The [Paw extension](https://luckymarmot.com/paw/extensions/APIBlueprintImporter) can be installed from the [Paw extensions page](https://luckymarmot.com/paw/extensions/APIBlueprintImporter).

#### Development Instructions

If you would like to develop the extension, the following steps can be used to
setup a development environment setup. You will need [Paw](https://paw.cloud/)
installed.

##### Clone

First of all, clone this repository in any convenient location (e.g `~/Desktop`).

```bash
$ git clone https://github.com/apiaryio/Paw-APIBlueprintImporter.git
```

##### Prerequisites

Install `node` if needed (e.g. below using [Homebrew](http://brew.sh/)):

```bash
$ brew install node
```

Install dependencies using `npm`:

```bash
$ npm install
```

##### Development Installation

During development, build the Paw extension using:

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
