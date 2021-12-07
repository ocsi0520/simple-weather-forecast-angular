import { ListViewQueryDescriptor } from './list-view-query-descriptor';
export type ListViewDescriptor =
  ListViewQueryDescriptor &
  { pagination: { availablePages: number; } | null; };