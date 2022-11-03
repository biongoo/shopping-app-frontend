class Error {
  key: string;
  inputName?: string;

  constructor(key: string, inputName?: string) {
    this.key = key;
    this.inputName = inputName;
  }
}

export class ApiError {
  mainError?: Error;

  inputErrors: Error[] = [];

  constructor(error?: string, inputErrors?: string[]) {
    if (error) {
      this.mainError = new Error(error);
    }

    if (inputErrors) {
      this.inputErrors = inputErrors.map((x) => {
        const src = x.split(':');

        return new Error(src?.[0], src?.[1]);
      });
    }
  }
}
