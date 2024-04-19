export class TenantQueryInput {
  tenantId: string;
  next: (...args: any[]) => Promise<void>;
}
