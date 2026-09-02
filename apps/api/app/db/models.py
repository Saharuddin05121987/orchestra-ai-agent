"""
SaharOps AI — Enterprise PostgreSQL Database Models (SQLAlchemy ORM)
Enterprise 13-Table Schema for Multi-Agent Orchestration & Observability
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Column, String, Integer, Boolean, Float, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# 1. Users Table (RBAC & Tenant Isolation)
class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False, default="analyst")  # admin, analyst, viewer
    tenant_id = Column(String(50), nullable=False, index=True, default="tenant-alpha")
    created_at = Column(DateTime, default=datetime.utcnow)

    executions = relationship("Execution", back_populates="user")
    memories = relationship("Memory", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")


# 2. Agents Catalog Table
class Agent(Base):
    __tablename__ = "agents"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # coordinator, research, analysis, action, reviewer, finalizer
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    versions = relationship("AgentVersion", back_populates="agent")
    workflow_nodes = relationship("WorkflowNode", back_populates="agent")


# 3. Agent Versions Table
class AgentVersion(Base):
    __tablename__ = "agent_versions"

    id = Column(String(50), primary_key=True)
    agent_id = Column(String(50), ForeignKey("agents.id"), nullable=False)
    version = Column(String(20), nullable=False, default="v1.0.0")
    system_prompt = Column(Text, nullable=False)
    model_name = Column(String(50), default="gpt-4o")
    created_at = Column(DateTime, default=datetime.utcnow)

    agent = relationship("Agent", back_populates="versions")


# 4. Workflows Table
class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(String(50), primary_key=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    tenant_id = Column(String(50), nullable=False, index=True, default="tenant-alpha")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    nodes = relationship("WorkflowNode", back_populates="workflow")
    edges = relationship("WorkflowEdge", back_populates="workflow")
    executions = relationship("Execution", back_populates="workflow")


# 5. Workflow Nodes Table
class WorkflowNode(Base):
    __tablename__ = "workflow_nodes"

    id = Column(String(50), primary_key=True)
    workflow_id = Column(String(50), ForeignKey("workflows.id"), nullable=False)
    agent_id = Column(String(50), ForeignKey("agents.id"), nullable=False)
    node_type = Column(String(50), default="agent")
    position_x = Column(Integer, default=0)
    position_y = Column(Integer, default=0)

    workflow = relationship("Workflow", back_populates="nodes")
    agent = relationship("Agent", back_populates="workflow_nodes")


# 6. Workflow Edges Table
class WorkflowEdge(Base):
    __tablename__ = "workflow_edges"

    id = Column(String(50), primary_key=True)
    workflow_id = Column(String(50), ForeignKey("workflows.id"), nullable=False)
    source_node_id = Column(String(50), ForeignKey("workflow_nodes.id"), nullable=False)
    target_node_id = Column(String(50), ForeignKey("workflow_nodes.id"), nullable=False)
    condition = Column(String(100), nullable=True)  # approve, reject, default

    workflow = relationship("Workflow", back_populates="edges")


# 7. Executions Table
class Execution(Base):
    __tablename__ = "executions"

    id = Column(String(50), primary_key=True)
    workflow_id = Column(String(50), ForeignKey("workflows.id"), nullable=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    tenant_id = Column(String(50), nullable=False, index=True, default="tenant-alpha")
    task_input = Column(Text, nullable=False)
    status = Column(String(30), default="RUNNING")  # RUNNING, COMPLETED, REJECTED, FAILED
    output = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="executions")
    workflow = relationship("Workflow", back_populates="executions")
    steps = relationship("ExecutionStep", back_populates="execution")
    approvals = relationship("Approval", back_populates="execution")


# 8. Execution Steps (Observability Traces) Table
class ExecutionStep(Base):
    __tablename__ = "execution_steps"

    id = Column(String(50), primary_key=True)
    execution_id = Column(String(50), ForeignKey("executions.id"), nullable=False)
    agent_name = Column(String(100), nullable=False)
    action = Column(String(150), nullable=False)
    details = Column(Text, nullable=True)
    tool_name = Column(String(50), nullable=True)
    duration_ms = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    execution = relationship("Execution", back_populates="steps")


# 9. Approvals Queue Table
class Approval(Base):
    __tablename__ = "approvals"

    id = Column(String(50), primary_key=True)
    execution_id = Column(String(50), ForeignKey("executions.id"), nullable=True)
    name = Column(String(150), nullable=False)
    detail = Column(Text, nullable=False)
    status = Column(String(30), default="Needs review")  # Needs review, Approved, Rejected
    tag_class = Column(String(20), default="review")
    created_at = Column(DateTime, default=datetime.utcnow)

    execution = relationship("Execution", back_populates="approvals")


# 10. Documents Table (RAG & Knowledge Base)
class Document(Base):
    __tablename__ = "documents"

    id = Column(String(50), primary_key=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    embedding_json = Column(JSON, nullable=True)  # Store 1536-dim embeddings
    tenant_id = Column(String(50), nullable=False, index=True, default="tenant-alpha")
    created_at = Column(DateTime, default=datetime.utcnow)


# 11. Memories Table (Agent Session Context & State)
class Memory(Base):
    __tablename__ = "memories"

    id = Column(String(50), primary_key=True)
    session_id = Column(String(100), nullable=False, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    memory_key = Column(String(100), nullable=False)
    memory_value = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="memories")


# 12. Tools Registry Table
class Tool(Base):
    __tablename__ = "tools"

    id = Column(String(50), primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    category = Column(String(50), nullable=False)  # research, analysis, action
    required_permission = Column(String(50), nullable=False)  # read, analyze, write
    description = Column(Text, nullable=True)


# 13. Audit Logs Table (RBAC Security Trail)
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    tenant_id = Column(String(50), nullable=False, index=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(150), nullable=False)
    allowed = Column(Boolean, nullable=False, default=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
