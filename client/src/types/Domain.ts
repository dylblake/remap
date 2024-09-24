export interface Domain {
  uuid: string;
  name: string;
  upper_domain_id?: string | null;
  middle_domain_id?: string | null;
  level?: "upper" | "middle" | "lower";
  order: number;
}
