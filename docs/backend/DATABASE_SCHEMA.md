# Passa Platform Database Schema Documentation

## Overview

This document describes the comprehensive database schema for the Passa platform, a multi-stakeholder event management platform powered by blockchain technology. The schema supports user management, event creation, NFT-based ticketing, attribution tracking, and revenue distribution.

## Database Design Principles

- **Relational Model**: Uses PostgreSQL with proper normalization
- **Soft Deletes**: Critical tables include `is_deleted` and `deleted_at` fields
- **Audit Trail**: Comprehensive audit logging for all major operations
- **Blockchain Integration**: Tables designed to track on-chain activities
- **Performance**: Proper indexing for query optimization
- **Scalability**: Designed to handle high transaction volumes

## Core Entity Relationships

### User Management Hierarchy
```
Users (Supertype)
├── UserProfiles (1:1)
├── UserRoleAssignments (1:N)
├── Wallets (1:N)
└── Role-Specific Tables (1:1)
    ├── Organizers
    ├── Artists
    ├── ContentCreators
    ├── Sponsors
    └── Fans
```

### Event Management
```
Events
├── EventCategories (N:1)
├── EventTagAssignments (N:N with EventTags)
├── Tickets (1:N)
├── Attribution (1:N)
└── SmartContracts (N:1)
```

### Blockchain Integration
```
SmartContracts
├── Events (1:N)
├── Tickets (1:N)
└── Transactions (1:N)

Transactions
├── Tickets (1:N)
├── Attribution (1:N)
└── SmartContracts (1:N)
```

## Table Descriptions

### Core User Tables

#### `users`
Primary user table storing common information for all platform users.
- **Primary Key**: `user_id`
- **Unique Constraints**: `username`, `email`
- **Soft Delete**: Yes (`is_deleted`, `deleted_at`)
- **Timestamps**: Yes

#### `user_profiles`
Extended user profile information with social media links and preferences.
- **Primary Key**: `profile_id`
- **Foreign Keys**: `user_id` → `users.user_id`
- **Unique Constraints**: `user_id`

#### `user_roles` & `user_role_assignments`
Role-based access control system with flexible permission management.
- **Roles**: admin, organizer, artist, content_creator, sponsor, fan
- **Permissions**: JSON array of permission strings

### Role-Specific Tables

#### `organizers`
Event organizers with business information and verification status.
- **Primary Key**: `user_id` (also FK to users)
- **Business Fields**: company_name, tax_id, business_type
- **Verification**: is_verified, verified_at, verification_documents

#### `artists`
Performing artists with genre, bio, and performance information.
- **Primary Key**: `user_id` (also FK to users)
- **Performance Fields**: stage_name, genres, performance_fee_range
- **Metrics**: follower_count, rating, total_performances

#### `content_creators`
Content creators with portfolio and rate information.
- **Primary Key**: `user_id` (also FK to users)
- **Service Fields**: content_types, specialties, rates
- **Metrics**: completed_projects, rating

#### `sponsors`
Brand sponsors with budget and targeting information.
- **Primary Key**: `user_id` (also FK to users)
- **Brand Fields**: brand_name, industry, annual_budget
- **Targeting**: target_demographics, sponsorship_types

#### `fans`
Event attendees with preferences and loyalty information.
- **Primary Key**: `user_id` (also FK to users)
- **Preferences**: favorite_genres, interests, max_ticket_budget
- **Loyalty**: loyalty_points, loyalty_tier, events_attended

### Event Management Tables

#### `events`
Core event information with location, timing, and status.
- **Primary Key**: `event_id`
- **Foreign Keys**: `organizer_user_id`, `category_id`, `smart_contract_id`
- **Status**: draft, published, cancelled, completed, postponed
- **Soft Delete**: Yes

#### `event_categories`
Hierarchical categorization system for events.
- **Primary Key**: `category_id`
- **Hierarchy**: `parent_category_id` for subcategories
- **Display**: icon_url, color_hex, sort_order

#### `event_tags`
Flexible tagging system for event attributes.
- **Primary Key**: `tag_id`
- **Metrics**: usage_count for popularity tracking

### Blockchain & Financial Tables

#### `smart_contracts`
Registry of deployed smart contracts with ABI and metadata.
- **Primary Key**: `contract_id`
- **Types**: ticketing, revenue_distribution, attribution
- **Status**: deploying, active, paused, deprecated

#### `transactions`
Comprehensive blockchain transaction logging.
- **Primary Key**: `transaction_id`
- **Blockchain Fields**: transaction_hash, block_number, gas_fee
- **Status**: pending, confirmed, failed, cancelled

