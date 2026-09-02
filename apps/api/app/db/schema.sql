-- ============================================================
-- SAHAROPS AI — ENTERPRISE DATABASE SCHEMA (POSTGRESQL + PGVECTOR)
-- DDL Script for 13 Core Tables
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'analyst', -- admin, analyst, viewer
    tenant_id VARCHAR(50) NOT NULL DEFAULT 'tenant-alpha',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. AGENTS TABLE
CREATE TABLE IF NOT EXISTS agents (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- coordinator, research, analysis, action, reviewer, finalizer
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. AGENT VERSIONS TABLE
CREATE TABLE IF NOT EXISTS agent_versions (
    id VARCHAR(50) PRIMARY KEY,
    agent_id VARCHAR(50) REFERENCES agents(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL DEFAULT 'v1.0.0',
    system_prompt TEXT NOT NULL,
    model_name VARCHAR(50) DEFAULT 'gpt-4o',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. WORKFLOWS TABLE
CREATE TABLE IF NOT EXISTS workflows (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    tenant_id VARCHAR(50) NOT NULL DEFAULT 'tenant-alpha',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. WORKFLOW NODES TABLE
CREATE TABLE IF NOT EXISTS workflow_nodes (
    id VARCHAR(50) PRIMARY KEY,
    workflow_id VARCHAR(50) REFERENCES workflows(id) ON DELETE CASCADE,
    agent_id VARCHAR(50) REFERENCES agents(id) ON DELETE CASCADE,
    node_type VARCHAR(50) DEFAULT 'agent',
    position_x INT DEFAULT 0,
    position_y INT DEFAULT 0
);

-- 6. WORKFLOW EDGES TABLE
CREATE TABLE IF NOT EXISTS workflow_edges (
    id VARCHAR(50) PRIMARY KEY,
    workflow_id VARCHAR(50) REFERENCES workflows(id) ON DELETE CASCADE,
    source_node_id VARCHAR(50) REFERENCES workflow_nodes(id) ON DELETE CASCADE,
    target_node_id VARCHAR(50) REFERENCES workflow_nodes(id) ON DELETE CASCADE,
    condition VARCHAR(100) DEFAULT 'default'
);

-- 7. EXECUTIONS TABLE
CREATE TABLE IF NOT EXISTS executions (
    id VARCHAR(50) PRIMARY KEY,
    workflow_id VARCHAR(50) REFERENCES workflows(id) ON DELETE SET NULL,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    tenant_id VARCHAR(50) NOT NULL DEFAULT 'tenant-alpha',
    task_input TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'RUNNING',
    output TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 8. EXECUTION STEPS (OBSERVABILITY TRACES) TABLE
CREATE TABLE IF NOT EXISTS execution_steps (
    id VARCHAR(50) PRIMARY KEY,
    execution_id VARCHAR(50) REFERENCES executions(id) ON DELETE CASCADE,
    agent_name VARCHAR(100) NOT NULL,
    action VARCHAR(150) NOT NULL,
    details TEXT,
    tool_name VARCHAR(50),
    duration_ms FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. APPROVALS TABLE
CREATE TABLE IF NOT EXISTS approvals (
    id VARCHAR(50) PRIMARY KEY,
    execution_id VARCHAR(50) REFERENCES executions(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    detail TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'Needs review',
    tag_class VARCHAR(20) DEFAULT 'review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. DOCUMENTS TABLE (RAG & VECTOR STORAGE)
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    tenant_id VARCHAR(50) NOT NULL DEFAULT 'tenant-alpha',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. MEMORIES TABLE (AGENT SESSION STATE)
CREATE TABLE IF NOT EXISTS memories (
    id VARCHAR(50) PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    memory_key VARCHAR(100) NOT NULL,
    memory_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. TOOLS TABLE
CREATE TABLE IF NOT EXISTS tools (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    required_permission VARCHAR(50) NOT NULL,
    description TEXT
);

-- 13. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    tenant_id VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(150) NOT NULL,
    allowed BOOLEAN NOT NULL DEFAULT TRUE,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEXES FOR OPTIMAL PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflows_tenant ON workflows(tenant_id);
CREATE INDEX IF NOT EXISTS idx_executions_tenant ON executions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_tenant ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_logs(tenant_id);
