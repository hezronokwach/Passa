# Passa Smart Contract Specification

This document outlines the high-level requirements and expected functionality for the smart contracts that will power the Passa platform. These contracts are responsible for handling ticket minting, revenue distribution, and attribution in a transparent and automated manner.

---

## Core Contracts

The Passa ecosystem will be built around three primary smart contracts:

1.  **`TicketNFT.sol`**: An ERC-721 compliant contract responsible for minting unique tickets as Non-Fungible Tokens (NFTs) for each event.
2.  **`RevenueSplitter.sol`**: A contract that handles the automated distribution of funds from ticket sales to all stakeholders according to predefined splits.
3.  **`AttributionRegistry.sol`**: An on-chain registry to transparently record contributions from creators, artists, and sponsors for each event.

---

## 1. `TicketNFT.sol`

This contract will manage the lifecycle of event tickets.

### Key Functions & Logic:

-   **`mintTicket(address to, uint256 eventId, string memory tokenURI)`**:
    -   Mints a new NFT ticket for a specific `eventId` and assigns it to the buyer's `to` address.
    -   Each ticket should have a unique `tokenId` associated with the `eventId`.
    -   The `tokenURI` will point to off-chain metadata containing ticket details (event name, date, seat, etc.).
    -   Should only be callable by a trusted address (e.g., the `RevenueSplitter` contract or a backend wallet) upon successful payment.

-   **`getOwner(uint256 tokenId)`**:
    -   Standard ERC-721 function to verify the current owner of a ticket.

-   **`validateTicket(uint256 tokenId)`**:
    -   A function that can be called by an event organizer's address to check the validity of a ticket for event entry.
    -   It should return the `eventId` and the `owner` address.
    -   Could include a mechanism to mark a ticket as "used" to prevent re-entry.

-   **Transfers**:
    -   Standard ERC-721 `transferFrom` and `safeTransferFrom` functions will be used.
    -   The contract may include an optional modifier to allow event organizers to disable transfers for certain events to prevent scalping.

---

## 2. `RevenueSplitter.sol`

This contract is the financial heart of the platform, ensuring fair and immediate payouts.

### Key Functions & Logic:

-   **`processPurchase(uint256 eventId, uint256 ticketPrice)`**:
    -   This function is called when a ticket is purchased. It accepts the payment from the user.
    -   It must be `payable`.
    -   After receiving the funds (`msg.value`), it should immediately trigger the distribution logic.

-   **`distributeFunds(uint256 eventId, uint256 amount)`**:
    -   Internally called by `processPurchase`.
    -   It will fetch the revenue split percentages and wallet addresses for the given `eventId` from the `AttributionRegistry`.
    -   It calculates the share for each stakeholder (artist(s), venue, Passa platform, organizer).
    -   It sends the corresponding amount of cryptocurrency to each stakeholder's wallet address.

-   **Security**:
    -   The contract must be robust against re-entrancy attacks. Use of the "checks-effects-interactions" pattern is critical.
    -   It needs a mechanism to handle potential failed sends (e.g., to a contract wallet that cannot receive funds).

---

## 3. `AttributionRegistry.sol`

This contract acts as the on-chain "source of truth" for who gets paid for what.

### Key Functions & Logic:

-   **`setEventSplits(uint256 eventId, address[] calldata payees, uint256[] calldata shares)`**:
    -   Called by an event organizer when an event is created or updated.
    -   Records the wallet addresses (`payees`) and their corresponding revenue `shares` (as basis points, e.g., 7000 for 70%) for a specific `eventId`.
    -   Should ensure that the total shares for an event sum to 10000 (100%).

-   **`addAttribution(uint256 eventId, address creator, uint256 sharePercentage)`**:
    -   Called when an organizer approves a creator's work that is tied to a revenue share.
    -   This function updates the event's splits, adding the `creator` to the list of `payees` and adjusting the `shares` accordingly. This requires careful logic to ensure the total remains 100%.

-   **`getEventSplits(uint256 eventId)`**:
    -   A public view function that allows anyone (including the `RevenueSplitter` contract) to query the payees and their shares for a given event, providing full transparency.

-   **Sponsorships**:
    -   The registry can also include functions to record sponsorship deals, linking a sponsor's wallet to an event for on-chain proof of partnership, even if the payment happens off-chain.
