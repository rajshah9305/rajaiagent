# Production Setup Guide

This guide covers the production-ready features and setup for the Raj Agent platform.

## 🚀 Features Added

### 1. Agent Tools System
- **Built-in Tools**: Data Analysis, Web Scraping, Email, File Processing, API Integration
- **Tool Management**: Add, configure, and manage tools for agents
- **Tool Execution**: Real-time tool execution with progress tracking
- **Tool Categories**: Organized by data, communication, automation, analysis, integration

### 2. Task Delegation System
- **Task Creation**: Delegate complex tasks to agents with tools
- **Parallel Execution**: Tools execute in parallel for better performance
- **Progress Tracking**: Real-time task progress and status updates
- **Dependency Management**: Handle task dependencies and priorities

### 3. Advanced Analytics
- **Real-time Metrics**: Live system status and performance metrics
- **Agent Performance**: Detailed analytics for each agent
- **Tool Usage**: Track tool usage and performance
- **Time Series Data**: Historical performance trends
- **Cost Tracking**: Monitor execution costs and usage

### 4. Production-Ready Features
- **Error Handling**: Comprehensive error management with logging
- **Rate Limiting**: Protect APIs from abuse with configurable limits
- **Health Monitoring**: System health checks and monitoring
- **Security**: CORS, security headers, and API key authentication
- **Performance**: Compression, caching, and optimization

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- SQLite (or PostgreSQL for production)
- AWS Account with Bedrock access
- Redis (optional, for distributed rate limiting)

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="file:./dev.db"

# AWS Bedrock
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_BEDROCK_ROLE_ARN="arn:aws:iam::account:role/bedrock-role"

# Security
API_KEYS_ENABLED="true"
API_KEYS_REQUIRED="false"
CORS_ORIGINS="http://localhost:3000,https://yourdomain.com"

# Rate Limiting
RATE_LIMITING_ENABLED="true"
REDIS_ENABLED="false"
RATE_LIMIT_MAX_KEYS="10000"

# Monitoring
HEALTH_CHECK_ENABLED="true"
METRICS_ENABLED="true"
ERROR_LOGGING_ENABLED="true"

# Features
TOOLS_ENABLED="true"
ANALYTICS_ENABLED="true"
TASK_DELEGATION_ENABLED="true"

# Performance
COMPRESSION_ENABLED="true"
CACHING_ENABLED="true"
REQUEST_TIMEOUT="30000"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database (optional)
npx prisma db seed
```

### 3. Development Server

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 API Endpoints

### Tools Management
- `GET /api/tools` - List all available tools
- `POST /api/tools` - Execute a tool
- `GET /api/tools/[name]` - Get specific tool details
- `POST /api/tools/[name]` - Execute specific tool

### Agent Tools
- `GET /api/agents/[id]/tools` - Get agent's tools
- `POST /api/agents/[id]/tools` - Add tool to agent
- `PUT /api/agents/[id]/tools/[toolId]` - Update agent tool
- `DELETE /api/agents/[id]/tools/[toolId]` - Remove tool from agent

### Task Delegation
- `POST /api/tasks/delegate` - Delegate task to agent
- `GET /api/tasks/[id]` - Get task status
- `GET /api/agents/[id]/tasks` - Get agent's tasks

### Analytics
- `GET /api/analytics/metrics` - Get overall metrics
- `GET /api/analytics/timeseries` - Get time series data
- `GET /api/analytics/agents` - Get agent performance
- `GET /api/analytics/tools` - Get tool usage
- `GET /api/analytics/realtime` - Get real-time metrics

### Health & Monitoring
- `GET /api/health` - Basic health check
- `GET /api/health?detailed=true` - Detailed system metrics

## 🔧 Configuration

### Rate Limiting
Configure rate limits for different endpoints:

```typescript
// Example: Apply rate limiting to agent execution
export const POST = withRateLimit(rateLimitConfigs.agentExecution)(handler)
```

### Error Handling
Wrap handlers with error handling:

```typescript
// Example: Error handling middleware
export const GET = withErrorHandling(handler)
```

### Security Headers
Configure security headers in `next.config.js`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

## 🚀 Deployment

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t rajagenter .
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Environment Variables for Production

Set these in your production environment:

```bash
# Required
DATABASE_URL="postgresql://user:password@host:port/database"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"

# Optional but recommended
REDIS_URL="redis://your-redis-host:6379"
SENTRY_DSN="your-sentry-dsn"
LOG_LEVEL="info"
NODE_ENV="production"
```

## 📈 Monitoring & Observability

### Health Checks
- Basic health: `GET /api/health`
- Detailed metrics: `GET /api/health?detailed=true`

### Metrics
- System uptime and performance
- Database connection status
- AWS Bedrock service status
- Memory usage and error rates
- Rate limiting statistics

### Logging
- Structured JSON logging
- Error tracking and alerting
- Request/response logging
- Performance metrics

## 🔒 Security Features

### Rate Limiting
- Per-IP rate limiting
- Per-user rate limiting
- Configurable limits per endpoint
- Redis support for distributed systems

### Error Handling
- Sanitized error messages in production
- Request ID tracking
- Error categorization and logging
- External logging service integration

### Security Headers
- CORS configuration
- HSTS support
- Content Security Policy
- X-Frame-Options and other security headers

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suites
npm test -- --testPathPattern=tools
npm test -- --testPathPattern=errorHandling
npm test -- --testPathPattern=rateLimiting
```

### Test Coverage
- Unit tests for all core functionality
- Integration tests for API endpoints
- Error handling and edge cases
- Rate limiting and security features

## 📚 Usage Examples

### Adding Tools to an Agent
```typescript
// Add a tool to an agent
const response = await fetch(`/api/agents/${agentId}/tools`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    toolId: 'data_analysis',
    isEnabled: true,
    priority: 1,
    config: { analysisType: 'detailed' }
  })
})
```

### Delegating a Task
```typescript
// Delegate a task to an agent
const response = await fetch('/api/tasks/delegate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentId: 'agent-123',
    taskName: 'Analyze Data',
    description: 'Analyze customer data for insights',
    priority: 5,
    input: { data: customerData },
    tools: ['data_analysis', 'web_scraping']
  })
})
```

### Executing a Tool
```typescript
// Execute a tool directly
const response = await fetch('/api/tools/data_analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: {
      data: [{ name: 'John', age: 30 }],
      analysisType: 'summary'
    }
  })
})
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check `DATABASE_URL` environment variable
   - Ensure database is running and accessible
   - Run `npx prisma migrate deploy`

2. **AWS Bedrock Errors**
   - Verify AWS credentials and permissions
   - Check `AWS_REGION` and `AWS_BEDROCK_ROLE_ARN`
   - Ensure Bedrock service is available in your region

3. **Rate Limiting Issues**
   - Check rate limit configuration
   - Verify Redis connection if using distributed rate limiting
   - Monitor rate limit headers in responses

4. **Tool Execution Failures**
   - Check tool configuration and permissions
   - Verify input validation
   - Monitor error logs for detailed information

### Debug Mode
Enable debug logging by setting:
```bash
LOG_LEVEL="debug"
NODE_ENV="development"
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review error logs and health check endpoints
3. Check GitHub issues
4. Contact the development team

## 🔄 Updates

To update the system:
1. Pull latest changes
2. Run `npm install` to update dependencies
3. Run `npx prisma migrate deploy` for database updates
4. Restart the application
5. Verify health check endpoints

---

This production setup provides a robust, scalable, and secure platform for AI agent management with comprehensive tooling and analytics capabilities.
