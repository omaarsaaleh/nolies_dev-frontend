import { useState, useEffect } from "react";

export const commonQueryOptions = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  cacheTime: 1000 * 60 * 30, // 30 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  // @ts-expect-error type does not matter
  placeholderData: (prev) => prev,
};


export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export function normalize<T extends JsonValue>(value: T): JsonValue {
    if (value === null || typeof value !== "object") {
    return value as JsonValue;
  }

  if (Array.isArray(value)) {
    const normalizedArray = value.map(normalize);
    const allPrimitive = value.every(
      (v) => v === null || typeof v !== "object"
    );
    if (allPrimitive) normalizedArray.sort();
    return normalizedArray;
  }

  const obj = value as Record<string, unknown>;
  const sortedKeys = Object.keys(obj).sort();
  const normalizedObj: Record<string, JsonValue> = {};

  for (const key of sortedKeys) {
    normalizedObj[key] = normalize(obj[key] as JsonValue);
  }

  return normalizedObj;
}
