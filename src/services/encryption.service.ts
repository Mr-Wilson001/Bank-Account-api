import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY as string, "hex"); // 32 bytes
const iv = Buffer.from(process.env.ENCRYPTION_IV as string, "hex");   // 16 bytes

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}