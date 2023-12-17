export default function () {
  return {
    DEFAULT_CURRENCY_SYMBOL: 'USD',
    DEFAULT_MQ_URL: 'amqp://localhost:5672',
    JWT_SALT: '2MzUyUGSZui4D9e%^f!&vGD8IM0Is0STYNVDeDSfpN5h0okIZX',
    HASH_SALT: '1it#g%VVT3277G%xdV3VKhy5whWoAP^h9rqdH!3R$t#&Nmj7E8',
    JWT_REFRESH_SALT: '95IpEm0@MqrDBsxpIyJW1M%uj8w9@9QGr&DGrtFI1&o12QfFB*',
    JWT_AUTH_EXPIRE: '300s',
    JWT_REFRESH_EXPIRE: '86400s',
    TWO_WAY_ENCRYPT_SALT:
      '4&%-@(#&!*#(@031604b2c5ef61785yoratrc#*!)$#76eb6c06c1c30b756763f+_@#-#$79=',
    requestChannelId: 'BANICOOP',
    requestChannel: 'Api',
    requestChannelType: 'Integerator',
    requestApplicationCode: 'POUCHII',
    requestPartnerCode: 'BACNIOOP',
    walletId: 50,
  };
}

export class SystemConfigDto {
  static DATABASE_URL = 'DATABASE_URL';
  static DB_DATABASE = 'DB_DATABASE';
  static DB_HOST = 'DB_HOST';
  static DB_PASSWORD = 'DB_PASSWORD';
  static DB_PORT = 'DB_PORT';
  static DB_USERNAME = 'DB_USERNAME';
  static JWT_SECRET = 'JWT_SECRET';
  static QUEUE = 'QUEUE';
  static RABBITMQ_URL = 'CLOUDAMQP_URL';
  static STAGE = 'STAGE';
  static TWILIO_SID = 'TWILIO_SID';
  static TWILIO_ACCT_TOKEN = 'TWILIO_ACCT_TOKEN';
  static RABBITMQ_SERVICE = 'RABBITMQ_SERVICE';
  static SYSTEM_SPEC_PIN = 'SYSTEM_SPEC_PIN';
  static SYSTEM_SPEC_USER = 'SYSTEM_SPEC_USER';
  static SYSTEM_SPEC_PASS = 'SYSTEM_SPEC_PASS';
}
