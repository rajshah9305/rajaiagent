# RAJ AI Agent Builder

A production-ready AWS Bedrock AI Agent management platform with real-time execution monitoring, advanced analytics, and a beautiful modern UI. Built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## ✨ Features

- 🤖 **Agent Management** - Create, update, and manage AWS Bedrock AI agents
- ⚡ **Real-time Execution** - Stream agent responses with live visualization
- 📊 **Advanced Analytics** - Comprehensive metrics and performance tracking
- 💬 **Chat Interface** - Multi-turn conversations with context retention
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- 🚀 **Production Ready** - Zero-config deployment to Vercel
- 🔒 **Type Safety** - Full TypeScript implementation with Prisma ORM
- 📱 **Responsive** - Mobile-first design with excellent accessibility
- 🛡️ **Error Handling** - Comprehensive error boundaries and validation
- 🔄 **Real-time Updates** - Server-Sent Events for live streaming

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- AWS Account with Bedrock access
- AWS IAM credentials with proper permissions

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/raj-ai-agent-builder.git
cd raj-ai-agent-builder
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp env.example .env.local
# Edit .env.local with your AWS credentials
```

4. **Set up the database:**
```bash
npm run db:push
```

5. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_BEDROCK_ROLE_ARN=arn:aws:iam::your-account:role/BedrockAgentRole

# Application Configuration
NEXT_PUBLIC_APP_NAME=RAJ AI Agent Builder
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="file:./dev.db"

# Security
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Optional: Enable authentication
ENABLE_AUTH=false
```

### AWS Setup

1. **Create an IAM role for Bedrock** with the following policy:
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
        "bedrock:InvokeAgent",
        "bedrock:CreateAgentAlias",
        "bedrock:ListAgentAliases"
      ],
      "Resource": "*"
    }
  ]
}
```

2. **Configure your AWS credentials** in the environment variables

3. **Ensure Bedrock is enabled** in your AWS region

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `env.example`
   - Deploy!

### Deploy to Other Platforms

The application is built with standard Next.js and can be deployed to:
- **Railway** - Zero-config deployment with PostgreSQL
- **Render** - Full-stack platform with database
- **AWS Amplify** - AWS-native deployment
- **DigitalOcean App Platform** - Simple deployment

### Production Database

For production, replace the SQLite database with PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/raj_agent_builder"
```

Then run:
```bash
npm run db:migrate
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

### Project Structure

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
│   └── db/              # Database services
├── prisma/               # Database schema and migrations
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
└── public/              # Static assets
```

### Code Architecture

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Backend**: Next.js API Routes with AWS SDK v3
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Styling**: Tailwind CSS with custom design system
- **Real-time**: Server-Sent Events for streaming
- **State Management**: React hooks with SWR for data fetching
- **Error Handling**: Error boundaries and comprehensive validation

## 📊 Features Overview

### Agent Management
- Create and configure AI agents with custom instructions
- Support for multiple foundation models (Claude, Titan)
- Agent status monitoring and lifecycle management
- Favorites and search functionality
- Real-time agent updates

### Real-time Execution
- Stream agent responses with live output
- Execution timeline with task progress
- Performance metrics and analytics
- Error handling and recovery
- Session management

### Dashboard
- Overview metrics and KPIs
- Recent executions and quick actions
- Performance analytics and insights
- Settings and configuration
- Real-time updates

### Chat Interface
- Multi-turn conversations with context
- Real-time streaming responses
- Message history and persistence
- Stop/start execution controls
- Beautiful message bubbles

## 🔒 Security

- Environment variable validation
- Input sanitization and validation
- CORS configuration
- Error boundary protection
- Type-safe database operations
- Secure AWS credential handling

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

- Next.js 14 optimizations
- Code splitting and lazy loading
- Image optimization
- Database query optimization
- Caching with SWR
- Server-side rendering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/raj-ai-agent-builder/issues) page
2. Create a new issue with detailed information
3. Contact support at [your-email@example.com](mailto:your-email@example.com)

## 🙏 Acknowledgments

- AWS Bedrock for AI agent capabilities
- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Tailwind CSS for the utility-first styling
- Vercel for seamless deployment

---

**Built with ❤️ for personal productivity and AI agent management**
