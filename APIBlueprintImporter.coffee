# Paw API v0.2.0 and below (Paw 2.2.2 and below) differences
((root) ->
  if root.bundle?.minApiVersion('0.2.0')
    root.drafter = require './drafter.js'
  else
    drafter = require 'drafter.js'
)(this)


# PAW APIBlueprint extension
APIBlueprintImporter = ->

  # Imports a blueprint.
  #
  # @param [Context] context Paw context
  # @param [Object] blueprint application/vnd.apiblueprint.parseresult+json
  #
  @importBlueprint = (context, blueprint) ->
    ast = blueprint["ast"]
    metadata = ast["metadata"]
    baseHost = null

    for metadata in ast["metadata"]
      if metadata["name"] == "HOST"
          baseHost = metadata["value"]

    if not baseHost
        baseHost = "http://my-host.com"

    # TODO make real base host
    resourceGroups = ast["resourceGroups"]

    for resourceGroup in resourceGroups
      @importResourceGroup(context, baseHost, resourceGroup)

  # Imports a blueprint resource group.
  #
  # @param [Context] context Paw context
  # @param [String] baseHost The blueprint's base host
  # @param [Object] resourceGroup The blueprint resource group
  #
  # @returns [RequestGroup,Void] A PAW Request group
  #
  @importResourceGroup = (context, baseHost, resourceGroup) ->
    name = resourceGroup["name"]
    resources = resourceGroup["resources"]

    if name.length > 0
      console.log("Importing resource group " + name)
      requestGroup = context.createRequestGroup(name)

      for resource in resources
        request = @importResource(context, baseHost, resource)
        requestGroup.appendChild(request)

      return requestGroup

    console.log("Importing unnamed resource group")

    for resource in resources
      @importResource(context, baseHost, resource)


  # Imports a resource from a blueprint.
  #
  # @param [Context] context Paw context
  # @param [String] baseHost The blueprint's base host
  # @param [Object] resource the blueprint resource
  #
  # @return [Request,RequestGroup] Returns the imported request group
  #
  @importResource = (context, baseHost, resource) ->
    name = resource["name"] || "Unnamed Resource"
    actions = resource["actions"]

    console.log("Importing resource " + name)

    url = baseHost + resource["uriTemplate"]
    # TODO: uriTemplate and parameters

    requestGroup = context.createRequestGroup(name)
    for action in actions
      request = @importResourceAction(context, baseHost, url, action)
      requestGroup.appendChild(request)

    return requestGroup

  # Imports an action from a blueprint.
  #
  # @param [Context] context Paw context
  # @param [String] baseHost The blueprint's base host
  # @param [String] url Actions URL
  # @param [Object] action the blueprint action
  #
  # @return [Request,RequestGroup] Returns either a request or request group
  #
  @importResourceAction = (context, baseHost, url, action) ->
    name = action["name"]
    if name.length == 0
      name = action["description"]

      if name.length == 0
        name = "Example"

    examples = action["examples"]
    method = action["method"]
    # TODO uri templates

    attributes = action['attributes']
    if attributes
      uriTemplate = attributes['uriTemplate']
      if uriTemplate && uriTemplate.length > 0
          url = baseHost + uriTemplate

    console.log("Importing resource action '" + name + "' " + examples.length + " examples")

    if examples.length > 0
        if examples.length == 1
          return @importExample(context, name, method, url, examples[0])
        else
          requestGroup = context.createRequestGroup(name)
          for example in examples
            request = @importExample(context, name, method, url, example)
            requestGroup.appendChild(request)

          return requestGroup
    else
      request = context.createRequest(name, method, url)

    return request

  # Imports an example from a blueprint.
  #
  # @param [Context] context Paw context
  # @param [String] name The name of the example
  # @param [String] method The method of the example request
  # @param [String] url The URL of the example request
  # @param [Object] example the blueprint example
  #
  # @return [Request,RequestGroup] Returns either a request or request group
  #
  @importExample = (context, name, method, url, example) ->
    if example["name"].length > 0
      name = example["name"]
    requests = example["requests"]

    if requests != undefined && requests.length > 0
      if requests.length == 1
          return @importExampleRequest(context, name, method, url, requests[0])
      else
        requestGroup = context.createRequestGroup(name)

        for requestExample in requests
          request = @importExampleRequest(context, name, method, url, requestExample)
          requestGroup.appendChild(request)

        return requestGroup
    else
      request = context.createRequest(name, method, url)

    return request

  # Imports an example request from a blueprint.
  #
  # @param [Context] context Paw context
  # @param [String] name The name of the example request
  # @param [String] method The method of the example request
  # @param [String] url The URL of the example request
  # @param [Object] exampleRequest the blueprint example request
  #
  # @returns [Request] A Paw Request, created from the example request
  #
  @importExampleRequest = (context, name, method, url, exampleRequest) ->
    if exampleRequest["name"].length > 0
      name = exampleRequest["name"]

    exampleHeaders = exampleRequest["headers"]
    body = exampleRequest["body"]

    console.log("Importing example request " + name)

    headers = {}
    if exampleHeaders
      for header in exampleHeaders
        key = header["name"]
        value = header["value"]
        headers[key] = value

    request = context.createRequest(name, method, url)
    request.headers = headers
    request.body = body
    return request

  # Imports a string from Paw (Paw callback)
  #
  # @param [Context] context Paw context
  # @param [String] string Payload to import
  #
  @importString = (context, string) ->
    result = drafter.parse(string, type: "ast")
    @importBlueprint context, result
    return true

  return

APIBlueprintImporter.identifier = "io.apiary.PawExtensions.APIBlueprintImporter"
APIBlueprintImporter.title = "API Blueprint Importer"

if typeof registerImporter != 'undefined'
  registerImporter APIBlueprintImporter
else if typeof module != 'undefined'
  module.exports = APIBlueprintImporter
