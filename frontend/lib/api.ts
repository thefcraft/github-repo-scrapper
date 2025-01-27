import { Repo } from "@/lib/types";

export const baseApi = 'http://127.0.0.1:8000';

export interface ApiResponse {
  repos: Repo[];
  total?: number;
  tags?: string[];
  langs?: string[];
}

export async function searchRepos(
  search: string, 
  lang: string, 
  tags: string[],
  page: number,
  size: number
): Promise<ApiResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });
  if (search) params.append("search", search);
  if (lang) params.append("lang", lang);
  tags.forEach((tag) => params.append("tag", tag));
  const res = await fetch(`${baseApi}/api/repos?${params.toString()}`);
  return res.json();
}

export async function getTags(query: string): Promise<ApiResponse> {
  const res = await fetch(`${baseApi}/api/tags?q=${query}`);
  return res.json();
}
export async function getLanguages(): Promise<ApiResponse> {
  const res = await fetch(`${baseApi}/api/langs`);
  return res.json();
}

export async function getTagRepos(tagName: string): Promise<ApiResponse> {
  const res = await fetch(`${baseApi}/api/tag/${tagName}`);
  return res.json();
}
