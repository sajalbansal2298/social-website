export interface SocialAccounts {
  id: string;
  name: string;
}

export interface ProfileSetting {
  [key: string]: Record<string, unknown>;
}

export interface AccessData {
  expiry: string;
  ids: string[];
  planId: string;
}

export interface AccessPolicy {
  type: string;
  access: AccessData[];
}

export interface UnsubscribeSetting {
  offers: boolean;
  newsLetters?: boolean;
}

export interface UnsubscribeForm {
  emailSetting: UnsubscribeSetting;
  pushSetting: UnsubscribeSetting;
}

export interface Profile {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  referralCode?: string;
  expiryDate: string;
  hasPaymentSubscription?: string;
  isVerified: boolean;
  isSuspended: boolean;
  linkedAccounts: SocialAccounts[];
  roles: string[];
  preferences?: ProfileSetting;
  city?: string;
  country?: string;
  orgId?: string;
  createdAt?: string;
  employeeId?: string;
  accessPolicy: AccessPolicy[];
  notificationSettings?: UnsubscribeForm;
}
