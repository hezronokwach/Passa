# Event Creation & Artist Negotiation Workflow

## Overview

Passa implements a comprehensive event management system with artist invitation, negotiation, and automatic publishing workflows. This document outlines the complete process from event creation to live publication.

## Core Concepts

### Event States
- **DRAFT**: Event created but not published (default state)
- **PUBLISHED**: Event is live and visible to fans (all artists accepted)

### Invitation States
- **PENDING**: Invitation sent, awaiting artist response
- **ACCEPTED**: Artist accepted the invitation
- **REJECTED**: Artist declined the invitation

### Revenue Distribution
- **Fixed Fee Model**: Artists receive predetermined amounts (not percentages)
- **Instant Splits**: Payments processed automatically via blockchain
- **Transparent Attribution**: All contributions tracked on-chain

## Complete Workflow

### Phase 1: Event Creation

#### 1.1 Two-Step Event Creation Process
**Location**: `/dashboard/organizer/events/create`

**Step 1: Basic Information**
- Event title and description
- Date and time selection (calendar picker)
- Location and country
- Event image URL

**Step 2: Ticket Configuration**
- Multiple ticket tiers supported
- Each tier: name, price, quantity
- Dynamic tier management (add/remove)

**Database Changes**:
```sql
-- Event created with published = false
INSERT INTO Event (title, description, date, location, country, imageUrl, organizerId, published)
VALUES (..., false);

-- Ticket tiers created
INSERT INTO Ticket (eventId, name, price, quantity, sold)
VALUES (eventId, tierName, tierPrice, tierQuantity, 0);
```

#### 1.2 Event Status After Creation
- Event remains in **DRAFT** state
- Visible only to organizer
- Cannot be purchased by fans
- Ready for artist invitation process

### Phase 2: Artist Invitation & Negotiation

#### 2.1 Artist Search & Invitation
**Location**: Publish Event Modal (triggered from organizer dashboard)

**Process**:
1. Organizer sets total budget for artists
2. Search existing creators on platform
3. Add external artists (email/name)
4. Assign individual fees to each artist
5. Add optional message for context

**Validation**:
- Total artist fees cannot exceed budget
- At least one artist required
- Budget validation before sending

**Database Changes**:
```sql
-- Update event with budget
UPDATE Event SET totalBudget = ? WHERE id = ?;

-- Create invitations
INSERT INTO ArtistInvitation (eventId, organizerId, artistEmail, artistName, proposedFee, message, artistId)
VALUES (...);

-- Create history record
INSERT INTO InvitationHistory (invitationId, action, newStatus, newFee, comments)
VALUES (invitationId, 'CREATED', 'PENDING', fee, 'Initial invitation sent');

-- Notify platform users
INSERT INTO Notification (userId, type, title, message, data)
VALUES (artistId, 'ARTIST_INVITATION', 'New Artist Invitation', '...', {...});
```

#### 2.2 Artist Response Process
**Location**: 
- Notification bell → click invitation
- `/dashboard/creator/invitations` → view details

**Artist Options**:
1. **Accept**: Agree to terms and fee
2. **Reject**: Decline with optional comments
3. **View History**: See full negotiation trail

**Database Changes**:
```sql
-- Update invitation status
UPDATE ArtistInvitation 
SET status = 'ACCEPTED'|'REJECTED', artistComments = ?
WHERE id = ?;

-- Create history record
INSERT INTO InvitationHistory (invitationId, action, oldStatus, newStatus, comments)
VALUES (invitationId, 'ACCEPTED'|'REJECTED', 'PENDING', newStatus, comments);

-- Notify organizer
INSERT INTO Notification (userId, type, title, message, data)
VALUES (organizerId, 'INVITATION_RESPONSE', 'Artist responded', '...', {...});
```

#### 2.3 Organizer Counter-Negotiation
**Location**: 
- Notification bell → click response notification
- `/dashboard/organizer/invitations` → view details

**When Artist Rejects**:
1. Organizer can edit invitation
2. Update fee and/or message
3. Reset status to PENDING
4. Artist gets new notification

