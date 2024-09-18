import { CustomError } from './CustomError';

export class UnSupportedFileFormat extends CustomError {
  statusCode = 415;

  constructor() {
    super('Unsupported file format');
    Object.setPrototypeOf(this, UnSupportedFileFormat.prototype);
  }

  serializeErrors() {
    return [
      {
        message: 'Unsupported file format',
      },
    ];
  }
}
