# Soroban Smart Contract Payment Integration Plan

## Overview
This document outlines how artist agreements and payments integrate with Soroban smart contracts on Stellar and automated payment distribution after event performance.

## Stellar vs Soroban
**Stellar**: Native blockchain operations (payments, account creation, multi-sig)
**Soroban**: Smart contract platform on Stellar (programmable logic, escrow contracts, automated execution)

**Why Soroban for Passa:**
- **Programmable escrow**: Complex deposit/final payment logic in smart contracts
- **Automated execution**: Performance confirmation triggers automatic payments
- **Custom business logic**: Deposit percentages, dispute resolution, time locks
- **State management**: Track payment status, confirmations, balances in contract
- **Integration**: Can still use Stellar native assets (USDC) within contracts

## Current System State
- Artist invitations with negotiated FIXED fees stored in database
- Event publishing when all artists accept
- Payment model: Fixed agreed amounts with deposit system
- Existing workflows: Apply → Invite → Negotiate → Accept → Auto-publish

## Soroban Integration

### 1. Agreement Creation (Smart Contract Deployment)
**When**: Artist accepts invitation with agreed fee
**Process**:
```typescript
// After artist accepts in invitation-response.ts
1. Deploy Soroban escrow contract for agreement
2. Initialize contract with organizer, artist, and agreed fee
3. Fund contract with total payment amount
4. Store contract address in database
5. Update invitation status to 'CONTRACTED'
```

**Soroban Contract Structure**:
```rust
// Artist Agreement Contract (Rust)
#[contract]
pub struct ArtistAgreement;

#[contractdata]
pub struct AgreementData {
    pub organizer: Address,
    pub artist: Address,
    pub agreed_fee: i128,
    pub deposit_paid: bool,
    pub final_payment_paid: bool,
    pub organizer_confirmed: bool,
    pub artist_confirmed: bool,
    pub event_date: u64,
}

#[contractimpl]
impl ArtistAgreement {
    pub fn initialize(
        env: Env,
        organizer: Address,
        artist: Address,
        agreed_fee: i128,
        event_date: u64
    ) -> Self {
        // Initialize contract with agreement terms
    }
    
    pub fn pay_deposit(env: Env) -> Result<(), Error> {
        // Pay 50% deposit to artist
    }
    
    pub fn confirm_performance(env: Env, confirmer: Address) -> Result<(), Error> {
        // Record performance confirmation
    }
    
    pub fn pay_final_amount(env: Env) -> Result<(), Error> {
        // Pay remaining 50% after confirmation
    }
}
```

### 2. Event Master Contract Creation
**When**: All artists accept and event is published
**Process**:
```typescript
// In existing auto-publish logic
1. Deploy main event master contract
2. Link all artist agreement contracts
3. Fund master contract with total artist fees + platform fee
4. Trigger automatic deposit payments to all artists
```

**Event Master Contract**:
```rust
#[contract]
pub struct EventMaster;

#[contractdata]
pub struct EventData {
    pub event_id: u32,
    pub organizer: Address,
    pub artist_contracts: Vec<Address>,
    pub total_artist_fees: i128,
    pub passa_fee: i128,
    pub deposits_paid: bool,
    pub event_completed: bool,
}

#[contractimpl]
impl EventMaster {
    pub fn pay_all_deposits(env: Env) -> Result<(), Error> {
        // Call pay_deposit on all artist contracts
        for contract_addr in self.artist_contracts {
            // Invoke artist contract deposit function
        }
    }
    
    pub fn finalize_payments(env: Env) -> Result<(), Error> {
        // Pay final amounts to confirmed artists
        // Pay platform fee to Passa
    }
}
```

## Soroban Payment Flow Architecture

### Phase 1: Event Funding & Deposits (Pre-Event)
```
All artists accept → Deploy contracts → Fund master contract → Auto-pay deposits → Event published
```

**Implementation**:
- Deploy individual artist agreement contracts
- Deploy master event contract linking all artist contracts
- Organizer funds master contract with total fees
- Smart contracts automatically pay 50% deposits to all artists
- Event publishes only after all deposits are confirmed

### Phase 2: Performance Confirmation (Event Day)
```
Event happens → Multi-party confirmation → Release remaining 50%
```

**Confirmation Methods**:
1. **Organizer Confirmation**: Confirms each artist performed satisfactorily
2. **Artist Confirmation**: Artist confirms they completed performance
3. **Time-based Release**: Automatic release 48 hours after event if no disputes
4. **Passa Mediation**: Resolves disputes or handles non-performance cases

