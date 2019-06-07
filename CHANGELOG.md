# Paw API Blueprint Importer Changelog

## 2.1.0

### Enhancements

- Updated to [Drafter
  4.0.0-pre.7](https://github.com/apiaryio/drafter/blob/9aa5aecdfdd4bf6b3a7236cc631073315d9d4d88/CHANGELOG.md#400-pre7-2019-05-31),
  the new version of the API Blueprint parser. This contains many fixes and
  improvements, see Drafter changelog for more details.

### Bug Fixes

- Underlying errors from parsing invalid API Blueprint's are now presented with
  the line number in the API Blueprint document that caused the error.

- URI Templates from API Blueprint are now expanded with the default and
  example values. This can fix problems when importing documents that use query
  parameters in URI Template. The parameters shown in Paw previously could
  contain fragments from URI Template for example `}`.
  [#15](https://github.com/apiaryio/Paw-APIBlueprintImporter/issues/15)

## 2.0.0

### Enhancements

- Parsing API Blueprint is now done locally so you can now import API
  Blueprints offline.

- You can now specify a base host, the importer will use the default host when
  constructing URLs with paths in your API Blueprint.  
  [#6](https://github.com/apiaryio/Paw-APIBlueprintImporter/issues/6)

- The importer will now be detected by Paw when using an API Blueprint so you
  do not need to manually select the API Blueprint importer.
