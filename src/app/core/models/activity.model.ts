export interface Activity {
  id: string;
  name: string;
  tenantId: string;
  type: ActivityType;
}

export enum ActivityType {
  Restaurant = 'Restaurant',
  Cafe = 'Cafe',
  Labo = 'Labo',
}
