export interface Service {
    uuid: string;
    name: string;
    upper_service_id?: string;
    middle_service_id?: string;
    type?: 'upper' | 'middle' | 'lower';
  }
  

export interface ServiceWithIndentation {
  uuid: string;
  name: string;
  indentLevel: number;
  type?: 'upper' | 'middle' | 'lower';
}


  