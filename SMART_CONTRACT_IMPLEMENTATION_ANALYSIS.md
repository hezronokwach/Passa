# Passa Smart Contract Implementation Analysis

## Overview

The current smart contract implementation is a **Soroban-based payment splitter** that can be adapted for the MVP requirement: **bilateral agreements between organizers and artists** with funds held in escrow until both parties agree to release payment.

## What Has Been Implemented

### 1. **SplitterRegistry Contract** (`lib.rs`)
A Rust-based Soroban smart contract that manages payment agreements between multiple parties.

#### Core Data Structures:
- **Agreement**: Contains payer, token, payees, budget, deadline, and approval system
- **Share**: Defines recipient address and basis points (percentage) for revenue splits
- **Error Handling**: 9 different error types for various failure scenarios

#### Key Functions:
1. **`create_agreement()`** - Creates new payment agreement
2. **`release()`** - Pays specific amount to individual contractor (requires authorization)
3. **`release_split()`** - Distributes total amount based on predefined percentages
4. **`close()`** - Closes agreement and prevents further releases
5. **`get()`** - Retrieves agreement details

### 2. **TypeScript Client** (`index.ts`)
JavaScript/TypeScript bindings for interacting with the smart contract from web applications.

### 3. **Comprehensive Tests** (`test.rs`)
Unit tests covering main contract functionality.

## MVP Requirements Analysis

### ✅ **What Already Works for MVP**

#### 1. **Bilateral Agreement Structure**
- **Current**: Contract supports `payer` (organizer) and `approvers` (can include artist)
- **MVP Use**: Organizer creates agreement, artist must approve payment release
- **Perfect Fit**: Both parties must agree before money is released

#### 2. **Escrow Functionality**
- **Current**: Funds held in contract until authorized release
- **MVP Use**: Ticket sales money held in escrow until both parties agree
- **Perfect Fit**: Prevents organizer from withholding payment

#### 3. **Authorization System**
- **Current**: Requires payer OR approver to authorize releases
- **MVP Use**: Both organizer and artist must agree to release payment
- **Good Foundation**: Can be modified for bilateral approval

#### 4. **Fixed Amount Support**
- **Current**: `release()` function supports exact amounts
- **MVP Use**: Artist gets exactly the agreed fixed fee
- **Perfect Fit**: No percentage calculations needed

## Required Modifications for MVP

### 1. **Bilateral Approval System**
```rust
// Current: Either payer OR approver can release
// Needed: Both payer AND artist must approve

pub struct ArtistAgreement {
    pub organizer: Address,      // payer
    pub artist: Address,         // must approve
    pub fixed_fee: i128,         // exact amount agreed
    pub event_date: u64,         // when event happens
    pub organizer_approved: bool, // organizer says "event completed"
    pub artist_approved: bool,    // artist says "I performed"
    pub released: bool,          // payment sent
}
```

### 2. **Two-Step Release Process**
```rust
// Step 1: Organizer confirms event completion
pub fn organizer_confirm_completion(env: Env, agreement_id: Symbol) {
    // Organizer says: "Event happened, artist performed"
}

// Step 2: Artist confirms performance
pub fn artist_confirm_performance(env: Env, agreement_id: Symbol) {
    // Artist says: "Yes, I performed as agreed"
}

// Step 3: Automatic release when both approve
pub fn try_release_payment(env: Env, agreement_id: Symbol) {
    // If both approved, send fixed fee to artist
}
```

## MVP Workflow with Current Contract

### Phase 1: Agreement Creation
1. **Organizer invites artist** (via Passa web app)
2. **Artist accepts invitation** with fixed fee (e.g., $5,000)
3. **Smart contract created** with:
   - Organizer as payer
   - Artist as approver
   - Fixed fee amount
   - Event date

### Phase 2: Ticket Sales (Escrow)
1. **Fans buy tickets** → Money goes to organizer's wallet
2. **Organizer deposits funds** → Approves contract to spend fixed fee amount
3. **Funds secured in escrow** → Contract can now pay artist

### Phase 3: Event Completion (Bilateral Release)
1. **Event happens** → Artist performs
2. **Organizer confirms** → "Event completed successfully"
3. **Artist confirms** → "I performed as agreed"
4. **Automatic payment** → Artist receives fixed fee immediately

## Integration with Current Passa Platform

### 1. **Database Changes Needed**
```sql
-- Add contract tracking to invitations table
ALTER TABLE "ArtistInvitation" ADD COLUMN contract_id VARCHAR(255);
ALTER TABLE "ArtistInvitation" ADD COLUMN organizer_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE "ArtistInvitation" ADD COLUMN artist_approved BOOLEAN DEFAULT FALSE;
```

