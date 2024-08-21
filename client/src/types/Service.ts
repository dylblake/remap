export interface Service {
    uuid: string;
    name: string;
    indentLevel: number;
    upper_service_id?: string;
    middle_service_id?: string;
    type: 'upper' | 'middle' | 'lower';
  }
  