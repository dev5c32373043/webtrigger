import pick from 'lodash/pick';
import { to } from '@/utils';

import { ReceptorListQueryDTO } from '../dto';

export async function list({ query, set, logger, store: { db } }) {
  const q = pick(query, ['take', 'skip', 'orderBy']);
  const [fetchErr, receptors] = await to(db.receptor.findMany(q));
  if (fetchErr) {
    set.status = 500;
    logger.error(fetchErr);
    return { error: '🔧 The server needs a break' };
  }

  return receptors;
}

export const listSchema = {
  query: ReceptorListQueryDTO,
  transform({ query }) {
    if (query.orderBy) {
      const orderType = query.orderType ?? 'asc';
      query.orderBy = { [query.orderBy]: orderType };
    }

    const take = query.take && parseInt(query.take, 10);
    query.take = Number.isFinite(take) ? Math.min(100, take) : 100;

    const skip = query.skip && parseInt(query.skip, 10);
    if (Number.isFinite(skip)) {
      query.skip = skip;
    }
  }
};
