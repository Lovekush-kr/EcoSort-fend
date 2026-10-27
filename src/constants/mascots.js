/**
 * EcoSort AI — Mascot Asset Registry
 *
 * Each mascot illustration corresponds to a specific application state:
 * - HERO: Homepage hero illustration (neutral / device)
 * - LOCKED: Protected, restricted, or locked feature status
 * - SMS: SMS-related state (reserved for future SMS alert/notification workflow)
 * - SUCCESS: Successful waste classification result (checkmark)
 * - LOADING: Active classification request in-progress (loading rays)
 * - ERROR: Unsuccessful login or error state (red error badge)
 *
 * NOTE: Mascot images MUST NOT be used inside waste category cards.
 */

export const MASCOTS = {
  /** Mascot 1: Homepage hero exclusive illustration */
  HERO: '/assets/Group 1.svg',

  /** Mascot 2: Locked / Restricted status state */
  LOCKED: '/assets/Group 18.svg',

  /** Mascot 3: SMS-related state (reserved) */
  SMS: '/assets/Group 19.svg',

  /** Mascot 4: Successful waste classification result */
  SUCCESS: '/assets/Group 3.svg',

  /** Mascot 5: Active classification loading indicator */
  LOADING: '/assets/Group 5.svg',

  /** Mascot 6: Authentication failure / error state */
  ERROR: '/assets/Group 4.svg',
};

export default MASCOTS;
