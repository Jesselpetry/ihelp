/** Google's "G" mark, for the sign-in button. Shared by the account menu
 * and the library sign-in gate. */
export function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.86-.08-1.68-.22-2.47H12v4.68h6.45a5.5 5.5 0 0 1-2.39 3.6v3h3.86c2.26-2.08 3.58-5.15 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.87-3a7.2 7.2 0 0 1-10.72-3.78H1.36v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.36 14.3a7.18 7.18 0 0 1 0-4.6V6.62H1.36a12 12 0 0 0 0 10.77l4-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.42C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.36 6.62l4 3.09A7.2 7.2 0 0 1 12 4.75Z"
      />
    </svg>
  );
}
