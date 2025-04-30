import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const verifyPassword = async (
  password: string,
  hash: string | undefined
) => {
  if (!hash) {
    return false;
  }
  return bcrypt.compareSync(password, hash);
};
