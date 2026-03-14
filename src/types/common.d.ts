/**
 * Common type definitions used across the project
 */

/** Generic form values type */
export type FormValues = Record<string, unknown>;

/** API error response structure */
export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
  request?: unknown;
  config?: {
    method?: string;
  };
}

/** Generic API response */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/** File upload type */
export type FileOrFiles = File | File[] | null;

/** Formik error type */
export type FormikError = Record<string, string | Record<string, string>>;

/** Generic callback function */
export type Callback<T = void> = (value?: T) => void;

/** Generic async function */
export type AsyncFunction<T = unknown> = () => Promise<T>;

/** Redux payload action type */
export type PayloadType<T> = {
  payload: T;
};

/** Map type for key-value pairs */
export type MapType<T = unknown> = Record<string, T>;

/** Pagination metadata */
export interface PaginationMeta {
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
}

/** Standard list response */
export interface ListResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}
