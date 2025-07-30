# Passa Project: Database Schema and User Flows

## 1. Database Schema Design

### 1.1 Core Entities and Relationships

The **core entities** of the Passa project revolve around **users, events, tickets, and contributions/attributions**. The **User** entity acts as a supertype, with distinct subtypes for **Organizers, Artists, Content Creators, Sponsors, and Fans**, each possessing unique attributes while sharing common user information. **Events are central**, created by Organizers and featuring Artists. **Tickets provide access to these events** and are linked to both the event and the purchasing fan.

A crucial aspect is the **Attribution** entity, which meticulously records contributions from various users (Artists performing, Content Creators producing promotional material, Organizers managing logistics, Sponsors providing funding) to specific events or tickets. This attribution is fundamental to the **revenue distribution mechanism** and ensures fair recognition.

**Smart contracts** are key blockchain integration elements, managing aspects like NFT ticket minting and revenue splits. Relationships are primarily **one-to-many** (e.g., one Organizer creates many Events) or **many-to-many** (e.g., many Artists perform at many Events, facilitated by junction tables or the **Attribution** entity).

### 1.2 User Management: Supertype and Subtypes

The Passa project database schema employs a **supertype-subtype relationship** to manage diverse user roles: Organizers, Artists, Content Creators, Sponsors, and Fans. This design centralizes common user attributes in a **User** supertype table, while specific attributes for each role reside in their respective subtype tables. This approach minimizes data redundancy and ensures data integrity.

Common attributes like **UserID**, **Username**, **Email**, **PasswordHash**, and **WalletAddress** are stored in the **User** table. Each subtype table (e.g., **Organizer**, **Artist**) then holds role-specific details, such as **CompanyName** for an Organizer or **Genre** for an Artist.

The relationship between the **User** supertype and its subtypes is **one-to-one (1:1)**, enforced by the subtype tables sharing the **UserID** from the **User** table as both their primary key and a foreign key. This ensures a clean, normalized structure, simplifying queries for common user information and allowing flexible expansion.

The implementation in SQL involves creating the **User** table first, followed by individual tables for each subtype. For example, the **User** table would be defined as:

```sql
CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash CHAR(64) NOT NULL, -- Assuming SHA-256
    WalletAddress VARCHAR(255) UNIQUE, -- More on this in blockchain section
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- Other common attributes like FirstName, LastName,
    -- ProfilePictureURL can be added here
);
```

An **Organizer** subtype table would then be created as:

```sql
CREATE TABLE Organizer (
    UserID INT PRIMARY KEY,
    CompanyName VARCHAR(255),
    TaxID VARCHAR(50),
    ContactPersonName VARCHAR(255),
    -- Other Organizer-specific attributes
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE
);
```

This **supertype-subtype model is a well-established database design pattern** that effectively addresses scenarios where entities share common characteristics but also have distinct, role-specific data, providing a robust and scalable solution for managing diverse user types within Passa.

### 1.3 Blockchain Integration Elements

Integrating blockchain technology into the Passa project necessitates specific database elements to link on-chain activities with off-chain application data. **User blockchain identities, primarily their wallet addresses, are fundamental**. The **User** supertype table includes a **WalletAddress** field, associating at least one blockchain wallet with each user for transactions like ticket purchases or revenue distribution. For scalability, a separate **Wallet** table linked to **User** could manage multiple addresses per user, along with metadata like wallet type and blockchain network. The data type for a blockchain address is typically a string, representing a public key hash.

**Tracking on-chain transactions is crucial** for ticketing, revenue distribution, and attribution. A **Transaction** table will log these activities, storing details such as **TransactionHash** (the unique hash on the blockchain), **BlockNumber**, **FromAddress**, **ToAddress**, **Amount**, **Currency**, **GasUsed**, **GasPrice**, **Timestamp**, **Status** (e.g., Pending, Confirmed), **EventType** (e.g., TicketPurchase), **RelatedEntityType** and **RelatedEntityID** (polymorphic foreign keys), **SmartContractAddress**, and **InputData**. This structure consolidates information from various blockchain sources like blocks, transactions, logs, and receipts, allowing efficient querying and reconciliation.

**Smart contract interactions are another key aspect**. A **smart_contracts** table could store **contract_id**, **contract_address**, **contract_ABI** (Application Binary Interface), **deployment_transaction_id**, **deployer_wallet_address**, and **contract_type** (e.g., 'Ticketing', 'RevenueDistribution'). Storing the ABI is vital for the application to encode and decode contract interactions.

