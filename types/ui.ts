export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'agent';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  company: string;
  joinDate: string;
}

export interface Agent {
  id: string;
  agentId: string;
  agentName: string;
  foundationModel: string;
  agentStatus: string;
  description?: string;
  instructions?: string;
}

export interface DashboardStats {
  activeAgents: number;
  newAgents: number;
  totalExecutions: number;
  recentExecutions: number;
  avgResponseTime: number;
  responseTimeDelta: string;
  successRate: number;
  successRateDelta: number;
}

export interface AgentConfig {
  agentName: string;
  foundationModel: string;
  instruction: string;
  description: string;
}

export interface Settings {
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  bedrockRoleArn: string;
  enableEmailNotifications: boolean;
  enableSlackNotifications: boolean;
}

export interface Task {
  name: string;
  icon: any;
  status?: string;
}

export interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export interface NavItem {
  name: string;
  icon: any;
}
