import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample agents
  const agents = await Promise.all([
    prisma.agent.upsert({
      where: { agentId: 'sample-agent-1' },
      update: {},
      create: {
        agentId: 'sample-agent-1',
        agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/sample-agent-1',
        agentName: 'Customer Support Agent',
        description: 'A helpful customer support agent that can answer questions about products and services',
        instructions: 'You are a helpful customer support agent. Always be polite, professional, and try to solve customer issues quickly and effectively. If you cannot solve an issue, escalate it to a human agent.',
        foundationModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
        idleSessionTTL: 600,
        agentStatus: 'PREPARED',
        tags: JSON.stringify(['customer-support', 'help-desk', 'automation']),
        isFavorite: true,
        executionCount: 15,
        lastExecutionTime: new Date(),
      },
    }),
    prisma.agent.upsert({
      where: { agentId: 'sample-agent-2' },
      update: {},
      create: {
        agentId: 'sample-agent-2',
        agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/sample-agent-2',
        agentName: 'Code Review Assistant',
        description: 'An AI agent that helps review code and provides suggestions for improvements',
        instructions: 'You are a code review assistant. Analyze the provided code for bugs, security issues, performance problems, and best practices. Provide constructive feedback and suggestions for improvement.',
        foundationModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
        idleSessionTTL: 900,
        agentStatus: 'PREPARED',
        tags: JSON.stringify(['code-review', 'development', 'quality-assurance']),
        isFavorite: false,
        executionCount: 8,
        lastExecutionTime: new Date(Date.now() - 86400000), // 1 day ago
      },
    }),
    prisma.agent.upsert({
      where: { agentId: 'sample-agent-3' },
      update: {},
      create: {
        agentId: 'sample-agent-3',
        agentArn: 'arn:aws:bedrock:us-east-1:123456789012:agent/sample-agent-3',
        agentName: 'Content Writer',
        description: 'An AI agent that helps create engaging content for blogs, social media, and marketing materials',
        instructions: 'You are a content writer. Create engaging, well-structured content that is appropriate for the target audience. Focus on clarity, readability, and value for the reader.',
        foundationModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
        idleSessionTTL: 1200,
        agentStatus: 'PREPARED',
        tags: JSON.stringify(['content-writing', 'marketing', 'blog']),
        isFavorite: true,
        executionCount: 23,
        lastExecutionTime: new Date(Date.now() - 3600000), // 1 hour ago
      },
    }),
  ])

  console.log(`✅ Created ${agents.length} sample agents`)

  // Create sample executions
  const executions = await Promise.all([
    prisma.execution.create({
      data: {
        agentId: agents[0].id,
        sessionId: 'session-1',
        input: 'I need help with my order that was supposed to arrive yesterday',
        status: 'COMPLETE',
        startTime: new Date(Date.now() - 7200000), // 2 hours ago
        endTime: new Date(Date.now() - 7140000), // 1 hour 59 minutes ago
        duration: 60000, // 1 minute
        output: 'I apologize for the delay with your order. Let me check the status and provide you with an update. Based on our records, your order is currently in transit and should arrive within the next business day. I\'ve also sent you a tracking number via email.',
        tasks: {
          create: [
            {
              taskName: 'Check Order Status',
              status: 'COMPLETE',
              startTime: new Date(Date.now() - 7200000),
              endTime: new Date(Date.now() - 7180000),
              duration: 20000,
              progress: 100,
              output: 'Order found in transit system',
            },
            {
              taskName: 'Send Tracking Info',
              status: 'COMPLETE',
              startTime: new Date(Date.now() - 7180000),
              endTime: new Date(Date.now() - 7140000),
              duration: 40000,
              progress: 100,
              output: 'Tracking information sent to customer email',
            },
          ],
        },
        metrics: {
          create: {
            totalTasks: 2,
            completedTasks: 2,
            failedTasks: 0,
            runningTasks: 0,
            averageTaskDuration: 30000,
            totalDuration: 60000,
            throughput: 2.0,
            successRate: 100.0,
          },
        },
      },
    }),
    prisma.execution.create({
      data: {
        agentId: agents[1].id,
        sessionId: 'session-2',
        input: 'Please review this JavaScript function for potential issues',
        status: 'COMPLETE',
        startTime: new Date(Date.now() - 86400000), // 1 day ago
        endTime: new Date(Date.now() - 86340000), // 1 day ago + 10 minutes
        duration: 600000, // 10 minutes
        output: 'I\'ve reviewed your JavaScript function. Here are the main issues I found: 1) Missing error handling for the API call, 2) Potential memory leak with the event listener, 3) Consider using async/await instead of promises for better readability. Overall, the function works but needs these improvements for production use.',
        tasks: {
          create: [
            {
              taskName: 'Analyze Code Structure',
              status: 'COMPLETE',
              startTime: new Date(Date.now() - 86400000),
              endTime: new Date(Date.now() - 86370000),
              duration: 300000,
              progress: 100,
              output: 'Code structure analyzed',
            },
            {
              taskName: 'Identify Issues',
              status: 'COMPLETE',
              startTime: new Date(Date.now() - 86370000),
              endTime: new Date(Date.now() - 86340000),
              duration: 300000,
              progress: 100,
              output: 'Issues identified and documented',
            },
          ],
        },
        metrics: {
          create: {
            totalTasks: 2,
            completedTasks: 2,
            failedTasks: 0,
            runningTasks: 0,
            averageTaskDuration: 300000,
            totalDuration: 600000,
            throughput: 0.2,
            successRate: 100.0,
          },
        },
      },
    }),
    prisma.execution.create({
      data: {
        agentId: agents[2].id,
        sessionId: 'session-3',
        input: 'Write a blog post about the benefits of AI in healthcare',
        status: 'COMPLETE',
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        endTime: new Date(Date.now() - 3300000), // 30 minutes ago
        duration: 300000, // 5 minutes
        output: 'I\'ve created a comprehensive blog post about AI in healthcare. The post covers key benefits including improved diagnostics, personalized treatment plans, drug discovery acceleration, and enhanced patient care. It includes statistics, real-world examples, and addresses common concerns about AI implementation in healthcare.',
        tasks: {
          create: [
            {
              taskName: 'Research Topic',
              status: 'COMPLETE',
              startTime: new Date(Date.now() - 3600000),
              endTime: new Date(Date.now() - 3450000),
              duration: 150000,
              progress: 100,
              output: 'Topic research completed',
            },
            {
              taskName: 'Write Content',
              status: 'COMPLETE',
              startTime: new Date(Date.now() - 3450000),
              endTime: new Date(Date.now() - 3300000),
              duration: 150000,
              progress: 100,
              output: 'Blog post written and formatted',
            },
          ],
        },
        metrics: {
          create: {
            totalTasks: 2,
            completedTasks: 2,
            failedTasks: 0,
            runningTasks: 0,
            averageTaskDuration: 150000,
            totalDuration: 300000,
            throughput: 0.4,
            successRate: 100.0,
          },
        },
      },
    }),
  ])

  console.log(`✅ Created ${executions.length} sample executions`)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
