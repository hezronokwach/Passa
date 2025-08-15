
# Passa Database Schema

This document outlines the structure of the Passa database, managed via Prisma. Each model corresponds to a table in our PostgreSQL database.

## Models

### `User`

Represents an individual who has an account on Passa.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the user. |
| `email` | `String` | `@unique` | The user's email address. |
| `name` | `String?` | | The user's full name. |
| `role` | `Role` | `@default(FAN)` | The user's role on the platform (`FAN`, `CREATOR`, `ORGANIZER`, `ADMIN`). |
| `creatorProfile` | `CreatorProfile?` | | Relation to the creator-specific profile (if any). |
| `organizerProfile`| `OrganizerProfile?`| | Relation to the organizer-specific profile (if any). |
| `eventsOrganized`| `Event[]`| | Events created by this user (if an organizer). |
| `submissions`| `Submission[]` | | Content submissions made by this user (if a creator). |
| `purchasedTickets`|`PurchasedTicket[]`| | Tickets purchased by this user (if a fan). |
| `attributions` | `Attribution[]` | | Revenue attributions for this user (if a creator). |

---

### `CreatorProfile`

Stores additional information for users with the `CREATOR` role.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the creator profile. |
| `user` | `User` | `@relation(fields: [userId], references: [id])` | The associated user account. |
| `userId`| `Int` | `@unique` | Foreign key linking to the `User` table. |
| `bio`| `String?` | `@db.Text` | A short biography of the creator. |
| `skills`| `String[]` | | A list of the creator's skills or specialties. |
| `website`| `String?` | | A link to the creator's personal website or portfolio. |
| `portfolio`| `PortfolioItem[]`| | A collection of the creator's work samples. |

---

### `PortfolioItem`

A single piece of work in a creator's portfolio.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the portfolio item. |
| `creatorProfile`| `CreatorProfile`| `@relation(fields: [creatorProfileId], references: [id])` | The creator profile this item belongs to. |
| `creatorProfileId`| `Int` | | Foreign key linking to the `CreatorProfile` table. |
| `title`| `String` | | The title of the work. |
| `description`| `String?` | `@db.Text` | A description of the work. |
| `type`| `PortfolioItemType`| | The type of media (`IMAGE`, `VIDEO`). |
| `url`| `String` | | The URL where the media file is stored. |
| `createdAt`| `DateTime` | `@default(now())`| Timestamp of when the item was added. |

---

### `OrganizerProfile`

Stores additional information for users with the `ORGANIZER` role. Can be used for Event Organizers or Sponsors.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the organizer profile. |
| `user` | `User` | `@relation(fields: [userId], references: [id])` | The associated user account. |
| `userId`| `Int` | `@unique` | Foreign key linking to the `User` table. |
| `companyName`| `String?`| | The name of the organization. |
| `bio`| `String?` | `@db.Text` | A short biography of the organization. |
| `website`| `String?` | | A link to the company's website. |

---

### `Event`

Represents an event created by an organizer.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the event. |
| `title`| `String` | | The title of the event. |
| `description`| `String` | `@db.Text` | A detailed description of the event. |
| `date`| `DateTime` | | The date and time of the event. |
| `location`| `String` | | The venue or city where the event takes place. |
| `country`| `String`| | The country of the event, used for localization. |
| `imageUrl`| `String`| | A URL for the event's promotional image. |
| `organizer`| `User`| `@relation(fields: [organizerId], references: [id])` | The user who organized the event. |
| `organizerId`| `Int`| | Foreign key linking to the `User` table. |
| `artistSplit`| `Int`| `@default(70)` | The percentage of revenue for the artist/creator. |
| `venueSplit`| `Int`| `@default(20)` | The percentage of revenue for the venue/operations. |
| `passaSplit`| `Int`| `@default(10)` | The percentage of revenue for the Passa platform. |
| `tickets`| `Ticket[]` | | A list of ticket types available for the event. |
| `purchasedTickets`| `PurchasedTicket[]` | | A list of all individual tickets sold for the event. |
| `briefs`| `CreativeBrief[]`| | A list of creative briefs associated with the event. |
| `attributions` | `Attribution[]` | | A list of revenue attributions for this event. |
| `createdAt`| `DateTime`| `@default(now())`| Timestamp of when the event was created. |

---

### `Ticket`

Represents a type of ticket available for an event (e.g., a ticket tier).

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the ticket type. |
| `event`| `Event` | `@relation(fields: [eventId], references: [id])` | The event these tickets are for. |
| `eventId`| `Int` | | Foreign key linking to the `Event` table. |
| `name`| `String` | | The name of the ticket tier (e.g., "General Admission"). |
| `price`| `Float` | | The price of the ticket. |
| `quantity`| `Int` | | The total number of tickets available in this tier. |
| `sold`| `Int` | `@default(0)` | The number of tickets sold in this tier. |
| `purchasedTickets`| `PurchasedTicket[]` | | A list of individual tickets sold of this type. |

---

### `PurchasedTicket`

