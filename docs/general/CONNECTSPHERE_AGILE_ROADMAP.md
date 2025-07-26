# Passa Agile Development Roadmap

## Team Composition
- **UI/UX & Frontend:** 2 Developers
- **Backend & Blockchain:** 2 Developers
- **Project Manager:** 1

## Goal
Deliver the core functionality and blockchain features of the Passa platform in 6 weeks.

---

## Sprint 1 (Weeks 1-2): Core Backend & Smart Contract Foundation

### Backend Team (2 Developers)
- **Database Schema & Migrations (4 days, 1 dev):**
  - [ ] Design and implement the database schema for users, events, tickets, and transactions using Knex.js.
- **User Management & Auth (6 days, 1 dev):**
  - [ ] Implement User and UserProfile models.
  - [ ] Set up JWT-based authentication, password hashing with bcrypt, and email verification flows.
- **Smart Contract Scaffolding (5 days, 1 dev - parallel task):**
  - [ ] Set up the Soroban development environment.
  - [ ] Define the interfaces and data structures for the Ticket NFT and Revenue Distribution smart contracts.

### Frontend Team (2 Developers)
- **Wallet Integration (5 days, 1 dev):**
  - [ ] Integrate Freighter and LOBSTR wallet connectors into the React frontend.
  - [ ] Create UI components for wallet connection, disconnection, and account switching.
- **Core UI Components (5 days, 1 dev):**
  - [ ] Develop a library of reusable UI components (forms, buttons, modals, etc.) to be used throughout the application.

### Project Manager
- [ ] Create detailed user stories and tasks in a project management tool.
- [ ] Facilitate daily stand-up meetings to track progress and resolve blockers.
- [ ] Ensure seamless communication between the frontend and backend teams.

---

## Sprint 2 (Weeks 3-4): Smart Contract Implementation & Backend Integration

### Backend Team (2 Developers)
- **Ticket NFT Smart Contract (8 days, 1 dev):**
  - [ ] Write the Rust logic for creating, transferring, and validating NFT-based tickets.
  - [ ] Develop a comprehensive test suite for the contract.
- **Revenue Distribution Smart Contract (8 days, 1 dev):**
  - [ ] Write the Rust logic for automated revenue splitting between creators and the platform.
  - [ ] Develop a comprehensive test suite for the contract.
- **Stellar SDK Integration (2 days, 2 devs):**
  - [ ] Integrate the Stellar SDK into the backend.
  - [ ] Create services to deploy and interact with the Soroban smart contracts.

### Frontend Team (2 Developers)
- **Event Management UI (8 days, 1 dev):**
  - [ ] Build the user interface for creating, editing, and managing events.
  - [ ] Connect the UI to mock backend APIs for initial development.
- **User Profile & Dashboard UI (8 days, 1 dev):**
  - [ ] Build the UI for user profiles, dashboards, and settings pages.

### Project Manager
- [ ] Monitor sprint velocity and address any impediments.
- [ ] Coordinate with the team to prepare for integration testing in the next sprint.

---

## Sprint 3 (Weeks 5-6): End-to-End Integration & Testing

### Backend Team (2 Developers)
- **Event & Ticket Controller Logic (6 days, 1 dev):**
  - [ ] Implement the backend controllers for event creation and ticket purchasing, integrating with the smart contracts.
- **USDC Payment Processing (6 days, 1 dev):**
  - [ ] Implement the logic for processing USDC payments for ticket purchases.
  - [ ] Handle transaction monitoring and status updates.
- **Deployment Scripts (4 days, 2 devs):**
  - [ ] Create and test scripts for deploying the smart contracts and the backend application.

### Frontend Team (2 Developers)
- **API Integration (8 days, 1 dev):**
  - [ ] Replace all mock APIs with live backend APIs.
  - [ ] Connect the event creation and ticket purchasing flows to the backend.
- **End-to-End Testing & UI Polish (8 days, 1 dev):**
  - [ ] Conduct thorough end-to-end testing of all user flows.
  - [ ] Polish the UI, fix bugs, and ensure a smooth user experience.

### Project Manager
- [ ] Coordinate and oversee the end-to-end testing process.
- [ ] Plan and prepare for a final demo of the core platform functionality.
- [ ] Gather feedback to inform the roadmap for the next development phase.
