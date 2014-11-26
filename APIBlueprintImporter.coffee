# PAW APIBlueprint extension
APIBlueprintImporter = ->

  # Imports a blueprint.
  #
  # @param [Context] context Paw context
  # @param [Object] blueprint application/vnd.apiblueprint.parseresult.raw+json
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
  # @returns [RequestGroup] A PAW Request group
  #
  @importResourceGroup = (context, baseHost, resourceGroup) ->
    name = resourceGroup["name"] || "Unnamed"
    resources = resourceGroup["resources"]

    console.log("Importing resource group " + name)

    requestGroup = context.createRequestGroup(name)
    for resource in resources
      request = @importResource(context, baseHost, resource)
      requestGroup.appendChild(request)

    return requestGroup

  # Imports a resource from a blueprint.
  #
  # @param [Context] context Paw context
  # @param [String] baseHost The blueprint's base host
  # @param [Object] resource the blueprint resource
  #
  # @return [Request,RequestGroup] Returns the imported request group
  #
  @importResource = (context, baseHost, resource) ->
    name = resource["name"] || "Unnamed"
    actions = resource["actions"]

    console.log("Importing resource " + name)

    url = baseHost + resource["uriTemplate"]
    # TODO: uriTemplate and parameters

    requestGroup = context.createRequestGroup(name)
    for action in actions
      request = @importResourceAction(context, url, action)
      requestGroup.appendChild(request)

    return requestGroup

  # Imports an action from a blueprint.
  #
  # @param [Context] context Paw context
  # @param [String] url Actions URL
  # @param [Object] action the blueprint action
  #
  # @return [Request,RequestGroup] Returns either a request or request group
  #
  @importResourceAction = (context, url, action) ->
    name = action["name"]
    if name.length == 0
      name = action["description"]

      if name.length == 0
        name = "Example"

    examples = action["examples"]
    method = action["method"]
    # TODO uri templates

    console.log("Importing resource action '" + name + "' " + examples.length + " examples")

    if examples.length > 0
        requestGroup = context.createRequestGroup(name)
        for example in examples
          request = @importExample(context, method, url, example)
          requestGroup.appendChild(request)

        return requestGroup
    else
      request = context.createRequest(name, method, url)

    return request

  # Imports an example from a blueprint.
  #
  # @param [Context] context Paw context
  # @param [String] method The method of the example request
  # @param [String] url The URL of the example request
  # @param [Object] example the blueprint example
  #
  # @return [Request,RequestGroup] Returns either a request or request group
  #
  @importExample = (context, method, url, example) ->
    name = example["name"]
    requests = example["requests"]

    if name.length == 0
      name = example["description"]

      if name.length == 0
        name = "Example"

    console.log("Importing example " + name)

    if requests != undefined && requests.length > 0
      requestGroup = context.createRequestGroup(name)

      for requestExample in requests
        request = @importExampleRequest(context, method, url, requestExample)
        requestGroup.appendChild(request)

      return requestGroup
    else
      request = context.createRequest(name, method, url)

    return request

  # Imports an example request from a blueprint.
  #
  # @param [Context] context Paw context
  # @param [String] method The method of the example request
  # @param [String] url The URL of the example request
  # @param [Object] exampleRequest the blueprint example request
  #
  # @returns [Request] A Paw Request, created from the example request
  #
  @importExampleRequest = (context, method, url, exampleRequest) ->
    name = exampleRequest["name"] || "Unnamed"
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
    http_request = new NetworkHTTPRequest()
    http_request.requestUrl = "https://api.apiblueprint.org/parser"
    http_request.requestMethod = "POST"
    http_request.requestTimeout = 3600000
    http_request.requestBody = string
    http_request.setRequestHeader "Content-Type", "text/vnd.apiblueprint+markdown; version=1A; charset=utf-8"
    http_request.setRequestHeader "Accept", "application/vnd.apiblueprint.parseresult.raw+json"
    if http_request.send() and (http_request.responseStatusCode is 200)
      blueprint = JSON.parse(http_request.responseBody)
      @importBlueprint context, blueprint
      return true

    throw new Error "HTTP Request failed: " + http_request.responseStatusCode

  return

APIBlueprintImporter.identifier = "io.apiary.PawExtensions.APIBlueprintImporter"
APIBlueprintImporter.title = "API Blueprint Importer"

if typeof registerImporter != 'undefined'
  registerImporter APIBlueprintImporter
else if typeof module != 'undefined'
  module.exports = APIBlueprintImporter
