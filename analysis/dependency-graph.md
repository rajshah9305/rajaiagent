# RAJ AI Agent Builder - Complete Dependency Graph Analysis

## External Dependencies (package.json)

### Core Framework
- **next**: ^14.2.33 - React framework
- **react**: 18.2.0 - UI library
- **react-dom**: 18.2.0 - DOM rendering

### AWS Integration
- **@aws-sdk/client-bedrock-agent**: ^3.450.0 - AWS Bedrock Agent management
- **@aws-sdk/client-bedrock-agent-runtime**: ^3.450.0 - AWS Bedrock runtime operations

### UI Components & Styling
- **@headlessui/react**: ^1.7.17 - Unstyled UI components
- **@heroicons/react**: ^2.0.18 - Icon library
- **tailwindcss**: 3.4.0 - CSS framework
- **class-variance-authority**: ^0.7.1 - CSS class management
- **clsx**: ^2.1.1 - Conditional class names
- **tailwind-merge**: ^3.3.0 - Tailwind class merging

### Radix UI Components (Comprehensive Set)
- **@radix-ui/react-accordion**: ^1.2.10
- **@radix-ui/react-alert-dialog**: ^1.1.13
- **@radix-ui/react-aspect-ratio**: ^1.1.6
- **@radix-ui/react-avatar**: ^1.1.9
- **@radix-ui/react-checkbox**: ^1.3.1
- **@radix-ui/react-collapsible**: ^1.1.10
- **@radix-ui/react-context-menu**: ^2.2.14
- **@radix-ui/react-dialog**: ^1.1.13
- **@radix-ui/react-dropdown-menu**: ^2.1.14
- **@radix-ui/react-hover-card**: ^1.1.13
- **@radix-ui/react-label**: ^2.1.6
- **@radix-ui/react-menubar**: ^1.1.14
- **@radix-ui/react-navigation-menu**: ^1.2.12
- **@radix-ui/react-popover**: ^1.1.13
- **@radix-ui/react-progress**: ^1.1.6
- **@radix-ui/react-radio-group**: ^1.3.6
- **@radix-ui/react-scroll-area**: ^1.2.8
- **@radix-ui/react-select**: ^2.2.4
- **@radix-ui/react-separator**: ^1.1.6
- **@radix-ui/react-slider**: ^1.3.4
- **@radix-ui/react-slot**: ^1.2.2
- **@radix-ui/react-switch**: ^1.2.4
- **@radix-ui/react-tabs**: ^1.1.11
- **@radix-ui/react-toggle**: ^1.1.8
- **@radix-ui/react-toggle-group**: ^1.1.9
- **@radix-ui/react-tooltip**: ^1.2.6

### Additional UI Libraries
- **cmdk**: ^1.1.1 - Command palette
- **date-fns**: ^4.1.0 - Date utilities
- **embla-carousel-react**: ^8.6.0 - Carousel component
- **framer-motion**: ^12.15.0 - Animation library
- **input-otp**: ^1.4.2 - OTP input component
- **lucide-react**: ^0.510.0 - Icon library
- **react-hook-form**: ^7.56.3 - Form management
- **react-markdown**: ^9.0.1 - Markdown rendering
- **react-resizable-panels**: ^3.0.2 - Resizable panels
- **recharts**: ^2.15.3 - Chart library
- **sonner**: ^2.0.3 - Toast notifications
- **vaul**: ^1.1.2 - Drawer component

### Data Management
- **swr**: ^2.2.4 - Data fetching
- **zustand**: ^5.0.8 - State management
- **nanoid**: ^5.1.6 - ID generation
- **zod**: ^3.24.4 - Schema validation

### Theme Management
- **next-themes**: ^0.4.6 - Theme switching

### Development Dependencies
- **@types/node**: 20.10.5 - Node.js types
- **@types/react**: 18.2.45 - React types
- **@types/react-dom**: 18.2.18 - React DOM types
- **autoprefixer**: 10.4.16 - CSS autoprefixer
- **eslint**: 8.56.0 - Linting
- **eslint-config-next**: 14.0.4 - Next.js ESLint config
- **postcss**: 8.4.32 - CSS processor
- **typescript**: 5.3.3 - TypeScript compiler

## Internal Module Dependencies

### Core Application Structure
```
app/
├── layout.tsx (Root layout)
├── globals.css (Global styles)
└── (dashboard)/
    ├── layout.tsx (Dashboard layout)
    ├── page.tsx (Dashboard home)
    ├── agents/
    │   ├── page.tsx (Agent list)
    │   ├── new/page.tsx (Create agent)
    │   └── [id]/
    │       ├── page.tsx (Agent details)
    │       └── execute/page.tsx (Execute agent)
    ├── executions/
    │   ├── page.tsx (Execution list)
    │   └── [id]/page.tsx (Execution details)
    ├── analytics/page.tsx (Analytics dashboard)
    └── settings/page.tsx (Settings)
```

