// Mock Paw RequestGroup
class RequestGroup {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  appendChild(child) {
    this.children.push(child);
  }
}


// Mock PAW Request
class Request {
  constructor(name, method, url) {
    this.name = name;
    this.method = method;
    this.url = url;
    this.headers = {};
  }

  setHeader(name, value) {
    this.headers[name] = value;
  }
}


// Mock Paw Context
class Context {
  constructor() {
    this.children = [];
  }

  createRequestGroup(name) {
    const group = new RequestGroup(name);
    this.children.push(group);
    return group;
  }

  createRequest(name, method, url) {
    const request = new Request(name, method, url);
    this.children.push(request);
    return request;
  }
}

module.exports = Context;
