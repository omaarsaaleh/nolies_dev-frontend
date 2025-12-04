export type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export type Operator = "AND" | "OR";

export type Country = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
};

export type State = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  country: Country;
};

export type StateMinimal  = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  country: number;
};

export type City = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  state: State;
};

export type CityMinimal  = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  state: number;
};