### Phase 3: Smart Contract Automated Payments
```
Performance confirmed → Smart contract executes → Automatic final payments
```

## Complete Soroban Deposit System

### How Smart Contract Deposits Work:
1. **Artist accepts invitation** → Agreed fee: $2000
2. **All artists accept** → Deploy individual artist contracts
3. **Deploy master contract** → Links all artist contracts
4. **Organizer funds master** → Total fees ($10,000 + $50 platform fee)
5. **Smart contract auto-pays deposits** → Each artist gets 50% ($1000)
6. **Event published** → Artists secured with blockchain-guaranteed deposits
7. **Event happens** → Performance confirmation in smart contract
8. **Smart contract auto-pays final** → Remaining 50% ($1000) + platform fee

### Soroban Implementation:
```typescript
// 1. Deploy and Fund Event (TypeScript integration)
import { Contract, SorobanRpc, TransactionBuilder } from '@stellar/stellar-sdk';

async function deployEventContracts(eventId: number) {
    const event = await getEventWithArtists(eventId);
    const artistContracts = [];
    
    // Deploy individual artist contracts
    for (const invitation of event.artistInvitations) {
        const contract = await deployArtistContract({
            organizer: event.organizer.stellarAddress,
            artist: invitation.artist.stellarAddress,
            agreedFee: invitation.proposedFee,
            eventDate: event.date
        });
        artistContracts.push(contract.address);
        
        // Update database with contract address
        await prisma.artistInvitation.update({
            where: { id: invitation.id },
            data: { escrowAccountId: contract.address }
        });
    }
    
    // Deploy master event contract
    const masterContract = await deployEventMasterContract({
        eventId: eventId,
        organizer: event.organizer.stellarAddress,
        artistContracts: artistContracts,
        totalFees: event.artistInvitations.reduce((sum, inv) => sum + inv.proposedFee, 0),
        passaFee: calculateFixedPassaFee(event)
    });
    
    return { masterContract, artistContracts };
}

// 2. Fund and Trigger Deposits
async function fundAndPayDeposits(eventId: number, organizerKeypair: Keypair) {
    const event = await getEventWithContracts(eventId);
    
    // Fund master contract
    const fundingTx = new TransactionBuilder(organizerAccount, { fee: BASE_FEE })
        .addOperation(Operation.invokeContract({
            contract: event.masterContractAddress,
            method: 'fund_event',
            args: [nativeToScVal(event.totalArtistFees + event.passaFee, {type: 'i128'})]
        }))
        .setTimeout(300)
        .build();
    
    await submitTransaction(fundingTx, organizerKeypair);
    
    // Trigger automatic deposit payments
    const depositTx = new TransactionBuilder(organizerAccount, { fee: BASE_FEE })
        .addOperation(Operation.invokeContract({
            contract: event.masterContractAddress,
            method: 'pay_all_deposits',
            args: []
        }))
        .setTimeout(300)
        .build();
    
    return await submitTransaction(depositTx, organizerKeypair);
}

// 3. Performance Confirmation and Final Payment
async function confirmPerformanceAndPay(eventId: number, artistId: number) {
    const invitation = await getInvitationWithContract(eventId, artistId);
    
    // Confirm performance in artist contract
    const confirmTx = new TransactionBuilder(account, { fee: BASE_FEE })
        .addOperation(Operation.invokeContract({
            contract: invitation.escrowAccountId,
            method: 'confirm_performance',
            args: [addressToScVal(confirmerAddress)]
        }))
        .setTimeout(300)
        .build();
    
    await submitTransaction(confirmTx, keypair);
    
    // Check if both parties confirmed, then trigger final payment
    const contractState = await getContractState(invitation.escrowAccountId);
    if (contractState.organizer_confirmed && contractState.artist_confirmed) {
        const finalPaymentTx = new TransactionBuilder(account, { fee: BASE_FEE })
            .addOperation(Operation.invokeContract({
                contract: invitation.escrowAccountId,
                method: 'pay_final_amount',
                args: []
            }))
            .setTimeout(300)
            .build();
        
        return await submitTransaction(finalPaymentTx, keypair);
    }
}
```

## Database Integration

