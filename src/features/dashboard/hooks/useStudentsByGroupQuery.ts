import { useQuery } from "@tanstack/react-query";

import { studentsService } from "@/services/students.service";

export const useStudentsByGroupQuery = () =>
	useQuery({
		queryKey: ["dashboard", "students", "by-group"],
		queryFn: studentsService.statsByGroup,
		staleTime: 60_000,
	});
