// import { IoAdapter } from '@nestjs/platform-socket.io';
// import * as redisIoAdapter from 'socket.io-redis';
// import * as Redis from 'ioredis'; // Import the ioredis library
// export class RedisIoAdapter extends IoAdapter {
//   socket = {
//     host: '',
//     password: 'I1FUSxaV05OmfEJPouyDWuFKCNyAtb9S',
//     port: 5000,
//   };
//   createIOServer(port: number): any {
//     const pubClient = new Redis({
//       host: this.socket.host,
//       port: this.socket.port,
//       password: this.socket.password,
//     });

//     const subClient = new Redis({
//       host: this.socket.host,
//       port: this.socket.port,
//       password: this.socket.password,
//     });

//     const adapter = new RedisIoAdapter(pubClient, subClient); // Use the correct class

//     return super.createIOServer(port, { adapter });

// }
