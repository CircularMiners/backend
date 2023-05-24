import bcrypt from "bcrypt";

const saltRounds = 10;

// Function to encrypt a password
const encryptPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error("Password encryption failed");
  }
};

// Function to compare a password with its encrypted version
const comparePasswords = async (
  password: string,
  encryptedPassword: string
): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(password, encryptedPassword);
    return match;
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

export { encryptPassword, comparePasswords };
