import { EntityManager } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { RequestContext } from 'nestjs-request-context';

export default class HttpContext {
  static get(): RequestContext<
    Request & { user?: any; em?: EntityManager },
    Response
  > {
    return RequestContext.currentContext;
  }
}
