import crypto from "crypto";

const generateHash = (inputText) => {
  return crypto
    .createHmac("sha256", process.env.HASH_SECRET)
    .update(inputText)
    .digest("hex");
};

export { generateHash };
