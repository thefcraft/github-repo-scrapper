# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dataclasses import dataclass
import json
from typing import List, Optional, Tuple
import os
basepath = os.path.dirname(__file__)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@dataclass
class Topic:
    href: str
    title: str
    body: str

@dataclass
class Repo:
    repo_owner: Optional[str]
    repo_name: Optional[str]
    repo_url: str
    start: int
    icon: str
    desc: Optional[str]
    tags: List[Tuple[str, str]]
    timestamp: str
    lang: Optional[str]

# Load data
repos = []
with open(os.path.join(basepath, "repos.jsonl")) as f:
    for line in f:
        data = json.loads(line)
        data["tags"] = [tuple(tag) for tag in data["tags"]]
        repos.append(Repo(**data))

@app.get("/api/repos")
async def get_repos(
    search: Optional[str] = None,
    lang: Optional[str] = None,
    tag: Optional[str] = None,
    page: int = 1,
    size: int = 20
):
    filtered = repos
    
    if search:
        search = search.lower()
        filtered = [r for r in filtered 
                   if (r.desc and search in r.desc.lower()) or 
                      (r.repo_name and search in r.repo_name.lower())]
    
    if lang:
        filtered = [r for r in filtered if r.lang == lang]
    
    if tag:
        filtered = [r for r in filtered if any(t[0] == tag for t in r.tags)]
    
    paginated = filtered[(page-1)*size : page*size]
    return {
        "repos": [r.__dict__ for r in paginated],
        "total": len(filtered)
    }

@app.get("/api/tags")
async def search_tags(q: Optional[str] = None):
    tags = set()
    for repo in repos:
        for tag in repo.tags:
            tags.add(tag[0])
    tags = sorted(tags)
    if q:
        tags = [t for t in tags if q.lower() in t.lower()]
    return {"tags": tags[:100]}  # Limit to top 100 matches

@app.get("/api/langs")
async def get_languages():
    langs = set()
    for repo in repos:
        if repo.lang:
            langs.add(repo.lang)
    return {"langs": sorted(langs)}

@app.get("/api/tag/{tag_name}")
async def get_tag_repos(tag_name: str):
    matching_repos = []
    for repo in repos:
        if any(t[0] == tag_name for t in repo.tags):
            matching_repos.append(repo.__dict__)
    return {"repos": matching_repos}

import random

@app.get("/api/random-repo")
async def get_random_repo():
    return random.choice(repos).__dict__

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)