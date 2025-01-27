"use client";

import StarIcon from '@mui/icons-material/Star';
import CodeIcon from '@mui/icons-material/Code';
import { Repo } from '@/lib/types';

export default function RepoCard({ repo }: { repo: Repo }) {
  return (
    <div className="border py-4 px-2 sm:px-4 rounded-lg hover:shadow-lg transition-shadow bg-white">
      <div className="flex items-start gap-4 h-full flex-wrap-reverse">
        <div className="flex-1 w-full">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CodeIcon fontSize="small" />
            <a 
              href={`https://github.com${repo.repo_url}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 truncate max-w-[50vw] sm:max-w-[70vw]"
            >
              {repo.repo_owner}/{repo.repo_name}
            </a>
          </h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <StarIcon fontSize="small" />
              {repo.start.toLocaleString()}
            </span>
            {repo.lang && (
              <span className="px-2 py-1 bg-gray-100 rounded">
                {repo.lang}
              </span>
            )}
          </div>
          <p className="mt-2 text-gray-700">{repo.desc}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {repo.tags.map(([tag]) => (
              <a
                key={tag}
                href={`/tag?id=${tag}`}
                className="px-2 py-1 bg-blue-100 rounded hover:bg-blue-200 text-sm transition-colors"
              >
                #{tag}
              </a>
            ))}
          </div>
        </div>
        {repo.icon && (
          <img 
            src={repo.icon} 
            alt="repo icon" 
            className="w-[512px] h-auto rounded object-contain mx-auto"
          />
        )}
      </div>
    </div>
  );
}