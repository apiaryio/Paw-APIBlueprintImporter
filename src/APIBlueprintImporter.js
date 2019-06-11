import {Fury} from 'fury';
import APIBlueprintParser from 'fury-adapter-apib-parser';
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
    this.fury.use(APIBlueprintParser);
  }

  canImport(context, items) {
    let isAPIBlueprint = false;

    items.forEach((item) => {
      if (APIBlueprintParser.detect(item.content)) {
        isAPIBlueprint = true;
      }
    });

    return isAPIBlueprint;
  }

  async import(context, items, options) {
    const defaultHost = options.inputs['host'];

    for (const item of items) {
      console.log('Importing Item');
      const parseResult = await this.fury.parse({ source: item.content, mediaType: 'text/vnd.apiblueprint' });

      if (parseResult.api) {
        const importer = new APIElementImporter(context, defaultHost);
        importer.importAPI(parseResult.api);
      }

      parseResult.errors.forEach((error) => {
        const start = error.attributes.get('sourceMap').get(0).get(0).get(0);
        const line = start.attributes.get('line');
        const column = start.attributes.get('column');
        throw new Error(`${error.toValue()} on line ${line}:${column}`)
      });
    }

    return true;
  }
}
