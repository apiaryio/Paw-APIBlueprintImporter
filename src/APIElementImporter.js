const uritemplate = require('uri-template');

// Takes elements as arguments and returns the value of the first
// defined element (for example, skipping undefined elements)
// Last argument is the default value when all elements are undefined
function coalesceElementValue(...elements) {
  const defaultValue = elements.pop();
  const element = elements.find(e => e && e.toValue());

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
      meta.forEach((member) => {
        if (member.key.content === 'HOST') {
          this.base = member.value.toValue();
        }
      });
    }

    api.resourceGroups.forEach((resourceGroup) => {
      this.importResourceGroup(resourceGroup);
    });

    api.resources.forEach((resource) => {
      this.importResource(resource);
    });
  }

  importResourceGroup(resourceGroup) {
    console.log('Importing Resource Group');

    if (resourceGroup.title) {
      const group = this.context.createRequestGroup(coalesceElementValue(resourceGroup.title, 'Resource Group'));

      resourceGroup.resources.forEach((resource) => {
        const item = this.importResource(resource);
        group.appendChild(item);
      });
    } else {
      resourceGroup.resources.forEach((resource) => {
        this.importResource(resource);
      });
    }
  }

  importResource(resource) {
    console.log('Importing Resource');

    const group = this.context.createRequestGroup(coalesceElementValue(resource.title, 'Resource'));

    resource.transitions.forEach((transition) => {
      const item = this.importTransition(resource, transition);
      group.appendChild(item);
    });

    return group;
  }

  importTransition(resource, transition) {
    console.log('Importing Transition');

    if (transition.transactions.length === 1) {
      const transaction = transition.transactions.get(0);
      return this.importTransaction(resource, transition, transaction);
    }

    const group = this.context.createRequestGroup(coalesceElementValue(transition.title, 'Transition'));

    transition.transactions.forEach((transaction) => {
      const item = this.importTransaction(resource, transition, transaction);
      group.appendChild(item);
    });

    return group;
  }

  importTransaction(resource, transition, transaction) {
    console.log('Importing Transaction');

    const { request } = transaction;

    const href = coalesceElementValue(request.href, transition.href, resource.href, '/unknown');
    const hrefVariables = (
      request.hrefVariables || transition.hrefVariables || resource.hrefVariables
    );

    let toExpand = {};
    if (hrefVariables) {
      toExpand = hrefVariables.valueOf();
    }

    const template = uritemplate.parse(href);
    const expandedPath = template.expand(toExpand);
    const url = this.createAbsoluteURL(expandedPath);

    const pawRequest = this.context.createRequest(coalesceElementValue(request.title, transition.title, 'Transaction'), request.method.toValue(), url);

    if (request.headers) {
      request.headers.forEach((header) => {
        pawRequest.setHeader(header.key.toValue(), header.value.toValue());
      });
    }

    if (request.messageBody) {
      pawRequest.body = request.messageBody.toValue();
    }

    return pawRequest;
  }

  createAbsoluteURL(path) {
    if (this.base.endsWith('/') && path.startsWith('/')) {
      return this.base + path.substring(1);
    }

    if (!this.base.endsWith('/') && !path.startsWith('/')) {
      return `${this.base}/${path}`;
    }

    return this.base + path;
  }
}
