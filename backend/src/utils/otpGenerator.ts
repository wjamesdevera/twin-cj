const otpStore: { [email: string]: { otp: string; expiresAt: number } } = {};

export const generateOTP = (expiryInMinutes: number = 5) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + expiryInMinutes * 60 * 1000;
  return { otp, expiresAt };
};

export const storeOTP = (email: string, otp: string, expiresAt: number) => {
  otpStore[email] = { otp, expiresAt };
};

export const validateOTP = (email: string, otp: string): boolean => {
  const storedOTP = otpStore[email];

  if (!storedOTP) {
    return false;
  }

  if (storedOTP.otp !== otp) {
    return false;
  }

  if (Date.now() > storedOTP.expiresAt) {
    delete otpStore[email];
    return false;
  }

  delete otpStore[email];
  return true;
};

export const clearExpiredOTPs = () => {
  const now = Date.now();
  for (const email in otpStore) {
    if (otpStore[email].expiresAt < now) {
      delete otpStore[email];
    }
  }
};
