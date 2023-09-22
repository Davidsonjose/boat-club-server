import { createHash } from "crypto";
import Cryptr from "cryptr";
import systemConfig from "src/config/systemConfig";

export function sha256Encrypt(data: string) {
    return createHash('sha256').update(data, 'utf-8').digest('hex');
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