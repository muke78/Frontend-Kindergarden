import {
	BookOpen,
	Building2,
	FileText,
	GraduationCap,
	Users2,
	Users as UsersIcon,
} from "lucide-react";
import { memo } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { StudentsByGenderChart } from "@/features/dashboard/components/StudentsByGenderChart";
import { StudentsByGroupChart } from "@/features/dashboard/components/StudentsByGroupChart";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { useAuth } from "@/hooks/useAuth";

export const DashboardPage = () => {
	const { user } = useAuth();
	const stats = useDashboardStats();

	return (
		<div className="space-y-8">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<PageHeader title={`Hola, ${user?.name ?? ""}`} description="Resumen general del sistema" />
				<Button variant="outline" size="sm" className="gap-2 shrink-0" disabled>
					<FileText className="h-4 w-4" />
					Generar reporte PDF
				</Button>
			</div>

			<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				<StatCard
					label="Alumnos"
					value={stats.studentsTotal}
					icon={GraduationCap}
					loading={stats.isLoading}
				/>
				<StatCard
					label="Maestros"
					value={stats.teachersTotal}
					icon={BookOpen}
					loading={stats.isLoading}
				/>
				<StatCard
					label="Padres / Tutores"
					value={stats.parentsTotal}
					icon={Users2}
					loading={stats.isLoading}
				/>
				<StatCard
					label="Usuarios del sistema"
					value={stats.usersTotal}
					icon={UsersIcon}
					loading={stats.isLoading}
				/>
				<StatCard
					label="Aulas"
					value={stats.classroomsTotal}
					icon={Building2}
					loading={stats.isLoading}
				/>
			</section>

			<section className="grid gap-4 lg:grid-cols-2">
				<StudentsByGroupChart />
				<StudentsByGenderChart />
			</section>

			<section className="grid gap-4 lg:grid-cols-2">
				<SessionCard user={user} />
				<ModulesCard />
			</section>
		</div>
	);
};

const SessionCard = memo(({ user }: { user: ReturnType<typeof useAuth>["user"] }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-base">Tu sesión</CardTitle>
		</CardHeader>
		<CardContent className="space-y-2 text-sm">
			<Row label="Rol" value={user?.role_code ?? "—"} />
			<Row label="Estado" value={user?.status_code ?? "—"} />
			<Row
				label="Último login"
				value={user?.last_login_at ? new Date(user.last_login_at).toLocaleString() : "—"}
			/>
		</CardContent>
	</Card>
));
SessionCard.displayName = "SessionCard";

const ModulesCard = memo(() => (
	<Card>
		<CardHeader>
			<CardTitle className="text-base">Módulos disponibles</CardTitle>
		</CardHeader>
		<CardContent className="space-y-1.5 text-sm text-muted-foreground">
			<p>• Alumnos, maestros y padres/tutores</p>
			<p>• Aulas y grados/grupos</p>
			<p>• Diagnósticos socioeconómicos</p>
			<p>• Inventario y activos</p>
			<p>• Reportes PDF (próximamente)</p>
		</CardContent>
	</Card>
));
ModulesCard.displayName = "ModulesCard";

const Row = memo(({ label, value }: { label: string; value: string }) => (
	<div className="flex justify-between border-b py-1.5 last:border-b-0">
		<span className="text-muted-foreground">{label}</span>
		<span className="font-medium">{value}</span>
	</div>
));
Row.displayName = "Row";
