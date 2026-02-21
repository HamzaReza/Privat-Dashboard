export interface ServiceCategory {
  id: string;
  name_en: string;
  name_it: string;
  icon: string;
  image_uri: string;
  credits: number;
  hidden?: boolean; // add `hidden boolean default false` to your table for this feature
}

export type CategoryFormData = Omit<ServiceCategory, "hidden">;
