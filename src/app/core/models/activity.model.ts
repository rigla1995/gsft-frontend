export interface Activity {
  id: string;
  name: string;
  tenantId: string;
  type: ActivityType;
}

export enum ActivityType {
  Franchise = 'Franchise',
  Distincte = 'Distincte',
  Labo = 'Labo',
}
