import dayjs from 'dayjs';
import { get, toString, pick } from 'lodash';

const typeMap = {
  string: v => (typeof v === 'string' ? v : toString(v)),
  number: v => (typeof v === 'number' ? v : parseFloat(v)),
  boolean: v => (typeof v === 'boolean' ? v : v === 'true'),
  date: v => new Date(v)
};

const opMap = {
  eq: (a, b) => a === b,
  neq: (a, b) => a !== b,
  gt: (a, b) => a > b,
  gte: (a, b) => a >= b,
  lt: (a, b) => a < b,
  lte: (a, b) => a <= b,
  co: (a, b) => a.includes(b),
  nco: (a, b) => !a.includes(b),
  ex: (a, b) => a !== undefined,
  nex: (a, b) => a === undefined
};

const dateOpMap = {
  eq: (a, b) => dayjs(a).isSame(b, 'day'),
  neq: (a, b) => !dayjs(a).isSame(b, 'day'),
  gt: (a, b) => dayjs(a).isAfter(b, 'day'),
  gte: (a, b) => dayjs(a).isSameOrAfter(b, 'day'),
  lt: (a, b) => dayjs(a).isBefore(b, 'day'),
  lte: (a, b) => dayjs(a).isSameOrBefore(b, 'day')
};

const opByType = {
  string: pick(opMap, ['eq', 'neq', 'co', 'nco', 'ex', 'nex']),
  number: pick(opMap, ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'ex', 'nex']),
  boolean: pick(opMap, ['eq', 'ex', 'nex']),
  date: { ...dateOpMap, ...pick(opMap, ['ex', 'nex']) }
};

export default function rulesMatcher(eventValue, propType, op, propValue) {
  const executor = get(opByType, `${propType}.${op}`);
  if (typeof executor !== 'function') {
    throw new Error(`Operator ${op} is not supported`);
  }

  const typeCoercion = typeMap[propType];
  if (!typeCoercion) {
    throw new Error(`Type ${propType} is not supported`);
  }

  return executor(typeCoercion(eventValue), typeCoercion(propValue));
}
