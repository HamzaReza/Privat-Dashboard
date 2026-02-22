export interface ServiceCategory {
  id: string;
  name_en: string;
  name_it: string;
  icon: string;
  image_uri: string;
  credits: number;
}

export type CategoryFormData = ServiceCategory;