### 2. **Web App Integration Points**

#### When Artist Accepts Invitation:
```typescript
// Create smart contract agreement
const contractClient = new Client({
  contractId: PASSA_CONTRACT_ID,
  networkPassphrase: Networks.TESTNET,
  rpcUrl: 'https://soroban-testnet.stellar.org'
});

await contractClient.create_agreement({
  id: `event_${eventId}_artist_${artistId}`,
  payer: organizerWalletAddress,
  token: USDC_TOKEN_ADDRESS,
  payees: [{ recipient: artistWalletAddress, bps: 10000 }], // 100% to artist
  budget: agreedFeeAmount,
  deadline: eventDate,
  approvers: [artistWalletAddress]
});
```

#### After Event Completion:
```typescript
// Organizer confirms event completion
await contractClient.organizer_confirm_completion({
  agreement_id: contractId
});

// Artist confirms performance
await contractClient.artist_confirm_performance({
  agreement_id: contractId
});

// Payment automatically released if both confirmed
```

### 3. **UI Components Needed**

#### For Organizers:
- **"Confirm Event Completion"** button after event date
- **Escrow balance display** showing funds available
- **Agreement status** showing artist approval status

#### For Artists:
- **"Confirm Performance"** button after event
- **Payment status** showing when organizer has confirmed
- **Wallet integration** for receiving payments

## What Remains to Be Done

### 1. **Smart Contract Modifications** (2-3 days)
- [ ] Add bilateral approval system
- [ ] Modify release logic for two-step confirmation
- [ ] Add event completion tracking
- [ ] Update tests for new workflow

### 2. **Database Integration** (1 day)
- [ ] Add contract_id to ArtistInvitation table
- [ ] Add approval status fields
- [ ] Create contract deployment service

### 3. **Web App Integration** (3-4 days)
- [ ] Install Stellar SDK and contract client
- [ ] Add wallet connection for organizers and artists
- [ ] Create contract deployment on invitation acceptance
- [ ] Add confirmation UI components
- [ ] Add payment status tracking

### 4. **Testing & Deployment** (2 days)
- [ ] Test full workflow on testnet
- [ ] Deploy updated contract to testnet
- [ ] Integration testing with web app
- [ ] User acceptance testing

## Technical Implementation Steps

### Step 1: Contract Modification
```rust
// Add to existing contract
pub fn organizer_confirm_completion(env: Env, id: Symbol) {
    let mut agreement = Self::must_get(&env, &id);
    agreement.payer.require_auth();
    
    // Mark organizer as confirmed
    agreement.organizer_approved = true;
    env.storage().persistent().set(&DataKey::Agreement(id), &agreement);
    
    // Try automatic release if both parties approved
    Self::try_auto_release(&env, &id, &agreement);
}

pub fn artist_confirm_performance(env: Env, id: Symbol) {
    let mut agreement = Self::must_get(&env, &id);
    // Require artist authorization
    agreement.payees.get(0).unwrap().recipient.require_auth();
    
    // Mark artist as confirmed
    agreement.artist_approved = true;
    env.storage().persistent().set(&DataKey::Agreement(id), &agreement);
    
    // Try automatic release if both parties approved
    Self::try_auto_release(&env, &id, &agreement);
}
```

### Step 2: Web App Service
```typescript
// services/smart-contract.ts
export class PassaContractService {
  async createArtistAgreement(invitation: ArtistInvitation) {
    // Deploy contract when artist accepts invitation
  }
  
  async confirmEventCompletion(contractId: string) {
    // Organizer confirms event happened
  }
  
  async confirmPerformance(contractId: string) {
    // Artist confirms they performed
  }
  
  async getAgreementStatus(contractId: string) {
    // Check approval status and payment state
  }
}
```

## Benefits of This Approach

### 1. **True Bilateral Agreement**
- Both parties must explicitly agree before payment
- Prevents disputes and ensures mutual satisfaction
- Builds trust between organizers and artists

### 2. **Escrow Protection**
- Funds secured before event
- Artist guaranteed payment if they perform
- Organizer protected from no-shows

### 3. **Minimal Changes to Current System**
- Existing invitation workflow mostly unchanged
- Smart contract layer adds security without complexity
- Current UI can be enhanced rather than rebuilt

## Conclusion

The current smart contract implementation is **surprisingly well-suited** for the MVP bilateral agreement system. The main changes needed are:

1. **Add bilateral approval logic** (both parties must confirm)
2. **Integrate with invitation acceptance** (create contracts automatically)
3. **Add confirmation UI** (simple buttons for both parties)

**Timeline**: 7-10 days for full implementation
**Complexity**: Medium (mostly integration work, not rebuilding)
**Risk**: Low (building on proven contract foundation)