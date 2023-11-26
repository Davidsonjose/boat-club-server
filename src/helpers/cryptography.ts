import { createHash, randomBytes, randomInt } from 'crypto';
import Cryptr from 'cryptr';
import systemConfig from 'src/config/systemConfig';

export function sha256Encrypt(data: string) {
  return createHash('sha256').update(data, 'utf-8').digest('hex');
}

export function base64Encode(data: string) {
  return Buffer.from(data, 'utf-8').toString('base64');
}
export function base64Decode(data: string) {
  return Buffer.from(data, 'base64').toString('utf-8');
}

export function twoWayencrypt(str: string) {
  return new Cryptr(systemConfig().TWO_WAY_ENCRYPT_SALT).encrypt(str);
}

export function decrypt(str: string) {
  return new Cryptr(systemConfig().TWO_WAY_ENCRYPT_SALT).decrypt(str);
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
