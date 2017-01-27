export default class APIElementImporter {
  constructor(context, defaultHostname) {
    this.context = context;
    this.base = defaultHostname || 'https://example.com';
  }

  importAPI(api) {
    // FIXME: Minim is treating object (array of member) as array
    const meta = api.attributes.get('meta');
    if (meta) {
      for (const member of meta) {
        if (member.key.content === 'HOST') {
          const host = member.value.content;
          this.base = host;
        }
      }
    }

    for (const resourceGroup of api.resourceGroups) {
      this.importResourceGroup(resourceGroup);
    }
  }

  importResourceGroup(resourceGroup) {
    console.log('Importing Resource Group');

    if (resourceGroup.title) {
      const group = this.context.createRequestGroup(resourceGroup.title);

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

    const group = this.context.createRequestGroup(resource.title || 'Resource');

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

    const group = this.context.createRequestGroup(transition.title || 'Transition');

    for (const transaction of transition.transactions) {
      const item = this.importTransaction(resource, transition, transaction);
      group.appendChild(item);
    }

    return group;
  }

  importTransaction(resource, transition, transaction) {
    console.log('Importing Transaction');

    const request = transaction.request;
    const url = this.createAbsoluteURL(request.href || transition.href || resource.href);
    const pawRequest = this.context.createRequest(request.title || transition.title || 'Transaction', request.method, url);

    if (request.headers) {
      for (const header of request.headers) {
        pawRequest.setHeader(header.key.content, header.value.content);
      }
    }

    if (request.messageBody) {
      pawRequest.body = request.messageBody.content;
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
