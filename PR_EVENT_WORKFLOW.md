# PR: Complete Event Workflow Implementation

## Summary
Implemented a comprehensive event workflow system that enables organizers to create events, invite artists, and manage the entire collaboration process from invitation to completion.

## Features Added

### Event Management
- **Event Creation**: Organizers can create events with detailed information (title, description, date, location, budget)
- **Event Dashboard**: Centralized view of all events with status tracking and management options
- **Event Details**: Comprehensive event pages with full information display

### Artist Invitation System
- **Artist Discovery**: Browse and search available artists by skills and location
- **Invitation Management**: Send invitations with proposed fees and custom messages
- **Negotiation Flow**: Back-and-forth negotiation with fee adjustments and status updates
- **Response Tracking**: Real-time status updates (Pending, Accepted, Rejected)

### Artist Workflow
- **Invitation Inbox**: Artists receive and manage invitations from organizers
- **Response System**: Accept/reject invitations with optional comments
- **Negotiation History**: Complete audit trail of all interactions

### Database Schema
- **Events Table**: Core event information with organizer relationships
- **Invitations Table**: Artist invitations with status tracking and fee negotiation
- **Invitation History**: Complete audit trail of all changes and negotiations

## Technical Implementation

### Backend
- **Prisma Schema**: Added Event and Invitation models with proper relationships
- **Server Actions**: Implemented CRUD operations for events and invitations
- **API Routes**: RESTful endpoints for invitation management and responses

### Frontend
- **Event Forms**: Create and edit event forms with validation
- **Artist Directory**: Searchable artist listing with filtering capabilities
- **Invitation Dialogs**: Interactive modals for sending and responding to invitations
- **Dashboard Components**: Comprehensive dashboards for both organizers and artists

### Type Safety
- **TypeScript Types**: Proper type definitions for all data structures
- **Form Validation**: Zod schemas for data validation
- **Next.js 15 Compatibility**: Updated for async params handling

## Files Changed

### Database
- `prisma/schema.prisma` - Added Event and Invitation models
- `prisma/migrations/` - Database migration files

### Backend Actions
- `src/app/actions/events.ts` - Event CRUD operations
- `src/app/actions/invitations.ts` - Invitation management
- `src/app/actions/invitation-response.ts` - Artist response handling

### API Routes
- `src/app/api/invitations/[id]/route.ts` - Invitation details endpoint
- `src/app/api/organizer-invitations/[id]/route.ts` - Organizer invitation endpoint

### Pages
- `src/app/dashboard/organizer/events/` - Event management pages
- `src/app/dashboard/organizer/artists/` - Artist discovery pages
- `src/app/dashboard/creator/invitations/` - Artist invitation inbox

### Components
- `src/components/passa/event-form.tsx` - Event creation/editing
- `src/components/passa/artist-invitation-dialog.tsx` - Send invitations
- `src/components/passa/invitation-response-dialog.tsx` - Respond to invitations
- `src/components/passa/invitations-client.tsx` - Artist invitation management
- `src/components/passa/organizer-invitations-client.tsx` - Organizer invitation tracking

## How to Test

### Prerequisites
1. Ensure database is set up and migrated:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Test Scenarios

#### 1. Event Creation (Organizer)
1. Login as an organizer account
2. Navigate to `/dashboard/organizer/events`
3. Click "Create New Event"
4. Fill out event form with:
   - Title: "Test Music Festival"
   - Description: "Annual music festival"
   - Date: Future date
   - Location: "Lagos, Nigeria"
   - Budget: 50000
5. Submit form and verify event appears in dashboard

#### 2. Artist Invitation (Organizer)
1. From event dashboard, click "Invite Artists" on created event
2. Browse available artists at `/dashboard/organizer/artists`
3. Click "Invite" on an artist
4. Fill invitation form:
   - Proposed fee: 5000
   - Message: "We'd love to have you perform"
5. Send invitation and verify it appears in organizer's invitations list

#### 3. Invitation Response (Artist)
1. Login as a creator/artist account
2. Navigate to `/dashboard/creator/invitations`
3. View pending invitation
4. Click "View Details" to open invitation dialog
5. Test both acceptance and rejection flows:
   - Accept: Add optional comments and accept
   - Reject: Add feedback and decline
6. Verify status updates in both artist and organizer dashboards

#### 4. Negotiation Flow
1. As organizer, view rejected invitation
2. Click "Edit and Resend Invitation"
3. Adjust fee and message
4. Resend invitation
5. As artist, respond to updated invitation
6. Verify negotiation history shows all interactions

#### 5. Data Validation
1. Test form validation by submitting incomplete forms
2. Verify error messages display correctly
3. Test date validation (past dates should be rejected)
4. Test numeric validation for fees and budgets

### Expected Behavior
- All forms should validate input and show appropriate error messages
- Status updates should reflect immediately in both dashboards
- Negotiation history should maintain complete audit trail
- Email notifications should be sent (if email system is configured)
- All TypeScript compilation should pass without errors

### Database Verification
Check database records directly:
```sql
-- View events
SELECT * FROM "Event";

-- View invitations with relationships
SELECT i.*, e.title as event_title, u.name as artist_name 
FROM "Invitation" i 
JOIN "Event" e ON i."eventId" = e.id 
JOIN "User" u ON i."artistId" = u.id;

-- View invitation history
SELECT * FROM "InvitationHistory" ORDER BY "createdAt" DESC;
```

## Notes
- Ensure proper user roles are set up (Organizer vs Creator)
- Test with multiple user accounts to verify role-based access
- All monetary values are stored as integers (cents) for precision
- Dates are stored in UTC and converted for display