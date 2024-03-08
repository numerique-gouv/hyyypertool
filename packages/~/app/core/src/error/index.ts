//

import ModernError from "modern-errors";

//

export const AuthError = ModernError.subclass("AuthError");
export const HTTPError = ModernError.subclass("HTTPError");
export const NotFoundError = ModernError.subclass("NotFoundError");