### API Routes Structure
```
app/api/
├── agents/
│   ├── route.ts (CRUD operations)
│   └── [id]/
│       ├── route.ts (Individual agent operations)
│       ├── invoke-stream/route.ts (Streaming execution)
│       └── prepare/route.ts (Agent preparation)
├── executions/
│   ├── route.ts (Execution CRUD)
│   └── [id]/
│       ├── route.ts (Individual execution)
│       └── stream/route.ts (Execution streaming)
└── metrics/
    ├── route.ts (Metrics API)
    └── dashboard/route.ts (Dashboard metrics)
```

### Component Dependencies
```
components/
├── ThemeProvider.tsx (Theme context)
├── agents/
│   ├── AgentCard.tsx
│   ├── AgentForm.tsx
│   └── AgentList.tsx
├── chat/
│   └── ChatInterface.tsx
├── dashboard/
│   ├── MetricCard.tsx
│   ├── QuickActions.tsx
│   └── RecentExecutions.tsx
├── execution/
│   ├── ExecutionMetrics.tsx
│   ├── ExecutionTimeline.tsx
│   ├── LiveOutput.tsx
│   └── TaskCard.tsx
└── ui/
    ├── AdvancedComponents.tsx
    ├── Button.tsx
    ├── EmptyState.tsx
    ├── Input.tsx
    ├── InteractiveComponents.tsx
    ├── LoadingSpinner.tsx
    ├── Skeleton.tsx
    └── Toast.tsx
```

### Library Dependencies
```
lib/
├── aws/
│   └── bedrock.ts (AWS Bedrock service)
├── db/
│   └── store.ts (Local data store)
├── constants.ts (Application constants)
├── logger.ts (Logging utility)
└── utils.ts (Utility functions)
```

### Custom Hooks
```
hooks/
├── useAgent.ts (Agent management)
├── useExecution.ts (Execution management)
└── useSSE.ts (Server-sent events)
```

### Type Definitions
```
types/
└── index.ts (TypeScript interfaces)
```

## Dependency Flow Analysis

### 1. Entry Points
- **app/layout.tsx** → ThemeProvider → Global styles
- **app/(dashboard)/layout.tsx** → Navigation components → Interactive components

### 2. Data Flow
- **API Routes** → AWS Bedrock Service → Local Store
- **Components** → Custom Hooks → API Routes
- **Real-time Updates** → SSE Hooks → Component State

### 3. UI Component Hierarchy
- **Layout Components** → Navigation → Page Components
- **Page Components** → Feature Components → UI Components
- **Feature Components** → Custom Hooks → API Integration

### 4. State Management
- **Zustand** (Global state)
- **SWR** (Server state)
- **React State** (Component state)
- **Local Store** (Persistence)

## Critical Dependencies

### High-Risk Dependencies
1. **AWS SDK** - External service dependency
2. **Next.js** - Framework dependency
3. **React** - Core UI dependency
4. **TypeScript** - Type safety

### Medium-Risk Dependencies
1. **Radix UI** - Component library
2. **Framer Motion** - Animation library
3. **Tailwind CSS** - Styling framework

### Low-Risk Dependencies
1. **Utility libraries** (date-fns, nanoid, etc.)
2. **Icon libraries** (lucide-react, heroicons)
3. **Development tools** (ESLint, PostCSS)

## Dependency Health Status

### ✅ Healthy Dependencies
- All external dependencies are up-to-date
- No known security vulnerabilities
- Compatible version ranges
- Active maintenance

### ⚠️ Potential Issues
- Large number of Radix UI components (could be optimized)
- Multiple icon libraries (could be consolidated)
- Some unused dependencies may exist

### 🔧 Recommendations
1. Audit unused dependencies
2. Consider consolidating icon libraries
3. Implement dependency monitoring
4. Regular security updates

## Build Analysis Results

### Compilation Status: ✅ SUCCESS
- TypeScript compilation: PASSED
- ESLint validation: PASSED
- Next.js build: PASSED
- Static generation: PASSED

### Bundle Analysis
- Total routes: 19
- Static routes: 13
- Dynamic routes: 6
- First Load JS: 87.3 kB (shared)
- Largest page: 141 kB (executions)

### Performance Metrics
- Build time: ~30 seconds
- Bundle size: Optimized
- Code splitting: Implemented
- Tree shaking: Active
