# RAJ AI Agent Builder

A personal AWS Bedrock AI Agent management platform with real-time execution monitoring and advanced analytics.

## Features

- 🤖 **Agent Management** - Create, update, and manage AWS Bedrock AI agents
- ⚡ **Real-time Execution** - Stream agent responses with live visualization
- 📊 **Advanced Analytics** - Comprehensive metrics and performance tracking
- 💬 **Chat Interface** - Multi-turn conversations with context retention
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- 🚀 **Production Ready** - Zero-config deployment to Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- AWS Account with Bedrock access
- AWS IAM credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/raj-ai-agent-builder.git
cd raj-ai-agent-builder
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp env.example .env.local
# Edit .env.local with your AWS credentials
```

4. Run development server:
```bash
npm run dev
```

Open http://localhost:3000 to view the application.

## Deployment

### Deploy to Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Import to Vercel:
   - Go to vercel.com
   - Import your GitHub repository
   - Add environment variables from env.example
   - Deploy!

## Environment Variables

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BEDROCK_ROLE_ARN=arn:aws:iam::account:role/BedrockAgentRole
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, AWS SDK
- **Cloud**: AWS Bedrock, Vercel
- **Real-time**: Server-Sent Events (SSE)

## Project Structure

```
raj-ai-agent-builder/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── agents/           # Agent-related components
│   ├── execution/        # Execution monitoring
│   ├── dashboard/        # Dashboard components
│   ├── chat/            # Chat interface
│   └── ui/              # Reusable UI components
├── lib/                  # Utilities and services
│   ├── aws/             # AWS Bedrock integration
│   └── db/              # Local data store
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
└── public/              # Static assets
```

## Features Overview

### Agent Management
- Create and configure AI agents with custom instructions
- Support for multiple foundation models (Claude, Titan)
- Agent status monitoring and lifecycle management
- Favorites and search functionality

### Real-time Execution
- Stream agent responses with live output
- Execution timeline with task progress
- Performance metrics and analytics
- Error handling and recovery

### Dashboard
- Overview metrics and KPIs
- Recent executions and quick actions
- Performance analytics and insights
- Settings and configuration

### Chat Interface
- Multi-turn conversations with context
- Real-time streaming responses
- Message history and persistence
- Stop/start execution controls

## AWS Setup

1. Create an IAM role for Bedrock with the following policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:CreateAgent",
        "bedrock:UpdateAgent",
        "bedrock:DeleteAgent",
        "bedrock:GetAgent",
        "bedrock:ListAgents",
        "bedrock:PrepareAgent",
        "bedrock:InvokeAgent"
      ],
      "Resource": "*"
    }
  ]
}
```

2. Configure your AWS credentials in the environment variables

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

The project follows Next.js 14 app directory structure with:
- Server and client components
- API routes for backend functionality
- TypeScript for type safety
- Tailwind CSS for styling
- Custom hooks for state management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT - Personal use only

## Author

RAJ AI Agent Builder - Built with ❤️ for personal productivity
