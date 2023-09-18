import { to } from '@/utils';

import { ReceptorUpdateParamsDTO, ReceptorUpdateBodyDTO } from '../dto';

export async function update({ params: { id }, body, set, logger, store: { db } }) {
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

  const [updateErr, updatedReceptor] = await to(db.receptor.update({ where: { id }, data: body }));
  if (updateErr) {
    set.status = 500;
    logger.error(updateErr);
    return { error: '🔧 The server needs a break' };
  }

  return updatedReceptor;
}

export const updateSchema = {
  params: ReceptorUpdateParamsDTO,
  body: ReceptorUpdateBodyDTO,
  transform({ params }) {
    const id = parseInt(params.id, 10);
    if (Number.isFinite(id)) {
      params.id = id;
    }
  }
};
