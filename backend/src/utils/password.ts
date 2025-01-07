import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};
