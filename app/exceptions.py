class NotFoundError(Exception):
    pass

class ForbiddenError(Exception):
    pass

class EmailAlreadyExistsError(Exception):
    pass

class ValidationError(Exception):
    pass

class UnauthorizedError(Exception):
    pass

class AuthenticationError(Exception):
    pass

class BadRequestError(Exception):
    pass