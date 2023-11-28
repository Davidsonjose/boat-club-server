import {
  createHash,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomInt,
} from 'crypto';
import Cryptr from 'cryptr';
import systemConfig from 'src/config/systemConfig';

const algorithm = 'aes-256-cbc';
const salt = systemConfig().TWO_WAY_ENCRYPT_SALT;
const key = Buffer.from(salt.padEnd(32, ' '), 'utf-8').slice(0, 32);
// const key = Buffer.from(systemConfig().TWO_WAY_ENCRYPT_SALT, 'hex');
const iv = randomBytes(16);

export function sha256Encrypt(data: string) {
  return createHash('sha256').update(data, 'utf-8').digest('hex');
}

export function base64Encode(data: string) {
  return Buffer.from(data, 'utf-8').toString('base64');
}
export function base64Decode(data: string) {
  return Buffer.from(data, 'base64').toString('utf-8');
}
export function twoWayencrypt(str: string): string {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(str, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
}

export function decrypt(encryptedStr: string): string {
  const ivFromEncrypted = encryptedStr.slice(0, 32); // Assuming 32 characters for the IV
  const encryptedText = encryptedStr.slice(32);

  const decipher = createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivFromEncrypted, 'hex'),
  );
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

export function sha512Encrypt(data: string) {
  return createHash('sha512').update(data, 'utf-8').digest('hex');
}

export function generateToken(length: number) {
  const randomStrings = randomBytes(100).toString('hex');
  //we used a substring because we wanted to increase the randomness by not using the actual result
  return randomStrings.substring(3, length > 80 ? 80 : length + 3); //we add 3 because we're so sure it'll be 100 chars.
}

export function generateApiKey() {
  const randomStrings = randomBytes(80).toString('hex');
  //we used a substring because we wanted to increase the randomness by not using the actual result
  return randomStrings.substring(3, 60); //we add 3 because we're so sure it'll be 100 chars.
}

export function generateAppSysId() {
  const randomStrings = randomBytes(80).toString('hex');
  //we used a substring because we wanted to increase the randomness by not using the actual result
  return randomStrings.substring(3, 10); //we add 3 because we're so sure it'll be 100 chars.
}

export function generateNumberToken(length: number) {
  return randomInt(
    Number(Array(length).fill(1).join('')),
    Number(Array(length).fill(9).join('')),
  ).toString();
}
