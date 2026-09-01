# Orchestra AI — Autonomous Multi-Agent Starter

Production-oriented starter for an autonomous multi-agent workflow platform.

## Stack
- Next.js + TypeScript frontend
- FastAPI backend
- LangGraph orchestration
- PostgreSQL + pgvector
- Redis
- Docker Compose

## Quick start

1. Copy `.env.example` to `.env`
2. Put your model API key in `.env`
3. Run:

```bash
docker compose up --build
```

Frontend: http://localhost:3000
API: http://localhost:8000
API docs: http://localhost:8000/docs

## First workflow

Open the dashboard, enter a task, and run it. The starter graph executes:
Planner → Researcher → Analyst → Reviewer → Finalizer.

The executor and external tools are intentionally permission-gated and are the next production extension.
