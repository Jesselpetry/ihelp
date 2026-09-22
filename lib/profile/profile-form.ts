/**
 * Shared between the onboarding and edit-profile actions and their forms.
 *
 * Kept out of the "use server" action modules because those may only export
 * async functions - exporting a type from one is fine, but a value is not, and
 * splitting it here keeps both sides importing from the same place.
 */
export type ProfileFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export type ProfileFieldDefaults = {
  firstName?: string | null;
  lastName?: string | null;
  nickname?: string | null;
  major?: string | null;
  facebookUrl?: string | null;
  igUrl?: string | null;
};
