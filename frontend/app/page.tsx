"use client";

import { useEffect, useState } from 'react';
import { Autocomplete, TextField, Grid, Chip, CircularProgress, Button, Pagination } from '@mui/material';
import { searchRepos, getTags, getLanguages, baseApi } from '@/lib/api';
import RepoCard from '@/components/RepoCard';
import { Pagination as TypePagination, Repo } from '@/lib/types';

export default function SearchPage() {
  const [pagination, setPagination] = useState<TypePagination>({ page: 1, size: 20, total: 0 });
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [langOptions, setLangOptions] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLanguages().then((res) => setLangOptions(res.langs?res.langs:[]));
  }, []);

  // Modify search effect
  useEffect(() => {
    setLoading(true);
    searchRepos(search, lang, tags, pagination.page, pagination.size).then((res) => {
      setRepos(res.repos);
      setPagination(prev => ({ ...prev, total: res.total || 0 }));
      setLoading(false);
    });
  }, [search, lang, tags, pagination.page, pagination.size]);

  const handleTagSearch = (query: string) => {
    getTags(query).then((res) => setTagOptions(res.tags?res.tags:[]));
    setTags([query]);
  };
  // Add random handler
  const handleRandom = async () => {
    const res = await fetch(`${baseApi}/random-repo`);
    const repo: Repo = await res.json();
    window.open(`https://github.com${repo.repo_url}`, '_blank');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Open Source Explorer</h1>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={handleRandom}
        >
          🍀 Feel Lucky
        </Button>
      </div>

      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search Repositories"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
        <Autocomplete
          options={langOptions}
          loading={langOptions.length === 0}
          onInputChange={(_, value) => setLang(value)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Language" 
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
          </Grid>
        <Grid item xs={12} md={4}>
        <Autocomplete
          options={tagOptions}
          loading={tagOptions.length === 0}
          onInputChange={(_, value) => handleTagSearch(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
        </Grid>
      </Grid>
      <div className="my-4 flex justify-between items-center">
        <Pagination
          count={Math.ceil(pagination.total / pagination.size)}
          page={pagination.page}
          onChange={(_, page) => setPagination(prev => ({ ...prev, page }))}
          color="primary"
        />
        <select 
          value={pagination.size}
          onChange={(e) => setPagination(prev => ({ ...prev, size: Number(e.target.value) }))}
          className="border p-2 rounded"
        >
          {[10, 20, 50].map(size => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </select>
      </div>

      {repos.length === 0 && <>
        No Result Found
      </>}

      {loading ? (
        <CircularProgress />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <RepoCard key={repo.repo_url} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}