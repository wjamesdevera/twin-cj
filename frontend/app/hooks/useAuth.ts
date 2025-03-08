import { getUser } from "../lib/api";
import useSWR from "swr";

export const AUTH = "auth";

const useAuth = (opts = {}) => {
  const { data: user, ...rest } = useSWR([AUTH], getUser, opts);
  return {
    user,
    ...rest,
  };
};

export default useAuth;
