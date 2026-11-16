import { useQuery } from "@tanstack/react-query";

import { studentsService } from "@/services/students.service";

export const useStudentsByGenderQuery = () =>
	useQuery({
		queryKey: ["dashboard", "students", "by-gender"],
		queryFn: studentsService.statsByGender,
		staleTime: 60_000,
	});
