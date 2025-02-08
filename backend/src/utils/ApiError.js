//* This class is used to handle errors in the API. It extends the Error class and adds a statusCode property to it. This class is used to throw errors in the API and then catch them in the error handler middleware to send the error response to the client.
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
  }
}

export { ApiError };
