import { CustomError } from './CustomError';

export class FileSizeExceed extends CustomError {
  statusCode = 415;

  constructor(public message:string) {
    super(message);
    Object.setPrototypeOf(this, FileSizeExceed.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