Furthermore, **managing Non-Fungible Tokens (NFTs)**, if used for tickets, requires an **nfts** table. This table would store **nft_id** (internal), **token_id** (on-chain), **smart_contract_id** (linking to the minting contract), **owner_wallet_address**, **metadata_uri** (often on IPFS), **creation_transaction_id**, and **attributes**. This table is central to the ticketing system, tracking NFT ownership and metadata.

Finally, the schema must address **blockchain's transparency and data privacy concerns**, often by storing sensitive personal data off-chain in the database and only hashes or non-sensitive identifiers on-chain.

### 1.4 Ticketing System

The **ticketing system in Passa is envisioned to leverage NFT technology**, providing unique, verifiable, and potentially tradable digital tickets. This approach enhances security, reduces fraud, and can offer new engagement opportunities for fans.

The core database entity for this system is the **Ticket** table. This table would store essential information for each ticket, including a unique **TicketID** (primary key), an **EventID** (foreign key linking to the **Event** table, specifying the event the ticket grants access to), and an **OwnerUserID** (foreign key linking to the **User** table, identifying the current ticket holder, typically a Fan).

Crucially, for NFT-based tickets, the table would include a **TokenID** field, storing the unique identifier of the NFT on the blockchain, and a **SmartContractID** (foreign key to a **SmartContracts** table), identifying the smart contract that minted or manages this NFT ticket. Additional fields might include **TicketStatus** (e.g., 'Available', 'Purchased', 'Used', 'Resold'), **PurchaseTransactionID** (foreign key to the **Transaction** table, recording the on-chain purchase transaction), **Price**, **PurchaseDate**, and potentially **SeatNumber** or **TicketTier** if applicable.

The integration with the **Transaction** table ensures a clear audit trail for every ticket sale and transfer. The **Event** table, managed by Organizers, would define the parameters of the event for which tickets are sold. This includes **EventID**, **OrganizerUserID** (foreign key to **User**), **EventName**, **Description**, **Location**, **StartDateTime**, **EndDateTime**, **TotalTicketsAvailable**, and potentially a reference to the **SmartContractID** of the main event contract if complex on-chain logic is involved.

