import { api, unwrap } from "@/lib/api";
import type {
	AssetCondition,
	AssetStatus,
	Classroom,
	EducationLevel,
	Gender,
	GradeGroup,
	RoomType,
	Status,
	SupplyUnit,
	WorkShift,
} from "@/types/catalog.types";

export const catalogsService = {
	statuses: () => api.get<{ data: Status[] }>("/catalogs/statuses").then(unwrap),
	genders: () => api.get<{ data: Gender[] }>("/catalogs/genders").then(unwrap),
	educationLevels: () =>
		api.get<{ data: EducationLevel[] }>("/catalogs/education-levels").then(unwrap),
	workShifts: () => api.get<{ data: WorkShift[] }>("/catalogs/work-shifts").then(unwrap),
	assetStatuses: () => api.get<{ data: AssetStatus[] }>("/catalogs/asset-statuses").then(unwrap),
	assetConditions: () =>
		api.get<{ data: AssetCondition[] }>("/catalogs/asset-conditions").then(unwrap),
	supplyUnits: () => api.get<{ data: SupplyUnit[] }>("/catalogs/supply-units").then(unwrap),
	roomTypes: () => api.get<{ data: RoomType[] }>("/catalogs/room-types").then(unwrap),
	classrooms: () => api.get<{ data: Classroom[] }>("/catalogs/classrooms").then(unwrap),
	gradeGroups: () => api.get<{ data: GradeGroup[] }>("/catalogs/grade-groups").then(unwrap),
};
