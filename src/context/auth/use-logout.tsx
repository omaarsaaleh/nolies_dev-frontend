import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
import { logout } from "@/api/auth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => logout(),
    onSuccess: () => {
      // remove any query starts with user
      queryClient.removeQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === 'user',
      });

      queryClient.setQueryData(['user', 'me'], null);
            
      toast.success("Logged out successfully");
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });
}
