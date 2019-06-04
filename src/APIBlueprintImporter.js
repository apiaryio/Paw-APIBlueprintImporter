import {Fury} from 'fury';
import APIBlueprintParser from 'fury-adapter-apib-parser';
import APIElementImporter from './APIElementImporter.js'

function promisify(func, thisArg) {
  return (...args) => new Promise((resolve, reject) => {
    func.bind(thisArg)(...args, (err, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
}

@registerImporter
export default class APIBlueprintImporter {
  static identifier = 'io.apiary.PawExtensions.APIBlueprintImporter';
  static title = 'API Blueprint Importer';
  static inputs = [
    InputField("host", "Base HOST", "String", {placeholder: "https://example.com"}),
  ];

  constructor() {
    this.fury = new Fury();
    this.fury.use(APIBlueprintParser);
  }

  canImport(context, items) {
    for (const item of items) {
      if (APIBlueprintParser.detect(item.content)) {
        return true
      }
    }

    return false;
  }

  async import(context, items, options) {
    const defaultHost = options.inputs['host'];

    // FIXME remove promisify when https://github.com/apiaryio/api-elements.js/issues/37 is live
    const parse = promisify(this.fury.parse, this.fury);

    for (const item of items) {
      console.log('Importing Item');
      const parseResult = await parse({ source: item.content, mediaType: 'text/vnd.apiblueprint' });
      const importer = new APIElementImporter(context, defaultHost);
      importer.importAPI(parseResult.api);
    }

    return true;
  }
}
