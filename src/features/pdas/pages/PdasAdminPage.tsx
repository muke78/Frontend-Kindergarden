import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { PermissionGate } from "@/components/common/PermissionGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PdaCategoryDialog } from "@/features/pdas/components/PdaCategoryDialog";
import { PdaItemDialog } from "@/features/pdas/components/PdaItemDialog";
import {
	usePdaCategoryMutations,
	usePdaItemMutations,
} from "@/features/pdas/hooks/usePdasMutations";
import { usePdaCategories, usePdaItems } from "@/features/pdas/hooks/usePdasQueries";
import { usePdasUiStore } from "@/features/pdas/stores/pdasUi.store";

export const PdasAdminPage = () => {
	const { data: categories = [], isLoading } = usePdaCategories();
	const { data: allItems = [] } = usePdaItems({ is_active: true });
	const [expanded, setExpanded] = useState<string[]>([]);
	const store = usePdasUiStore();
	const catMut = usePdaCategoryMutations();
	const itemMut = usePdaItemMutations();

	const toggle = (id: string) =>
		setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

	return (
		<div className="space-y-6">
			<PageHeader
				title="PDAs — Campos Formativos"
				description="Procesos de Desarrollo de Aprendizaje — NEM 2022"
				actions={
					<PermissionGate module="pda_categories" action="create">
						<Button onClick={store.openCreateCategory}>
							<Plus className="mr-2 h-4 w-4" />
							Nuevo campo formativo
						</Button>
					</PermissionGate>
				}
			/>

			{isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}

			<div className="space-y-3">
				{categories.map((cat) => {
					const items = allItems.filter((i) => i.category_id === cat.id);
					const open = expanded.includes(cat.id);

					return (
						<Card key={cat.id}>
							<CardHeader className="py-3 px-4">
								<div className="flex items-center gap-3">
									<div
										className="h-3 w-3 rounded-full shrink-0"
										style={{ background: cat.color }}
									/>
									<CardTitle className="text-base flex-1">{cat.name}</CardTitle>
									<Badge variant="secondary">{items.length} PDAs</Badge>
									<PermissionGate module="pda_categories" action="update">
										<Button size="icon" variant="ghost" onClick={() => store.openEditCategory(cat)}>
											<Pencil className="h-4 w-4" />
										</Button>
									</PermissionGate>
									<PermissionGate module="pda_categories" action="delete">
										<Button
											size="icon"
											variant="ghost"
											className="text-destructive"
											onClick={() => catMut.remove.mutate(cat.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</PermissionGate>
									<Button size="icon" variant="ghost" onClick={() => toggle(cat.id)}>
										{open ? (
											<ChevronDown className="h-4 w-4" />
										) : (
											<ChevronRight className="h-4 w-4" />
										)}
									</Button>
								</div>
							</CardHeader>

							{open && (
								<CardContent className="pt-0 pb-3 px-4 space-y-2">
									{["Primero", "Segundo", "Tercero"].map((grade) => {
										const gradeItems = items.filter((i) => i.grade_name === grade);
										return (
											<div key={grade}>
												<div className="flex items-center justify-between mb-1">
													<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
														{grade} de Preescolar
													</p>
													<PermissionGate module="pda_items" action="create">
														<Button
															size="sm"
															variant="ghost"
															className="h-6 text-xs"
															onClick={() => store.openCreateItem(cat.id)}
														>
															<Plus className="h-3 w-3 mr-1" /> PDA
														</Button>
													</PermissionGate>
												</div>
												{gradeItems.length === 0 ? (
													<p className="text-xs text-muted-foreground pl-2">Sin PDAs definidos</p>
												) : (
													<ul className="space-y-1">
														{gradeItems.map((item) => (
															<li
																key={item.id}
																className="flex items-start gap-2 text-sm rounded-md px-2 py-1 hover:bg-muted/50"
															>
																<span className="text-muted-foreground mt-0.5 shrink-0">
																	{item.sort_order + 1}.
																</span>
																<span className="flex-1">{item.description}</span>
																<div className="flex gap-1 shrink-0">
																	<Button
																		size="icon"
																		variant="ghost"
																		className="h-6 w-6"
																		onClick={() => store.openEditItem(item)}
																	>
																		<Pencil className="h-3 w-3" />
																	</Button>
																	<Button
																		size="icon"
																		variant="ghost"
																		className="h-6 w-6 text-destructive"
																		onClick={() => itemMut.remove.mutate(item.id)}
																	>
																		<Trash2 className="h-3 w-3" />
																	</Button>
																</div>
															</li>
														))}
													</ul>
												)}
											</div>
										);
									})}
								</CardContent>
							)}
						</Card>
					);
				})}
			</div>

			<PdaCategoryDialog />
			<PdaItemDialog />
		</div>
	);
};
