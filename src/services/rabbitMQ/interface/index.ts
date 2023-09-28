export enum EventPatternEnum {
  USER_REGISTERED = 'user_registered',
  ACCOUNT_DELETION = 'account_deletion',
}

export enum AdminTypeEmum {
  ADMIN = 'admin',
  // MANAGER = 'manager',
  // SUPPORT = 'support',
}

export enum AMQPEventType {
  RETRIEVAL = 'RETRIEVAL',
  PUSH = 'PUSH',
}

export type AMQPEventPayload = {
  eventType: AMQPEventType;
  eventId: string;
  eventSource: string;
  eventPattern: EventPatternEnum;
  dataSignature: string;
  data: Record<string, string>;
};
