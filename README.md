# RAJ AI Agent Builder

A **production-ready, enterprise-grade** AWS Bedrock AI Agent management platform with real-time execution monitoring, advanced analytics, and a stunning modern UI. Built with Next.js 14, TypeScript, Prisma ORM, and a comprehensive design system.

## 🌟 Key Features

### 🤖 **Advanced Agent Management**
- ✅ Create, update, and manage AWS Bedrock AI agents with full lifecycle support
- ✅ Real-time agent status monitoring and performance tracking
- ✅ Support for multiple foundation models (Claude, Titan, and more)
- ✅ Advanced search, filtering, and favorites system
- ✅ Agent alias creation and management

### ⚡ **Real-time Execution Engine**
- ✅ Stream agent responses with live visualization and progress tracking
- ✅ Execution timeline with detailed task breakdown
- ✅ Performance metrics and comprehensive analytics
- ✅ Error handling, recovery, and retry mechanisms
- ✅ Session management with context retention

### 📊 **Enterprise Analytics Dashboard**
- ✅ Real-time performance metrics and KPIs
- ✅ Agent usage statistics and trends
- ✅ Cost analysis and optimization insights
- ✅ Execution success rates and failure analysis
- ✅ Custom reporting and export capabilities

### 💬 **Modern Chat Interface**
- ✅ Multi-turn conversations with full context retention
- ✅ Real-time streaming responses with typing indicators
- ✅ Message history and conversation management
- ✅ Interactive execution controls (start/stop)
- ✅ Beautiful message bubbles with rich formatting

### 🎨 **Professional UI/UX**
- ✅ **Glass Morphism Design** - Modern translucent containers with backdrop blur
- ✅ **Animated Gradients** - Subtle background effects and hover animations
- ✅ **Dark Mode Support** - Complete theme system with CSS variables
- ✅ **Responsive Design** - Mobile-first approach with touch-friendly interactions
- ✅ **Accessibility** - WCAG compliant with proper ARIA labels

## 🚀 **Instant Deployment**

This project is **100% ready for production deployment** with zero manual configuration required beyond AWS credentials.

### **Deploy to Vercel (Recommended)**
```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy to Vercel (from GitHub)
vercel --prod

# 3. Set environment variables in Vercel dashboard
# Copy from env.example and configure AWS credentials
```

### **Alternative Deployments**
- **Railway** - Zero-config with PostgreSQL support
- **Render** - Full-stack platform with managed database
- **AWS Amplify** - AWS-native deployment
- **DigitalOcean App Platform** - Simple container deployment

## 🛠️ **Quick Start**

### **Prerequisites**
- Node.js 18+
- AWS Account with Bedrock access
- AWS IAM role with Bedrock permissions

### **One-Command Setup**
```bash
# Clone and setup in one command
git clone <repository-url> && cd raj-ai-agent-builder && npm install && cp env.example .env.local

# Edit .env.local with your AWS credentials
# Run database setup and start development server
npm run db:push && npm run dev
```

### **Environment Configuration**
```bash
# Required: AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BEDROCK_ROLE_ARN=arn:aws:iam::account:role/BedrockAgentRole

# Required: Application Settings
NEXT_PUBLIC_APP_NAME=RAJ AI Agent Builder
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (SQLite for dev, PostgreSQL for prod)
DATABASE_URL="file:./dev.db"

# Security
NEXTAUTH_SECRET=your_secure_random_string
NEXTAUTH_URL=http://localhost:3000
```
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### **AWS IAM Role Setup**

Create an IAM role with the following policy for Bedrock access:

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

## ⚙️ **Configuration**

### **Environment Variables**

Create a `.env.local` file with the following variables:

```env
# Required: AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_BEDROCK_ROLE_ARN=arn:aws:iam::your-account:role/BedrockAgentRole

# Required: Application Settings
NEXT_PUBLIC_APP_NAME=RAJ AI Agent Builder
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (SQLite for dev, PostgreSQL for prod)
DATABASE_URL="file:./dev.db"

# Required: Security
NEXTAUTH_SECRET=your-secure-random-string
NEXTAUTH_URL=http://localhost:3000

# Optional: Enable authentication
ENABLE_AUTH=false
```

### **AWS IAM Setup**

1. **Create IAM Role** for Bedrock access with this policy:
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

2. **Enable Bedrock** in your AWS region (us-east-1 recommended)

3. **Configure AWS credentials** in environment variables above

## 🚀 **Production Deployment**

### **Deploy to Vercel (Zero-Config)**

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Deploy from GitHub:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Git Repository"
   - Select your repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables:**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add all variables from `env.example`
   - Replace placeholder values with real AWS credentials

4. **Deploy!** 🚀
   - Vercel will automatically build and deploy
   - Access your live application instantly

### **Alternative Deployment Platforms**

#### **Railway** (PostgreSQL Included)
```bash
# Deploy with built-in PostgreSQL
railway up
```

#### **Render** (Full-Stack Platform)
- Connect GitHub repository to Render
- Auto-deploys on push to main
- Includes managed PostgreSQL database

#### **AWS Amplify** (AWS-Native)
- Connect GitHub repository to Amplify Console
- Automatic deployments with AWS services

#### **DigitalOcean App Platform**
- Simple container deployment
- Connect to managed database service

### **Production Database Setup**

For production deployments, use PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@host:5432/database_name"
```

Run migrations:
```bash
npm run db:migrate
```

**Note:** SQLite works for development but PostgreSQL is recommended for production due to better concurrency and reliability.

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
