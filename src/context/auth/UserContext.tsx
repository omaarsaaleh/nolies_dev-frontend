import { createContext, type ReactNode, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@/types/api/user";
import {authenticatedApi} from '@/api/base.ts';
import {AuthenticationError} from '@/api/errors';
import {type QueryObserverResult} from '@tanstack/react-query'

type UserContextType = {
  user: User | null;
  refetchUser: () => Promise<QueryObserverResult<User, Error>>;
	isLoading: boolean;
  isError: boolean;
  error: unknown;

};

const UserContext = createContext<UserContextType | undefined>(undefined);

async function fetchUser(): Promise<User> {
  const res = await authenticatedApi.get("/me/");
  return res.data;
}

export function UserProvider({ children }: { children: ReactNode }) {  
  const [, forceUpdate] = useState({});
  
  const { data: user, isLoading, isError, error, refetch } = useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: fetchUser,
    enabled: document.cookie.includes('logged='),
    staleTime: 1000 * 60 * 10, 
    refetchOnWindowFocus: false,
    retry: (failureCount, error: Error) => {
        if (error instanceof AuthenticationError) return false; 
        return failureCount < 3;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access' && !e.newValue) {
        forceUpdate({});
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const originalRemoveItem = sessionStorage.removeItem;
    
    sessionStorage.removeItem = function(key: string) {
      originalRemoveItem.apply(this, [key]);
      if (key === 'access') {
        forceUpdate({});
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      sessionStorage.removeItem = originalRemoveItem;
    };
  }, []);

  

  return (
    <UserContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isError,
        error,
        refetchUser: refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export  {
  UserContext
}
