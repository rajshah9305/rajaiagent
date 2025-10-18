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