**Database Changes**:
```sql
-- Update invitation with new terms
UPDATE ArtistInvitation 
SET proposedFee = ?, message = ?, status = 'PENDING', artistComments = NULL
WHERE id = ?;

-- Create history record
INSERT INTO InvitationHistory (invitationId, action, oldStatus, newStatus, oldFee, newFee, comments)
VALUES (invitationId, 'UPDATED', 'REJECTED', 'PENDING', oldFee, newFee, 'Organizer updated terms');

-- Notify artist of changes
INSERT INTO Notification (userId, type, title, message, data)
VALUES (artistId, 'ARTIST_INVITATION', 'Updated Invitation', '...', {...});
```

### Phase 3: Automatic Event Publishing

#### 3.1 Publishing Trigger
**Condition**: ALL invited artists have ACCEPTED their invitations

**Automatic Process**:
```sql
-- Check if all invitations are accepted
SELECT COUNT(*) FROM ArtistInvitation 
WHERE eventId = ? AND status != 'ACCEPTED';

-- If count = 0, publish event
UPDATE Event SET published = true WHERE id = ?;

-- Notify organizer
INSERT INTO Notification (userId, type, title, message, data)
VALUES (organizerId, 'EVENT_PUBLISHED', 'Event Published!', 'All artists accepted - event is now live', {...});
```

#### 3.2 Published Event Features
- Visible on public events page
- Fans can purchase tickets
- Revenue splits are locked in
- Artist fees are finalized

### Phase 4: Ticket Sales & Revenue Distribution

#### 4.1 Ticket Purchase Process
**Location**: `/events/[id]` (public event page)

**Process**:
1. Fan selects ticket tier and quantity
2. Payment processed via blockchain
3. Automatic revenue distribution

**Revenue Split Calculation**:
```javascript
// Example for $100 ticket sale
const ticketPrice = 100;
const artistSplit = 70; // 70%
const venueSplit = 20;  // 20%
const passaSplit = 10;  // 10%

const artistPool = ticketPrice * (artistSplit / 100); // $70
const venueShare = ticketPrice * (venueSplit / 100);  // $20
const passaShare = ticketPrice * (passaSplit / 100);  // $10

// Artist pool distributed based on fixed fees
// If Artist A fee = $500, Artist B fee = $300
// Artist A gets: ($500 / $800) * $70 = $43.75
// Artist B gets: ($300 / $800) * $70 = $26.25
```

## User Interfaces

### Organizer Dashboards

#### Main Dashboard (`/dashboard/organizer`)
- Event overview with status indicators
- Quick access to create events
- "My Invitations" button for invitation management
- Publish buttons for draft events

#### Invitations Page (`/dashboard/organizer/invitations`)
- Table of all sent invitations
- Artist details and response status
- "View Details" opens negotiation history
- Edit/resend functionality for rejected invitations

#### Event Creation (`/dashboard/organizer/events/create`)
- Two-step form process
- Calendar date picker
- Dynamic ticket tier management
- Form validation and error handling

### Artist/Creator Dashboards

#### Main Dashboard (`/dashboard/creator`)
- Earnings overview
- Submission statistics
- "My Invitations" button for invitation management

#### Invitations Page (`/dashboard/creator/invitations`)
- Table of all received invitations
- Event details and proposed fees
- "View Details" opens invitation dialog with history
- Accept/reject functionality

### Notification System

#### Notification Bell (Header)
- Real-time notification count
- Popover with recent notifications
- Different handling for different notification types:
  - `ARTIST_INVITATION`: Opens invitation response dialog
  - `INVITATION_RESPONSE`: Opens organizer response dialog
  - `EVENT_PUBLISHED`: Shows success toast

#### Notification Types
1. **ARTIST_INVITATION**: Sent to artists when invited
2. **INVITATION_RESPONSE**: Sent to organizers when artists respond
3. **EVENT_PUBLISHED**: Sent to organizers when event goes live

## History & Audit Trail

### Complete Negotiation History
Every invitation action is tracked in `InvitationHistory`:

