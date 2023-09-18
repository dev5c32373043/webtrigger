import { get } from 'lodash';

import { to } from '@/utils';

import rulesMatcher from './rules-matcher';
import forwardRequest from './forward-request';

import { Receptor, Event, EventResult } from '@/interfaces';

export function validateEvent(event: Event, receptor: Receptor): boolean {
  if (receptor.rules.length === 0) return true;

  return receptor.rules.every(rule => {
    const { propType, key, value, op } = rule;
    const eventValue = get(event, key);
    return rulesMatcher(eventValue, propType, op, value);
  });
}

export default async function processEvent(event: Event, receptors: Receptor[]): Promise<EventResult> {
  const result = { receptors: [], errors: [], reqSent: 0 };

  for (const receptor of receptors) {
    const isMatched = validateEvent(event, receptor);
    if (!isMatched) continue;

    const [err, eventResult] = await to(forwardRequest(event, receptor));
    if (err) {
      result.errors.push(err.message);
      continue;
    }

    result.receptors.push(eventResult);
    result.reqSent += 1;
  }

  return result;
}
