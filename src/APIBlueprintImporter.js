import {Fury} from 'fury';
import {parseSync} from 'drafter.js';
import APIElementImporter from './APIElementImporter.js'

@registerImporter
export default class APIBlueprintImporter {
  static identifier = 'io.apiary.PawExtensions.APIBlueprintImporter';
  static title = 'API Blueprint Importer';

  constructor() {
    this.fury = new Fury();
  }

  importString(context, string) {
    const parseResult = this.fury.load(parseSync(string));
    const importer = new APIElementImporter(context);
    importer.importAPI(parseResult.api);
    console.log('Imported');
    return true;
  }
}