**Tracked Actions**:
- `CREATED`: Initial invitation sent
- `UPDATED`: Organizer modified terms
- `ACCEPTED`: Artist accepted invitation
- `REJECTED`: Artist declined invitation

**Tracked Data**:
- Old/new status changes
- Old/new fee changes
- Comments from both parties
- Timestamps for all actions

### History Access Points
1. **Invitation Response Dialog**: Shows history when viewing invitation details
2. **Organizer Response Dialog**: Shows history when viewing artist responses
3. **Invitations Pages**: Accessible via "View Details" buttons

## API Endpoints

### Artist Invitations
- `POST /api/artist-invitations` - Send invitations
- `GET /api/invitations/[id]` - Get invitation details (artist view)
- `GET /api/organizer-invitations/[id]` - Get invitation details (organizer view)
- `PATCH /api/invitations/[id]/respond` - Artist response
- `PATCH /api/invitations/[id]/edit` - Organizer edit

### Notifications
- `GET /api/notifications` - Fetch user notifications
- `PATCH /api/notifications` - Mark notification as read

### Artist Search
- `GET /api/artists/search?q=query` - Search platform creators

## Database Schema

### Key Models

```prisma
model Event {
  id                Int                @id @default(autoincrement())
  title             String
  description       String
  date              DateTime
  location          String
  country           String
  imageUrl          String
  organizerId       Int
  published         Boolean            @default(false)
  totalBudget       Float?
  artistInvitations ArtistInvitation[]
  tickets           Ticket[]
  // ... other fields
}

model ArtistInvitation {
  id             Int                   @id @default(autoincrement())
  eventId        Int
  organizerId    Int
  artistEmail    String
  artistName     String
  proposedFee    Float
  message        String?
  status         InvitationStatus      @default(PENDING)
  artistComments String?
  artistId       Int?
  history        InvitationHistory[]
  // ... relations
}

model InvitationHistory {
  id           Int              @id @default(autoincrement())
  invitationId Int
  action       String           // CREATED, UPDATED, ACCEPTED, REJECTED
  oldStatus    InvitationStatus?
  newStatus    InvitationStatus?
  oldFee       Float?
  newFee       Float?
  comments     String?
  createdAt    DateTime         @default(now())
  // ... relations
}

model Notification {
  id        Int      @id @default(autoincrement())
  userId    Int
  type      String   // ARTIST_INVITATION, INVITATION_RESPONSE, EVENT_PUBLISHED
  title     String
  message   String
  data      Json?    // Additional context data
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  // ... relations
}
```

## Key Features

### 1. **Transparent Negotiation**
- Complete history of all interactions
- Both parties can see full conversation
- Timestamps and action tracking

### 2. **Automatic Publishing**
- Events only go live when all artists agree
- No manual intervention required
- Prevents incomplete lineups

### 3. **Fixed Fee Model**
- Predictable payments for artists
- No percentage-based confusion
- Clear revenue distribution

### 4. **Real-time Notifications**
- Immediate alerts for all parties
- Separate notification and management systems
- Context-aware notification handling

### 5. **Comprehensive Management**
- Dedicated pages for invitation management
- Separate from notification system
- Full CRUD operations on invitations

## Future Enhancements

### Planned Features
1. **Bulk Invitations**: Invite multiple artists at once
2. **Template Messages**: Save common invitation messages
3. **Artist Recommendations**: AI-powered artist suggestions
4. **Contract Generation**: Automatic legal document creation
5. **Payment Scheduling**: Milestone-based payments
6. **Multi-currency Support**: Global payment options

### Technical Improvements
1. **Real-time Updates**: WebSocket notifications
2. **Email Integration**: Email notifications for external artists
3. **Mobile Optimization**: Responsive design improvements
4. **Analytics Dashboard**: Invitation success metrics
5. **API Rate Limiting**: Prevent abuse
6. **Caching Layer**: Improve performance

This workflow ensures a smooth, transparent, and automated process from event creation to live publication, with complete audit trails and user-friendly interfaces for all stakeholders.