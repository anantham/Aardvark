# Moderation Module

Complete content moderation system for the Aardvark interactive fiction platform.

## Overview

The moderation module provides comprehensive tools for:
- User-submitted content reports
- Admin/moderator moderation queue
- User warnings and ban management
- Automated content flagging
- Audit logging and statistics

## Architecture

### Files Structure

```
moderation/
├── dto/
│   ├── index.ts                    # DTO exports
│   └── moderation.dto.ts           # All DTOs (304 lines)
├── index.ts                        # Module exports
├── moderation.controller.ts        # REST API endpoints (284 lines)
├── moderation.module.ts            # NestJS module configuration (33 lines)
├── moderation.service.ts           # Business logic (688 lines)
└── README.md                       # This file
```

### Database Entities

Located at `/home/user/Aardvark/backend/src/database/entities/moderation.entity.ts`:

- **Report** - User reports on content
- **ModerationLog** - Audit trail of all moderation actions
- **UserWarning** - Warnings issued to users
- **UserBan** - User ban records (temporary, permanent, shadowban)
- **ContentFlag** - Auto-flagged content by ML/filters

### Enums

- **ModerationContentType** - story, segment, comment, rating, forum_thread, forum_post, message, user_profile
- **ReportReason** - spam, harassment, hate_speech, inappropriate_content, copyright, violence, misinformation, impersonation, other
- **ModerationStatus** - pending, under_review, approved, rejected, escalated, resolved
- **ModerationAction** - none, warning, content_removed, content_edited, user_warned, user_temp_ban, user_perm_ban, user_shadowban, dismissed

## Service Methods

### Report Management
- `createReport(reporterId, contentType, contentId, reason, details?)` - Submit report
- `getReportQueue(query)` - Get paginated moderation queue
- `assignReport(reportId, moderatorId)` - Assign report to moderator
- `resolveReport(reportId, moderatorId, action, notes)` - Resolve report with action

### User Warnings
- `issueWarning(userId, issuerId, reason, message, reportId?)` - Issue warning to user
- `getUserWarnings(userId)` - Get all warnings for a user

### User Bans
- `issueBan(userId, issuerId, reason, details, isPermanent, expiresAt?, isShadowban?)` - Ban user
- `liftBan(banId, liftedById)` - Lift ban
- `getUserBans(userId)` - Get all bans for a user
- `isUserBanned(userId)` - Check if user is currently banned (with auto-expiry)

### Audit & Analytics
- `getModerationLogs(query)` - Get audit logs with filtering
- `getModerationStats()` - Dashboard statistics

### Auto-Moderation
- `createContentFlag(contentType, contentId, authorId, flagType, confidence, patterns?)` - Create auto-flag
- `getContentFlags(query)` - Get paginated auto-flagged content
- `resolveContentFlag(flagId, moderatorId, action, notes?)` - Resolve content flag

## REST API Endpoints

### User Actions (Authenticated)

#### Submit Report
```
POST /moderation/reports
Body: CreateReportDto
Auth: JWT (any authenticated user)
```

### Admin/Moderator Actions (Role-Based)

#### Moderation Queue
```
GET /moderation/queue
Query: ModerationQueueQuery (page, limit, contentType, status, assignedTo, sortBy, sortOrder)
Auth: JWT + MODERATOR or ADMIN role
```

#### Assign Report
```
PATCH /moderation/reports/:id/assign
Body: AssignReportDto (moderatorId optional)
Auth: JWT + MODERATOR or ADMIN role
```

#### Resolve Report
```
PATCH /moderation/reports/:id/resolve
Body: ResolveModerationDto (action, reason, notes?, editedContent?, banDuration?)
Auth: JWT + MODERATOR or ADMIN role
```

#### Issue Warning
```
POST /moderation/warnings
Body: IssueWarningDto (userId, reason, message, reportId?, expiresInDays?)
Auth: JWT + MODERATOR or ADMIN role
```

#### Get User Warnings
```
GET /moderation/warnings/:userId
Auth: JWT + MODERATOR or ADMIN role
```

#### Issue Ban
```
POST /moderation/bans
Body: IssueBanDto (userId, reason, details, isPermanent, durationDays?, isShadowban, reportId?)
Auth: JWT + MODERATOR or ADMIN role
```

#### Lift Ban
```
DELETE /moderation/bans/:id
Auth: JWT + MODERATOR or ADMIN role
```

#### Get User Bans
```
GET /moderation/bans/:userId
Auth: JWT + MODERATOR or ADMIN role
```

#### Check Ban Status
```
GET /moderation/bans/:userId/status
Auth: JWT + MODERATOR or ADMIN role
```

#### Audit Logs
```
GET /moderation/logs
Query: ModerationLogQuery (page, limit, moderatorId, contentType, action, targetUserId)
Auth: JWT + MODERATOR or ADMIN role
```

#### Dashboard Stats
```
GET /moderation/stats
Auth: JWT + MODERATOR or ADMIN role
Returns: pendingReports, underReviewReports, resolvedToday, totalActiveBans,
         totalActiveWarnings, pendingFlags, reportsByReason, actionsTakenToday
```

