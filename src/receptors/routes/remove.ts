import { to } from '@/utils';

import { ReceptorRemoveParamsDTO } from '../dto';

export async function remove({ params: { id }, set, logger, store: { db } }) {
  const [fetchErr, receptor] = await to(db.receptor.findUnique({ where: { id }, select: { id: true } }));
  if (fetchErr) {
    set.status = 500;
    logger.error(fetchErr);
    return { error: '🔧 The server needs a break' };
  }

  if (!receptor) {
    set.status = 404;
    return { message: 'Record is not found' };
  }

  const [removeErr, removedReceptor] = await to(db.receptor.delete({ where: { id } }));
  if (removeErr) {
    set.status = 500;
    logger.error(removeErr);
    return { error: '🔧 The server needs a break' };
  }

  return removedReceptor;
}

export const removeSchema = {
  params: ReceptorRemoveParamsDTO,
  transform({ params }) {
    const id = parseInt(params.id, 10);
    if (Number.isFinite(id)) {
      params.id = id;
    }
  }
};
