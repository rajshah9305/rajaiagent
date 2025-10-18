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
  const required = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BEDROCK_ROLE_ARN']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required AWS environment variables: ${missing.join(', ')}`)
  }
}

// Initialize AWS clients with proper configuration
const initializeClients = () => {
  validateAWSConfig()
  
  const config = {
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  }

  return {
    agentClient: new BedrockAgentClient(config),
    runtimeClient: new BedrockAgentRuntimeClient(config)
  }
}

const { agentClient, runtimeClient } = initializeClients()

export class BedrockService {
  async createAgent(params: {
    agentName: string
    instructions: string
    foundationModel: string
    description?: string
    idleSessionTTL?: number
  }) {
    try {
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
      const command = new DeleteAgentCommand({ agentId })
      return await agentClient.send(command)
    } catch (error) {
      console.error('Error deleting agent:', error)
      throw new Error(`Failed to delete agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getAgent(agentId: string) {
    try {
      const command = new GetAgentCommand({ agentId })
      return await agentClient.send(command)
    } catch (error) {
      console.error('Error getting agent:', error)
      throw new Error(`Failed to get agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async listAgents(maxResults = 20, nextToken?: string) {
    try {
      const command = new ListAgentsCommand({ maxResults, nextToken })
      return await agentClient.send(command)
    } catch (error) {
      console.error('Error listing agents:', error)
      throw new Error(`Failed to list agents: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async prepareAgent(agentId: string) {
    try {
      const command = new PrepareAgentCommand({ agentId })
      return await agentClient.send(command)
    } catch (error) {
      console.error('Error preparing agent:', error)
      throw new Error(`Failed to prepare agent: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getAgentAliases(agentId: string) {
    try {
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
