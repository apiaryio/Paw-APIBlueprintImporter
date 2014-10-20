{exec} = require "child_process"

task 'test', ->
  exec 'mocha --compilers coffee:coffee-script/register test.coffee', (err, output) ->
    throw err if err
    console.log output

task 'build', ->
  exec 'coffee --compile APIBlueprintImporter.coffee'

task 'watch', ->
  exec 'coffee --watch --compile APIBlueprintImporter.coffee'

