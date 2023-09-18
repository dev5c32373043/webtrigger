import { t } from 'elysia';
import { to } from '@/utils';

import processEvent from '../services/process-event';

export async function receiver({ body, set, logger, store: { db } }) {
  const { action } = body;

  const [fetchErr, receptors] = await to(db.receptor.findMany({ where: { action } }));
  if (fetchErr) {
    set.status = 500;
    logger.error(fetchErr);
    return { error: '🔧 The server needs a break' };
  }

  if (receptors.length === 0) {
    return { receptors: [], errors: [], reqSent: 0 };
  }

  const [err, result] = await to(processEvent(body, receptors));
  if (err) {
    set.status = 500;
    logger.error(err);
    return { error: '🔧 The server needs a break' };
  }
  return result;
}

export const receiverSchema = {
  body: t.Object({ action: t.String({ minLength: 2 }) }, { additionalProperties: true })
};
