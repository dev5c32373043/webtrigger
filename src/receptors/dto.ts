import { t } from 'elysia';

export const ReceptorBodyCreateDTO = t.Object({
  name: t.String({}),
  description: t.Optional(t.String()),
  action: t.String({ minLength: 2 }),
  actionMethod: t.String({ pattern: '^(GET|POST|PUT|PATCH|DELETE)$', default: 'POST' }),
  actionURL: t.String(),
  rules: t.Optional(
    t.Array(
      t.Object({
        id: t.Integer(),
        propType: t.String({ pattern: '^(string|number|date|boolean)$', default: 'string' }),
        key: t.String(),
        value: t.Any(),
        op: t.String({ pattern: '^(eq|neq|gt|gte|lt|lte|co|nco|ex|nex)$', default: 'eq' })
      })
    )
  )
});

export const ReceptorUpdateParamsDTO = t.Object({ id: t.Integer() });

export const ReceptorUpdateBodyDTO = t.Partial(ReceptorBodyCreateDTO);

export const ReceptorListQueryDTO = t.Object({
  take: t.Integer(),
  skip: t.Optional(t.Integer()),
  orderBy: t.Optional(t.Object({})),
  orderType: t.Optional(t.String({ pattern: '^(asc|desc)$', default: 'asc' }))
});

export const ReceptorRemoveParamsDTO = t.Object({ id: t.Integer() });
