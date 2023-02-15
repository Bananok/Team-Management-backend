export interface RedisHandler<T> {
  action: string;
  data: T;
}
