export interface Service {
  uuid: string;
  name: string;
  upper_service_id?: string | null;
  middle_service_id?: string | null;
  level?: 'upper' | 'middle' | 'lower';
  order: number 
}