Represents a single, unique ticket purchased by a fan.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the purchased ticket. |
| `event` | `Event` | `@relation(fields: [eventId], references: [id])` | The event this ticket is for. |
| `eventId`| `Int` | | Foreign key linking to the `Event` table. |
| `ticket` | `Ticket` | `@relation(fields: [ticketId], references: [id])` | The ticket tier that was purchased. |
| `ticketId`| `Int` | | Foreign key linking to the `Ticket` table. |
| `owner`| `User`| `@relation(fields: [ownerId], references: [id])` | The user who owns this ticket. |
| `ownerId`| `Int`| | Foreign key linking to the `User` table. |
| `status`| `TicketStatus`| `@default(ACTIVE)` | The status of the ticket (`ACTIVE`, `USED`). |
| `transaction`| `Transaction?`| | The transaction associated with this purchase. |
| `createdAt`| `DateTime`| `@default(now())`| Timestamp of when the ticket was purchased. |

---

### `Transaction`

Records the details of a ticket purchase transaction.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the transaction. |
| `purchasedTicket`| `PurchasedTicket` | `@relation(fields: [purchasedTicketId], references: [id])` | The ticket purchased in this transaction. |
| `purchasedTicketId`|`Int`| `@unique` | Foreign key linking to the `PurchasedTicket` table. |
| `amount` | `Float` | | The total amount paid. |
| `currency`| `String`| | The currency of the transaction (e.g., "USD"). |
| `blockchainTxId`| `String`| `@unique`| The unique identifier from the blockchain transaction. |
| `status`| `String` | | The status of the transaction (e.g., "COMPLETED"). |
| `createdAt`| `DateTime`| `@default(now())`| Timestamp of the transaction. |


---

### `CreativeBrief`

A work opportunity or "gig" posted by an organizer for an event.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the brief. |
| `event`| `Event`| `@relation(fields: [eventId], references: [id])` | The event this brief is for. |
| `eventId`| `Int`| | Foreign key linking to the `Event` table. |
| `title`| `String`| | The title of the creative brief. |
| `description`| `String`| `@db.Text` | A detailed description of the work required. |
| `budget`| `Float`| | The budget allocated for this work. |
| `requiredSkills`| `String[]`| | A list of skills needed to complete the work. |
| `submissions`| `Submission[]`| | A list of submissions received for this brief. |
| `createdAt`| `DateTime`| `@default(now())`| Timestamp of when the brief was created. |

---

### `Submission`

Represents a piece of content submitted by a creator for a `CreativeBrief`.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the submission. |
| `brief`| `CreativeBrief`| `@relation(fields: [briefId], references: [id])` | The brief this submission is for. |
| `briefId`| `Int`| | Foreign key linking to the `CreativeBrief` table. |
| `creator`| `User`| `@relation(fields: [creatorId], references: [id])` | The user who submitted the content. |
| `creatorId`| `Int`| | Foreign key linking to the `User` table. |
| `message`| `String?`| `@db.Text` | An optional message from the creator to the organizer. |
| `fileUrl`| `String`| | The URL of the submitted content file. |
| `status`| `SubmissionStatus`| `@default(PENDING)` | The current status of the submission (`PENDING`, `APPROVED`, `REJECTED`). |
| `createdAt`| `DateTime`| `@default(now())`| Timestamp of when the submission was made. |

---

### `Attribution`

Links an approved creator's submission or a sponsor's contribution to an event.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the attribution. |
| `event` | `Event` | `@relation(fields: [eventId], references: [id])` | The event receiving the contribution. |
| `eventId` | `Int` | | Foreign key linking to the `Event` table. |
| `user`| `User` | `@relation(fields: [userId], references: [id])` | The user (creator or sponsor) being attributed. |
| `userId`| `Int` | | Foreign key linking to the `User` table. |
| `submission` | `Submission?` | `@relation(fields: [submissionId], references: [id])` | The specific submission (if a creative contribution). |
| `submissionId` | `Int?` | `@unique` | Foreign key linking to the `Submission` table (optional). |
| `contributionType` | `ContributionType` | | The type of contribution (`CREATIVE`, `SPONSORSHIP`). |
| `sharePercentage` | `Float` | | The percentage of the 'artistSplit' a creator receives. 0 for sponsors. |
| `createdAt` | `DateTime` | `@default(now())` | Timestamp of when the attribution was made. |

---

### `NewsletterSubscription`

Stores emails of users who have subscribed to the newsletter.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | `@id @default(autoincrement())` | Unique identifier for the subscription. |
| `email` | `String` | `@unique` | The email address of the subscriber. |
| `createdAt` | `DateTime` | `@default(now())` | Timestamp of when the subscription was made. |


## Enums

### `Role`
- `FAN`
- `CREATOR`
- `ORGANIZER`
- `ADMIN`

### `PortfolioItemType`
- `IMAGE`
- `VIDEO`

### `SubmissionStatus`
- `PENDING`
- `APPROVED`
- `REJECTED`

### `TicketStatus`
- `ACTIVE`
- `USED`

### `ContributionType`
- `CREATIVE`
- `SPONSORSHIP`