The relationship between **Event** and **Ticket** is one-to-many (one event has many tickets). The **NFTs** table, as mentioned in blockchain integration, would store detailed information about each NFT, including its **TokenID**, **SmartContractID**, **OwnerWalletAddress** (which might be denormalized from the **Ticket** table's **OwnerUserID** linked wallet, or directly managed on-chain), **MetadataURI** (pointing to ticket artwork or details on IPFS), and **Attributes** (e.g., VIP status, access rights).

This system allows for efficient management of ticket inventory, validation at event entry (by verifying NFT ownership on-chain), and tracking of ticket provenance. The use of smart contracts for ticket minting and transfers ensures that the rules of ticket issuance and ownership are transparent and automatically enforced.

### 1.5 Revenue Distribution Mechanism

The **revenue distribution mechanism in Passa is designed to be transparent and automated**, leveraging smart contracts and detailed attribution records. The core idea is that revenue generated from ticket sales (and potentially other sources) is automatically split among various stakeholders, such as artists, content creators, organizers, and sponsors, based on predefined rules and their contributions.

The database schema supports this through several key tables. The **Attribution** table (detailed in section 1.6) is fundamental, as it defines who contributed what and their agreed-upon share or stake (e.g., **PercentageShare**). This table links **UserID** (the contributor) to an **ArtifactID** (e.g., **EventID** or **TicketID**) and specifies the **ContributionType**.

A **RevenueShareAssignment** table (or a similar structure integrated within **Attribution** or **Transaction** logic) would explicitly link a specific revenue-generating event (like a ticket sale, recorded in the **Transaction** table) to the beneficiaries and their shares. This table might include **AssignmentID**, **SourceTransactionID** (foreign key to **Transaction** for the sale), **BeneficiaryUserID** (foreign key to **User**), **AttributionID** (foreign key to **Attribution**, providing context for the share), **ShareAmount** or **SharePercentage**, **DistributedAmount**, and **DistributionTransactionID** (foreign key to **Transaction** for the payout).

When a ticket is sold, the system would identify all contributors attributed to that ticket or its associated event via the **Attribution** table. The smart contract responsible for revenue distribution would then use these attribution rules to automatically split the incoming funds (e.g., from the ticket purchase transaction) and distribute them to the respective contributors' wallet addresses. The **Transaction** table would record each of these distribution payouts, linking them back to the original sale and the beneficiary.

1.6 Attribution Tracking Model

The attribution tracking model is a cornerstone of the Passa project, designed to meticulously record and verify all contributions from users (organizers, artists, content creators, sponsors) to events, tickets, or other digital assets. This system ensures accurate assignment of credit and responsibilities, forming the basis for revenue distribution and recognition.

The core of this model is the Attribution table, which links contributors to specific artifacts and details their contribution. A key feature is its integration with blockchain technology, where each attribution record is anchored to a blockchain transaction (BlockChainTxnID), providing immutable and verifiable proof. This enhances transparency and supports mechanisms like revenue distribution. The model is flexible, accommodating various contribution types and contributors, ensuring all participation is acknowledged.

The Attribution table is structured with several key fields to capture the necessary details of each contribution. The primary key is AttributionID. Foreign keys like UserID (identifying the contributor) and ArtifactID (linking to the specific item, e.g., TicketID or EventID) establish relationships. The ContributionType field describes the role (e.g., 'ArtistPerformance', 'OrganizerLogistics', 'ContentCreation', 'Sponsorship'). An optional PercentageShare field denotes the contributor's share for revenue or ownership. Crucially, the BlockChainTxnID field stores the identifier of the blockchain transaction that records this attribution, ensuring immutability. A CreatedTimestamp records when the attribution was registered.

Table 1: Structure of the Attribution Table

| Attribute | Type | Description |
|-----------|------|-------------|
| AttributionID | INT | Unique identifier for the attribution |
| TicketID | INT | Foreign key referencing the ticket the contribution is for |
| EventID | INT | Foreign key referencing the event the contribution is for |
| UserID | INT | Foreign key referencing the User who made the contribution |
| ContributionType | VARCHAR(50) or ENUM | Describes the type of contribution ('OrganizerLogistics', 'ContentCreation') |
| BlockChainTxnID | VARCHAR(255) | The transaction ID or NFT ID on the blockchain that verifies this attribution |
| PercentageShare | DECIMAL(5,2) | The percentage of revenue or attribution for this contribution (if applicable) |
| Description | TEXT | A textual description of the contribution |
| Timestamp | DATETIME | The date and time when the attribution was created |

1.7 Smart Contract Management

Smart contracts are integral to the Passa platform, automating key functionalities like NFT-based ticketing, revenue distribution, and potentially aspects of attribution tracking. Effective management of these smart contracts within the database is crucial for the application to interact with them correctly and to maintain a record of their deployment and usage.

A dedicated SmartContracts table will serve this purpose. This table will store essential metadata for each deployed smart contract relevant to the Passa ecosystem. Key attributes would include a ContractID (a unique internal identifier), the ContractAddress (the on-chain address where the contract is deployed, which is essential for interacting with it), and the ContractABI (Application Binary Interface, a JSON array describing the contract's functions and events, necessary for encoding transactions and decoding data).

Other important fields in the SmartContracts table would include ContractName (a human-readable name for the contract, e.g., "PassaTicketingV1" or "RevenueSplitter"), ContractType (e.g., 'Ticketing', 'RevenueDistribution', 'AttributionRegistry'), DeployerWalletAddress (the wallet address that deployed the contract), DeploymentTransactionID (a foreign key to the Transaction table, recording the on-chain transaction that created the contract), CompilerVersion (the Solidity or Vyper compiler version used), and IsActive (a boolean flag to indicate if the contract is currently in use or deprecated).

1.8 Feature Prioritization (MVP vs. Version 2)

Feature prioritization is essential for the Passa project, distinguishing between Minimum Viable Product (MVP) features that deliver core value and Version 2 features that offer enhanced functionality and user experience. This phased approach allows for a faster initial launch and iterative development based on user feedback.

Table 2: Feature Prioritization for Passa (MVP vs. Version 2)

| Feature Category | MVP Feature Set |
|-----------------|-----------------|
| User Management | Basic user registration/login (email/password), single wallet address per user, distinct Organizer, Artist, Fan roles |
| Ticketing | NFT-based ticket minting and primary sales, basic ticket validation (on-chain check), simple ticket tiers |
| Event Management | Organizers can create, manage, and list events with basic details (title, date, location, description) |
| Revenue Distribution | Automated revenue splits to artists/organizers based on simple percentage rules defined at event creation, payouts in native blockchain currency |
| Attribution Tracking | Basic attribution model linking artists/organizers to events/tickets for revenue sharing, on-chain recording of primary contributors |
| Content Creation | Basic content upload for event promotion (images, text) |
| Sponsorship | Basic sponsorship display on event pages |
| Fan Experience | Browse events, purchase tickets, view owned tickets (NFTs) in a simple dashboard |
| Blockchain Integration | Support for a single primary blockchain (e.g., Polygon, Ethereum L2), basic transaction history |
| Admin & Reporting | Basic admin dashboard for user management and platform monitoring |

2. User Flows

2.1 Organizer User Flow

The Organizer user flow begins with registration and profile setup, where the organizer provides company details, contact information, and verifies their identity if required. Once onboarded, the core activity is event creation and management. This involves:

1. Creating an Event: The organizer defines event details such as title, description, date, time, location (physical or virtual), and ticket types (e.g., general admission, VIP, with corresponding prices and quantities). They also upload event artwork and any relevant media.

2. Configuring Revenue Splits: For each event or ticket type, the organizer specifies the revenue distribution model. This involves selecting contributing artists and other beneficiaries (e.g., content creators, co-organizers) and assigning their percentage shares. This information is crucial for the attribution tracking and automated revenue distribution.

3. Managing Ticket Sales: The organizer can monitor ticket sales in real-time through a dashboard, track revenue, and view attendee demographics if available. They might have options to pause sales, release more tickets, or adjust pricing (within smart contract constraints).

4. Promoting the Event: While Passa might offer some promotional tools, the organizer is responsible for driving traffic to their event page. This could involve integrating with their marketing channels.

5. Post-Event Activities: After the event, organizers can access reports on sales, revenue distributed, and attendee feedback. They can also manage payouts if not fully automated or handle any post-event customer support.

2.2 Artist User Flow

The Artist user flow centers around showcasing their work, managing their involvement in events, and receiving fair compensation. Key stages include:

1. Profile Creation and Portfolio: Artists register and create a rich profile, highlighting their genre, bio, past performances, discography, and links to their music or other artistic work. They can upload media like photos, videos, and audio samples.

2. Engagement with Organizers: Artists can be discovered by organizers or proactively pitch for events. They receive invitations to participate in events, which include details about the event, their expected role, and proposed compensation (often tied to a revenue share from ticket sales). They can accept or decline these invitations.

3. Contribution Attribution: Once an artist agrees to participate, their contribution is formally recorded in the Attribution table, linking them to the specific event and defining their revenue share. This may involve an on-chain transaction to register this attribution.

4. Promoting Events: Artists are encouraged to promote events they are part of to their fanbase, leveraging their social media and other channels. Passa might provide tools to make this easier, like shareable links or promotional assets.

5. Tracking Performance and Revenue: Artists have a dashboard to view their upcoming events, track ticket sales for events they are involved in, and monitor their earned revenue. They can see transparent reports on how their revenue share is calculated and when payouts are made (ideally automated via smart contracts).

6.

## Direct Fan Interaction (Potential V2)
In future versions, artists might have tools for direct fan engagement, such as selling exclusive content or merchandise through their Passa profile, or offering special experiences to ticket holders. The artist's experience is designed to be empowering, providing them with transparency over their bookings and earnings, and ensuring they are properly credited and compensated for their contributions.

### 2.3 Content Creator User Flow
The Content Creator user flow involves contributing valuable content to promote events and engage the community, and potentially earning rewards for their efforts. The stages are:

1. **Onboarding and Portfolio**: Content creators (e.g., videographers, graphic designers, writers, social media influencers) register and showcase their skills and past work through a portfolio on their profile. They specify their areas of expertise and the types of content they create.

2. **Discovering Opportunities**: Creators can browse a marketplace or listings of events seeking specific content (e.g., "promotional video for music festival," "social media graphics for art show"). Organizers or artists might also directly invite creators to contribute.

3. **Content Submission and Approval**: Creators submit their content (e.g., videos, images, articles) for a specific event or campaign. This content might go through a review process by the event organizer or a platform jury before being approved and published. The platform needs tools for easy upload and management of content.

4. **Attribution and Potential Rewards**: Once content is approved and used, the creator receives attribution. If their content is tied to a revenue-sharing model (e.g., they created a viral promotional video that drove ticket sales), their contribution is recorded in the Attribution table, potentially linking them to a share of revenue generated. This ensures they receive proper credit and any agreed-upon compensation.

5. **Tracking Performance**: Content creators can track the performance of their content (e.g., views, engagement, click-through rates to ticket sales if measurable) and see any rewards or revenue generated from their contributions. The platform should provide analytics to help creators understand the impact of their work.

6. **Collaboration and Networking (Potential V2)**: Future versions could include better tools for creators to collaborate with each other or with organizers/artists, and a more robust system for finding and bidding on content creation gigs.

The flow aims to make it easy for creators to contribute their skills to the Passa ecosystem and be recognized and rewarded for their valuable work in enhancing event promotion and fan engagement.

### 2.4 Sponsor User Flow
The Sponsor user flow is designed for businesses or individuals looking to gain visibility and engagement by supporting events or artists on the Passa platform. Key stages include:

1. **Registration and Profile Setup**: Sponsors create a profile, detailing their brand, target audience, and sponsorship objectives. They may also provide information about the types of events or artists they are interested in sponsoring.

2. **Discovering Sponsorship Opportunities**: Sponsors can browse events or artist profiles seeking sponsorship. The platform might offer a marketplace or a way for organizers/artists to list their sponsorship proposals, detailing benefits (e.g., logo placement, social media mentions, branded activations) and investment levels.

3. **Initiating and Finalizing Sponsorship**: A sponsor can express interest in an opportunity, leading to discussions and negotiations with the organizer or artist (potentially facilitated through the platform). Once terms are agreed upon, the sponsorship deal is formalized. This might involve creating an Attribution record with a ContributionType of 'Sponsorship', linking the sponsor to the event/artist and specifying the sponsorship value or benefits.

4. **Fulfillment of Sponsorship Benefits**: The organizer/artist then fulfills the agreed-upon sponsorship benefits (e.g., displaying the sponsor's logo, acknowledging their support). The platform should provide tools for sponsors to upload their branding assets and for organizers to easily integrate these into event pages or promotional materials.

5. **Tracking Sponsorship Impact**: Sponsors have access to a dashboard to track the performance of their sponsorships. This could include metrics like impressions on event pages, clicks on their logo, social media engagement generated, and potentially leads or conversions if trackable. This data helps sponsors measure ROI.

6. **On-Chain Verification (Potential V2)**: For enhanced transparency, sponsorship agreements could be recorded on the blockchain, with smart contracts potentially managing aspects of the agreement or payouts. This would provide an immutable record of the sponsorship.

The sponsor user flow aims to create a transparent and effective way for sponsors to connect with relevant events and artists, and to measure the impact of their investment within the Passa ecosystem.

### 2.5 Fan User Flow
The Fan user flow is centered around discovering exciting events, purchasing tickets, and engaging with the community. This is the most common user journey and should be intuitive and enjoyable:

1. **Registration and Profile (Optional but Recommended)**: Fans can register to get a personalized experience, save favorite events/artists, and view their ticket history. Even without registration, they should be able to browse events.

2. **Discovering Events**: Fans browse events by category, location, date, or artist. They can use search and filtering tools to find events that match their interests. Personalized recommendations based on past activity or stated preferences would be a V2 enhancement.

3. **Viewing Event Details**: Fans click on an event to see detailed information, including the lineup, date, time, location, ticket types and prices, and event description. They can also see who the organizers and sponsors are.

4. **Purchasing Tickets**: Fans select the desired ticket type and quantity, then proceed to checkout. This involves connecting their crypto wallet (if not already connected) and confirming the transaction on the blockchain. Upon successful purchase, they receive an NFT ticket in their wallet, and a record is created in the Ticket and Transaction tables.

5. **Managing Tickets**: Fans can view their purchased tickets (NFTs) in their Passa account dashboard or directly in their connected wallet. They might be able to transfer tickets (if allowed by the event rules) or view unlockable content associated with the ticket NFT.

6. **Attending the Event**: On the event day, fans present their NFT ticket for validation (e.g., by scanning a QR code derived from the NFT). The on-chain validity of the NFT is checked.

7. **Post-Event Engagement**: After the event, fans might leave reviews, share their experiences on social media, or follow artists/organizers they discovered. They can also access any post-event content or exclusive offers linked to their ticket NFT.

The fan user flow is designed to be seamless, from discovery to attendance, leveraging the benefits of NFT ticketing for security and a richer experience.