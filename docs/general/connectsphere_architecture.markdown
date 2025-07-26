```markdown
# Passa - System Architecture and Technology Stack

## System Overview

Passa is a blockchain-powered web platform integrating event ticketing, creator monetization, and brand campaign management. Built on the Stellar blockchain with a Node.js/Express backend, it ensures transparency, automation, and scalability for Kenya’s entertainment and creator economies via a responsive React web application. It leverages Soroban for smart contracts, Stellar SDK for blockchain interactions, LOBSTR Wallet for user asset management, and anchors for fiat integration.

### Scope
- **Event Management**: Fraud-free ticketing, revenue distribution, venue verification.
- **Creator Economy**: Attribution tracking, automated payments, engagement analytics.
- **Brand Campaigns**: ROI measurement, creator partnerships, fraud prevention.
- **Fan Engagement**: Loyalty tokens, personalized experiences, web-based wallet.

### Architecture Goals
- **Transparency**: Verifiable transactions and attribution via Stellar.
- **Automation**: Soroban smart contracts for payments and revenue splits.
- **Scalability**: Support 50,000+ tickets and thousands of creators with Node.js and AWS.
- **Reliability**: 99.9% uptime during peak events using Prometheus/Grafana.
- **Security**: Fraud prevention, secure financial transactions with Stellar and Express middleware.

---

## Architecture Principles

1. **Modular Design**: Independent modules for events, creators, and brands sharing core infrastructure.
2. **API-First**: RESTful APIs via Express for third-party integrations.
3. **Event-Driven**: Asynchronous processing with RabbitMQ/EventStore for high-load scenarios.
4. **Blockchain-Hybrid**: Stellar/Soroban for trust-critical operations; Node.js for performance-sensitive tasks.
5. **Web-First**: Optimized for responsive React application with Tailwind CSS.
6. **Data Sovereignty**: GDPR-compliant user control over data.

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       Client Layer                           │
├─────────────────┬─────────────────┬───────────────────────────┤
│ Web Portal      │ Admin Panel     │ APIs                      │
│ (React App)     │ (React/MUI)     │ (REST/Express)            │
└─────────────────┴─────────────────┴───────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
├─────────────────┬─────────────────┬───────────────────────────┤
│ Authentication  │ Rate Limiting   │ Load Balancing           │
│ (JWT/TOTP)      │ (Express)       │ (AWS ELB)                │
└─────────────────┴─────────────────┴───────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                   Microservices Layer                        │
├─────────────────┬─────────────────┬─────────────────┬────────┤
│ Event Service   │ Creator Service │ Brand Service   │ Analytics │
│ - Ticketing     │ - Attribution   │ - Campaigns     │ - Metrics │
│ - Venues        │ - Payments      │ - ROI Tracking  │ - Reports │
│ - Revenue       │ - Verification  │ - Partnerships  │ - Alerts  │
└─────────────────┴─────────────────┴─────────────────┴────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    Integration Layer                         │
├─────────────────┬─────────────────┬───────────────────────────┤
│ Message Queue   │ Event Bus       │ Workflow Engine          │
│ (Redis/RabbitMQ)│ (EventStore)    │ (Temporal/Zeebe)         │
└─────────────────┴─────────────────┴───────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
├─────────────────┬─────────────────┬─────────────────┬────────┤
│ Primary DB      │ Analytics DB    │ Cache Layer     │ File Store │
│ (PostgreSQL)    │ (ClickHouse)    │ (Redis)         │ (S3)      │
└─────────────────┴─────────────────┴─────────────────┴────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                          │
├──────────────────────────────────────────────────────────────┤
│               Stellar Network Integration                    │
│ Soroban Contracts│ Asset Tokens    │ Payment Channels        │
│ (Rust/WASM)     │ (SPHERE/NFTs)   │ (Anchors)               │
└──────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Backend
- **Framework**: Node.js with Express for RESTful APIs, chosen for event-driven performance, Stellar SDK compatibility, and React synergy.
- **Scalability**: AWS ECS with auto-scaling, Elastic Load Balancer, Redis caching for 50,000+ ticket transactions.
- **Security**: `helmet`, `express-rate-limit`, JWT, TOTP, AWS Secrets Manager for Stellar keys.
- **Real-Time**: `socket.io` for live analytics (ROI dashboards, creator metrics).
- **Example**: API endpoint for ticket purchase:
  ```javascript
  const express = require('express');
  const StellarSdk = require('stellar-sdk');
  const router = express.Router();
  router.post('/tickets', async (req, res) => {
    const { eventId, userId } = req.body;
    const ticket = await db.query('INSERT INTO tickets SET ?', { eventId, userId });
    const tx = await invokeContract(ticketContractId, 'issue_ticket', [ticket.id, userId]);
    res.json({ ticket, tx });
  });
  ```

### Blockchain Layer
- **Platform**: Stellar (sub-cent fees, 5-second settlement, 3,000+ TPS).
- **Soroban**: Rust-based smart contracts (compiled to WASM) for revenue splits, ticket NFTs, attribution, and SPHERE tokens.
  ```rust
  use soroban_sdk::{contract, contractimpl, Address, Env, Vec};
  #[contract]
  pub struct EventRevenue;
  #[contractimpl]
  impl EventRevenue {
      pub fn distribute_revenue(env: Env, event_id: String, total_amount: u64, splits: Vec<(Address, u32, String)>) {
          for (beneficiary, percentage, _role) in splits.iter() {
              let amount = (total_amount * percentage as u64) / 10000;
              env.transfer(beneficiary, amount);
          }
      }
  }
  ```
- **Stellar SDK (JavaScript)**: Node.js integration for account management, transactions, and Soroban contract calls via Soroban RPC/Horizon API.
  ```javascript
  const StellarSdk = require('stellar-sdk');
  const server = new StellarSdk.SorobanRpc.Server('https://soroban-testnet.stellar.org');
  async function invokeContract(contractId, functionName, params) {
    const account = await server.getAccount(sourcePublicKey);
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(new StellarSdk.Contract(contractId).call(functionName, ...params))
      .setTimeout(30)
      .build();
    tx.sign(sourceKeypair);
    return await server.submitTransaction(tx);
  }
  ```
- **LOBSTR Wallet**: Web-based wallet for fans/creators to manage tokens/tickets via Freighter API.
  ```javascript
  import freighterApi from '@stellar/freighter-api';
  async function signTransaction(txXdr) {
    return await freighterApi.signTransaction(txXdr, StellarSdk.Networks.TESTNET);
  }
  ```
- **Anchors**: Fiat on/off-ramps (e.g., MoneyGram, Vibrant) for KES/USD transactions.
  ```javascript
  async function depositFiat(anchorUrl, amount, currency) {
    const response = await fetch(`${anchorUrl}/deposit`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency, destination: stellarAccountId })
    });
    return await response.json();
  }
  ```
- **Additional Tools**: Stellar CLI (contract deployment/testing), Horizon API (transaction data), Blockdaemon APIs (reliable RPC).

### Frontend
- **Web Portal**: React application with Tailwind CSS, hosted via cdn.jsdelivr.net for React dependencies, using Next.js for server-side rendering to optimize SEO and load times.
- **Admin Panel**: React with shadcn for platform management.

### Databases
- **Primary DB**: PostgreSQL (user, event, campaign data).
- **Analytics DB**: ClickHouse (time-series, performance metrics).
- **Cache**: Redis (session management, query caching).
- **File Storage**: AWS S3 (content, media, logs).

### Infrastructure
- **Cloud Provider**: AWS (EC2, ECS, Lambda) for scalability.
- **API Gateway**: AWS API Gateway (authentication, rate limiting, routing).
- **Load Balancing**: AWS Elastic Load Balancer for traffic distribution.
- **CI/CD**: GitHub Actions for automated builds and deployments.
- **Monitoring**: Prometheus, Grafana for system health (99.9% uptime).

### Security
- **Authentication**: OAuth 2.0, JWT, TOTP for web access.
- **Encryption**: AES-256 (data at rest), TLS 1.3 (data in transit).
- **Fraud Detection**: Machine learning models (TensorFlow.js) for fake engagement detection.

---

## Core Components

### 1. Event Management Service
- **Modules**:
  - Event Creator: Setup, metadata, revenue splits via web portal.
  - Ticket Engine: Stellar NFT generation, dynamic pricing, anti-scalping.
  - Venue Management: Verification, capacity, QR-based check-in.
  - Revenue Processor: Soroban smart contract distributions.
- **Data Models**:
  ```typescript
  interface Event {
    id: string;
    organizerId: string;
    title: string;
    venue: Venue;
    dateTime: DateTime;
    pricing: PricingTier[];
    revenueSplits: RevenueSplit[];
    creatorPartners: CreatorPartner[];
    brandSponsors: BrandSponsor[];
  }
  interface Ticket {
    id: string;
    eventId: string;
    tokenId: string; // Stellar NFT
    purchaserId: string;
    price: number;
    verificationCode: string;
    attributionSource?: string;
  }
  ```

### 2. Creator Attribution Service
- **Modules**:
  - Content Tracker: Monitors posts (Instagram, TikTok, Twitter).
  - Attribution Engine: Links content to ticket sales via promo codes and Stellar SDK.
  - Performance Analytics: ROI and creator rankings via ClickHouse.
  - Payment Processor: Instant payouts via Soroban contracts.
- **Attribution Model**:
  ```typescript
  interface Attribution {
    creatorId: string;
    eventId: string;
    contentId: string;
    metrics: { impressions: number; clicks: number; conversions: number; revenue: number };
    attributionMethod: 'first-click' | 'last-click' | 'time-decay';
  }
  ```

### 3. Brand Campaign Service
- **Modules**:
  - Campaign Manager: Budgets, creator selection, campaign setup.
  - ROI Tracker: Real-time metrics via WebSocket.
  - Creator Marketplace: Discovery based on audience demographics.
  - Fraud Detection: ML-based bot detection, content approval workflows.

### 4. Fan Engagement Service
- **Modules**:
  - Loyalty Engine: SPHERE token rewards for attendance and engagement via Soroban.
  - Fan Profile: Personalized recommendations.
  - Wallet Management: Web-based LOBSTR integration for token balances, QR ticketing.

---

## Blockchain Layer

### Stellar Integration
- **Soroban Contracts**:
  1. **Revenue Distribution**:
     ```rust
     use soroban_sdk::{contract, contractimpl, Address, Env, Vec};
     #[contract]
     pub struct EventRevenue;
     #[contractimpl]
     impl EventRevenue {
         pub fn distribute_revenue(env: Env, event_id: String, total_amount: u64, splits: Vec<(Address, u32, String)>) {
             for (beneficiary, percentage, _role) in splits.iter() {
                 let amount = (total_amount * percentage as u64) / 10000;
                 env.transfer(beneficiary, amount);
             }
         }
     }
     ```
  2. **Creator Attribution**:
     ```rust
     use soroban_sdk::{contract, contractimpl, Address, Env, String};
     #[contract]
     pub struct CreatorAttribution;
     #[contractimpl]
     impl CreatorAttribution {
         pub fn record_attribution(env: Env, creator_id: String, event_id: String, ticket_id: String, sale_price: u64) {
             let commission = (sale_price * 1000) / 10000; // 10% commission
             env.transfer(creator_id.parse::<Address>().unwrap(), commission);
         }
     }
     ```
  3. **Loyalty Tokens**:
     ```rust
     use soroban_sdk::{contract, contractimpl, Env, String};
     #[contract]
     pub struct LoyaltyTokens;
     #[contractimpl]
     impl LoyaltyTokens {
         pub fn reward_event_attendance(env: Env, user_id: String, event_id: String) {
             let reward = 10; // 10 SPHERE tokens
             env.mint(user_id.parse::<Address>().unwrap(), reward);
         }
     }
     ```
- **Token Economics**:
  - **SPHERE Token**: Governance, rewards (10-50/event, 1-10/engagement).
  - **Event Tickets**: NFTs for fraud-proof access.
  - **Creator Coins**: Social tokens for creator communities.
  - **Brand Vouchers**: Redeemable discounts.

### Blockchain Benefits
- **Low Costs**: Sub-cent transaction fees.
- **Fast Settlement**: 5-second confirmations.
- **Scalability**: 3,000+ TPS for high-volume events.
- **Multi-Currency**: Supports KES, USD, tokens via anchors.

---

## Data Architecture

### Databases
- **PostgreSQL**: User profiles, events, campaigns, transactions.
- **ClickHouse**: Time-series analytics, performance metrics.
- **Redis**: Caching for sessions, queries.
- **AWS S3**: Media, logs, backups.

### Data Flow
```
Event Creation → Ticket NFT Generation (Soroban) → Blockchain Registration (Stellar SDK)
         ↓
