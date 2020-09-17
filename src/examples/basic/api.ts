
import { data } from './stub';

export const get = <T>(path: string): Promise<T> => new Promise((resolve) => resolve((data as any)[path] as any));
