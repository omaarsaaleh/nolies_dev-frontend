import { createContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@/types/api/user";
import {authenticatedApi} from '@/api/base.ts';
import {AuthenticationError} from '@/api/errors';


type UserContextType = {
  user: User | null;
  refetchUser: () => void;
	isLoading: boolean;
  isError: boolean;
  error: unknown;

};

const UserContext = createContext<UserContextType | undefined>(undefined);

async function fetchUser(): Promise<User> {
  const res = await authenticatedApi.get("/me");
  return res.data;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const token = sessionStorage.getItem("access");
  
  const { data: user, isLoading, isError, error, refetch } = useQuery<User>({
    queryKey: ["me"],
    queryFn: fetchUser,
    enabled: !!token, // Only fetch if token exists
    staleTime: 1000 * 60 * 10, 
    refetchOnWindowFocus: true,
    retry: (failureCount, error: Error) => {
        // dont retry if not authenticated
        if (error instanceof AuthenticationError) return false; 
        return failureCount < 3;
    }
  });

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
