const uritemplate = require('uri-template');

// Takes elements as arguments and returns the value of the first
// defined element (for example, skipping undefined elements)
// Last argument is the default value when all elements are undefined
function coalesceElementValue(...elements) {
  const defaultValue = elements.pop();
  const element = elements.find(element => element && element.toValue());

  if (element) {
    return element.toValue();
  }

  return defaultValue;
}

export default class APIElementImporter {
  constructor(context, defaultHostname) {
    this.context = context;
    this.base = defaultHostname || 'https://example.com';
  }

  importAPI(api) {
    // FIXME: Minim is treating object (array of member) as array
    const meta = api.attributes.get('metadata');
    if (meta) {
      for (const member of meta) {
        if (member.key.content === 'HOST') {
          this.base = member.value.toValue();
        }
      }
    }

    for (const resourceGroup of api.resourceGroups) {
      this.importResourceGroup(resourceGroup);
    }

    for (const resource of api.resources) {
      this.importResource(resource);
    }
  }

  importResourceGroup(resourceGroup) {
    console.log('Importing Resource Group');

    if (resourceGroup.title) {
      const group = this.context.createRequestGroup(coalesceElementValue(resourceGroup.title, 'Resource Group'));

      for (const resource of resourceGroup.resources) {
        const item = this.importResource(resource);
        group.appendChild(item);
      }
    } else {
      for (const resource of resourceGroup.resources) {
        this.importResource(resource);
      }
    }
  }

  importResource(resource) {
    console.log('Importing Resource');

    const group = this.context.createRequestGroup(coalesceElementValue(resource.title, 'Resource'));

    for (const transition of resource.transitions) {
      const item = this.importTransition(resource, transition);
      group.appendChild(item);
    }

    return group;
  }

  importTransition(resource, transition) {
    console.log('Importing Transition');

    if (transition.transactions.length === 1) {
      const transaction = transition.transactions.get(0);
      return this.importTransaction(resource, transition, transaction);
    }

    const group = this.context.createRequestGroup(coalesceElementValue(transition.title, 'Transition'));

    for (const transaction of transition.transactions) {
      const item = this.importTransaction(resource, transition, transaction);
      group.appendChild(item);
    }

    return group;
  }

  importTransaction(resource, transition, transaction) {
    console.log('Importing Transaction');

    const request = transaction.request;

    const href = coalesceElementValue(request.href, transition.href, resource.href, '/unknown');
    const hrefVariables = request.attributes.get('hrefVariables') || transition.hrefVariables || resource.hrefVariables;

    let toExpand = {};
    if (hrefVariables) {
      toExpand = hrefVariables.valueOf();
    }

    const template = uritemplate.parse(href);
    const expandedPath = template.expand(toExpand);
    const url = this.createAbsoluteURL(expandedPath);

    const pawRequest = this.context.createRequest(coalesceElementValue(request.title, transition.title, 'Transaction'), request.method.toValue(), url);

    if (request.headers) {
      for (const header of request.headers) {
        pawRequest.setHeader(header.key.toValue(), header.value.toValue());
      }
    }

    if (request.messageBody) {
      pawRequest.body = request.messageBody.toValue();
    }

    return pawRequest;
  }

  createAbsoluteURL(path) {
    if (this.base.endsWith('/') && path.startsWith('/')) {
      return this.base + path.substring(1);
    } else if (!this.base.endsWith('/') && !path.startsWith('/')) {
      return this.base + '/' + path;
    }

    return this.base + path;
  }
}
