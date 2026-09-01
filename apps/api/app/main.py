import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from .orchestration.graph import run_workflow
from .orchestration.tool_registry import tool_registry
from .orchestration.rbac import rbac_manager

app = FastAPI(
    title="Orchestra AI - Modern AI Agent Orchestration API",
    version="1.0.0",
    description="Enterprise Multi-Agent Orchestration Architecture with Tool Registry, RBAC Layer, and Observability Traces"
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RunRequest(BaseModel):
    task: str = Field(..., example="Analisis risiko keselamatan kerja pada area perataan tanah dan buat tiket rekomendasi.")
    role: Optional[str] = Field("analyst", example="analyst")
    tenant_id: Optional[str] = Field("tenant-alpha", example="tenant-alpha")

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Orchestra AI Agent Engine",
        "architecture": "Modern AI Agent Orchestration Architecture"
    }

@app.get("/api/v1/tools")
def list_tools():
    return tool_registry.list_tools()

@app.get("/api/v1/roles")
def list_roles():
    return rbac_manager.roles

@app.post("/api/v1/workflows/run")
async def run(req: RunRequest):
    return await run_workflow(
        task=req.task,
        role=req.role or "analyst",
        tenant_id=req.tenant_id or "tenant-alpha"
    )
