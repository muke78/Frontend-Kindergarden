export type CatalogItem = {
	id: string;
	code: string;
	name: string;
	description?: string | null;
};

export type Gender = CatalogItem;
export type Status = CatalogItem;
export type AssetStatus = CatalogItem;
export type AssetCondition = CatalogItem;
export type RoomType = CatalogItem;

export type EducationLevel = CatalogItem & { short_name?: string | null };
export type WorkShift = CatalogItem & { starts_at?: string | null; ends_at?: string | null };
export type SupplyUnit = CatalogItem & { symbol?: string | null };

export type Classroom = {
	id: string;
	name: string;
	capacity?: number | null;
	room_type_id: string;
	room_type_code: string;
	room_type_name: string;
	created_at?: string;
	updated_at?: string;
};

export type GradeGroup = {
	id: string;
	grade_name: string;
	group_name: string;
	label: string;
};
