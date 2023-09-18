export interface Rule {
  propType: string;
  key: string;
  value: string;
  op: string;
}

export interface Receptor {
  id: string;
  name: string;
  description?: string;
  action: string;
  actionMethod: string;
  actionURL: string;
  rules?: Rule[];
}
