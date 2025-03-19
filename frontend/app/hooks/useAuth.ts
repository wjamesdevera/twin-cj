import { getUser } from "../lib/api";
import useSWR, { SWRConfiguration } from "swr";

export const AUTH = "auth";

const useAuth = (opts?: SWRConfiguration) => {
  const {
    data: user,
    error,
    isValidating,
    mutate,
  } = useSWR([AUTH], getUser, opts);
  return {
    user,
    isLoading: !error && !user,
    isError: !error,
    isValidating,
    mutate,
  };
};

export default useAuth;
