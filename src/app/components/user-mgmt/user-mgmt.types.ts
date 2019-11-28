/** Sortable Columns */
export type SortableColumn =  'companyName' | 'firstName';

/** SortProps Interface */
export interface SortProps {
	dir: 'asc' | 'desc';
	column: SortableColumn;
}
