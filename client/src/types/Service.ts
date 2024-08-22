export interface Service {
    uuid: string;
    name: string;
    upper_service_id?: string;
    middle_service_id?: string;
    type: 'upper' | 'middle' | 'lower';
  }
  