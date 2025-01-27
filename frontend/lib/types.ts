export interface Repo {
  repo_owner: string | null;
  repo_name: string | null;
  repo_url: string;
  start: number;
  icon: string;
  desc: string | null;
  tags: [string, string][];
  timestamp: string;
  lang: string | null;
}
export interface Pagination {
  page: number;
  size: number;
  total: number;
}