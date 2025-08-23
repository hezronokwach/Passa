# Passa MVP Smart Contract Workflow
## Artists & Fans Payment System

## Introduction

Passa uses **Soroban smart contracts** on Stellar blockchain to guarantee artists get paid their **fixed agreed amount** immediately after events. No percentages, no delays, no middlemen.

## Simple 3-Step Process

### Step 1: Artist Agreement (Fixed Payment)
When an artist accepts an event invitation:
- **Fixed Fee Agreed**: Artist negotiates and agrees to exact amount (e.g., $5,000)
- **Smart Contract Created**: Contract locks in this fixed payment amount
- **Artist Wallet Added**: Artist provides Stellar address for payment
- **Payment Guaranteed**: Money is guaranteed regardless of ticket sales

### Step 2: Fan Ticket Purchases (Escrow Collection)
When fans buy tickets:
- **Ticket Purchase**: Fan pays for ticket (e.g., $50 per ticket)
- **Money Goes to Escrow**: Payment automatically goes to smart contract
- **Funds Accumulate**: All ticket sales build up in the contract
- **Artist Payment Reserved**: Contract always keeps artist's $5,000 safe

### Step 3: Event Day Payment (Automatic Release)
After the event happens:
- **Event Completes**: Smart contract detects event date has passed
- **Instant Payment**: Artist immediately receives their full $5,000
- **No Waiting**: Payment happens within seconds, not weeks
- **Blockchain Proof**: Permanent record that payment was made

## Real Example: Wizkid Concert

### The Setup
- **Artist**: Wizkid agrees to perform for **$10,000 fixed fee**
- **Tickets**: 1,000 tickets at $75 each = $75,000 total possible revenue
- **Smart Contract**: Deployed with Wizkid's $10,000 guaranteed

### The Process
1. **Contract Deployment**: Smart contract created with $10,000 reserved for Wizkid
2. **Ticket Sales Begin**: Fans start buying tickets, money goes to escrow
3. **Sales Progress**: 800 tickets sold = $60,000 in escrow
4. **Event Day**: Concert happens successfully
5. **Automatic Payment**: Wizkid instantly receives his $10,000

### Key Point
- Wizkid gets his **full $10,000** whether 100 or 1,000 tickets are sold
- No revenue sharing calculations needed
- Payment is **guaranteed and instant**

## Fan Experience

### Buying Tickets
1. **Browse Events**: Fan sees Wizkid concert on Passa
2. **Purchase Ticket**: Pays $75 using card or crypto
3. **Blockchain Ticket**: Receives authentic, fraud-proof ticket
4. **Attend Event**: Shows ticket at venue, enjoys concert

### Fan Benefits
- **No Fake Tickets**: Blockchain verification prevents fraud
- **Fair Pricing**: No hidden fees or scalping markups
- **Refund Protection**: Automatic refunds if event is cancelled
- **Supporting Artists**: Know their money goes directly to performers

## Artist Experience

### Getting Paid
1. **Negotiate Fee**: Artist and organizer agree on fixed amount
2. **Accept Invitation**: Artist confirms participation in Passa system
3. **Perform Event**: Artist shows up and performs as agreed
4. **Get Paid Instantly**: Receives full payment within seconds of event completion

### Artist Benefits
- **Guaranteed Payment**: Fixed amount regardless of ticket sales
- **Instant Payment**: No waiting 30-90 days like traditional bookings
- **No Middlemen**: Direct payment from smart contract to artist wallet
- **Global Reach**: Can perform anywhere in Africa and get paid seamlessly
- **Transparent System**: Can see ticket sales in real-time (but payment stays fixed)

## Smart Contract Logic (Simple)

### Contract Rules
```
IF event_date_passed = TRUE
AND artist_performed = TRUE
THEN send_fixed_amount_to_artist()
```

### What the Contract Stores
- **Artist Wallet Address**: Where to send payment
- **Fixed Payment Amount**: Exact dollars agreed upon
- **Event Date**: When to trigger payment
- **Escrow Balance**: All ticket sales money

### What Happens Automatically
- **Payment Trigger**: Contract checks if event date has passed
- **Fund Transfer**: Sends exact agreed amount to artist
- **Record Keeping**: Logs payment on blockchain permanently

## Security Features

### For Artists
- **Payment Guaranteed**: Money is locked in contract, cannot be stolen
- **No Organizer Risk**: Even if organizer disappears, artist still gets paid
- **Transparent Escrow**: Can see ticket sales building up in real-time
- **Dispute Protection**: Blockchain record proves payment terms

### For Fans
- **Authentic Tickets**: Smart contract prevents fake ticket creation
- **Refund Safety**: If event cancelled, automatic refunds from escrow
- **No Scalping**: Tickets tied to blockchain, harder to resell illegally
- **Price Transparency**: See exactly what they're paying for

## Why This Solves Real Problems

### Current Industry Problems
- **Artists wait months** for payment after performing
- **Organizers sometimes don't pay** artists at all
- **Fans buy fake tickets** and lose money
- **No transparency** in how money flows

### Passa Smart Contract Solutions
- **Instant payment** the moment event ends
- **Payment guaranteed** by blockchain, not promises
- **Impossible to create fake tickets** on blockchain
- **Complete transparency** - everyone sees the same data

## Technical Benefits (Simple)

### Stellar/Soroban Advantages
- **Low Fees**: Costs pennies to send thousands of dollars
- **Fast**: Payments complete in 3-5 seconds
- **Reliable**: 99.9% uptime, always available
- **African-Friendly**: Works with mobile money systems

### No Technical Complexity for Users
- **Artists**: Just provide wallet address, get paid automatically
- **Fans**: Buy tickets normally, blockchain works invisibly
- **Organizers**: Set up event once, everything else is automatic

## Presentation Key Points

### For Investors
1. **Solves Real Pain**: Artists currently wait months for payment
2. **Guaranteed Execution**: Smart contracts cannot be manipulated
3. **Market Size**: Billions in African event industry
4. **Scalable Technology**: Can handle thousands of events simultaneously

### For Artists
1. **Get Paid Instantly**: No more chasing organizers for money
2. **Fixed Amount Guaranteed**: Know exactly what you'll earn
3. **Work Anywhere**: Perform across Africa, get paid seamlessly
4. **No Middlemen**: Direct payment from fans to your wallet

### For Fans
1. **No Fake Tickets**: Blockchain prevents fraud
2. **Fair Prices**: No hidden fees or scalping
3. **Refund Protection**: Money back if event cancelled
4. **Support Artists**: Money goes directly to performers

## MVP Focus

This MVP concentrates on the **core value proposition**:
- **Artists get paid instantly** with fixed amounts
- **Fans get authentic tickets** with fraud protection
- **Smart contracts handle everything automatically**

Future versions will add organizers, venues, creators, and sponsors, but the foundation is this simple, powerful artist-fan payment system.