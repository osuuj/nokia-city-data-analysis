import { NextResponse } from 'next/server';
import type { ApiErrorResponse } from '../types';

/**
 * HTTP status codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * API error class
 */
export class ApiError extends Error {
  status: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Creates an error response
 * @param error The error to create a response for
 * @returns A NextResponse with the error details
 */
export function createErrorResponse(error: Error | ApiError): NextResponse<ApiErrorResponse> {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        status: error.status,
        details: error.details,
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: error.message || 'An unexpected error occurred',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    { status: HttpStatus.INTERNAL_SERVER_ERROR },
  );
}

/**
 * Creates a success response
 * @param data The data to return
 * @param message An optional message
 * @param status The HTTP status code
 * @returns A NextResponse with the success data
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = HttpStatus.OK,
): NextResponse<{ success: true; data: T; message?: string; status?: number }> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      status,
    },
    { status },
  );
}

/**
 * Validates that a required parameter is present
 * @param value The parameter value to validate
 * @param name The name of the parameter
 * @throws ApiError if the parameter is missing or invalid
 */
export function validateRequiredParam(value: unknown, name: string): void {
  if (value === undefined || value === null || value === '') {
    throw new ApiError(`Missing required parameter: ${name}`, HttpStatus.BAD_REQUEST);
  }
}

/**
 * Validates that a parameter is a valid number
 * @param value The parameter value to validate
 * @param name The name of the parameter
 * @param min Optional minimum value
 * @param max Optional maximum value
 * @throws ApiError if the parameter is invalid
 */
export function validateNumericParam(
  value: unknown,
  name: string,
  min?: number,
  max?: number,
): void {
  const num = Number(value);

  if (Number.isNaN(num)) {
    throw new ApiError(`Invalid numeric parameter: ${name}`, HttpStatus.BAD_REQUEST);
  }

  if (min !== undefined && num < min) {
    throw new ApiError(
      `Parameter ${name} must be greater than or equal to ${min}`,
      HttpStatus.BAD_REQUEST,
    );
  }

  if (max !== undefined && num > max) {
    throw new ApiError(
      `Parameter ${name} must be less than or equal to ${max}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
