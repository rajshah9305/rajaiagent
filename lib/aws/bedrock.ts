import {
  BedrockAgentClient,
  CreateAgentCommand,
  UpdateAgentCommand,
  DeleteAgentCommand,
  GetAgentCommand,
  ListAgentsCommand,
  PrepareAgentCommand,
} from '@aws-sdk/client-bedrock-agent'

import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from '@aws-sdk/client-bedrock-agent-runtime'

const config = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}

const agentClient = new BedrockAgentClient(config)
const runtimeClient = new BedrockAgentRuntimeClient(config)

export class BedrockService {
  async createAgent(params: {
    agentName: string
    instructions: string
    foundationModel: string
    description?: string
    idleSessionTTL?: number
  }) {
    const command = new CreateAgentCommand({
      agentName: params.agentName,
      instruction: params.instructions,
      foundationModel: params.foundationModel,
      description: params.description,
      idleSessionTTLInSeconds: params.idleSessionTTL || 600,
      agentResourceRoleArn: process.env.AWS_BEDROCK_ROLE_ARN,
    })
    
    return await agentClient.send(command)
  }

  async updateAgent(agentId: string, updates: any) {
    const command = new UpdateAgentCommand({
      agentId,
      ...updates,
    })
    
    return await agentClient.send(command)
  }

  async deleteAgent(agentId: string) {
    const command = new DeleteAgentCommand({ agentId })
    return await agentClient.send(command)
  }

  async getAgent(agentId: string) {
    const command = new GetAgentCommand({ agentId })
    return await agentClient.send(command)
  }

  async listAgents(maxResults = 20, nextToken?: string) {
    const command = new ListAgentsCommand({ maxResults, nextToken })
    return await agentClient.send(command)
  }

  async prepareAgent(agentId: string) {
    const command = new PrepareAgentCommand({ agentId })
    return await agentClient.send(command)
  }

  async* invokeAgentStream(params: {
    agentId: string
    agentAliasId: string
    sessionId: string
    inputText: string
  }) {
    const command = new InvokeAgentCommand(params)
    const response = await runtimeClient.send(command)
    
    if (response.completion) {
      for await (const event of response.completion) {
        if (event.chunk?.bytes) {
          const text = new TextDecoder().decode(event.chunk.bytes)
          yield { type: 'chunk', data: text }
        }
      }
    }
  }
}

export const bedrockService = new BedrockService()
