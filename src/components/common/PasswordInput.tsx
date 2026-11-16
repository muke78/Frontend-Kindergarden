import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Input>;

export const PasswordInput = forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => {
	const [show, setShow] = useState(false);
	return (
		<div className="relative">
			<Input
				ref={ref}
				type={show ? "text" : "password"}
				className={cn("pr-10", className)}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				tabIndex={-1}
				className="absolute right-0 top-0 h-full w-9 text-muted-foreground hover:text-foreground"
				onClick={() => setShow((s) => !s)}
			>
				{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
			</Button>
		</div>
	);
});
PasswordInput.displayName = "PasswordInput";
