// Main models export file

// User-related exports
export { UserModel, UserRoleModel, UserActivityModel, UserValidationError } from './User';
export { UserProfileModel, UserProfileValidationError } from './UserProfile';
export * from '@/types/user';
export { UserValidation } from '@/utils/userValidation';
export { UserProfileValidation } from '@/utils/userProfileValidation';
export { PasswordUtils } from '@/utils/passwordUtils';

// Event-related exports
export { EventModel, EventValidationError } from './Event';
export { EventCoreModel } from './EventCore';
export { EventSearchModel } from './EventSearch';
export { EventStatusModel } from './EventStatus';
export { EventTicketModel } from './EventTicket';
export { EventStatisticsModel } from './EventStatistics';
export { EventCategoryModel } from './EventCategory';
export { EventTagModel, EventTagAssignmentModel } from './EventTag';
export type {
  Event,
  CreateEventInput,
  UpdateEventInput,
  EventSearchFilters,
  EventStatus,
  EventWithDetails,
  EventCategory,
  CreateEventCategoryInput,
  UpdateEventCategoryInput,
  EventTag,
  CreateEventTagInput,
  UpdateEventTagInput,
  EventTagAssignment,
  EventStatistics,
  PaginatedResult
} from '@/types/event';
export { EventValidation } from '@/utils/eventValidation';
export { EventMediaUtils } from '@/utils/eventMediaUtils';
