export class APIError extends Error {
  http_status: number;
  hint?: string;

  constructor(http_status: number, message: string, hint?: string) {
    super(message);
    this.name = this.constructor.name;
    this.http_status = http_status;
    this.hint = hint;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}


export class SomethingWentWrongError extends APIError {
  constructor() {
    super(500, "Something went wrong");
  }
}

export class NotFoundError extends APIError {
  constructor(message = "Resource not found", hint?: string) {
    super(404, message, hint);
  }
}

export class AuthenticationError extends APIError {
  constructor(message = "Authentication failed", hint?: string) {
    super(401, message, hint);
  }
}

export class ForbiddenError extends APIError {
  constructor(message = "Insufficient permissions", hint?: string) {
    super(403, message, hint);
  }
}

export class LockedAccountError extends ForbiddenError {
  reason?: string;

  constructor(
    message = "Account is locked",
    hint = "Contact support",
    reason?: string
  ) {
    super(message, hint);
    this.reason = reason;
  }
}

export class VerificationError extends APIError {
  constructor(message = "Verification error", hint?: string) {
    super(400, message, hint);
  }
}

export type FieldErrors = {
  [field: string]: string[] | FieldErrors;
};


export class ValidationError extends APIError {
  field_errors: FieldErrors;

  constructor(
    message = "Validation error", 
    hint?: string,
    field_errors: FieldErrors = {}
  ) {
    super(400, message, hint);
    this.field_errors = field_errors;
  }
}


export class RateLimitError extends APIError {
  constructor(message = "Rate limit exceeded", hint?: string) {
    super(429, message, hint);
  }
}

export type ErrorPayload = {
  message: string,
  code: string,
  http_status: number,
  hint?: string,
  reason?: string,
  field_errors?: FieldErrors
}

export function parseAPIError(data: ErrorPayload): APIError {
  const { code, http_status, message, hint, reason, field_errors } = data;

  switch (code) {
    case "LOCKED_ACCOUNT":
      return new LockedAccountError(message, hint, reason);
    case "FORBIDEEN":
      return new ForbiddenError(message, hint);
    case "AUTHENTICATION_ERROR":
      return new AuthenticationError(message, hint);
    case "NOT_FOUND":
      return new NotFoundError(message, hint);
    case "VERIFICATION_ERROR":
      return new VerificationError(message, hint);
    case "RATE_LIMIT_ERROR":
      return new RateLimitError(message, hint);
    case "SOMETHING_WENT_WRONG":
      return new SomethingWentWrongError();
    case "VALIDATION_ERROR":
      return new ValidationError(message, hint, field_errors);
    default:
      return new APIError(http_status ?? 500, message ?? "Unknown error", hint);
  }
}
