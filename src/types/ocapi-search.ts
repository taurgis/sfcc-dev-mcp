/**
 * Shared OCAPI search request types.
 *
 * These types are reused by OCAPI clients and tool configs to avoid drift.
 */

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface TextQuery {
  fields: string[];
  search_phrase: string;
}

export interface TermQuery {
  fields: string[];
  operator: string;
  values: JsonValue[];
}

export interface FilteredQuery {
  filter: JsonValue;
  query: SearchQuery;
}

export interface BoolQuery {
  must?: SearchQuery[];
  must_not?: SearchQuery[];
  should?: SearchQuery[];
}

export interface SearchQuery {
  text_query?: TextQuery;
  term_query?: TermQuery;
  filtered_query?: FilteredQuery;
  bool_query?: BoolQuery;
  match_all_query?: Record<string, never>;
}

export interface SearchSortOption {
  field: string;
  sort_order?: 'asc' | 'desc';
}

export interface OCAPISearchRequest {
  query?: SearchQuery;
  sorts?: SearchSortOption[];
  start?: number;
  count?: number;
  select?: string;
}

export interface SitePreferencesSearchOptions {
  maskPasswords?: boolean;
  expand?: string;
}
