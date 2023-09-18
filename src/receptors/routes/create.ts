import { t } from 'elysia';
import { to } from '@/utils';

import { ReceptorBodyCreateDTO } from '../dto';

export async function create({ body, set, logger, store: { db } }) {
  const [createErr, receptor] = await to(db.receptor.create({ data: body }));
  if (createErr) {
    set.status = 500;
    logger.error(createErr);
    return { error: '🔧 The server needs a break' };
  }

  set.status = 201;

  return receptor;
}

export const createSchema = {
  body: ReceptorBodyCreateDTO
};
