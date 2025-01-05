import bcrypt from 'bcrypt';

// Define an asynchronous function `hashPassword` that takes a password string as input and returns a Promise that resolves to a hashed password string.
export const hashPassword = async (password: string): Promise<string> => {
  // Generate a salt with 10 rounds of processing.
  const salt = await bcrypt.genSalt(10);
  
  // Hash the password using the generated salt and return the hashed password.
  return bcrypt.hash(password, salt);
};
//
// This function can be used to securely hash passwords before storing them in a database. Hashing passwords helps protect user data in case of a database breach, as the original passwords cannot be easily retrieved from the hashed values.


// Define an asynchronous function `comparePasswords` that takes a password string and a hashed password string as input and returns a Promise that resolves to a boolean indicating whether the password matches the hashed password.
export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  // Compare the password with the hashed password and return the result.
  return bcrypt.compare(password, hashedPassword);
};