### New Tables/Fields Needed
```sql
-- Add to existing User table for Stellar addresses
ALTER TABLE "User" ADD COLUMN stellarAddress VARCHAR(56); -- Stellar public key
ALTER TABLE "User" ADD COLUMN stellarSeed VARCHAR(56); -- Encrypted private key

-- Add to existing ArtistInvitation table
ALTER TABLE "ArtistInvitation" ADD COLUMN escrowAccountId VARCHAR(56); -- Soroban contract address
ALTER TABLE "ArtistInvitation" ADD COLUMN depositPaid DECIMAL(10,2) DEFAULT 0; -- Amount paid as deposit
ALTER TABLE "ArtistInvitation" ADD COLUMN remainingBalance DECIMAL(10,2) DEFAULT 0; -- Amount owed after performance
ALTER TABLE "ArtistInvitation" ADD COLUMN depositPaidAt TIMESTAMP; -- When deposit was paid
ALTER TABLE "ArtistInvitation" ADD COLUMN finalPaymentAt TIMESTAMP; -- When final payment was made
ALTER TABLE "ArtistInvitation" ADD COLUMN performanceConfirmed BOOLEAN DEFAULT FALSE;
ALTER TABLE "ArtistInvitation" ADD COLUMN organizerConfirmed BOOLEAN DEFAULT FALSE;
ALTER TABLE "ArtistInvitation" ADD COLUMN artistConfirmed BOOLEAN DEFAULT FALSE;

-- Add to existing Event table  
ALTER TABLE "Event" ADD COLUMN masterContractAddress VARCHAR(56); -- Soroban master contract
ALTER TABLE "Event" ADD COLUMN totalArtistFees DECIMAL(10,2) DEFAULT 0; -- Sum of all agreed artist fees
ALTER TABLE "Event" ADD COLUMN totalDepositsRequired DECIMAL(10,2) DEFAULT 0; -- Total deposits needed
ALTER TABLE "Event" ADD COLUMN totalDepositsPaid DECIMAL(10,2) DEFAULT 0; -- Total deposits already paid
ALTER TABLE "Event" ADD COLUMN finalPaymentsDistributed BOOLEAN DEFAULT FALSE;
ALTER TABLE "Event" ADD COLUMN venueAddress VARCHAR(56); -- Venue Stellar address
ALTER TABLE "Event" ADD COLUMN passaFee DECIMAL(10,2) DEFAULT 0; -- Fixed platform fee

-- New table for Soroban transaction tracking
CREATE TABLE "SorobanTransaction" (
    id SERIAL PRIMARY KEY,
    eventId INTEGER REFERENCES "Event"(id),
    artistId INTEGER REFERENCES "User"(id),
    amount DECIMAL(10,2),
    transactionHash VARCHAR(64), -- Soroban transaction hash
    ledger INTEGER, -- Stellar ledger number
    contractAddress VARCHAR(56), -- Contract that executed the transaction
    type VARCHAR(20), -- 'DEPOSIT', 'FINAL_PAYMENT', 'PASSA_FEE', 'ORGANIZER_FUNDING', 'REFUND'
    status VARCHAR(20), -- 'PENDING', 'SUCCESS', 'FAILED'
    memo TEXT, -- Stellar memo
    createdAt TIMESTAMP DEFAULT NOW()
);
```

## Implementation Phases

### Phase 1: Stellar Account Setup Integration
```typescript
// src/lib/stellar/accounts.ts
import * as StellarSdk from 'stellar-sdk';

export async function createArtistEscrowAccount(
    organizerAddress: string,
    artistAddress: string, 
    agreedFee: number,
    eventDate: Date
) {
    const keypair = StellarSdk.Keypair.random();
    const server = new StellarSdk.Server('https://horizon.stellar.org');
    
    // Create and fund escrow account
    const createAccountOp = StellarSdk.Operation.createAccount({
        destination: keypair.publicKey(),
        startingBalance: '2' // Minimum balance
    });
    
    // Set up multi-signature
    const setOptionsOp = StellarSdk.Operation.setOptions({
        signer: {
            ed25519PublicKey: organizerAddress,
            weight: 1
        },
        lowThreshold: 2,
        medThreshold: 2,
        highThreshold: 3
    });
    
    return keypair.publicKey();
}

export async function createEventEscrowAccount(
    eventId: number,
    artistEscrowAccounts: string[],
    venueAddress: string
) {
    // Create main event escrow account
    // Set up payment streams to artist accounts
    // Configure multi-signature with organizer + Passa
    const keypair = StellarSdk.Keypair.random();
    return keypair.publicKey();
}
```

