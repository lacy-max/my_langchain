export interface Store {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  level: "旗舰店" | "精品店" | "专柜" | string;
  services: string[];
  distance: string;
  created_at: string;
  updated_at: string;
}
