export interface CatInfo {
  name: string;
  age: string;
  description: string;
}

export interface CatRaw {
  id: string;
  info: CatInfo;
}

export interface Cat {
  id?: string;
  name: string;
  age: string;
  description: string;
}

export interface ApiResponse<T> {
  status_code: number;
  data: T;
}

export interface CatPayload {
  name: string;
  age: string;
  description: string;
}
