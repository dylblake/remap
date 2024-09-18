export interface Service {
  uuid: string;
  name: string;
  upper_service_id?: string;
  middle_service_id?: string;
  level?: 'upper' | 'middle' | 'lower';
  order: number 
}