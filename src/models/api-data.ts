export class ApiData<Res> {
  constructor(
    public readonly status: string,
    public readonly data: Res,
    public readonly message?: string
  ) {}
}
