export type Teacher = {
	id: string;
	user_id: string | null;
	classroom_id: string | null;
	gender_id: string;
	education_level_id: string;
	grade_group_id: string | null;
	grade_group_label: string | null;
	school_year: string | null;
	work_shift_id: string;
	status_id: string;
	first_name: string;
	paternal_surname: string;
	maternal_surname: string | null;
	full_name: string;
	date_of_birth: string;
	school_name: string | null;
	students_in_charge: number;
	cct: string | null;
	school_zone: string | null;
	curp: string;
	email: string;
	phone: string;
	state: string;
	suburb: string;
	street: string;
	emergency_contact: string;
	emergency_phone: string | null;
	gender_name: string;
	education_level_name: string;
	work_shift_name: string;
	status_name: string;
	status_code: string;
	created_at: string;
	updated_at: string;
};

export type Student = {
	id: string;
	gender_id: string;
	grade_group_id: string;
	work_shift_id: string;
	status_id: string;
	first_name: string;
	paternal_surname: string;
	maternal_surname: string | null;
	full_name: string;
	date_of_birth: string;
	curp: string;
	allergies: string | null;
	medical_conditions: string | null;
	state: string;
	suburb: string;
	street: string;
	emergency_contact: string;
	emergency_phone: string | null;
	enrollment_date: string;
	gender_name: string;
	grade_group_label: string;
	work_shift_name: string;
	status_name: string;
	status_code: string;
	created_at: string;
	updated_at: string;
};

export type Parent = {
	id: string;
	user_id: string | null;
	gender_id: string;
	education_level_id: string;
	work_shift_id: string | null;
	status_id: string;
	first_name: string;
	paternal_surname: string;
	maternal_surname: string | null;
	full_name: string;
	date_of_birth: string;
	occupation: string | null;
	curp: string;
	email: string;
	phone: string;
	state: string;
	suburb: string;
	street: string;
	emergency_contact: string;
	emergency_phone: string | null;
	gender_name: string;
	education_level_name: string;
	status_name: string;
	status_code: string;
	created_at: string;
	updated_at: string;
};

export type { Classroom } from "@/types/catalog.types";

// --- Payloads ---
export type PersonBase = {
	gender_id: string;
	status_id: string;
	first_name: string;
	paternal_surname: string;
	maternal_surname?: string | null;
	date_of_birth: string;
	curp: string;
	state: string;
	suburb: string;
	street: string;
	emergency_contact: string;
	emergency_phone?: string | null;
};

export type CreateTeacherPayload = PersonBase & {
	education_level_id: string;
	work_shift_id: string;
	email: string;
	phone: string;
	user_id?: string | null;
	classroom_id?: string | null;
	grade_group_id?: string | null;
	school_year?: string | null;
	school_name?: string | null;
	cct?: string | null;
	school_zone?: string | null;
};
export type UpdateTeacherPayload = Partial<CreateTeacherPayload>;

export type CreateStudentPayload = PersonBase & {
	grade_group_id: string;
	work_shift_id: string;
	enrollment_date: string;
	allergies?: string | null;
	medical_conditions?: string | null;
};
export type UpdateStudentPayload = Partial<CreateStudentPayload>;

export type CreateParentPayload = PersonBase & {
	education_level_id: string;
	email: string;
	phone: string;
	user_id?: string | null;
	work_shift_id?: string | null;
	occupation?: string | null;
};
export type UpdateParentPayload = Partial<CreateParentPayload>;

export type CreateParentWithChildrenPayload = {
	parents: CreateParentPayload[];
	children: Array<
		| { mode: "link"; student_id: string; relationships: string[]; is_primary: boolean }
		| {
				mode: "create";
				student: CreateStudentPayload;
				relationships: string[];
				is_primary: boolean;
		  }
	>;
};

export type CreateClassroomPayload = {
	room_type_id: string;
	name: string;
	capacity?: number | null;
};
export type UpdateClassroomPayload = Partial<CreateClassroomPayload>;
