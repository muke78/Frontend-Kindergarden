export type ApiResponse<T> = {
	success: true;
	httpStatus: number;
	method: string;
	path: string;
	timestamp: string;
	message?: string;
	data?: T;
};

export type ApiErrorResponse = {
	success: false;
	httpStatus: number;
	code: string;
	message: string;
	details?: Array<{ field: string; message: string }>;
	stack?: string;
};

export type Paginated<T> = {
	rows: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
};

export type PaginationQuery = {
	page?: number;
	limit?: number;
	sort?: string;
	order?: "asc" | "desc";
	search?: string;
};
