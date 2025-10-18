export interface Agent {
  id: string
  agentId: string
  agentArn: string
  agentName: string
  description: string | null
  instructions: string
  foundationModel: string
  idleSessionTTL: number
  agentStatus: string
  createdAt: string
  updatedAt: string
  tags: string[]
  isFavorite: boolean
  executionCount: number
  lastExecutionTime?: string
}

export interface Execution {
  id: string
  agentId: string
  sessionId: string
  input: string
  status: string
  startTime: string
  endTime?: string | null
  duration?: number | null
  output?: string | null
  tasks: Task[]
  metrics?: ExecutionMetrics | null
  agent?: Agent
}

export interface Task {
  id: string
  executionId: string
  taskName: string
  status: string
  startTime: string
  endTime?: string | null
  duration?: number | null
  progress: number
  output?: string | null
  error?: string | null
}

export interface ExecutionMetrics {
  totalTasks: number
  completedTasks: number
  failedTasks: number
  runningTasks: number
  averageTaskDuration: number
  totalDuration: number
  throughput: number
  successRate: number
}

export interface Tool {
  id: string
  name: string
  displayName: string
  description: string
  category: string
  icon?: string
  isActive: boolean
  config?: string
  version: string
  createdAt: string
  updatedAt: string
}

export interface AgentTool {
  id: string
  agentId: string
  toolId: string
  isEnabled: boolean
  config?: string
  priority: number
  createdAt: string
  updatedAt: string
  tool?: Tool
}

export interface ToolExecution {
  id: string
  toolId: string
  executionId: string
  taskId?: string
  input: string
  output?: string
  status: string
  startTime: string
  endTime?: string
  duration?: number
  error?: string
  metadata?: string
  createdAt: string
  updatedAt: string
  tool?: Tool
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
  isActive: boolean
  lastLoginAt?: string
  preferences?: string
  createdAt: string
  updatedAt: string
}

export interface UserAnalytics {
  id: string
  userId: string
  date: string
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  totalDuration: number
  totalCost: number
  toolsUsed: string
  createdAt: string
  updatedAt: string
}
