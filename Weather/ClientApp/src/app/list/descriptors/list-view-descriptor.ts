import { Pagination } from 'src/app/paginator/pagination.model';
import { ListViewQueryDescriptor } from './list-view-query-descriptor';
export type ListViewDescriptor =
  ListViewQueryDescriptor &
  { pagination: Pagination | null };