Sales → Attribution Tracking (Stellar SDK) → Smart Contract Revenue Split (Soroban)
         ↓
Analytics (ClickHouse) → Creator Payments (Soroban) → Fan Rewards (LOBSTR)
```

### Data Privacy
- **GDPR**: Right to be forgotten, data portability, consent management.
- **Encryption**: AES-256 (at rest), TLS 1.3 (in transit), end-to-end for communications.

---

## Security Architecture

### Authentication & Authorization
- **MFA**: Email, TOTP for web access via Express middleware.
- **RBAC**:
  ```typescript
  enum UserRole { FAN, CREATOR, ARTIST, VENUE, BRAND, ADMIN }
  interface Permission { resource: string; action: 'create' | 'read' | 'update' | 'delete' }
  ```
- **Access Control**: Granular permissions per role, enforced via `passport`.

### Blockchain Security
- **Soroban Contracts**: Multi-signature wallets, time-locks, circuit breakers audited with Certora.
- **Oracles**: Multiple sources, cryptographic proofs, reputation-based selection for attribution.

### Fraud Prevention
- **Tickets**: NFT-based verification, transfer restrictions via Stellar SDK.
- **Creators**: TensorFlow.js ML models for bot detection, cross-platform verification.
- **Venues**: QR-based check-in, real-time attendance tracking via Express APIs.

---

## Scalability Design
- **Microservices**: Independent Express routers for event, creator, brand services.
- **Cloud Infrastructure**: AWS ECS auto-scaling, Lambda for serverless tasks.
- **Load Balancing**: Elastic Load Balancer for traffic distribution.
- **Blockchain**: Stellar’s 3,000+ TPS handles high-volume transactions.
- **Caching**: Redis for low-latency query responses (80% of API calls cached).
- **Example**: Cached event lookup:
  ```javascript
  const redis = require('redis').createClient();
  app.get('/events/:id', async (req, res) => {
    const event = await redis.get(`event:${req.params.id}`);
    if (!event) {
      const dbEvent = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
      await redis.setEx(`event:${req.params.id}`, 3600, JSON.stringify(dbEvent));
      return res.json(dbEvent);
    }
    res.json(JSON.parse(event));
  });
  ```

---

## Deployment Architecture
- **Environment**: AWS (us-east-1 for low latency to Kenya).
- **CI/CD**: GitHub Actions for automated deployments.
- **Monitoring**: Prometheus, Grafana for real-time insights.
- **Disaster Recovery**: Multi-region backups, failover systems.
- **Staging**: Separate dev, test, production environments.
- **Testing**: Artillery for stress-testing 50,000+ users, Stellar CLI for contract testing on Futurenet.

---

## Development Timeline
- **Months 1-3**: Soroban contracts (revenue, attribution, tokens), React application beta, pilot events.
- **Months 4-6**: Creator attribution system, brand campaign interface, closed beta with Stellar SDK/LOBSTR.
- **Months 7-9**: Analytics enhancements (ClickHouse), UX improvements, security audits (Certora, Snyk).
- **Months 10-12**: API for integrations, multi-language support (Swahili, English), regional expansion prep.

*This architecture ensures Passa is a scalable, secure, and fast web platform, leveraging Node.js/Express, Stellar blockchain, and Soroban for Kenya’s entertainment ecosystem.*
```