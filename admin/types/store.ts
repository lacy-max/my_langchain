export interface Store {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  level: StoreLevel;
  services: string[];
  distance: string;
  created_at: string;
  updated_at: string;
}

export interface StoreFormValues {
  city: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  level: StoreLevel;
  services?: string[];
  distance?: string;
}

export const STORE_LEVELS = ["旗舰店", "精品店", "专柜"] as const;

export type StoreLevel = (typeof STORE_LEVELS)[number];
