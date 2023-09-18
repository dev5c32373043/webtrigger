export interface Event {
  action: string;
  [key: string]: any;
}

export interface ForwardReqResult {
  receptorId: string;
  response: {
    status: number;
  };
}

export interface EventResult {
  receptors: ForwardReqResult[];
  errors: string[];
  reqSent: number;
}
