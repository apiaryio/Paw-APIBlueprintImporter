import { expect } from 'chai';

import fs from 'fs';
import glob from 'glob';
import path from 'path';

import { Fury } from 'fury';
import apibParser from 'fury-adapter-apib-parser';

import APIElementImporter from '../src/APIElementImporter';
import Context from './Context';

const fury = new Fury();
fury.use(apibParser);

describe('API Blueprint Importer', () => {
  const filenames = glob.sync(path.join(__dirname, 'fixtures', '*.apib'));

  filenames.forEach((filename) => {
    const name = path.basename(filename, path.extname(filename));

    it(`can import ${name} fixture`, (done) => {
      const source = fs.readFileSync(filename, 'utf-8');
      const contextFilename = path.join(__dirname, 'fixtures', `${name}.json`);

      let expectedContext;

      try {
        expectedContext = JSON.parse(fs.readFileSync(contextFilename, 'utf-8'));
      } catch (error) {
        expectedContext = {};
      }

      fury.parse({ source }, (err, parseResult) => {
        expect(err).to.be.null;

        const context = new Context();
        const importer = new APIElementImporter(context);
        importer.importAPI(parseResult.api);

        if (process.env.GENERATE) {
          fs.writeFileSync(path.join(contextFilename), JSON.stringify(context, null, 2), 'utf8');
        }

        expect(JSON.parse(JSON.stringify(context))).to.deep.equal(expectedContext);

        done();
      });
    });
  });
});
