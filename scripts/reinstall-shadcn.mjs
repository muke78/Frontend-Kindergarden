// Manual shadcn registry installer (workaround Windows symlink scandir bug)
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const STYLE = "new-york";
const COMPONENTS = [
	"avatar",
	"badge",
	"button",
	"calendar",
	"card",
	"chart",
	"checkbox",
	"dialog",
	"dropdown-menu",
	"input",
	"label",
	"popover",
	"select",
	"separator",
	"sidebar",
	"skeleton",
	"table",
	"textarea",
	"tooltip",
];

const PROJECT_ROOT = resolve(import.meta.dirname, "..");
const UI_DIR = join(PROJECT_ROOT, "src", "components", "ui");
const LIB_DIR = join(PROJECT_ROOT, "src", "lib");
const HOOKS_DIR = join(PROJECT_ROOT, "src", "hooks");

const fetchRegistry = async (name) => {
	const url = `https://ui.shadcn.com/r/styles/${STYLE}/${name}.json`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed ${name}: ${res.status}`);
	return res.json();
};

const resolveTarget = (file) => {
	// shadcn target paths: ui/<x>.tsx → src/components/ui/<x>.tsx
	const p = file.path;
	if (p.startsWith("ui/")) return join(UI_DIR, p.slice(3));
	if (p.startsWith("lib/")) return join(LIB_DIR, p.slice(4));
	if (p.startsWith("hooks/")) return join(HOOKS_DIR, p.slice(6));
	if (file.target) return join(PROJECT_ROOT, file.target);
	return join(UI_DIR, p);
};

const dependencies = new Set();
const installed = new Set();

const install = async (name) => {
	if (installed.has(name)) return;
	installed.add(name);
	const reg = await fetchRegistry(name);
	for (const dep of reg.dependencies ?? []) dependencies.add(dep);
	for (const sub of reg.registryDependencies ?? []) await install(sub);
	for (const file of reg.files ?? []) {
		const target = resolveTarget(file);
		mkdirSync(dirname(target), { recursive: true });
		const content = file.content
			.replace(/@\/registry\/[\w-]+\/ui\//g, "@/components/ui/")
			.replace(/@\/registry\/[\w-]+\/lib\//g, "@/lib/")
			// Tailwind v3 → v4: prefix-[--var] → prefix-(--var). Keeps setters [--var:value] intact.
			.replace(/\b([a-z-]+)-\[(--[a-z-]+)\]/g, "$1-($2)")
			.replace(/@\/registry\/[\w-]+\/hooks\//g, "@/hooks/");
		writeFileSync(target, content, "utf8");
		console.log(`  ✓ ${target.replace(PROJECT_ROOT, ".")}`);
	}
};

for (const name of COMPONENTS) {
	console.log(`\n→ ${name}`);
	await install(name);
}

console.log(`\nnpm deps needed: ${[...dependencies].join(" ")}`);
