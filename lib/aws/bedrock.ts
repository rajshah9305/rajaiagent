import {
  BedrockAgentClient,
  CreateAgentCommand,
  UpdateAgentCommand,
  DeleteAgentCommand,
  GetAgentCommand,
  ListAgentsCommand,
  PrepareAgentCommand,
  CreateAgentAliasCommand,
  ListAgentAliasesCommand,
} from '@aws-sdk/client-bedrock-agent'

import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from '@aws-sdk/client-bedrock-agent-runtime'

// Validate AWS configuration
const validateAWSConfig = () => {
  const required = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.warn(`Missing AWS environment variables: ${missing.join(', ')}. Using mock mode.`)
    return false
  }
  return true
}

// Initialize AWS clients with proper configuration
const initializeClients = () => {
  const hasValidConfig = validateAWSConfig()
  
  if (!hasValidConfig) {
    return {
      agentClient: null,
      runtimeClient: null,
      isMockMode: true
    }
  }
  
  const config = {
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  }

  return {
    agentClient: new BedrockAgentClient(config),
    runtimeClient: new BedrockAgentRuntimeClient(config),
    isMockMode: false
  }
}

const { agentClient, runtimeClient, isMockMode } = initializeClients()

export class BedrockService {
  async createAgent(params: {
    agentName: string
    instructions: string
    foundationModel: string
    description?: string
    idleSessionTTL?: number
  }) {
    try {
      if (isMockMode || !agentClient) {
        // Return mock response for development
        const mockAgentId = `mock-agent-${Date.now()}`
        return {
          agent: {
            agentId: mockAgentId,
            agentArn: `arn:aws:bedrock:us-east-1:123456789012:agent/${mockAgentId}`,
            agentName: params.agentName,
            agentStatus: 'PREPARED',
            instruction: params.instructions,
            foundationModel: params.foundationModel,
            description: params.description,
            idleSessionTTLInSeconds: params.idleSessionTTL || 600,
          }
        }
      }

      const command = new CreateAgentCommand({
        agentName: params.agentName,
        instruction: params.instructions,
        foundationModel: params.foundationModel,
        description: params.description,
        idleSessionTTLInSeconds: params.idleSessionTTL || 600,
        agentResourceRoleArn: process.env.AWS_BEDROCK_ROLE_ARN,
      })
      
      const result = await agentClient.send(command)
      
      // Create a default alias for the agent
      if (result.agent?.agentId) {
        await this.createAgentAlias(result.agent.agentId, 'TSTALIASID')
      }
      
      return result
    } catch (error) {
      console.error('Error creating agent:', error)
      throw new Error(`Failed to create agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async createAgentAlias(agentId: string, aliasName: string = 'TSTALIASID') {
    try {
      if (!agentClient) {
        console.warn('AWS client not available, skipping agent alias creation')
        return
      }

      const command = new CreateAgentAliasCommand({
        agentId,
        agentAliasName: aliasName,
        description: 'Default alias for agent'
      })
      
      return await agentClient.send(command)
    } catch (error) {
      console.error('Error creating agent alias:', error)
      // Don't throw here as the agent was created successfully
    }
  }

  async updateAgent(agentId: string, updates: {
    agentName?: string
    instruction?: string
    description?: string
    foundationModel?: string
    idleSessionTTLInSeconds?: number
  }) {
    try {
      // For now, we'll skip AWS updates and just return success
      // The actual agent data is stored in our database
      console.log('Agent update requested:', { agentId, updates })
      return { success: true }
    } catch (error) {
      console.error('Error updating agent:', error)
      throw new Error(`Failed to update agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async deleteAgent(agentId: string) {
    try {
      if (!agentClient) {
        console.warn('AWS client not available, skipping agent deletion')
        return { success: true }
      }

      const command = new DeleteAgentCommand({ agentId })
      return await agentClient.send(command)
    } catch (error) {
      console.error('Error deleting agent:', error)
      throw new Error(`Failed to delete agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getAgent(agentId: string) {
    try {
      if (!agentClient) {
        throw new Error('AWS client not available')
      }

      const command = new GetAgentCommand({ agentId })
      return await agentClient.send(command)
    } catch (error) {
      console.error('Error getting agent:', error)
      throw new Error(`Failed to get agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async listAgents(maxResults = 20, nextToken?: string) {
    try {
      if (!agentClient) {
        throw new Error('AWS client not available')
      }

      const command = new ListAgentsCommand({ maxResults, nextToken })
      return await agentClient.send(command)
    } catch (error) {
      console.error('Error listing agents:', error)
      throw new Error(`Failed to list agents: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async prepareAgent(agentId: string) {
    try {
      if (!agentClient) {
        throw new Error('AWS client not available')
      }

      const command = new PrepareAgentCommand({ agentId })
      return await agentClient.send(command)
    } catch (error) {
      console.error('Error preparing agent:', error)
      throw new Error(`Failed to prepare agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getAgentAliases(agentId: string) {
    try {
      if (!agentClient) {
        throw new Error('AWS client not available')
      }

      const command = new ListAgentAliasesCommand({ agentId })
      return await agentClient.send(command)
    } catch (error) {
      console.error('Error getting agent aliases:', error)
      throw new Error(`Failed to get agent aliases: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async* invokeAgentStream(params: {
    agentId: string
    agentAliasId: string
    sessionId: string
    inputText: string
  }) {
    try {
      if (isMockMode || !runtimeClient) {
        // Return mock streaming response for development
        const mockResponse = `I understand you've asked: "${params.inputText}". This is a mock response from the AI agent. In a real implementation, this would be processed by AWS Bedrock's foundation models. The agent is configured with the specified instructions and foundation model.`
        
        // Simulate streaming by breaking the response into chunks
        const words = mockResponse.split(' ')
        for (let i = 0; i < words.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50)) // Simulate delay
          yield { type: 'chunk', data: words[i] + (i < words.length - 1 ? ' ' : '') }
        }
        return
      }

      const command = new InvokeAgentCommand({
        agentId: params.agentId,
        agentAliasId: params.agentAliasId,
        sessionId: params.sessionId,
        inputText: params.inputText,
      })
      
      const response = await runtimeClient.send(command)
      
      if (response.completion) {
        for await (const event of response.completion) {
          if (event.chunk?.bytes) {
            const text = new TextDecoder().decode(event.chunk.bytes)
            yield { type: 'chunk', data: text }
          }
        }
      }
    } catch (error) {
      console.error('Error invoking agent stream:', error)
      yield { type: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async invokeAgent(params: {
    agentId: string
    agentAliasId: string
    sessionId: string
    inputText: string
  }) {
    try {
      if (!runtimeClient) {
        throw new Error('AWS runtime client not available')
      }

      const command = new InvokeAgentCommand({
        agentId: params.agentId,
        agentAliasId: params.agentAliasId,
        sessionId: params.sessionId,
        inputText: params.inputText,
      })
      
      return await runtimeClient.send(command)
    } catch (error) {
      console.error('Error invoking agent:', error)
      throw new Error(`Failed to invoke agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const bedrockService = new BedrockService()
