export class ApiData<Res> {
  constructor(
    public readonly status: string,
    public readonly message?: string,
    public readonly data?: Res
  ) {}
}
