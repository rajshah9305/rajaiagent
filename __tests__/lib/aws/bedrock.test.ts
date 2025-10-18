// Mock environment variables before any imports
process.env.AWS_REGION = 'us-east-1'
process.env.AWS_ACCESS_KEY_ID = 'test-key'
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret'
process.env.AWS_BEDROCK_ROLE_ARN = 'arn:aws:iam::123456789012:role/test-role'

// Mock TextEncoder for Node.js environment
global.TextEncoder = class TextEncoder {
  encode(input: string): Uint8Array {
    return new Uint8Array(Buffer.from(input, 'utf8'))
  }
}

// Mock AWS SDK
jest.mock('@aws-sdk/client-bedrock-agent', () => ({
  BedrockAgentClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  CreateAgentCommand: jest.fn(),
  UpdateAgentCommand: jest.fn(),
  DeleteAgentCommand: jest.fn(),
  GetAgentCommand: jest.fn(),
  ListAgentsCommand: jest.fn(),
  PrepareAgentCommand: jest.fn(),
}))

jest.mock('@aws-sdk/client-bedrock-agent-runtime', () => ({
  BedrockAgentRuntimeClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  InvokeAgentCommand: jest.fn(),
}))

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BedrockService } from '@/lib/aws/bedrock'

// Mock the entire bedrock module to avoid AWS config validation
const mockBedrockService = {
  createAgent: jest.fn(),
  updateAgent: jest.fn(),
  deleteAgent: jest.fn(),
  getAgent: jest.fn(),
  listAgents: jest.fn(),
  prepareAgent: jest.fn(),
  invokeAgent: jest.fn(),
  invokeAgentStream: jest.fn(),
}

jest.mock('@/lib/aws/bedrock', () => ({
  BedrockService: jest.fn().mockImplementation(() => mockBedrockService),
  bedrockService: mockBedrockService
}))

describe('BedrockService', () => {
  let bedrockService: BedrockService
  let mockAgentClient: any
  let mockRuntimeClient: any

  beforeEach(() => {
    jest.clearAllMocks()
    bedrockService = mockBedrockService as any
    mockAgentClient = {
      send: jest.fn(),
    }
    mockRuntimeClient = {
      send: jest.fn(),
    }
  })

  describe('createAgent', () => {
    it('should create an agent with valid parameters', async () => {
      const mockResponse = {
        agent: {
          agentId: 'test-agent-id',
          agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/test-agent-id',
          agentStatus: 'PREPARED',
        },
      }

      mockAgentClient.send.mockResolvedValue(mockResponse)

      const params = {
        agentName: 'Test Agent',
        instructions: 'Test instructions',
        foundationModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
        description: 'Test description',
        idleSessionTTL: 600,
      }

      const result = await bedrockService.createAgent(params)

      expect(result).toEqual(mockResponse)
      expect(mockAgentClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            agentName: 'Test Agent',
            instruction: 'Test instructions',
            foundationModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
            description: 'Test description',
            idleSessionTTLInSeconds: 600,
          }),
        })
      )
    })

    it('should handle creation errors', async () => {
      const error = new Error('AWS Error')
      mockAgentClient.send.mockRejectedValue(error)

      const params = {
        agentName: 'Test Agent',
        instructions: 'Test instructions',
        foundationModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
      }

      await expect(bedrockService.createAgent(params)).rejects.toThrow('AWS Error')
    })
  })

  describe('updateAgent', () => {
    it('should update an agent with valid parameters', async () => {
      const mockResponse = { success: true }
      mockAgentClient.send.mockResolvedValue(mockResponse)

      const updates = {
        agentName: 'Updated Agent Name',
        instruction: 'Updated instructions',
      }

      const result = await bedrockService.updateAgent('test-agent-id', updates)

      expect(result).toEqual(mockResponse)
      expect(mockAgentClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            agentId: 'test-agent-id',
            agentName: 'Updated Agent Name',
            instruction: 'Updated instructions',
          }),
        })
      )
    })
  })

  describe('deleteAgent', () => {
    it('should delete an agent', async () => {
      const mockResponse = { success: true }
      mockAgentClient.send.mockResolvedValue(mockResponse)

      const result = await bedrockService.deleteAgent('test-agent-id')

      expect(result).toEqual(mockResponse)
      expect(mockAgentClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { agentId: 'test-agent-id' },
        })
      )
    })
  })

  describe('getAgent', () => {
    it('should retrieve an agent', async () => {
      const mockAgent = {
        agentId: 'test-agent-id',
        agentName: 'Test Agent',
        agentStatus: 'PREPARED',
      }
      mockAgentClient.send.mockResolvedValue({ agent: mockAgent })

      const result = await bedrockService.getAgent('test-agent-id')

      expect(result).toEqual({ agent: mockAgent })
      expect(mockAgentClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { agentId: 'test-agent-id' },
        })
      )
    })
  })

  describe('listAgents', () => {
    it('should list agents with default parameters', async () => {
      const mockResponse = {
        agentSummaries: [
          {
            agentId: 'agent-1',
            agentName: 'Agent 1',
            agentStatus: 'PREPARED',
          },
          {
            agentId: 'agent-2',
            agentName: 'Agent 2',
            agentStatus: 'PREPARED',
          },
        ],
      }
      mockAgentClient.send.mockResolvedValue(mockResponse)

      const result = await bedrockService.listAgents()

      expect(result).toEqual(mockResponse)
      expect(mockAgentClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { maxResults: 20 },
        })
      )
    })

    it('should list agents with custom parameters', async () => {
      const mockResponse = { agentSummaries: [] }
      mockAgentClient.send.mockResolvedValue(mockResponse)

      const result = await bedrockService.listAgents(10, 'next-token')

      expect(result).toEqual(mockResponse)
      expect(mockAgentClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { maxResults: 10, nextToken: 'next-token' },
        })
      )
    })
  })

  describe('prepareAgent', () => {
    it('should prepare an agent', async () => {
      const mockResponse = { success: true }
      mockAgentClient.send.mockResolvedValue(mockResponse)

      const result = await bedrockService.prepareAgent('test-agent-id')

      expect(result).toEqual(mockResponse)
      expect(mockAgentClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { agentId: 'test-agent-id' },
        })
      )
    })
  })

  describe('invokeAgentStream', () => {
    it('should stream agent responses', async () => {
      const mockCompletion = [
        { chunk: { bytes: new TextEncoder().encode('Hello') } },
        { chunk: { bytes: new TextEncoder().encode(' World') } },
      ]

      mockRuntimeClient.send.mockResolvedValue({
        completion: mockCompletion,
      })

      const params = {
        agentId: 'test-agent-id',
        agentAliasId: 'TSTALIASID',
        sessionId: 'test-session',
        inputText: 'Hello',
      }

      const chunks: string[] = []
      for await (const event of bedrockService.invokeAgentStream(params)) {
        if (event.type === 'chunk') {
          chunks.push(event.data)
        }
      }

      expect(chunks).toEqual(['Hello', ' World'])
    })

    it('should handle streaming errors', async () => {
      const error = new Error('Streaming error')
      mockRuntimeClient.send.mockRejectedValue(error)

      const params = {
        agentId: 'test-agent-id',
        agentAliasId: 'TSTALIASID',
        sessionId: 'test-session',
        inputText: 'Hello',
      }

      await expect(async () => {
        for await (const event of bedrockService.invokeAgentStream(params)) {
          // This should throw
        }
      }).rejects.toThrow('Streaming error')
    })
  })
})
