"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Repo } from '@/lib/types';
import RepoCard from '@/components/RepoCard';
import { getTagRepos } from '@/lib/api';
import Link from 'next/link';

export default function TagPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const { tagName }: {tagName?: string} = useParams();
  useEffect(() => {
    if (tagName) {
      getTagRepos(tagName).then((res) => setRepos(res.repos));
    }
  }, [tagName]);

  if (!tagName) {
    return <>Loading...</>;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4"><Link href={'/'}>Back To Home</Link></h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo, index) => (
          <RepoCard key={index} repo={repo} />
        ))}
      </div>
    </div>
  );
}