#### `tickets`
NFT-based tickets with ownership and transfer tracking.
- **Primary Key**: `ticket_id`
- **NFT Fields**: token_id, smart_contract_id
- **Status**: available, reserved, purchased, used, cancelled, refunded
- **Features**: transferable, refundable, resaleable

#### `attribution`
Revenue sharing and contribution tracking.
- **Primary Key**: `attribution_id`
- **Share Types**: percentage_share or fixed_amount
- **Status**: pending, approved, rejected, paid

### System Tables

#### `wallets`
User blockchain wallet addresses with verification.
- **Primary Key**: `wallet_id`
- **Networks**: stellar (primary), others supported
- **Types**: custodial, non_custodial, hardware

#### `permissions`
Granular permission definitions for RBAC.
- **Primary Key**: `permission_id`
- **Structure**: resource.action format (e.g., 'events.create')
- **Scopes**: own, organization, all

#### `audit_logs`
Comprehensive audit trail for all system operations.
- **Primary Key**: `log_id`
- **Tracking**: user_id, action, resource_type, old/new values

## Indexes and Performance

### Primary Indexes
- All primary keys have automatic indexes
- Foreign key columns are indexed for join performance
- Unique constraints create automatic indexes

### Custom Indexes
- **Users**: email, username, status, created_at
- **Events**: organizer_user_id, category_id, status, start_datetime, location
- **Tickets**: event_id, owner_user_id, ticket_status, purchase_date
- **Transactions**: transaction_hash, from_address, to_address, status
- **Attribution**: event_id, user_id, contribution_type, status

### Composite Indexes
- **user_role_assignments**: (user_id, role_id) unique
- **event_tag_assignments**: (event_id, tag_id) unique

## Data Integrity Constraints

### Foreign Key Constraints
- **CASCADE**: User deletions cascade to profiles, wallets, role assignments
- **RESTRICT**: Event deletions restricted if tickets exist
- **SET NULL**: User deletions set ticket owner to NULL (preserve ticket history)

### Check Constraints
- Percentage shares in attribution table: 0.0000 ≤ percentage_share ≤ 1.0000
- Event dates: end_datetime > start_datetime
- Ticket prices: price ≥ 0

### Business Rules
- One primary wallet per user per blockchain network
- Attribution percentages for an event cannot exceed 100%
- Ticket transfers require both parties' consent
- Event publication requires organizer verification

## Migration Strategy

### Migration Files Order
1. **001-004**: Core user management tables
2. **005**: Wallet management
3. **006-010**: Role-specific user tables
4. **011-014**: Event management and categorization
5. **015-016**: Blockchain infrastructure
6. **017**: Ticket management
7. **018**: Attribution system
8. **019**: Foreign key constraints
9. **020-021**: System utilities (permissions, audit)

### Rollback Strategy
- Each migration includes proper `down()` function
- Foreign key constraints added after dependent tables
- Seed data can be safely re-run (uses `del()` first)

## Security Considerations

### Data Protection
- Password hashing using bcrypt
- Sensitive data (tax_id, business_email) in separate tables
- Audit logging for all sensitive operations

### Access Control
- Role-based permissions with granular scopes
- API-level permission checking
- Database-level foreign key constraints

### Blockchain Security
- Transaction verification before database updates
- Smart contract address validation
- Multi-signature requirements for high-value operations

## Performance Optimization

### Query Optimization
- Proper indexing on frequently queried columns
- Composite indexes for common query patterns
- Partial indexes for filtered queries (e.g., active records only)

### Scaling Considerations
- Read replicas for analytics queries
- Partitioning for large tables (transactions, audit_logs)
- Connection pooling configuration
- Query result caching for static data

## Backup and Recovery

### Backup Strategy
- Daily full backups
- Continuous WAL archiving
- Point-in-time recovery capability
- Cross-region backup replication

### Recovery Procedures
- Automated backup verification
- Recovery time objectives (RTO): < 4 hours
- Recovery point objectives (RPO): < 15 minutes
- Disaster recovery testing schedule

## Monitoring and Maintenance

### Performance Monitoring
- Query performance tracking
- Index usage analysis
- Connection pool monitoring
- Slow query identification

### Maintenance Tasks
- Regular VACUUM and ANALYZE operations
- Index maintenance and optimization
- Statistics updates
- Archive old audit logs

This schema provides a robust foundation for the Passa platform, supporting all core functionalities while maintaining flexibility for future enhancements.