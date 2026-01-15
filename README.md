# Aardvark - Interactive Fiction Platform

A production-ready, scalable interactive fiction platform for creating, reading, and collaboratively authoring branching narrative stories. Similar to CHYOA (Choose Your Own Adventure), designed to support millions of users.

## Features

### For Readers
- Browse thousands of interactive stories across multiple genres
- Make choices that shape the narrative
- Track reading progress and bookmarks
- Follow favorite authors
- Create personal story collections
- Earn credits by watching ads
- Access premium content with subscriptions

### For Authors
- **Dual Editor System**: Rich text editor (WYSIWYG) and visual node-based editor (flowchart)
- Complex branching with state management and conditional choices
- Three collaboration modes: Private, Moderated, Open
- Detailed analytics dashboard
- AI Writing Companion (premium feature)
- Monetization through credits and premium stories

### Platform Features
- **5 User Roles**: Guest, Reader, Author, Moderator, Admin
- **Credit Economy**: Earn and spend credits
- **Premium Subscriptions**: Ad-free, unlimited access
- **Social Features**: Comments, ratings, follows, messaging, forums
- **Moderation System**: Automated and manual content moderation
- **Mobile-First PWA**: Offline reading, push notifications

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI**: React, Tailwind CSS, Radix UI
- **State**: Zustand, React Query
- **Editors**: TipTap (rich text), React Flow (visual)

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (TypeORM)
- **Cache**: Redis
- **Search**: Elasticsearch
- **Auth**: JWT with Passport.js
- **Payments**: Stripe
- **Real-time**: Socket.io

### Infrastructure
- **Storage**: AWS S3 / Cloudflare R2
- **CDN**: Cloudflare
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm 10+

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/aardvark.git
   cd aardvark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start infrastructure services**
   ```bash
   npm run docker:dev
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Docs: http://localhost:4000/api/docs

### Docker Compose Services

| Service | Port | Description |
|---------|------|-------------|
| postgres | 5432 | PostgreSQL database |
| redis | 6379 | Redis cache |
| elasticsearch | 9200 | Search engine |
| minio | 9000/9001 | S3-compatible storage |
| mailhog | 1025/8025 | Email testing |

## Project Structure

```
aardvark/
├── frontend/                 # Next.js 14 application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities
│   │   ├── services/        # API services
│   │   ├── stores/          # Zustand stores
│   │   └── styles/          # Global styles
│   └── public/              # Static assets
│
├── backend/                  # NestJS application
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── common/          # Shared utilities
│   │   ├── database/        # Entities & migrations
│   │   └── modules/         # Feature modules
│   │       ├── auth/        # Authentication
│   │       ├── users/       # User management
│   │       ├── stories/     # Story CRUD
│   │       ├── segments/    # Story segments
│   │       ├── choices/     # Choices
│   │       ├── progress/    # Reader progress
│   │       ├── credits/     # Credit system
│   │       └── ...
│   └── test/                # Tests
│
├── shared/                   # Shared types & utilities
│   └── src/
│       ├── types/           # TypeScript types
│       ├── utils/           # Utility functions
│       └── constants/       # Constants
│
├── docker/                   # Docker configuration
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
│
└── .github/                  # GitHub Actions
    └── workflows/
```

## API Documentation

API documentation is available via Swagger UI at `/api/docs` when running in development mode.

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login |
| GET | /api/v1/stories | List stories |
| POST | /api/v1/stories | Create story |
| GET | /api/v1/stories/:id | Get story details |
| GET | /api/v1/stories/:id/segments | Get story segments |
| POST | /api/v1/credits/watch-ad | Earn credits |
| POST | /api/v1/subscription/create | Subscribe |

## Database Schema

### Core Tables
- `users` - User accounts and profiles
- `stories` - Story metadata
- `story_segments` - Story content nodes
- `choices` - Connections between segments
- `reader_progress` - User reading state

### Social Tables
- `comments` - Story comments
- `ratings` - Story ratings/reviews
- `follows` - User follows
- `notifications` - User notifications

### Monetization Tables
- `transactions` - Credit transactions
- `subscriptions` - User subscriptions

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/aardvark
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_xxx
```

## Scripts

```bash
# Development
npm run dev              # Start all services
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Building
npm run build            # Build all packages
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend

# Testing
npm run test             # Run all tests
npm run test:e2e         # Run E2E tests

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database

# Docker
npm run docker:dev       # Start dev services
npm run docker:down      # Stop services
```

## Deployment

### Docker Deployment

```bash
# Build production images
docker build -f docker/Dockerfile.backend -t aardvark-backend .
docker build -f docker/Dockerfile.frontend -t aardvark-frontend .

# Run with Docker Compose
docker-compose -f docker/docker-compose.prod.yml up -d
```

### Cloud Deployment (AWS)

Recommended AWS architecture:
- **ECS Fargate** or **EKS** for containers
- **RDS PostgreSQL** with read replicas
- **ElastiCache Redis** for caching
- **OpenSearch** for search
- **S3** for file storage
- **CloudFront** for CDN
- **Application Load Balancer** for routing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary. All rights reserved.

## Support

- Documentation: [/docs](/docs)
- Issues: [GitHub Issues](https://github.com/your-org/aardvark/issues)
- Email: support@aardvark.com
