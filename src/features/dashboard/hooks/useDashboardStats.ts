import { useQuery } from "@tanstack/react-query";

import { catalogsService } from "@/services/catalogs.service";
import { parentsService } from "@/services/parents.service";
import { studentsService } from "@/services/students.service";
import { teachersService } from "@/services/teachers.service";
import { usersService } from "@/services/users.service";

export const useDashboardStats = () => {
	const users = useQuery({
		queryKey: ["dashboard", "users-total"],
		queryFn: () => usersService.list({ page: 1, limit: 1 }),
	});
	const classrooms = useQuery({
		queryKey: ["dashboard", "classrooms-total"],
		queryFn: catalogsService.classrooms,
	});
	const students = useQuery({
		queryKey: ["dashboard", "students-total"],
		queryFn: () => studentsService.list({ page: 1, limit: 1 }),
	});
	const teachers = useQuery({
		queryKey: ["dashboard", "teachers-total"],
		queryFn: () => teachersService.list({ page: 1, limit: 1 }),
	});
	const parents = useQuery({
		queryKey: ["dashboard", "parents-total"],
		queryFn: () => parentsService.list({ page: 1, limit: 1 }),
	});

	const isLoading =
		users.isLoading ||
		classrooms.isLoading ||
		students.isLoading ||
		teachers.isLoading ||
		parents.isLoading;

	return {
		usersTotal: users.data?.pagination.total ?? 0,
		classroomsTotal: classrooms.data?.length ?? 0,
		studentsTotal: students.data?.pagination.total ?? 0,
		teachersTotal: teachers.data?.pagination.total ?? 0,
		parentsTotal: parents.data?.pagination.total ?? 0,
		isLoading,
	};
};
