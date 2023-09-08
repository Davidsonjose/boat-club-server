import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://redis-18076.c78.eu-west-1-2.ec2.cloud.redislabs.com:18076`,
  password: 'I1FUSxaV05OmfEJPouyDWuFKCNyAtb9S',
});
