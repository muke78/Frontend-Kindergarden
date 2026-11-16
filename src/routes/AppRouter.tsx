import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicOnlyRoute } from "@/routes/PublicOnlyRoute";

const LoginPage = lazy(() =>
	import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const DashboardPage = lazy(() =>
	import("@/features/dashboard/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const UsersPage = lazy(() =>
	import("@/features/users/pages/UsersPage").then((m) => ({ default: m.UsersPage })),
);
const NotFoundPage = lazy(() =>
	import("@/features/dashboard/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const ClassroomsPage = lazy(() =>
	import("@/features/classrooms/pages/ClassroomsPage").then((m) => ({ default: m.ClassroomsPage })),
);
const TeachersPage = lazy(() =>
	import("@/features/teachers/pages/TeachersPage").then((m) => ({ default: m.TeachersPage })),
);
const StudentsPage = lazy(() =>
	import("@/features/students/pages/StudentsPage").then((m) => ({ default: m.StudentsPage })),
);
const ParentsPage = lazy(() =>
	import("@/features/parents/pages/ParentsPage").then((m) => ({ default: m.ParentsPage })),
);
const RolesPage = lazy(() =>
	import("@/features/roles/pages/RolesPage").then((m) => ({ default: m.RolesPage })),
);
const ProfilePage = lazy(() =>
	import("@/features/profile/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const GradeGroupsPage = lazy(() =>
	import("@/features/grade-groups/pages/GradeGroupsPage").then((m) => ({
		default: m.GradeGroupsPage,
	})),
);
const AssignmentsPage = lazy(() =>
	import("@/features/assignments/pages/AssignmentsPage").then((m) => ({
		default: m.AssignmentsPage,
	})),
);
const PdasAdminPage = lazy(() =>
	import("@/features/pdas/pages/PdasAdminPage").then((m) => ({ default: m.PdasAdminPage })),
);
const StudentPdaPage = lazy(() =>
	import("@/features/pdas/pages/StudentPdaPage").then((m) => ({ default: m.StudentPdaPage })),
);
const AssetsPage = lazy(() =>
	import("@/features/assets/pages/AssetsPage").then((m) => ({ default: m.AssetsPage })),
);
const InventoryPage = lazy(() =>
	import("@/features/inventory/pages/InventoryPage").then((m) => ({ default: m.InventoryPage })),
);
const AuditLogsPage = lazy(() =>
	import("@/features/audit-logs/pages/AuditLogsPage").then((m) => ({ default: m.AuditLogsPage })),
);

export const AppRouter = () => (
	<Suspense fallback={null}>
		<Routes>
			<Route element={<PublicOnlyRoute />}>
				<Route path="/login" element={<LoginPage />} />
			</Route>

			<Route element={<ProtectedRoute />}>
				<Route element={<AppLayout />}>
					<Route index element={<DashboardPage />} />
					<Route path="/users" element={<UsersPage />} />
					<Route path="/roles" element={<RolesPage />} />
					<Route path="/students" element={<StudentsPage />} />
					<Route path="/teachers" element={<TeachersPage />} />
					<Route path="/parents" element={<ParentsPage />} />
					<Route path="/classrooms" element={<ClassroomsPage />} />
					<Route path="/grade-groups" element={<GradeGroupsPage />} />
					<Route path="/assignments" element={<AssignmentsPage />} />
					<Route path="/pdas" element={<PdasAdminPage />} />
					<Route path="/students/:studentId/pdas" element={<StudentPdaPage />} />
					<Route path="/assets" element={<AssetsPage />} />
					<Route path="/inventory" element={<InventoryPage />} />
					<Route path="/audit-logs" element={<AuditLogsPage />} />
					<Route path="/profile" element={<ProfilePage />} />
				</Route>
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	</Suspense>
);
