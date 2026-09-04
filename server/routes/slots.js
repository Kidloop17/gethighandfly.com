import { getSlots } from '../slots.js';

/**
 * Fastify plugin — GET /api/slots
 */
export async function slotsRoute(fastify) {
  fastify.get('/api/slots', async (_request, reply) => {
    try {
      const { slots, cached } = getSlots();
      return reply.send({ slots, cached });
    } catch (err) {
      console.error('[slots] Error fetching slots:', err);
      return reply.status(500).send({ error: 'server_error' });
    }
  });
}
