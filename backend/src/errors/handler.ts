import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'yup';

interface ValidationErrors {
  [key: string]: string[];
}


const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    let errors: ValidationErrors = {};

    error.inner.forEach(element => {
      errors[element.path] = element.errors;
    });

    return res.status(400).json({ message: 'Validation failed', errors});
  }

  console.error(error);

  return res.status(500).json({ message: 'Internal server error'});
}

export default errorHandler;
