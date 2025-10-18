import { store } from '@/lib/db/store'
import { Agent, Execution } from '@/types'

describe('LocalStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    store.clear()
  })

  describe('Agent operations', () => {
    const mockAgent: Agent = {
      id: 'agent-1',
      agentId: 'aws-agent-1',
      agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/aws-agent-1',
      agentName: 'Test Agent',
      description: 'Test description',
      instructions: 'Test instructions',
      foundationModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
      idleSessionTTL: 600,
      agentStatus: 'PREPARED',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      tags: ['test'],
      isFavorite: false,
      executionCount: 0,
    }

    it('should save and retrieve agents', () => {
      store.saveAgent(mockAgent)
      
      const retrievedAgent = store.getAgent(mockAgent.id)
      expect(retrievedAgent).toEqual(mockAgent)
    })

    it('should return undefined for non-existent agent', () => {
      const retrievedAgent = store.getAgent('non-existent')
      expect(retrievedAgent).toBeUndefined()
    })

    it('should get all agents', () => {
      const agent1 = { ...mockAgent, id: 'agent-1' }
      const agent2 = { ...mockAgent, id: 'agent-2', agentName: 'Agent 2' }
      
      store.saveAgent(agent1)
      store.saveAgent(agent2)
      
      const agents = store.getAgents()
      expect(agents).toHaveLength(2)
      expect(agents).toContainEqual(agent1)
      expect(agents).toContainEqual(agent2)
    })

    it('should delete agents', () => {
      store.saveAgent(mockAgent)
      expect(store.getAgent(mockAgent.id)).toEqual(mockAgent)
      
      store.deleteAgent(mockAgent.id)
      expect(store.getAgent(mockAgent.id)).toBeUndefined()
    })

    it('should handle deleting non-existent agent', () => {
      // Should not throw error
      expect(() => store.deleteAgent('non-existent')).not.toThrow()
    })

    it('should update existing agent', () => {
      store.saveAgent(mockAgent)
      
      const updatedAgent = { ...mockAgent, agentName: 'Updated Agent' }
      store.saveAgent(updatedAgent)
      
      const retrievedAgent = store.getAgent(mockAgent.id)
      expect(retrievedAgent?.agentName).toBe('Updated Agent')
    })
  })

  describe('Execution operations', () => {
    const mockExecution: Execution = {
      id: 'execution-1',
      agentId: 'agent-1',
      sessionId: 'session-1',
      input: 'Test input',
      status: 'RUNNING',
      startTime: '2024-01-01T00:00:00Z',
      tasks: [],
      metrics: {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        runningTasks: 1,
        averageTaskDuration: 0,
        totalDuration: 0,
        throughput: 0,
        successRate: 0,
      },
    }

    it('should save and retrieve executions', () => {
      store.saveExecution(mockExecution)
      
      const retrievedExecution = store.getExecution(mockExecution.id)
      expect(retrievedExecution).toEqual(mockExecution)
    })

    it('should return undefined for non-existent execution', () => {
      const retrievedExecution = store.getExecution('non-existent')
      expect(retrievedExecution).toBeUndefined()
    })

    it('should get all executions', () => {
      const execution1 = { ...mockExecution, id: 'execution-1' }
      const execution2 = { ...mockExecution, id: 'execution-2', status: 'COMPLETE' as const }
      
      store.saveExecution(execution1)
      store.saveExecution(execution2)
      
      const executions = store.getExecutions()
      expect(executions).toHaveLength(2)
      expect(executions).toContainEqual(execution1)
      expect(executions).toContainEqual(execution2)
    })

    it('should get executions by agent', () => {
      const execution1 = { ...mockExecution, id: 'execution-1', agentId: 'agent-1' }
      const execution2 = { ...mockExecution, id: 'execution-2', agentId: 'agent-2' }
      const execution3 = { ...mockExecution, id: 'execution-3', agentId: 'agent-1' }
      
      store.saveExecution(execution1)
      store.saveExecution(execution2)
      store.saveExecution(execution3)
      
      const agent1Executions = store.getExecutionsByAgent('agent-1')
      expect(agent1Executions).toHaveLength(2)
      expect(agent1Executions).toContainEqual(execution1)
      expect(agent1Executions).toContainEqual(execution3)
      
      const agent2Executions = store.getExecutionsByAgent('agent-2')
      expect(agent2Executions).toHaveLength(1)
      expect(agent2Executions).toContainEqual(execution2)
    })

    it('should return empty array for non-existent agent executions', () => {
      const executions = store.getExecutionsByAgent('non-existent')
      expect(executions).toEqual([])
    })

    it('should update existing execution', () => {
      store.saveExecution(mockExecution)
      
      const updatedExecution = { ...mockExecution, status: 'COMPLETE' as const }
      store.saveExecution(updatedExecution)
      
      const retrievedExecution = store.getExecution(mockExecution.id)
      expect(retrievedExecution?.status).toBe('COMPLETE')
    })
  })

  describe('Data persistence', () => {
    it('should maintain data across operations', () => {
      const agent: Agent = {
        id: 'agent-1',
        agentId: 'aws-agent-1',
        agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/aws-agent-1',
        agentName: 'Test Agent',
        description: 'Test description',
        instructions: 'Test instructions',
        foundationModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
        idleSessionTTL: 600,
        agentStatus: 'PREPARED',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: ['test'],
        isFavorite: false,
        executionCount: 0,
      }

      const execution: Execution = {
        id: 'execution-1',
        agentId: 'agent-1',
        sessionId: 'session-1',
        input: 'Test input',
        status: 'RUNNING',
        startTime: '2024-01-01T00:00:00Z',
        tasks: [],
        metrics: {
          totalTasks: 0,
          completedTasks: 0,
          failedTasks: 0,
          runningTasks: 1,
          averageTaskDuration: 0,
          totalDuration: 0,
          throughput: 0,
          successRate: 0,
        },
      }

      // Save both agent and execution
      store.saveAgent(agent)
      store.saveExecution(execution)

      // Verify both are stored
      expect(store.getAgent(agent.id)).toEqual(agent)
      expect(store.getExecution(execution.id)).toEqual(execution)

      // Verify execution is linked to agent
      const agentExecutions = store.getExecutionsByAgent(agent.id)
      expect(agentExecutions).toContainEqual(execution)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty data', () => {
      expect(store.getAgents()).toEqual([])
      expect(store.getExecutions()).toEqual([])
    })

    it('should handle null/undefined values gracefully', () => {
      // These should not throw errors
      expect(() => store.getAgent('')).not.toThrow()
      expect(() => store.getExecution('')).not.toThrow()
      expect(() => store.getExecutionsByAgent('')).not.toThrow()
    })

    it('should handle large datasets', () => {
      // Create multiple agents and executions
      const agents: Agent[] = []
      const executions: Execution[] = []

      for (let i = 0; i < 100; i++) {
        const agent: Agent = {
          id: `agent-${i}`,
          agentId: `aws-agent-${i}`,
          agentArn: `arn:aws:bedrock:us-east-1:123456789012:agent/aws-agent-${i}`,
          agentName: `Agent ${i}`,
          description: `Description ${i}`,
          instructions: `Instructions ${i}`,
          foundationModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
          idleSessionTTL: 600,
          agentStatus: 'PREPARED',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          tags: [`tag-${i}`],
          isFavorite: false,
          executionCount: 0,
        }

        const execution: Execution = {
          id: `execution-${i}`,
          agentId: `agent-${i}`,
          sessionId: `session-${i}`,
          input: `Input ${i}`,
          status: 'RUNNING',
          startTime: '2024-01-01T00:00:00Z',
          tasks: [],
          metrics: {
            totalTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            runningTasks: 1,
            averageTaskDuration: 0,
            totalDuration: 0,
            throughput: 0,
            successRate: 0,
          },
        }

        agents.push(agent)
        executions.push(execution)
      }

      // Save all agents and executions
      agents.forEach(agent => store.saveAgent(agent))
      executions.forEach(execution => store.saveExecution(execution))

      // Verify all are stored
      expect(store.getAgents()).toHaveLength(100)
      expect(store.getExecutions()).toHaveLength(100)

      // Verify specific items can be retrieved
      expect(store.getAgent('agent-50')).toBeDefined()
      expect(store.getExecution('execution-50')).toBeDefined()
      expect(store.getExecutionsByAgent('agent-50')).toHaveLength(1)
    })
  })
})
