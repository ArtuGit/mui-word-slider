/**
 * Application routes configuration
 * Single source of truth for all route definitions
 */

export const ROUTES = {
  HOME: '/',
  DECKS: '/decks',
  DECK_DETAIL: '/deck/:deckId',
  UPLOAD: '/upload',
} as const;

// Valid routes for word initialization (excludes catch-all routes)
export const VALID_ROUTES = Object.values(ROUTES);

// Route definitions for React Router
export const ROUTE_DEFINITIONS = [
  {
    path: ROUTES.HOME,
    redirect: ROUTES.DECKS,
  },
  {
    path: ROUTES.DECKS,
    component: 'DecksPage',
  },
  {
    path: ROUTES.DECK_DETAIL,
    component: 'WordLearningPage',
  },
  {
    path: ROUTES.UPLOAD,
    component: 'UploadPage',
  },
  // Catch-all route for 404
  {
    path: '*',
    component: 'NotFoundPage',
  },
] as const;
