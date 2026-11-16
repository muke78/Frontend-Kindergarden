export type Asset = {
	id: string;
	condition_id: string;
	status_id: string;
	classroom_id: string | null;
	name: string;
	description: string | null;
	serial_number: string | null;
	purchase_date: string | null;
	cost: string | number;
	currency: string;
	last_maintenance_at: string | null;
	warranty_ends_at: string | null;
	condition_name: string;
	condition_code: string;
	status_name: string;
	status_code: string;
	classroom_name: string | null;
	created_at: string;
	updated_at: string;
};

export type CreateAssetPayload = {
	condition_id: string;
	status_id: string;
	name: string;
	classroom_id?: string | null;
	description?: string | null;
	serial_number?: string | null;
	purchase_date?: string | null;
	cost?: number;
	currency?: string;
	last_maintenance_at?: string | null;
	warranty_ends_at?: string | null;
};
export type UpdateAssetPayload = Partial<CreateAssetPayload>;

export type InventoryItem = {
	id: string;
	condition_id: string;
	status_id: string;
	classroom_id: string | null;
	item_code: string;
	serial_number: string | null;
	name: string;
	description: string | null;
	quantity: number;
	weight_kg: string | number | null;
	width_cm: string | number | null;
	height_cm: string | number | null;
	purchase_date: string | null;
	condition_name: string;
	condition_code: string;
	status_name: string;
	status_code: string;
	classroom_name: string | null;
	created_at: string;
	updated_at: string;
};

export type CreateInventoryItemPayload = {
	condition_id: string;
	status_id: string;
	item_code: string;
	name: string;
	quantity: number;
	classroom_id?: string | null;
	serial_number?: string | null;
	description?: string | null;
	weight_kg?: number | null;
	width_cm?: number | null;
	height_cm?: number | null;
	purchase_date?: string | null;
};
export type UpdateInventoryItemPayload = Partial<CreateInventoryItemPayload>;
