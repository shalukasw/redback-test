export interface IAppError {
  code: string;
  message: string;
}

export function IsAppError(error: unknown): error is IAppError {
  return (
    typeof (<IAppError>error).code != 'undefined' &&
    typeof (<IAppError>error).message != 'undefined'
  );
}
