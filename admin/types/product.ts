export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductFormValues {
  name: string;
  price: number;
  image?: string;
  category: string;
  description?: string;
}

export const PRODUCT_CATEGORIES = ["黄金系列", "钻石系列", "翡翠系列", "婚嫁系列"];
