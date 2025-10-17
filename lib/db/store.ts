import { Agent, Execution } from '@/types'

class LocalStore {
  private agents: Map<string, Agent> = new Map()
  private executions: Map<string, Execution> = new Map()

  // Agents
  getAgents(): Agent[] {
    return Array.from(this.agents.values())
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id)
  }

  saveAgent(agent: Agent): void {
    this.agents.set(agent.id, agent)
  }

  deleteAgent(id: string): void {
    this.agents.delete(id)
  }

  // Executions
  getExecutions(): Execution[] {
    return Array.from(this.executions.values())
  }

  getExecution(id: string): Execution | undefined {
    return this.executions.get(id)
  }

  saveExecution(execution: Execution): void {
    this.executions.set(execution.id, execution)
  }

  getExecutionsByAgent(agentId: string): Execution[] {
    return Array.from(this.executions.values()).filter(e => e.agentId === agentId)
  }
}

export const store = new LocalStore()
