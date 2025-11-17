import { EXCEPTION_MESSAGE } from "./exceptionMessage";

export class CustomException extends Error {
  public errorType: any;
  public systemLog: any;

  constructor(errorType = EXCEPTION_MESSAGE.PROCESSING_ERROR, systemLog?: any) {
    super(systemLog?.message || errorType.status);

    this.name = "CustomException";
    this.errorType = errorType;
    this.systemLog = systemLog;

    Object.setPrototypeOf(this, CustomException.prototype);
  }
}
