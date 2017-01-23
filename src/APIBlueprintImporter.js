import APIBlueprintASTImporter from './APIBlueprintASTImporter.coffee'

@registerImporter
export default class APIBlueprintImporter {
  static identifier = 'io.apiary.PawExtensions.APIBlueprintImporter';
  static title = 'API Blueprint Importer';

  importString(context, string) {
    const importer = new APIBlueprintASTImporter();
    importer.importString(context, string);
    return true;
  }
}
