/**
 * Response DTO
 */
export interface Response {
  status: number;
  code: number;
  msg: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: [] | null | Record<string, any>;
  error: {
    code: number;
    msg: string;
    data: null | string | string[];
  } | null;
}

/**
 * Input DTO for success
 */
export interface InputSuccess {
  code: number;
  msg: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: [] | Record<string, any>;
}

/**
 * Input DTO in case of failure
 */
export interface InputFailure {
  code: number;
  msg: string;
  data: string | string[];
}
