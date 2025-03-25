import { getRefreshToken, getUser } from "../lib/api";
import useSWR, { SWRConfiguration } from "swr";

export const AUTH = "auth";

const useAuth = (opts?: SWRConfiguration) => {
  const fetcher = async () => {
    try {
      return await getUser();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      if (error.message === "Not Authorized") {
        await getRefreshToken();
        return await getUser(); // Retry after refreshing the token
      }
      throw error;
    }
  };
  const {
    data: user,
    error,
    isValidating,
    mutate,
  } = useSWR([AUTH], fetcher, opts);
  return {
    user,
    isLoading: !error && !user,
    isError: !error,
    isValidating,
    mutate,
  };
};

export default useAuth;
