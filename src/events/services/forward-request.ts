import { pick, omit, isPlainObject } from 'lodash';
import { Event, Receptor, ForwardReqResult } from '@/interfaces';

export default async function forwardRequest(event: Event, receptor: Receptor): Promise<ForwardReqResult> {
  let { actionMethod, actionURL } = receptor;
  const { action, metadata } = event;

  if (isPlainObject(metadata)) {
    if (/^(GET|POST|PUT|PATCH|DELETE)$/.test(metadata.actionMethod)) {
      actionMethod = metadata.actionMethod;
    }

    if (metadata.actionURL) {
      actionURL = metadata.actionURL;
    }
  }

  const payload = {
    action,
    metadata: {
      receptor: {
        id: receptor.id,
        action: receptor.action,
        actionMethod: receptor.actionMethod,
        actionURL: receptor.actionURL,
        receivedAt: new Date().toISOString()
      }
    },
    data: omit(event, ['action', 'metadata'])
  };

  if (metadata.actionMethod || metadata.actionURL) {
    payload.metadata.overrides = pick(metadata, ['actionMethod', 'actionURL']);
  }

  const options = {
    method: actionMethod,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  const resp = await fetch(actionURL, options);
  if (!resp.ok) {
    throw new Error(`Response status is ${resp.status}`);
  }

  return {
    receptorId: receptor.id,
    response: { status: resp.status }
  };
}
