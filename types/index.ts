export interface Agent {
  id: string
  agentId: string
  agentArn: string
  agentName: string
  description: string
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
  status: 'RUNNING' | 'COMPLETE' | 'FAILED' | 'CANCELLED'
  startTime: string
  endTime?: string
  duration?: number
  output?: string
  tasks: Task[]
  metrics?: ExecutionMetrics
}

export interface Task {
  id: string
  taskName: string
  status: 'PENDING' | 'RUNNING' | 'COMPLETE' | 'ERROR'
  startTime: string
  endTime?: string
  duration?: number
  progress: number
  output?: string
  error?: string
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
