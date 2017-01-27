# Paw API Blueprint Importer Changelog

## 2.0.0

### Enhancements

- Parsing API Blueprint is now done locally so you can now import API
  Blueprints offline.

- You can now specify a base host, the importer will use the default host when
  constructing URLs with paths in your API Blueprint.  
  [#6](https://github.com/apiaryio/Paw-APIBlueprintImporter/issues/6)

- The importer will now be detected by Paw when using an API Blueprint so you
  do not need to manually select the API Blueprint importer.
