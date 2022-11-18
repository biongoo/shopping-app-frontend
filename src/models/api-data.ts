export class ApiData<Res = unknown> {
  constructor(
    public readonly status: string,
    public readonly data: Res,
    public readonly message?: string
  ) {}
}
