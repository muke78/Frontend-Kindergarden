export type ChildEntry = {
	_key: string;
	mode: "link" | "create";
	student_id?: string;
	student_display?: string;
	student?: {
		gender_id: string;
		grade_group_id: string;
		work_shift_id: string;
		status_id: string;
		first_name: string;
		paternal_surname: string;
		maternal_surname?: string | null;
		date_of_birth: string;
		curp: string;
		enrollment_date: string;
		state: string;
		suburb: string;
		street: string;
		emergency_contact: string;
		emergency_phone?: string | null;
	};
	relationships: string[];
	is_primary: boolean;
};

export type ParentAddress = {
	state: string;
	suburb: string;
	street: string;
	emergency_contact: string;
};
