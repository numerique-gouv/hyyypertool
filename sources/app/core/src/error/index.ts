//

import ModernError from "modern-errors";

//

export class AuthError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "AuthError";
  }
}

export const BadRequestError = ModernError.subclass("BadRequestError");
export const HTTPError = ModernError.subclass("HTTPError");
export const NotFoundError = ModernError.subclass("NotFoundError");
