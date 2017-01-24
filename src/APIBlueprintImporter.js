import {parseSync} from 'drafter.js';
import APIBlueprintASTImporter from './APIBlueprintASTImporter.coffee'

@registerImporter
export default class APIBlueprintImporter {
  static identifier = 'io.apiary.PawExtensions.APIBlueprintImporter';
  static title = 'API Blueprint Importer';

  importString(context, string) {
    const parseResult = parseSync(string, {type: 'ast'});

    const importer = new APIBlueprintASTImporter();
    importer.importBlueprint(context, parseResult);

    return true;
  }
}
