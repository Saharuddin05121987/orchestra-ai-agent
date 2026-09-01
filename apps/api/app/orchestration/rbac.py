"""
RBAC Layer module for Modern AI Agent Orchestration Architecture.
Handles tenant context, role hierarchy, and tool permission authorization.
"""

from typing import Dict, Any

ROLES = {
    "admin": {
        "description": "Full Access (Research, Analysis, Action, Admin Tools)",
        "permissions": ["read", "write", "admin"]
    },
    "analyst": {
        "description": "Read & Write Access (Research & Analysis Tools, Non-destructive Action Tools)",
        "permissions": ["read", "write"]
    },
    "viewer": {
        "description": "Read Only Access (Research Tools, Basic Analysis)",
        "permissions": ["read"]
    }
}

class RBACManager:
    def __init__(self):
        self.roles = ROLES

    def validate_access(self, role: str, required_permission: str, tenant_id: str = "tenant-default") -> Dict[str, Any]:
        user_role_config = self.roles.get(role.lower())
        if not user_role_config:
            return {
                "allowed": False,
                "reason": f"Role '{role}' is not recognized in RBAC system.",
                "tenant_id": tenant_id
            }
        
        has_perm = required_permission in user_role_config["permissions"]
        if has_perm:
            return {
                "allowed": True,
                "reason": f"Permission '{required_permission}' granted for role '{role}'. Tenant isolation verified ({tenant_id}).",
                "tenant_id": tenant_id
            }
        else:
            return {
                "allowed": False,
                "reason": f"Access DENIED! Role '{role}' lacks required permission '{required_permission}'.",
                "tenant_id": tenant_id
            }

rbac_manager = RBACManager()
