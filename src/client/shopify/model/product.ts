export interface Product {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: Date;
  handle: string;
  updated_at: Date;
  published_at: Date | null;
  template_suffix: null | string;
  published_scope: PublishedScope;
  tags: string;
  status: Status;
  admin_graphql_api_id: string;
  variants: Variant[];
  options: Option[];
  images: Image[];
  image: Image;
}

export interface Image {
  id: number;
  alt: null;
  position: number;
  product_id: number;
  created_at: Date;
  updated_at: Date;
  admin_graphql_api_id: string;
  width: number;
  height: number;
  src: string;
  variant_ids: any[];
}

export interface Option {
  id: number;
  product_id: number;
  name: Name;
  position: number;
  values: Option1[];
}

export enum Name {
  Title = 'Title',
}

export enum Option1 {
  DefaultTitle = 'Default Title',
}

export enum PublishedScope {
  Web = 'web',
}

export enum Status {
  Active = 'active',
}

export interface Variant {
  id: number;
  product_id: number;
  title: Option1;
  price: string;
  sku: string;
  position: number;
  inventory_policy: InventoryPolicy;
  compare_at_price: null | string;
  fulfillment_service: FulfillmentService;
  inventory_management: InventoryManagement;
  option1: Option1;
  option2: null;
  option3: null;
  created_at: Date;
  updated_at: Date;
  taxable: boolean;
  barcode: string;
  grams: number;
  image_id: null;
  weight: number;
  weight_unit: WeightUnit;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
}

export enum FulfillmentService {
  Manual = 'manual',
}

export enum InventoryManagement {
  Shopify = 'shopify',
}

export enum InventoryPolicy {
  Continue = 'continue',
  Deny = 'deny',
}

export enum WeightUnit {
  Kg = 'kg',
  LB = 'lb',
}
