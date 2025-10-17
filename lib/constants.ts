export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'RAJ AI Agent Builder'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const FOUNDATION_MODELS = [
  'anthropic.claude-3-sonnet-20240229-v1:0',
  'anthropic.claude-3-haiku-20240307-v1:0',
  'anthropic.claude-3-opus-20240229-v1:0',
  'amazon.titan-text-express-v1',
  'amazon.titan-text-lite-v1',
  'amazon.titan-embed-text-v1',
]

export const AGENT_STATUS_COLORS = {
  'CREATING': 'bg-yellow-100 text-yellow-800',
  'PREPARED': 'bg-green-100 text-green-800',
  'FAILED': 'bg-red-100 text-red-800',
  'UPDATING': 'bg-blue-100 text-blue-800',
  'DELETING': 'bg-gray-100 text-gray-800',
} as const

export const EXECUTION_STATUS_COLORS = {
  'RUNNING': 'bg-blue-100 text-blue-800',
  'COMPLETE': 'bg-green-100 text-green-800',
  'FAILED': 'bg-red-100 text-red-800',
  'CANCELLED': 'bg-gray-100 text-gray-800',
} as const

export const TASK_STATUS_COLORS = {
  'PENDING': 'bg-gray-100 text-gray-800',
  'RUNNING': 'bg-blue-100 text-blue-800',
  'COMPLETE': 'bg-green-100 text-green-800',
  'ERROR': 'bg-red-100 text-red-800',
} as const
