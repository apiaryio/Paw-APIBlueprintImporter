import {Fury} from 'fury';
import {detect} from 'fury-adapter-apib-parser';
import {parseSync} from 'drafter.js';
import APIElementImporter from './APIElementImporter.js'

@registerImporter
export default class APIBlueprintImporter {
  static identifier = 'io.apiary.PawExtensions.APIBlueprintImporter';
  static title = 'API Blueprint Importer';
  static inputs = [
    InputField("host", "Base HOST", "String", {placeholder: "https://example.com"}),
  ];

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

  import(context, items, options) {
    const defaultHost = options.inputs['host'];

    for (const item of items) {
      console.log('Importing Item');
      const parseResult = this.fury.load(parseSync(item.content));
      const importer = new APIElementImporter(context, defaultHost);
      importer.importAPI(parseResult.api);
    }

    return true;
  }
}
