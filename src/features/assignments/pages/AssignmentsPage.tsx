import { BookOpen, DoorOpen, GraduationCap, Loader2, Users } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignDrawer } from "@/features/assignments/components/AssignDrawer";
import { ClassroomBoard } from "@/features/assignments/components/ClassroomBoard";
import { FamilyBoard } from "@/features/assignments/components/FamilyBoard";
import { StudentBoard } from "@/features/assignments/components/StudentBoard";
import { TeacherBoard } from "@/features/assignments/components/TeacherBoard";
import { useAssignmentsBoard } from "@/features/assignments/hooks/useAssignmentsBoard";
import { useFamilyBoard } from "@/features/assignments/hooks/useFamilyBoard";

export const AssignmentsPage = () => {
	const board = useAssignmentsBoard();
	const family = useFamilyBoard();

	return (
		<div className="space-y-6">
			<PageHeader
				title="Asignaciones"
				description="Arrastra para asignar, o haz clic en cualquier tarjeta para ver detalles y mover manualmente"
			/>

			{board.isLoading ? (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</div>
			) : (
				<Tabs defaultValue="students">
					<TabsList className="flex-wrap">
						<TabsTrigger value="students" className="gap-1.5">
							<GraduationCap className="h-4 w-4" /> Alumnos
						</TabsTrigger>
						<TabsTrigger value="teachers" className="gap-1.5">
							<BookOpen className="h-4 w-4" /> Maestras
						</TabsTrigger>
						<TabsTrigger value="classrooms" className="gap-1.5">
							<DoorOpen className="h-4 w-4" /> Aulas
						</TabsTrigger>
						<TabsTrigger value="families" className="gap-1.5">
							<Users className="h-4 w-4" /> Familias
						</TabsTrigger>
					</TabsList>

					<TabsContent value="students" className="pt-4">
						<p className="mb-3 text-sm text-muted-foreground">
							Arrastra alumnos entre grupos, marca varios para moverlos juntos, o haz clic en uno
							para abrir el panel de detalles. La maestra titular se asigna automáticamente.
						</p>
						<StudentBoard board={board} />
					</TabsContent>

					<TabsContent value="teachers" className="pt-4">
						<p className="mb-3 text-sm text-muted-foreground">
							Cada grupo tiene una sola maestra titular por ciclo. Al soltar una maestra en un grupo
							ocupado, la anterior queda sin grupo y el historial se conserva.
						</p>
						<TeacherBoard board={board} />
					</TabsContent>

					<TabsContent value="classrooms" className="pt-4">
						<p className="mb-3 text-sm text-muted-foreground">
							Asigna a cada maestra su salón físico. Los activos e inventario de cada aula se
							gestionan en sus módulos filtrando por aula.
						</p>
						<ClassroomBoard board={board} />
					</TabsContent>

					<TabsContent value="families" className="pt-4">
						<p className="mb-3 text-sm text-muted-foreground">
							Arrastra un alumno del panel izquierdo hacia la tarjeta de su papá/mamá. Cada hijo
							muestra su grupo y su maestra actual, aunque los hermanos estén en grupos distintos.
						</p>
						<FamilyBoard family={family} />
					</TabsContent>
				</Tabs>
			)}

			<AssignDrawer board={board} />
		</div>
	);
};
