export interface ListResult<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}
