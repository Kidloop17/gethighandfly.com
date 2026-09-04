import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import { registerRoute } from './routes/register.js';
import { slotsRoute } from './routes/slots.js';

const PORT = parseInt(process.env.PORT || '3001');

const app = Fastify({
  logger: true,
  trustProxy: true,
});

await app.register(cors, {
  origin: ['https://gethighandfly.com', 'http://localhost:4321'],
});

await app.register(rateLimit, {
  max: 20,
  timeWindow: '1 minute',
});

app.register(registerRoute);
app.register(slotsRoute);

app.get('/health', async () => ({ ok: true }));

try {
  await app.listen({ port: PORT, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
