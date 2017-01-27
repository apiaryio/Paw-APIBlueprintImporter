import {Fury} from 'fury';
import {detect} from 'fury-adapter-apib-parser';
import {parseSync} from 'drafter.js';
import APIElementImporter from './APIElementImporter.js'

@registerImporter
export default class APIBlueprintImporter {
  static identifier = 'io.apiary.PawExtensions.APIBlueprintImporter';
  static title = 'API Blueprint Importer';

  constructor() {
    this.fury = new Fury();
  }

  canImport(context, items) {
    for (const item of items) {
      if (detect(item.content)) {
        return true
      }
    }

    return false;
  }

  importString(context, string) {
    const parseResult = this.fury.load(parseSync(string));
    const importer = new APIElementImporter(context);
    importer.importAPI(parseResult.api);
    console.log('Imported');
    return true;
  }
}
