import { Pagination } from 'src/app/paginator/pagination.model';

export type ListViewQueryDescriptor = {
  pagination: Omit<Pagination, 'availablePages'> | null;
}