### Phase 2: Stellar Payment Processing
```typescript
// src/lib/stellar/payments.ts
export async function confirmPerformance(
    eventId: number,
    artistId: number,
    confirmedBy: 'ORGANIZER' | 'ARTIST'
) {
    // Update confirmation in database
    await prisma.artistInvitation.update({
        where: { eventId, artistId },
        data: {
            [confirmedBy === 'ORGANIZER' ? 'organizerConfirmed' : 'artistConfirmed']: true
        }
    });
    
    // Check if both parties confirmed
    const invitation = await prisma.artistInvitation.findFirst({
        where: { eventId, artistId }
    });
    
    if (invitation?.organizerConfirmed && invitation?.artistConfirmed) {
        await triggerPaymentDistribution(eventId, artistId);
    }
}

export async function distributePayments(eventId: number) {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { artistInvitations: true }
    });
    
    // Create Stellar payment operations
    const operations = await buildPaymentOperations(event);
    
    // Submit multi-signature transaction
    const result = await submitStellarTransaction(operations);
    
    // Update database with transaction hashes
    await recordStellarTransactions(eventId, result);
    
    // Send notifications
    await notifyPaymentDistribution(eventId);
}
```

### Phase 3: User Interface Updates

#### Organizer Dashboard Enhancements
```typescript
// Add to /dashboard/organizer/events/[id]
- Contract deployment status
- Performance confirmation controls
- Payment distribution dashboard
- Real-time revenue tracking
```

#### Artist Dashboard Enhancements  
```typescript
// Add to artist dashboard
- Contract status view
- Performance confirmation
- Payment history
- Earnings analytics
```

## User Experience Flow

### For Organizers
1. **Agreement Phase**: See contract deployment status after artist accepts
2. **Event Day**: Confirm artist performances via dashboard
3. **Post-Event**: View payment distribution and transaction hashes
4. **Analytics**: Track revenue, payments, and contract performance

### For Artists
1. **Agreement Phase**: See contract address and locked fee amount
2. **Event Day**: Confirm own performance (optional multi-party confirmation)
3. **Post-Event**: Receive automatic payments to wallet
4. **History**: View all payments and contract interactions

### For Fans
1. **Ticket Purchase**: Pay directly to smart contract (transparent)
2. **Event Attendance**: Participate in performance confirmation (future)
3. **Transparency**: View contract addresses and payment distributions

## Security Considerations

### Smart Contract Security
- Multi-signature requirements for large payments
- Time-locked releases for dispute resolution
- Emergency pause functionality
- Audit requirements before mainnet deployment

### Database Security
- Encrypt wallet addresses
- Secure contract address storage
- Transaction hash verification
- Payment amount validation

## Integration Points

### Existing System Integration
```typescript
// Update existing invitation-response.ts
async function acceptInvitation() {
    // Existing logic...
    
    // New: Create Stellar escrow account
    const escrowAccountId = await createArtistEscrowAccount(
        invitation.event.organizer.stellarAddress,
        invitation.artist.stellarAddress,
        invitation.proposedFee,
        invitation.event.date
    );
    
    // Update database with escrow account
    await prisma.artistInvitation.update({
        where: { id: invitationId },
        data: { escrowAccountId }
    });
    
    // Check if all artists accepted for event escrow creation
    const allAccepted = await checkAllArtistsAccepted(invitation.eventId);
    if (allAccepted) {
        await createEventEscrowAccount(invitation.eventId);
        // Existing auto-publish logic continues...
    }
}
```

### Notification System Integration
```typescript
// Add new notification types to existing system
- 'ESCROW_CREATED': When Stellar escrow account is created
- 'PERFORMANCE_CONFIRMED': When performance is confirmed
- 'PAYMENT_RECEIVED': When Stellar payment is received
- 'PAYMENT_FAILED': If Stellar payment fails
- 'FUNDS_LOCKED': When ticket sales funds are secured in escrow
```

## Testing Strategy

### Development Environment
- Use Stellar Testnet (https://horizon-testnet.stellar.org)
- Mock payment confirmations with test accounts
- Simulate event scenarios with test XLM/USDC
- Test multi-signature workflows

### Production Deployment
- Gradual rollout with select events
- Monitor Stellar transaction fees (minimal ~0.00001 XLM)
- Track payment success rates via Horizon API
- User feedback collection
- Stellar anchor integration for fiat on/off ramps

## Future Enhancements

### Advanced Features
- **Dispute Resolution**: Multi-signature escrow for conflicts
- **Performance Metrics**: Attendance-based bonus payments
- **Dynamic Pricing**: Smart contract-based ticket pricing
- **Cross-chain Support**: Multiple blockchain networks
- **Oracle Integration**: Real-world data for automatic confirmations

### Analytics & Reporting
- Revenue analytics dashboard
- Payment success metrics
- Contract performance tracking
- Artist earnings reports
- Platform fee optimization

This integration transforms Passa from a simple ticketing platform into a fully automated, blockchain-powered event ecosystem with transparent, instant payments for all participants.