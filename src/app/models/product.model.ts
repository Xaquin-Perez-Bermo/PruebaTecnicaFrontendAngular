export interface Product {
  id: string;
  brand: string;
  model: string;
  price: string;
  imgUrl: string;
}

export interface ProductOption {
  code: number;
  name: string;
}

// Los nombres de algunos campos (dimentions, secondaryCmera) son tal cual los devuelve la API
export interface ProductDetail extends Product {
  cpu: string;
  ram: string;
  os: string;
  displayResolution: string;
  displaySize: string;
  battery: string;
  primaryCamera: string[] | string;
  secondaryCmera: string[] | string;
  dimentions: string;
  weight: string;
  options: {
    colors: ProductOption[];
    storages: ProductOption[];
  };
}

export interface CartItem {
  id: string;
  colorCode: number;
  storageCode: number;
}

export interface CartResponse {
  count: number;
}
