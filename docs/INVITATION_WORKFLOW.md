# Invitation Workflow Documentation

## Overview
The invitation system enables event organizers to discover, invite, and negotiate with artists for event performances. The workflow supports the complete lifecycle from initial invitation to final acceptance/rejection with negotiation capabilities.

## Workflow States

### Invitation Status Flow
```
PENDING → ACCEPTED ✓
PENDING → REJECTED → PENDING (re-invitation)
```

### User Roles
- **Organizer**: Creates events and sends invitations to artists
- **Artist/Creator**: Receives invitations and responds with acceptance/rejection

## Detailed Workflow

### 1. Artist Discovery Phase
**Actor**: Organizer  
**Location**: `/dashboard/organizer/artists`

1. Organizer browses available artists
2. Filters by skills, location, or other criteria
3. Views artist profiles and portfolios
4. Selects artists to invite

### 2. Invitation Creation Phase
**Actor**: Organizer  
**Component**: `InviteWithFeeDialog`

1. Organizer clicks "Invite" on selected artist
2. Opens invitation dialog with:
   - Artist name (auto-populated)
   - Proposed performance fee (required)
   - Custom message (optional)
3. Submits invitation via `inviteWithFee` action
4. System creates invitation record with status `PENDING`

### 3. Invitation Delivery Phase
**System Process**

1. Invitation stored in database with:
   - Event details
   - Artist information
   - Proposed fee
   - Organizer message
   - Timestamp
2. Artist receives notification (in-app)
3. Invitation appears in artist's inbox

### 4. Artist Response Phase
**Actor**: Artist  
**Location**: `/dashboard/creator/applications` (Invitations Received tab)

#### Option A: Acceptance Flow
1. Artist views invitation details
2. Reviews event information and proposed fee
3. Adds optional comments
4. Clicks "Accept Invitation"
5. Status changes to `ACCEPTED`
6. Organizer receives notification

#### Option B: Rejection Flow
1. Artist views invitation details
2. Reviews terms and decides to decline
3. Adds feedback/reason for rejection
4. Clicks "Decline"
5. Status changes to `REJECTED`
6. Organizer receives notification with feedback

### 5. Negotiation Phase (Post-Rejection)
**Actor**: Organizer  
**Component**: `OrganizerResponseDialog`

1. Organizer views rejected invitation
2. Clicks "Edit and Resend Invitation"
3. Adjusts terms:
   - New proposed fee
   - Updated message/terms
4. Resubmits invitation
5. Status resets to `PENDING`
6. Process returns to Step 4 (Artist Response)

## Data Models

### Invitation Record
```typescript
{
  id: number
  eventId: number
  artistId: number
  organizerId: number
  proposedFee: number
  message: string | null
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  artistComments: string | null
  createdAt: Date
  updatedAt: Date
}
```

### Invitation History
```typescript
{
  id: number
  invitationId: number
  action: string
  oldStatus: string
  newStatus: string
  oldFee: number
  newFee: number
  comments: string
  createdAt: Date
}
```

## Key Components

### Frontend Components
- `InviteWithFeeDialog` - Initial invitation creation
- `InvitationResponseDialog` - Artist response interface
- `OrganizerResponseDialog` - Organizer negotiation interface
- `ApplicationsClient` - Unified artist activity management
- `OrganizerInvitationsClient` - Organizer invitation tracking

### Backend Actions
- `inviteWithFee` - Creates new invitation
- `respondToInvitation` - Handles artist responses
- `editInvitation` - Updates invitation terms

### API Endpoints
- `GET /api/invitations/[id]` - Fetch invitation details for artists
- `GET /api/organizer-invitations/[id]` - Fetch invitation details for organizers

## Business Rules

### Invitation Creation
- Only organizers can send invitations
- Proposed fee must be positive number
- Artist must exist and have Creator role
- Event must belong to the organizer

### Response Handling
- Only invited artists can respond
- Artists can only respond to PENDING invitations
- Comments are optional but recommended for rejections

### Negotiation Rules
- Only organizers can edit rejected invitations
- Editing resets status to PENDING
- All changes are tracked in history
- No limit on negotiation rounds

### Data Integrity
- Soft deletes preserve history
- All monetary values stored as integers (cents)
- Timestamps in UTC
- Audit trail maintained for all changes

## Error Handling

### Common Error Scenarios
1. **Invalid Artist**: Artist doesn't exist or wrong role
2. **Duplicate Invitation**: Artist already invited for same event
3. **Invalid Fee**: Negative or non-numeric fee
4. **Permission Denied**: User lacks proper role/ownership
5. **Invalid Status**: Attempting invalid status transitions

### Error Messages
- User-friendly messages displayed via toast notifications
- Form validation prevents invalid submissions
- Server-side validation as final safety net

## Testing Scenarios

### Happy Path
1. Organizer invites artist → Artist accepts → Collaboration begins
2. Organizer invites artist → Artist rejects → Organizer negotiates → Artist accepts

### Edge Cases
1. Multiple invitations to same artist for different events
2. Invitation to artist who becomes inactive
3. Event cancellation with pending invitations
4. Concurrent responses to same invitation

### Performance Considerations
- Pagination for large invitation lists
- Efficient queries with proper indexing
- Caching for frequently accessed data
- Optimistic updates for better UX

## Future Enhancements

### Potential Features
- Email notifications for invitations
- Bulk invitation capabilities
- Template messages for common scenarios
- Integration with calendar systems
- Payment escrow integration
- Rating/review system post-event