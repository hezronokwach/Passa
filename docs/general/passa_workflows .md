# Passa - System Workflows & User Journey Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Core Workflows](#core-workflows)
4. [Smart Contract Interactions](#smart-contract-interactions)
5. [Payment Processing](#payment-processing)
6. [Error Handling & Edge Cases](#error-handling--edge-cases)
7. [Real-time Features](#real-time-features)

---

## System Overview

Passa operates as a multi-stakeholder platform where different user types interact through interconnected workflows. The system orchestrates complex interactions between event organizers, artists, content creators, brand sponsors, and fans while ensuring transparent, automated revenue distribution through blockchain smart contracts.

### Key System Principles
- **Transparency**: All revenue splits and attributions are publicly verifiable
- **Automation**: Minimal manual intervention in payment and attribution processes
- **Real-time**: Instant updates across all stakeholder dashboards
- **Fraud Prevention**: Blockchain verification for all critical operations

---

## User Roles & Permissions

### 1. Event Organizer
**Capabilities**:
- ✅ Create and manage events
- ✅ Configure ticket tiers and pricing
- ✅ Set revenue split percentages
- ✅ Approve content creator applications
- ✅ Manage brand sponsorship partnerships
- ✅ Access real-time event analytics
- ❌ Cannot modify revenue splits after first ticket sale
- ❌ Cannot access other organizers' event data

### 2. Artist/Performer  
**Capabilities**:
- ✅ Create artist profile and verify identity
- ✅ Apply to perform at events
- ✅ View assigned revenue percentage
- ✅ Access real-time earnings dashboard
- ✅ Communicate with fans through platform
- ❌ Cannot modify event details
- ❌ Cannot change revenue splits independently

### 3. Content Creator/Influencer
**Capabilities**:
- ✅ Apply for event promotional campaigns
- ✅ Submit content for approval
- ✅ Track attribution metrics in real-time
- ✅ Receive automated payments for verified sales
- ✅ Access promotional materials and assets
- ❌ Cannot edit event information
- ❌ Cannot see other creators' performance data

### 4. Brand Sponsor/Promoter
**Capabilities**:
- ✅ Create sponsorship campaigns
- ✅ Set campaign budgets and objectives
- ✅ Select and partner with creators
- ✅ Track ROI and campaign performance
- ✅ Access audience analytics
- ❌ Cannot modify event details directly
- ❌ Cannot access fan personal information

### 5. Fan/Event Attendee
**Capabilities**:
- ✅ Purchase tickets with multiple payment methods
- ✅ Transfer tickets to other users
- ✅ Access loyalty rewards and benefits
- ✅ Engage with artists and creators
- ✅ Participate in event communities
- ❌ Cannot resell tickets above configured limits
- ❌ Cannot access backend event data

---

## Core Workflows

### 1. Event Creation & Setup Workflow

#### Step 1: Initial Event Setup
```
Event Organizer Login → Dashboard → "Create Event" Button
    ↓
Event Creation Form (Multi-step):
    - Basic Info (Name, Description, Date, Venue)
    - Ticket Configuration (Tiers, Pricing, Capacity)
    - Revenue Split Setup (Artists, Promoters, Platform)
    - Media Upload (Images, Videos, Promotional Materials)
    ↓
Form Validation & Smart Contract Preparation
    ↓
Event Published (Pending State) → Smart Contract Deployed
```

**Smart Contract Interaction**:
```rust
// Event creation triggers smart contract deployment
fn create_event(
    organizer: Address,
    event_details: EventDetails,
    revenue_splits: Vec<RevenueSplit>
) -> Result<EventId, Error> {
    // Validate revenue splits sum to 100%
    validate_revenue_splits(&revenue_splits)?;
    
    // Create event on blockchain
    let event_id = generate_event_id();
    let event = Event {
        id: event_id.clone(),
        organizer,
        details: event_details,
        splits: revenue_splits,
        status: EventStatus::Active,
        tickets_sold: 0,
        total_revenue: 0,
    };
    
    // Store event data
    EVENTS.set(&event_id, &event);
    
    Ok(event_id)
}
```

#### Step 2: Content Creator Recruitment
```
Event Live → Creator Discovery Interface
    ↓
Content Creators Browse Available Events
    ↓
Creator Application Submission:
    - Portfolio/Previous Work Examples
    - Proposed Promotional Strategy
    - Audience Demographics
    - Commission Rate Request
    ↓
Organizer Review & Approval Process
    ↓
Smart Contract Updates with Creator Revenue Split
    ↓
Creator Onboarded → Campaign Brief Shared
```

#### Step 3: Brand Sponsorship Integration
```
Brand Partner Platform Access → Event Discovery
    ↓
Sponsorship Proposal Creation:
    - Campaign Objectives & Budget
    - Target Audience Requirements
    - Content Guidelines & Brand Safety
    - Performance Expectations
    ↓
Organizer Review & Negotiation
    ↓
Sponsorship Agreement Finalization
    ↓
Smart Contract Update with Sponsor Revenue Allocation
    ↓
Campaign Launch → Creator Partnerships Begin
```

### 2. Ticket Purchase & Attribution Workflow

#### Standard Ticket Purchase Flow
```
Fan Discovers Event → Event Details Page
    ↓
Ticket Selection (Tier, Quantity) → Cart Addition
    ↓
Checkout Process:
    - Account Login/Registration
    - Payment Method Selection (M-Pesa/USDC/Bank)
    - Wallet Connection (if blockchain payment)
    ↓
Payment Processing & Verification
    ↓
Smart Contract Execution:
    - NFT Ticket Generation
    - Revenue Distribution to All Stakeholders
    - Attribution Recording (if from creator link)
    ↓
Ticket Delivery → Email/SMS/Wallet
    ↓
Real-time Dashboard Updates for All Stakeholders
```

#### Creator-Attributed Purchase Flow
```
Fan Clicks Creator Promotional Link → Landing Page
    ↓
Creator Attribution Tracking Initiated:
    - Browser Cookie/Session Storage
    - URL Parameter Capture
    - Creator ID Association
    ↓
Standard Purchase Flow Continues
    ↓
Smart Contract Records Attribution:
    - Creator ID linked to ticket purchase
    - Commission calculation and distribution
    - Performance metrics updated
    ↓
Creator Receives Instant Payment Notification
```

**Attribution Smart Contract Logic**:
```rust
fn process_ticket_purchase(
    buyer: Address,
    event_id: String,
    quantity: u32,
    attribution_data: Option<AttributionData>
) -> Result<Vec<TicketId>, Error> {
    let event = EVENTS.get(&event_id)?;
    let total_price = event.ticket_price * quantity as i128;
    
    // Generate unique NFT tickets
    let tickets = generate_tickets(&event_id, quantity, &buyer)?;
    
    // Process revenue distribution
    distribute_revenue(&event_id, total_price, attribution_data)?;
    
    // Update event statistics
    update_event_stats(&event_id, quantity, total_price)?;
    
    Ok(tickets)
}

fn distribute_revenue(
    event_id: &String,
    total_amount: i128,
    attribution: Option<AttributionData>
) -> Result<(), Error> {
    let event = EVENTS.get(event_id)?;
    
    for split in event.splits.iter() {
        let amount = (total_amount * split.percentage as i128) / 10000;
        
        // Transfer payment to stakeholder
        transfer_payment(&split.beneficiary, amount)?;
        
        // Record transaction
        record_revenue_distribution(event_id, &split.beneficiary, amount)?;
    }
    
    // Handle creator attribution if present
    if let Some(attr) = attribution {
        process_creator_attribution(event_id, total_amount, attr)?;
    }
    
    Ok(())
}
```

### 3. Content Creator Campaign Workflow

#### Campaign Application Process
```
Creator Discovers Event → Campaign Details Review
    ↓
Application Submission:
    - Creative Brief Response
    - Content Timeline & Deliverables
    - Audience Insights & Demographics
    - Portfolio Examples
    ↓
Automated Eligibility Screening:
    - Minimum Follower Count Check
    - Engagement Rate Validation
    - Previous Performance Review
    ↓
Organizer Manual Review → Approval/Rejection
    ↓
If Approved: Campaign Agreement Generation
    ↓
Smart Contract Update with Creator Commission Rate
    ↓
Campaign Brief & Assets Shared → Creator Begins Work
```

#### Content Creation & Approval Process
```
Creator Develops Promotional Content
    ↓
Content Submission for Approval:
    - Draft Content Upload
    - Caption/Copy Text
    - Scheduled Publishing Time
    - Target Platform Selection
    ↓
Automated Content Scanning:
    - Brand Safety Check
    - Community Guidelines Compliance
    - Technical Requirements Validation
    ↓
Organizer/Brand Review → Feedback/Approval
    ↓
If Approved: Content Publishing Authorization
    ↓
Creator Publishes Content → Platform Verification
    ↓
Attribution Link Activation → Tracking Begins
```

#### Performance Tracking & Payment
```
Content Goes Live → Real-time Monitoring Begins
    ↓
Engagement Metrics Collection:
    - Views, Likes, Comments, Shares
    - Click-through Rates to Event Page
    - Conversion Tracking to Ticket Sales
    ↓
Attribution Algorithm Processing:
    - First-click, Last-click, Multi-touch Attribution
    - Time-decay Weighting for Campaign Duration
    - Cross-platform Engagement Aggregation
    ↓
Smart Contract Payment Triggers:
    - Verified Ticket Sale Attribution
    - Commission Calculation & Distribution
    - Real-time Payment to Creator Wallet
    ↓
Performance Dashboard Updates → Creator Notification
```

### 4. Brand Sponsorship Campaign Workflow

#### Campaign Setup & Creator Matching
```
Brand Partner Login → Campaign Creation Interface
    ↓
Campaign Configuration:
    - Objectives & Key Results (OKRs)
    - Budget Allocation & Spending Limits
    - Target Audience Demographics
    - Content Guidelines & Brand Requirements
    ↓
Creator Marketplace Integration:
    - AI-powered Creator Recommendations
    - Audience Overlap Analysis
    - Performance History Matching
    ↓
Creator Selection & Outreach:
    - Batch Creator Invitations
    - Individual Negotiation Interface
    - Contract Terms Agreement
    ↓
Campaign Launch → Multi-creator Coordination
```

#### Campaign Execution & Monitoring
```
Campaign Active → Real-time Monitoring Dashboard
    ↓
Content Approval Workflow:
    - Creator Submissions → Brand Review
    - Automated Brand Safety Scanning
    - Legal/Compliance Check
    ↓
Content Publishing Coordination:
    - Scheduled Publishing Calendar
    - Cross-platform Synchronization
    - Hashtag & Mention Tracking
    ↓
Performance Analytics Collection:
    - Reach, Impressions, Engagement
    - Click-through & Conversion Rates
    - Sentiment Analysis & Brand Mention Tracking
    ↓
ROI Calculation & Reporting:
    - Cost Per Acquisition (CPA)
    - Return on Ad Spend (ROAS)
    - Brand Awareness Lift Measurement
```

### 5. Event Day Operations Workflow

#### Pre-Event Preparation
```
24 Hours Before Event → System Preparation Mode
    ↓
Ticket Verification System Setup:
    - Venue QR Code Scanner Configuration
    - Staff Mobile App Distribution
    - Backup Manual Verification Process
    ↓
Final Revenue Reconciliation:
    - Smart Contract Balance Verification
    - Stakeholder Payment Confirmation
    - Outstanding Creator Commission Processing
    ↓
Real-time Monitoring Activation:
    - System Performance Dashboards
    - Customer Support Team Briefing
    - Emergency Response Procedures
```

#### Event Day Execution
```
Venue Gates Open → Ticket Scanning Begins
    ↓
Real-time Ticket Verification:
    - QR Code Scanning via Mobile App
    - Blockchain NFT Validation
    - Duplicate/Fraud Detection
    ↓
Attendance Tracking & Analytics:
    - Real-time Attendee Count
    - Demographic Data Collection
    - Entry Time Pattern Analysis
    ↓
Live Event Integration:
    - Social Media Wall Display
    - Creator Content Amplification
    - Brand Activation Coordination
    ↓
Post-event Data Collection:
    - Final Attendance Numbers
    - Revenue Reconciliation
    - Stakeholder Performance Reports
```

---

## Smart Contract Interactions

### Revenue Distribution Smart Contract
```rust
#[contract]
pub struct RevenueDistribution;

#[contractimpl]
impl RevenueDistribution {
    pub fn distribute_ticket_revenue(
        env: Env,
        event_id: String,
        ticket_price: i128,
        attribution_id: Option<String>
    ) -> Result<(), Error> {
        let event = get_event(&env, &event_id)?;
        
        // Base revenue distribution to core stakeholders
        for split in event.revenue_splits.iter() {
            let amount = (ticket_price * split.percentage as i128) / 10000;
            transfer(&env, &split.beneficiary, amount)?;
            
            emit_payment_event(&env, &event_id, &split.beneficiary, amount);
        }
        
        // Creator attribution bonus if applicable
        if let Some(creator_id) = attribution_id {
            let creator_commission = calculate_creator_commission(&event, ticket_price);
            transfer(&env, &Address::from_string(&creator_id), creator_commission)?;
            
            record_attribution(&env, &event_id, &creator_id, creator_commission)?;
        }
        
        Ok(())
    }
    
    pub fn process_bulk_distribution(
        env: Env,
        distributions: Vec<Distribution>
    ) -> Result<Vec<String>, Error> {
        let mut transaction_ids = Vec::new();
        
        for dist in distributions.iter() {
            let tx_id = process_single_distribution(&env, dist)?;
            transaction_ids.push(tx_id);
        }
        
        Ok(transaction_ids)
    }
}
```

### Ticket NFT Management
```rust
#[contract]
pub struct TicketNFT;

#[contractimpl]
impl TicketNFT {
    pub fn mint_ticket(
        env: Env,
        event_id: String,
        buyer: Address,
        tier: String,
        price: i128
    ) -> Result<String, Error> {
        let ticket_id = generate_unique_ticket_id(&env);
        
        let ticket = Ticket {
            id: ticket_id.clone(),
            event_id: event_id.clone(),
            owner: buyer.clone(),
            tier,
            purchase_price: price,
            issued_at: env.ledger().timestamp(),
            verification_code: generate_verification_code(&env),
            used: false,
        };
        
        TICKETS.set(&env, &ticket_id, &ticket);
        
        // Emit transfer event
        emit_mint_event(&env, &ticket_id, &buyer);
        
        Ok(ticket_id)
    }
    
    pub fn verify_ticket(
        env: Env,
        ticket_id: String,
        verification_code: String
    ) -> Result<bool, Error> {
        let mut ticket = TICKETS.get(&env, &ticket_id)?;
        
        // Verify the ticket hasn't been used and code matches
        if ticket.used {
            return Err(Error::TicketAlreadyUsed);
        }
        
        if ticket.verification_code != verification_code {
            return Err(Error::InvalidVerificationCode);
        }
        
        // Mark ticket as used
        ticket.used = true;
        TICKETS.set(&env, &ticket_id, &ticket);
        
        // Emit verification event
        emit_verification_event(&env, &ticket_id, &ticket.owner);
        
        Ok(true)
    }
    
    pub fn transfer_ticket(
        env: Env,
        ticket_id: String,
        from: Address,
        to: Address
    ) -> Result<(), Error> {
        let mut ticket = TICKETS.get(&env, &ticket_id)?;
        
        // Verify ownership
        if ticket.owner != from {
            return Err(Error::NotTicketOwner);
        }
        
        // Check if event allows transfers
        let event = get_event(&env, &ticket.event_id)?;
        if !event.allow_transfers {
            return Err(Error::TransfersNotAllowed);
        }
        
        // Update ownership
        ticket.owner = to.clone();
        TICKETS.set(&env, &ticket_id, &ticket);
        
        // Emit transfer event
        emit_transfer_event(&env, &ticket_id, &from, &to);
        
        Ok(())
    }
}
```

### Creator Attribution Smart Contract
```rust
#[contract]  
pub struct CreatorAttribution;

#[contractimpl]
impl CreatorAttribution {
    pub fn record_content_submission(
        env: Env,
        creator: Address,
        event_id: String,
        content_hash: String,
        platform: String
    ) -> Result<String, Error> {
        let attribution_id = generate_attribution_id(&env);
        
        let attribution = Attribution {
            id: attribution_id.clone(),
            creator: creator.clone(),
            event_id: event_id.clone(),
            content_hash,
            platform,
            submitted_at: env.ledger().timestamp(),
            approved: false,
            clicks: 0,
            conversions: 0,
            commission_earned: 0,
        };
        
        ATTRIBUTIONS.set(&env, &attribution_id, &attribution);
        
        emit_content_submission_event(&env, &attribution_id, &creator);
        
        Ok(attribution_id)
    }
    
    pub fn approve_content(
        env: Env,
        attribution_id: String,
        approver: Address
    ) -> Result<(), Error> {
        let mut attribution = ATTRIBUTIONS.get(&env, &attribution_id)?;
        
        // Verify approver has permission (event organizer or admin)
        verify_approval_permission(&env, &attribution.event_id, &approver)?;
        
        attribution.approved = true;
        ATTRIBUTIONS.set(&env, &attribution_id, &attribution);
        
        emit_content_approval_event(&env, &attribution_id);
        
        Ok(())
    }
    
    pub fn record_conversion(
        env: Env,
        attribution_id: String,
        ticket_sale_amount: i128
    ) -> Result<i128, Error> {
        let mut attribution = ATTRIBUTIONS.get(&env, &attribution_id)?;
        
        if !attribution.approved {
            return Err(Error::ContentNotApproved);
        }
        
        // Update conversion metrics
        attribution.conversions += 1;
        
        // Calculate creator commission
        let event = get_event(&env, &attribution.event_id)?;
        let commission = calculate_creator_commission(&event, ticket_sale_amount);
        attribution.commission_earned += commission;
        
        ATTRIBUTIONS.set(&env, &attribution_id, &attribution);
        
        // Transfer commission to creator
        transfer(&env, &attribution.creator, commission)?;
        
        emit_conversion_event(&env, &attribution_id, commission);
        
        Ok(commission)
    }
}
```

---

## Payment Processing

### Multi-Payment Method Integration

#### USDC/Stellar Payment Flow
```
User Selects USDC Payment → Wallet Connection Required
    ↓
Freighter/LOBSTR Wallet Integration:
    - User Authorization Request
    - Account Connection Verification
    - Balance Check for Sufficient Funds
    ↓
Smart Contract Payment Preparation:
    - Transaction Amount Calculation
    - Gas Fee Estimation
    - Revenue Split Preparation
    ↓
User Transaction Approval → Blockchain Submission
    ↓
Transaction Confirmation:
    - Stellar Network Validation (3-5 seconds)
    - Smart Contract Execution
    - Revenue Distribution to All Stakeholders
    ↓
Success Notification → NFT Ticket Generation
```

#### M-Pesa Integration Flow
```
User Selects M-Pesa Payment → Phone Number Entry
    ↓
Safaricom API Integration:
    - STK Push Request Initiation
    - User Mobile Confirmation Required
    - Payment Authorization on Phone
    ↓
Payment Confirmation Processing:
    - M-Pesa Transaction ID Capture
    - Amount Verification & Status Check
    - Fraud Detection Screening
    ↓
Fiat-to-USDC Conversion (if required):
    - Current Exchange Rate Application
    - Liquidity Pool Transaction
    - Conversion Fee Calculation
    ↓
Smart Contract Execution → Revenue Distribution
    ↓
Ticket Generation → SMS/Email Delivery
```

#### Bank Transfer Integration
```
User Selects Bank Transfer → Bank Selection Interface
    ↓
Banking API Integration (Equity, KCB, Safaricom Banking):
    - Account Verification Process
    - Available Balance Check
    - Transfer Authorization Request
    ↓
Payment Processing:
    - Real-time Transfer Execution
    - Transaction Status Monitoring
    - Confirmation Receipt Generation
    ↓
Payment Confirmation → Smart Contract Trigger
    ↓
Revenue Distribution → Ticket Issuance
```

### Revenue Distribution Logic

#### Multi-Stakeholder Payment Processing
```typescript
interface PaymentDistribution {
  eventId: string;
  totalAmount: number;
  distributions: StakeholderPayment[];
  creatorAttribution?: CreatorAttribution;
  brandSponsorship?: SponsorshipPayment;
}

interface StakeholderPayment {
  beneficiary: string; // Wallet address
  role: 'artist' | 'organizer' | 'venue' | 'platform';
  percentage: number; // Basis points (10000 = 100%)
  amount: number;
  paymentMethod: 'usdc' | 'xlm' | 'fiat';
}

async function processPaymentDistribution(
  payment: PaymentDistribution
): Promise<DistributionResult> {
  // 1. Validate total percentages sum to 100%
  validateDistributionPercentages(payment.distributions);
  
  // 2. Execute core stakeholder payments
  const corePayments = await Promise.all(
    payment.distributions.map(dist => 
      executeStakeholderPayment(dist)
    )
  );
  
  // 3. Process creator attribution if present
  let creatorPayment;
  if (payment.creatorAttribution) {
    creatorPayment = await processCreatorCommission(
      payment.eventId,
      payment.totalAmount,
      payment.creatorAttribution
    );
  }
  
  // 4. Handle brand sponsorship bonus
  let sponsorPayment;
  if (payment.brandSponsorship) {
    sponsorPayment = await processSponsorshipBonus(
      payment.brandSponsorship
    );
  }
  
  // 5. Record all transactions on blockchain
  await recordDistributionOnChain({
    eventId: payment.eventId,
    corePayments,
    creatorPayment,
    sponsorPayment,
    timestamp: Date.now()
  });
  
  return {
    success: true,
    transactionId: generateTransactionId(),
    distributions: [...corePayments, creatorPayment, sponsorPayment].filter(Boolean)
  };
}
```

---

## Error Handling & Edge Cases

### Payment Failure Scenarios

#### Smart Contract Execution Failures
```typescript
async function handleSmartContractFailure(
  error: ContractError,
  paymentData: PaymentDistribution
): Promise<RecoveryAction> {
  switch (error.type) {
    case 'INSUFFICIENT_BALANCE':
      // Retry with alternative funding source
      return await retryWithBackupFunding(paymentData);
      
    case 'NETWORK_CONGESTION':
      // Queue transaction for later retry with higher fee
      return await queueForRetryWithHigherFee(paymentData);
      
    case 'CONTRACT_PAUSED':
      // Use manual distribution as emergency fallback
      return await initiateManualDistribution(paymentData);
      
    case 'INVALID_SPLITS':
      // Recalculate splits and retry
      const correctedSplits = await recalculateRevenueSplits(paymentData);
      return await retryWithCorrectedSplits(correctedSplits);
      
    default:
      // Log error and initiate manual review
      await logCriticalError(error, paymentData);
      return await initiateManualReview(paymentData);
  }
}
```

#### Network Connectivity Issues
```typescript
class NetworkResilienceManager {
  private maxRetries = 3;
  private backoffMultiplier = 2;
  
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Log attempt failure
        console.warn(`${context} attempt ${attempt} failed:`, error.message);
        
        if (attempt < this.maxRetries) {
          // Exponential backoff delay
          const delay = 1000 * Math.pow(this.backoffMultiplier, attempt - 1);
          await this.sleep(delay);
        }
      }
    }
    
    // All retries exhausted - handle gracefully
    await this.handleFinalFailure(context, lastError);
    throw new Error(`${context} failed after ${this.maxRetries} attempts`);
  }
  
  private async handleFinalFailure(context: string, error: Error) {
    // Store failed operation for manual retry
    await this.queueForManualReview({
      context,
      error: error.message,
      timestamp: new Date(),
      retryCount: this.maxRetries
    });
    
    // Notify administrators
    await this.notifyAdministrators({
      severity: 'HIGH',
      message: `Critical operation failure: ${context}`,
      error: error.message
    });
  }
}
```

### Data Consistency Scenarios

#### Concurrent Ticket Purchase Handling
```typescript
class TicketInventoryManager {
  private lockManager = new DistributedLockManager();
  
  async purchaseTickets(
    eventId: string,
    quantity: number,
    buyerId: string
  ): Promise<PurchaseResult> {
    const lockKey = `event:${eventId}:inventory`;
    
    return await this.lockManager.withLock(lockKey, async () => {
      // 1. Check current availability
      const currentInventory = await this.getEventInventory(eventId);
      
      if (currentInventory.available < quantity) {
        throw new Error('Insufficient tickets available');
      }
      
      // 2. Reserve tickets atomically
      const reservation = await this.reserveTickets(eventId, quantity, buyerId);
      
      try {
        // 3. Process payment
        const paymentResult = await this.processPayment(reservation);
        
        // 4. Confirm reservation and generate NFTs
        const tickets = await this.confirmReservation(reservation);
        
        // 5. Update inventory
        await this.updateInventory(eventId, -quantity);
        
        return {
          success: true,
          tickets,
          paymentResult
        };
        
      } catch (paymentError) {
        // Release reservation on payment failure
        await this.releaseReservation(reservation);
        throw paymentError;
      }
    });
  }
}
```

#### Creator Attribution Conflicts
```typescript
async function resolveAttributionConflict(
  ticketId: string,
  conflictingAttributions: Attribution[]
): Promise<Attribution> {
  // Sort attributions by timestamp and confidence score
  const sortedAttributions = conflictingAttributions.sort((a, b) => {
    // Primary sort: confidence score (higher first)
    if (a.confidenceScore !== b.confidenceScore) {
      return b.confidenceScore - a.confidenceScore;
    }
    // Secondary sort: timestamp (earlier first for first-click attribution)
    return a.timestamp - b.timestamp;
  });
  
  const winningAttribution = sortedAttributions[0];
  
  // Log the conflict resolution for audit purposes
  await this.logAttributionResolution({
    ticketId,
    conflictingAttributions,
    winningAttribution,
    resolutionMethod: 'confidence_score_with_timestamp_tiebreak',
    timestamp: Date.now()
  });
  
  // Notify affected creators about the resolution
  await this.notifyCreatorsOfResolution(conflictingAttributions, winningAttribution);
  
  return winningAttribution;
}
```

---

## Real-time Features

### Live Dashboard Updates

#### WebSocket Event Broadcasting
```typescript
class RealTimeDashboard {
  private io: SocketIO.Server;
  private eventChannels = new Map<string, Set<string>>();
  
  async broadcastEventUpdate(eventId: string, update: EventUpdate) {
    const channel = `event:${eventId}`;
    
    // Broadcast to all connected clients for this event
    this.io.to(channel).emit('eventUpdate', {
      type: update.type,
      data: update.data,
      timestamp: Date.now()
    });
    
    // Also update specific stakeholder channels
    await this.updateStakeholderChannels(eventId, update);
  }
  
  private async updateStakeholderChannels(eventId: string, update: EventUpdate) {
    const event = await this.getEventDetails(eventId);
    
    // Update organizer dashboard
    this.io.to(`organizer:${event.organizerId}`).emit('revenueUpdate', {
      eventId,
      newTotal: update.data.totalRevenue,
      ticketsSold: update.data.ticketsSold
    });
    
    // Update creator dashboards
    for (const creator of event.creators) {
      this.io.to(`creator:${creator.id}`).emit('attributionUpdate', {
        eventId,
        newCommissions: update.data.creatorCommissions[creator.id] || 0,
        conversionCount: update.data.creatorConversions[creator.id] || 0
      });
    }
    
    // Update brand sponsor dashboards
    for (const sponsor of event.sponsors) {
      this.io.to(`brand:${sponsor.id}`).emit('campaignUpdate', {
        eventId,
        roi: this.calculateROI(sponsor.spend, update.data.attributedRevenue[sponsor.id]),
        reach: update.data.brandReach[sponsor.id]
      });
    }
  }
}
```

#### Real-time Analytics Processing
```typescript
class AnalyticsProcessor {
  private eventStream: EventEmitter;
  private metricsAggregator: MetricsAggregator;
  
  constructor() {
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    // Handle ticket purchases
    this.eventStream.on('ticket:purchased', async (event) => {
      await this.processTicketPurchase(event);
    });
    
    // Handle creator content interactions
    this.eventStream.on('creator:interaction', async (event) => {
      await this.processCreatorInteraction(event);
    });
    
    // Handle brand campaign metrics
    this.eventStream.on('brand:engagement', async (event) => {
      await this.processBrandEngagement(event);
    });
  }
  
  private async processTicketPurchase(purchaseEvent: TicketPurchaseEvent) {
    // Update real-time metrics
    await this.metricsAggregator.increment(`event:${purchaseEvent.eventId}:tickets_sold`);
    await this.metricsAggregator.add(`event:${purchaseEvent.eventId}:revenue`, purchaseEvent.amount);
    
    // Process attribution if present
    if (purchaseEvent.attributionId) {
      await this.metricsAggregator.increment(`creator:${purchaseEvent.creatorId}:conversions`);
      await this.metricsAggregator.add(`creator:${purchaseEvent.creatorId}:commissions`, purchaseEvent.commission);
    }
    
    // Trigger real-time dashboard updates
    await this.broadcastMetricsUpdate(purchaseEvent.eventId);
  }
  
  private async broadcastMetricsUpdate(eventId: string) {
    const currentMetrics = await this.metricsAggregator.getEventMetrics(eventId);
    
    // Broadcast to all interested parties
    this.eventStream.emit('metrics:updated', {
      eventId,
      metrics: currentMetrics,
      timestamp: Date.now()
    });
  }
}
```

### Live Event Day Features

#### Real-time Venue Entry Tracking
```typescript
class VenueEntryTracker {
  private entryGates: Map<string, GateScanner>;
  private attendanceStream: EventEmitter;
  
  async processTicketScan(gateId: string, ticketData: ScannedTicket): Promise<EntryResult> {
    try {
      // 1. Verify ticket authenticity on blockchain
      const isValid = await this.verifyTicketOnChain(ticketData.ticketId, ticketData.verificationCode);
      
      if (!isValid) {
        return {
          success: false,
          reason: 'INVALID_TICKET',
          timestamp: Date.now()
        };
      }
      
      // 2. Check for duplicate entry attempts
      const previousEntry = await this.checkPreviousEntry(ticketData.ticketId);
      
      if (previousEntry) {
        return {
          success: false,
          reason: 'TICKET_ALREADY_USED',
          originalEntry: previousEntry,
          timestamp: Date.now()
        };
      }
      
      // 3. Record successful entry
      await this.recordEntry({
        ticketId: ticketData.ticketId,
        gateId,
        timestamp: Date.now(),
        attendeeId: ticketData.ownerId
      });
      
      // 4. Update real-time attendance counter
      this.attendanceStream.emit('entry:recorded', {
        eventId: ticketData.eventId,
        gateId,
        timestamp: Date.now()
      });
      
      // 5. Trigger loyalty rewards
      await this.processAttendanceRewards(ticketData.ownerId, ticketData.eventId);
      
      return {
        success: true,
        welcomeMessage: await this.getPersonalizedWelcome(ticketData.ownerId),
        timestamp: Date.now()
      };
      
    } catch (error) {
      // Log error and allow manual verification
      await this.logEntryError(gateId, ticketData, error);
      
      return {
        success: false,
        reason: 'SYSTEM_ERROR',
        requiresManualVerification: true,
        timestamp: Date.now()
      };
    }
  }
  
  private async processAttendanceRewards(attendeeId: string, eventId: string) {
    // Award loyalty tokens for event attendance
    const rewardAmount = await this.calculateAttendanceReward(eventId);
    
    await this.loyaltyContract.rewardEventAttendance(
      attendeeId,
      eventId,
      rewardAmount
    );
    
    // Notify attendee of reward
    this.notificationService.sendRewardNotification(attendeeId, {
      type: 'ATTENDANCE_REWARD',
      amount: rewardAmount,
      eventId
    });
  }
}
```

This comprehensive workflow documentation demonstrates how Passa orchestrates complex multi-stakeholder interactions while maintaining transparency, automation, and real-time responsiveness across all platform operations. The system is designed to handle edge cases gracefully while providing seamless user experiences for all participant types.