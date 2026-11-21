/**
-- ==============================================================================
-- FRONTEND STRICT TYPES & API PAYLOAD INTERFACES
-- ==============================================================================
*/

export type UserRole = 'customer' | 'admin';

export type PipelineStatus = 
  | 'QUOTE' 
  | 'ORDER' 
  | 'ARTWORK' 
  | 'PROOF' 
  | 'PRODUCTION' 
  | 'COMPLETED';

export type ProofStatus = 
  | 'PENDING' 
  | 'CHANGES_REQUESTED' 
  | 'APPROVED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'PAID' 
  | 'FAILED' 
  | 'REFUNDED';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
  company_name?: string | null;
}

export interface ProductMaterial {
  id: string;
  name: string;
  multiplier: number;
  description?: string;
}

export interface VolumeTier {
  min_qty: number;
  max_qty: number;
  discount_pct: number;
}

export interface PrintZoneBounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PrintZone {
  id: string;
  name: string;
  bounds: PrintZoneBounds;
  max_chars?: number;
  min_font_pt?: number;
  shrink_to_fit?: boolean;
}

export interface ProductDivision {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  division_id: string;
  name: string;
  slug: string;
  base_rate: number;
  min_width_mm: number;
  max_width_mm: number;
  min_height_mm: number;
  max_height_mm: number;
  bleed_mm: number;
  dpi: number;
  materials_json: ProductMaterial[];
  volume_tiers_json: VolumeTier[];
  print_zones_json: PrintZone[];
  is_active: boolean;
}

export interface Template {
  id: string;
  product_id: string;
  name: string;
  print_zones_json: PrintZone[];
  default_elements_json: CanvasElement[];
  is_active: boolean;
}

export interface GalleryItem {
  id: string;
  division_id: string;
  title: string;
  image_url: string;
  specs_label: string;
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'rect' | 'circle' | 'vdp_field';
  x: number; // mm relative to canvas safe zone
  y: number; // mm
  width?: number; // mm
  height?: number; // mm
  text?: string;
  fontSize?: number; // pt
  fontFamily?: string;
  fill?: string;
  rotation?: number; // degrees
  vdpColumn?: string; // e.g. "Full_Name"
}

export interface DesignConfig {
  width_mm: number;
  height_mm: number;
  material_id: string;
  orientation?: 'portrait' | 'landscape';
  double_sided?: boolean;
}

export interface DesignData {
  elements: CanvasElement[];
  bleed_mm?: number;
  safety_margin_mm?: number;
  background_color?: string;
}

export interface SavedDesign {
  id: string;
  user_id: string;
  product_id: string;
  title: string;
  config_json: DesignConfig;
  design_json: DesignData;
  uploaded_file_url?: string | null;
  created_at: string;
}

export interface QuoteBreakdown {
  width_mm: number;
  height_mm: number;
  quantity: number;
  material_name: string;
  material_multiplier: number;
  area_sq_m: number;
  unit_price: number;
  subtotal: number;
  discount_pct: number;
  discount_amount: number;
  subtotal_after_discount: number;
  vat_rate: number;
  vat_amount: number;
  total_amount: number;
}

export interface Order {
  id: string;
  order_code: string;
  invoice_number?: string | null;
  is_archived?: boolean;
  user_id: string;
  product_id: string;
  saved_design_id?: string | null;
  config_json: DesignConfig;
  csv_rows_json?: Record<string, string | number>[] | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
  discount_amount: number;
  vat_amount: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_ref?: string | null;
  pipeline_status: PipelineStatus;
  approved_proof_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ProofVersion {
  id: string;
  order_id: string;
  version_number: number;
  design_snapshot_json: DesignData;
  uploaded_file_url?: string | null;
  status: ProofStatus;
  change_request_notes?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
}

export interface PrintFile {
  id: string;
  order_id: string;
  proof_version_id: string;
  file_name: string;
  file_format: string;
  storage_path: string;
  is_csv_batch: boolean;
  row_count: number;
  generated_at: string;
}

export interface PrintFileDownloadResponse {
  file_id: string;
  file_name: string;
  file_format: string;
  download_url: string;
  row_count: number;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  order_id?: string | null;
  event_type: string;
  subject: string;
  message: string;
  is_read: boolean;
  sent_at: string;
}

export interface AdminAnalytics {
  total_orders: number;
  active_production_jobs: number;
  pending_proofs: number;
  completed_jobs: number;
  total_revenue: number;
  paid_revenue: number;
  pipeline_distribution: Record<PipelineStatus, number>;
}
