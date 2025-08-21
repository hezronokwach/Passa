# Artist Onboarding & Event Publishing Workflow

## Overview
This document outlines the complete workflow for onboarding artists and publishing events in the Passa platform, with focus on smart contract integration for revenue distribution.

## Database Models

### ArtistInvitation
```prisma
model ArtistInvitation {
  id          Int     @id @default(autoincrement())
  event       Event   @relation(fields: [eventId], references: [id])
  eventId     Int
  organizerId Int
  artistEmail String
  artistName  String
  proposedFee Float   // Fixed amount, not percentage
  message     String? @db.Text
  status      InvitationStatus @default(PENDING)
  artistComments String? @db.Text
  // For existing users
  artistId    Int?
  artist      User?   @relation(fields: [artistId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum InvitationStatus {
  PENDING
  ACCEPTED
  REJECTED
}
```

### Event Updates
```prisma
model Event {
  // ... existing fields
  published        Boolean           @default(false)
  totalBudget      Float?            // Total budget for artist fees
  artistInvitations ArtistInvitation[]
}
```

## Complete Workflow

### Phase 1: Organizer - Artist Onboarding (Current Focus)

#### 1.1 Publish Event Modal
- **Trigger**: "Publish" button on draft events
- **Components**:
  - Event details display (read-only)
  - Total budget input
  - Artist invitation form
  - Progress tracker

#### 1.2 Artist Invitation Process
- **Search & Select Artists**:
  - Search existing platform users (creators/artists)
  - Add external artists by email/name
- **Set Fixed Fees**:
  - Input fixed amount for each artist
  - Show remaining budget calculation
- **Send Invitations**:
  - Create invitation records
  - Send in-app notifications
  - Send email notifications (future)

#### 1.3 Invitation Management
- **View Status**: Pending/Accepted/Rejected
- **Edit & Resend**: For rejected invitations
- **Track Responses**: Comments and feedback
- **Budget Tracking**: Total committed vs available

#### 1.4 Revenue Split Confirmation
- **Final Review**:
  - List all accepted artists and fees
  - Show organizer's remaining amount
  - Platform fee calculation
- **Confirm & Publish**:
  - Lock in the revenue splits
  - Prepare smart contract parameters
  - Mark event as published

### Phase 2: Artist Dashboard (Future)

#### 2.1 Notification System
- **Invitation Alerts**: New invitations from organizers
- **Response Forms**: Accept/reject with comments
- **Status Updates**: Track invitation progress

#### 2.2 Artist Response Flow
- **Review Invitation**:
  - Event details
  - Proposed fee
  - Organizer message
- **Response Options**:
  - Accept: Confirm participation
  - Reject: Provide feedback/counter-proposal
- **Account Creation**: For external artists

### Phase 3: Smart Contract Integration (Future)

#### 3.1 Contract Deployment
- **Revenue Split Parameters**:
  - Artist addresses and fixed fees
  - Organizer remaining amount
  - Platform fee percentage
- **Contract Functions**:
  - Automatic payment distribution
  - Ticket sale revenue tracking
  - Withdrawal mechanisms

#### 3.2 Payment Distribution
- **Trigger**: Ticket sales revenue
- **Process**: Automatic split based on agreed amounts
- **Tracking**: Transaction history and balances

## MVP Implementation Priority

### Current Phase: Organizer Artist Onboarding
1. ✅ Add database models
2. ✅ Create publish event modal
3. ✅ Build artist invitation form
4. ✅ Implement invitation management
5. ✅ Add revenue split confirmation

### Next Phase: Artist Dashboard
1. Notification system
2. Response forms
3. Account creation flow

### Final Phase: Smart Contract
1. Contract deployment
2. Payment distribution
3. Revenue tracking

## Key Features

### For MVP Demo
- **Fixed Fee Model**: Artists get fixed amounts, not percentages
- **In-App Communication**: All interactions tracked in platform
- **Budget Management**: Real-time budget tracking and validation
- **Flexible Negotiations**: Edit and resend rejected proposals
- **Smart Contract Ready**: Data structure prepared for blockchain integration

### Technical Considerations
- **Artist = Creator**: Same user type, different dashboard views
- **External Artists**: Must sign up for payment processing
- **Audit Trail**: Complete history of negotiations and agreements
- **Revenue Validation**: Ensure total fees don't exceed budget