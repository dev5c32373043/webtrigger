import { Elysia } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { logger } from '@bogeychan/elysia-logger';
import { swagger } from '@elysiajs/swagger';

import * as receptorRoutes from './receptors/routes';
import * as eventsRoutes from './events/routes';

process.env.TZ = 'UTC';

const db = new PrismaClient();
const app = new Elysia();

app.state('db', db);
app.use(logger({ level: Bun.env.LOGGER_LEVEL, contextKeyName: 'logger' }));
app.use(swagger());

app.onBeforeHandle(async ({ set, request, request: { headers } }) => {
  const reqToken = headers.get('access-token');

  if (reqToken !== Bun.env.AUTH_TOKEN) {
    set.status = 401;
    return { message: '🧙‍♂️ You shall not pass!' };
  }
});

app.onError(({ code, error, logger }) => {
  if (code === 'VALIDATION') {
    const errors = error.all.reduce((acc, err) => {
      const field = err.path.replace('/', '');
      acc[field] ||= [];
      acc[field].push(err.message);
      return acc;
    }, {});

    return { errors };
  }

  logger.error(error);
  return { message: error.message };
});

app.group('/receptors', router =>
  router
    .get('/', receptorRoutes.list, receptorRoutes.listSchema)
    .post('/', receptorRoutes.create, receptorRoutes.createSchema)
    .patch('/:id', receptorRoutes.update, receptorRoutes.updateSchema)
    .delete('/:id', receptorRoutes.remove, receptorRoutes.removeSchema)
);

app.post('/events', eventsRoutes.receiver, eventsRoutes.receiverSchema);

const port = Bun.env.PORT ?? 3000;
app.listen(port);

console.log(`🦊 Server is running at ${app.server?.hostname}:${port}`);
