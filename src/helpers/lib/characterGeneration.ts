import {
  generateNumberToken,
  generateToken,
  sha256Encrypt,
} from '../cryptography';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import systemConfig from 'src/config/systemConfig';

export function generateReferralCode(firstname: string) {
  const firstName = firstname.trim().replace(' ', '');
  return (
    firstName.substring(0, Math.ceil(firstName.length / 2)) + generateToken(4)
  ).toUpperCase();
}

export function generateUserUID() {
  return generateNumberToken(7);
}

export function generateUserPasswordhash(data: { pwd: string; uid: string }) {
  return sha256Encrypt(
    `${data.pwd}${systemConfig().HASH_SALT}${Math.sin(data.pwd.length)}${
      data.uid
    }`,
  );
}

export function generateRefId(seedStr: string) {
  return sha256Encrypt(seedStr).substring(3, 13).toUpperCase();
}

const hashingConfig = {
  //recommendations (as of March, 2022)
  parallelism: 1,
  memoryCost: 64000, // 64 mb
  timeCost: 3, // number of itetations
};

export async function generatePasswordHash(password: string) {
  let salt = randomBytes(16);
  return await argon2.hash(password, {
    ...hashingConfig,
    salt,
  });
}

export async function verifyPasswordWithHash(password: string, hash: string) {
  return await argon2.verify(hash, password, hashingConfig);
}
