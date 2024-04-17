import { Request, Response } from 'express';
import { RequestContext } from 'nestjs-request-context';
import { User } from 'src/db/entities/user.entity';

export default class HttpContext {
  static get(): RequestContext<Request & { user?: User }, Response> {
    return RequestContext.currentContext;
  }
}
