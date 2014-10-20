assert = require('assert')
APIBlueprintImporter = require('./APIBlueprintImporter.coffee')

# Mock PAW RequestGroup
RequestGroup = ->

  this.name = ''
  this.children = []

  @appendChild = (child) ->
    this.children.push(child)
    return

  return

# Mock PAW Request
class Request
  constructor: (@name, @method, @url) ->

# Mock PAW Context
Context = ->

  this.children = []

  @createRequestGroup = (name) ->
    group = new RequestGroup()
    group.name = name
    @children.push(group)
    return group

  @createRequest = (name, method, url) ->
    request = new Request(name, method, url)
    @children.push(request)
    return request

  return

describe 'API Blueprint Importer Paw Extension', ->

  describe 'when importing a resource group', ->
    before ->
      @context = new Context()
      resourceGroup = {
        "name": "Messages",
        "resources": [
            {
                "name": "My Messages",
                "actions": [],
            }
        ],
      }
      importer = new APIBlueprintImporter()
      @requestGroup = importer.importResourceGroup(@context, null, resourceGroup)

    it 'should return a request group with a name', ->
      assert.equal(@requestGroup.name, 'Messages')

    it 'should create child requests', ->
      assert.equal(@requestGroup.children.length, 1)

  describe 'when importing a resource', ->
    before ->
      @context = new Context()
      resource = {
        "name": "My Messages",
        "uriTemplate": "/messages",
        "parameters": [],
        "actions": [
          {
            "name": "Retrieve a Message",
            "method": "GET",
            "parameters": [],
            "examples": [],
          },
          {
            "name": "Retrieve a Message",
            "method": "GET",
            "parameters": [],
            "examples": [],
          },
        ],
      }

      importer = new APIBlueprintImporter()
      @requestGroup = importer.importResource(@context, "", resource)

    it 'should return a request group with a name', ->
      assert.equal(@requestGroup.name, 'My Messages')

    it 'should create child requests', ->
      assert.equal(@requestGroup.children.length, 2)

  describe 'when importing an action', ->
    before ->
      @context = new Context()

    describe 'with an example', ->
      before ->
        action = {
          "name": "Retrieve a Message",
          "method": "GET",
          "parameters": [],
          "examples": [
            {
              "name": "Example",
            },
            {
              "name": "Example",
            }
          ],
        }
        importer = new APIBlueprintImporter()
        @requestGroup = importer.importResourceAction(@context, "", action)

      it 'should create a request group with a name', ->
        assert.equal(@requestGroup.name, 'Retrieve a Message')

      it 'should create a request group with a child example', ->
        assert.equal(@requestGroup.children.length, 2)

    describe 'without any examples', ->
      before ->
        action = {
          "name": "Retrieve a Message",
          "method": "GET",
          "parameters": [],
          "examples": [],
        }
        importer = new APIBlueprintImporter()
        @request = importer.importResourceAction(@context, "http://api.acme.com/message", action)

      it 'should return a request with a name', ->
        assert.equal(@request.name, "Retrieve a Message")

      it 'should return a request with a method', ->
        assert.equal(@request.method, "GET")

      it 'should return a request with a URL', ->
        assert.equal(@request.url, "http://api.acme.com/message")

  describe 'when importing an example', ->
    before ->
      @context = new Context()

    describe 'with no requests', ->
      before ->
        example = {
          "name": "Awesome example",
        }
        importer = new APIBlueprintImporter()
        @request = importer.importExample(@context, "GET", "http://api.acme.com/message", example)

      it 'should create a request with a name', ->
        assert.equal(@request.name, "Awesome example")

      it 'should configure the method', ->
        assert.equal(@request.method, "GET")

      it 'should configure the URL', ->
        assert.equal(@request.url, "http://api.acme.com/message")

    describe 'with an example request', ->
      before ->
        example = {
          "name": "Awesome example",
          "requests": [
            {
              "name": "Update Plain Text Message",
              "headers": [
                {
                  "name": "Content-Type",
                  "value": "text/plain",
                },
              ],
              "body": "All your base are belong to us.",
            },
            {
              "name": "Update Plain Text Message",
              "headers": [
                {
                  "name": "Content-Type",
                  "value": "text/plain",
                },
              ],
              "body": "All your base are belong to us.",
            },
          ],
        }
        importer = new APIBlueprintImporter()
        @requestGroup = importer.importExample(@context, "GET", "http://api.acme.com/message", example)
        @request = @requestGroup.children[0]

      it 'should create a request group with a name', ->
        assert.equal(@requestGroup.name, "Awesome example")

      it 'should create a request group with the single child', ->
        assert.equal(@requestGroup.children.length, 2)

      it 'should create a request with a name', ->
        assert.equal(@request.name, "Update Plain Text Message")

    it 'should use the description as a name if the name is ommitted', ->
      example = {
        "name": "",
        "description": "Description!",
      }
      importer = new APIBlueprintImporter()
      request = importer.importExample(@context, "GET", "http://api.acme.com/message", example)
      assert.equal(request.name, "Description!")

    it 'should use the name "example" if the name and description is ommitted', ->
      example = {
        "name": "",
        "description": "",
      }
      importer = new APIBlueprintImporter()
      request = importer.importExample(@context, "GET", "http://api.acme.com/message", example)
      assert.equal(request.name, "Example")

  describe 'when importing an example request', ->
    before ->
      @context = new Context()
      exampleRequest = {
        "name": "Update Plain Text Message",
        "headers": [
          {
            "name": "Content-Type",
            "value": "text/plain",
          }
        ],
        "body": "All your base are belong to us."
      }

      importer = new APIBlueprintImporter()
      @request = importer.importExampleRequest(@context, "GET", "http://api.acme.com/message", exampleRequest)

    it 'should have a name', ->
      assert.equal(@request.name, "Update Plain Text Message")

    it 'should configure the method', ->
      assert.equal(@request.method, "GET")

    it 'should configure the URL', ->
      assert.equal(@request.url, "http://api.acme.com/message")

    it 'should configure the headers', ->
      assert.deepEqual(@request.headers, {
        "Content-Type": "text/plain",
      })

    it 'should configure the body', ->
      assert.equal(@request.body, "All your base are belong to us.")

