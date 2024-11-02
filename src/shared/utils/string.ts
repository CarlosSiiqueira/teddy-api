import { randomBytes } from "crypto";

export const generateShortCode = (length: number = 6): string => {
  return randomBytes(length)
    .toString('base64')
    .substring(0, length)
    .replace(/\+/g, 'a')
    .replace(/\//g, 'b');
}