#### Content Flags (Auto-flagged)
```
GET /moderation/flags
Query: ModerationQueueQuery
Auth: JWT + MODERATOR or ADMIN role
```

#### Resolve Content Flag
```
PATCH /moderation/flags/:id/resolve
Body: ResolveModerationDto
Auth: JWT + MODERATOR or ADMIN role
```

## DTOs

### CreateReportDto
- contentType: ModerationContentType
- contentId: string (UUID)
- reason: ReportReason
- details: string
- evidence?: string[] (optional)

### ResolveModerationDto
- action: ModerationAction
- reason: string
- notes?: string
- editedContent?: string (if action is EDIT)
- banDuration?: number (days, if action is TEMP_BAN)

### IssueWarningDto
- userId: string (UUID)
- reason: ReportReason
- message: string
- reportId?: string (UUID, optional)
- expiresInDays?: number (optional, 1-365)

### IssueBanDto
- userId: string (UUID)
- reason: ReportReason
- details: string
- isPermanent: boolean
- durationDays?: number (1-3650, required if not permanent)
- isShadowban: boolean
- reportId?: string (UUID, optional)

### AssignReportDto
- moderatorId?: string (UUID, optional - defaults to current user)

### ModerationQueueQuery
- page?: number (default: 1)
- limit?: number (default: 20, max: 100)
- contentType?: ModerationContentType
- status?: ModerationStatus
- assignedTo?: string ('unassigned' or moderator UUID)
- sortBy?: 'createdAt' | 'updatedAt' | 'priority' (default: 'createdAt')
- sortOrder?: 'ASC' | 'DESC' (default: 'DESC')

### ModerationLogQuery
- page?: number (default: 1)
- limit?: number (default: 20, max: 100)
- moderatorId?: string (UUID)
- contentType?: ModerationContentType
- action?: ModerationAction
- targetUserId?: string (UUID)

## Security & Authorization

### Guards
- **JwtAuthGuard** - Validates JWT token (all endpoints)
- **RolesGuard** - Checks user role (admin/moderator endpoints)

### Roles
- **MODERATOR** - Can perform all moderation actions
- **ADMIN** - Can perform all moderation actions
- **Authenticated Users** - Can submit reports only

### Decorators
- `@UseGuards(JwtAuthGuard)` - Require authentication
- `@UseGuards(RolesGuard)` - Require role check
- `@Roles(UserRole.MODERATOR, UserRole.ADMIN)` - Specify required roles

## Usage Examples

### Submit a Report
```typescript
POST /moderation/reports
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "contentType": "story",
  "contentId": "550e8400-e29b-41d4-a716-446655440000",
  "reason": "inappropriate_content",
  "details": "This story contains graphic violence without proper content warnings.",
  "evidence": ["https://example.com/screenshot1.png"]
}
```

### Get Moderation Queue
```typescript
GET /moderation/queue?page=1&limit=20&status=pending&sortBy=createdAt
Authorization: Bearer <moderator_jwt_token>
```

### Resolve Report and Ban User
```typescript
PATCH /moderation/reports/550e8400-e29b-41d4-a716-446655440000/resolve
Authorization: Bearer <moderator_jwt_token>
Content-Type: application/json

{
  "action": "user_temp_ban",
  "reason": "Violation of community guidelines",
  "notes": "User posted inappropriate content after previous warning",
  "banDuration": 7
}
```

### Issue Warning
```typescript
POST /moderation/warnings
Authorization: Bearer <moderator_jwt_token>
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "reason": "spam",
  "message": "Please refrain from posting promotional content in story comments.",
  "expiresInDays": 30
}
```

## Key Features

### Duplicate Report Prevention
Users cannot submit multiple active reports for the same content.

### Auto-Expiring Bans
Temporary bans automatically expire when checked via `isUserBanned()`.

### Comprehensive Audit Trail
All moderation actions are logged to `ModerationLog` with full context.

### Flexible Filtering
Queue and logs support extensive filtering and pagination.

### Auto-Moderation Support
Content flags from automated systems can be reviewed and resolved.

### Dashboard Statistics
Real-time stats for monitoring moderation queue health.

## Integration

### Module Registration

The module should be imported in the main `app.module.ts`:

```typescript
import { ModerationModule } from './modules/moderation';

@Module({
  imports: [
    // ... other modules
    ModerationModule,
  ],
})
export class AppModule {}
```

### Using the Service

```typescript
import { ModerationService } from '@/modules/moderation';

@Injectable()
export class SomeService {
  constructor(private moderationService: ModerationService) {}

  async checkUserStatus(userId: string) {
    const { isBanned, ban } = await this.moderationService.isUserBanned(userId);
    if (isBanned) {
      throw new ForbiddenException('User is banned');
    }
  }
}
```

## Notes

- All admin/moderator endpoints require appropriate role
- Ban status is checked with auto-expiry logic
- Reports can be assigned to self by omitting moderatorId
- Content flags are for automated moderation systems
- Statistics are calculated in real-time from database

## Future Enhancements

Potential additions:
- Appeal system for bans
- User strike tracking (3-strikes policy)
- Automated action triggers based on report count
- Moderator performance metrics
- Content flag ML integration
- Webhook notifications for critical reports
