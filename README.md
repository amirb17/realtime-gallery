# Realtime Gallery

A multi-user real-time image interaction application built with **React, TypeScript, Tailwind CSS, TanStack React Query, Zustand, and InstantDB**.

The application allows users to browse an image gallery powered by the Unsplash API, open focused image views, react with emojis, post comments, and see interactions synchronized in real time. A global activity feed displays reactions and comments from users across the gallery.

## Live Demo

## Live Demo

🚀 **[Open Realtime Gallery](https://realtime-gallery-nine.vercel.app/)**

A live deployment of the application running on Vercel.

## Features

* Image gallery powered by the Unsplash API
* Responsive image grid
* Infinite scrolling using TanStack React Query
* Focused image viewer with modal-style presentation
* Emoji picker for reactions
* One active reaction per user per image
* Clicking the same reaction removes it
* Selecting a different reaction replaces the previous reaction
* Real-time reaction synchronization with InstantDB
* Real-time comments
* Users can delete their own comments
* First-name user setup before entering the gallery
* Browser-based user identity using a generated user ID
* Activity feed displays the user's name for reactions and comments
* Global real-time activity feed
* Independent scrolling for gallery and activity feed
* Loading and error states
* Multi-tab real-time synchronization testing

## Tech Stack

| Technology           | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| React                | UI and component architecture                    |
| TypeScript           | Type safety                                      |
| Vite                 | Development and production build tooling         |
| Tailwind CSS         | Styling and responsive layout                    |
| TanStack React Query | Unsplash API/server state and infinite scrolling |
| InstantDB            | Real-time comments, reactions, and activity data |
| Zustand              | Lightweight UI state management                  |
| Emoji Picker React   | Emoji selection                                  |
| Lucide React         | UI icons                                         |
| Unsplash API         | Gallery image source                             |
| Git & GitHub         | Version control and repository hosting           |

## Architecture

The application separates external API data from collaborative real-time interaction data.

```text
                         ┌─────────────────┐
                         │   Unsplash API  │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  React Query    │
                         │ useInfiniteQuery │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     Gallery     │
                         │ ImageGrid/Card  │
                         └─────────────────┘


                         ┌─────────────────┐
                         │    InstantDB    │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
               Reactions      Comments      Activities
                    │             │             │
                    └─────────────┼─────────────┘
                                  ▼
                         Real-time UI updates
```

### Data responsibilities

**Unsplash + React Query**

Used for external gallery image data.

**InstantDB**

Used for collaborative application data:

* Reactions
* Comments
* Activity events

**Zustand**

Used for local UI state such as:

* Selected image
* Image viewer visibility

**localStorage**

Used for the lightweight browser identity flow:

* First name
* Generated browser user ID

## User Identity

When the application is opened without a saved user name, the user is shown a simple onboarding screen.

```text
Open application
      ↓
Enter first name
      ↓
Continue
      ↓
Gallery
```

A browser-specific user ID is generated using `crypto.randomUUID()` and stored locally.

The identity is then attached to interactions such as reactions and comments.

The activity feed uses the stored first name to display meaningful activity such as:

```text
Aamir reacted ❤️ to an image.
Aamir commented: "Great picture!"
```

This is intentionally a lightweight identity system rather than a full authentication system.

## Project Structure

```text
src/
├── assets/
│
├── components/
│   ├── activity/
│   │   └── ActivityFeed.tsx
│   │
│   ├── gallery/
│   │   ├── ImageCard.tsx
│   │   ├── ImageGrid.tsx
│   │   ├── ImageViewer.tsx
│   │   └── ReactionBar.tsx
│   │
│   └── user/
│       └── UserSetup.tsx
│
├── hooks/
│   ├── useActivities.ts
│   ├── useComments.ts
│   ├── useImages.ts
│   ├── useReactions.ts
│   └── useUserIdentity.ts
│
├── lib/
│   ├── instant.ts
│   └── queryClient.ts
│
├── services/
│   └── unsplash.ts
│
├── store/
│   └── appStore.ts
│
├── types/
│   └── types.ts
│
├── App.tsx
├── App.css
├── index.css
└── main.tsx

instant.schema.ts
```

## API Handling

Unsplash is used as the external image API.

The API logic is isolated inside:

```text
src/services/unsplash.ts
```

The service converts the Unsplash response into the application's internal `GalleryImage` structure instead of passing the complete Unsplash response throughout the UI.

```text
ImageGrid
    ↓
useImages
    ↓
TanStack React Query
    ↓
Unsplash Service
    ↓
Unsplash API
```

The gallery uses `useInfiniteQuery` to retrieve images page by page.

An `IntersectionObserver` monitors the bottom of the gallery and triggers `fetchNextPage()` when another page is available.

## InstantDB Data Model

InstantDB stores the application's real-time interaction data separately from the Unsplash image data.

### Comments

Comments contain:

```text
imageId
userId
text
createdAt
```

Comments are queried using the selected image ID, so the image viewer displays only comments belonging to that image.

Users can delete their own comments by comparing the comment's `userId` with the current browser's generated user ID.

### Reactions

Reactions contain:

```text
imageId
emoji
userId
createdAt
```

The application allows one active reaction per user per image.

The behaviour is:

```text
No existing reaction
        ↓
Create reaction

Same emoji selected
        ↓
Remove reaction

Different emoji selected
        ↓
Replace previous reaction
```

Reaction counts are calculated from the synchronized reaction data.

### Activities

The activity entity stores global interaction events:

```text
imageId
type
emoji
text
userId
userName
createdAt
```

Activities are created when users react or comment.

The Activity Feed subscribes to the activities data separately from image-specific comments and reactions, allowing new events to appear in real time.

## Real-Time Architecture

The application intentionally separates two different types of state.

### External API state

Handled by TanStack React Query:

```text
Unsplash API
     ↓
React Query
     ↓
Gallery
```

### Collaborative real-time state

Handled by InstantDB:

```text
InstantDB
   ├── Reactions
   ├── Comments
   └── Activities
          ↓
     Real-time UI
```

This separation keeps API fetching, local UI state, and collaborative data responsibilities clear.

## Key React Decisions

### Functional Components

The application uses React functional components throughout the UI.

Gallery, image viewer, reaction controls, comments, activity feed, and user setup are separated into focused components.

### React Query for API State

TanStack React Query is used for Unsplash because gallery images are external API/server state.

`useInfiniteQuery` provides the foundation for infinite scrolling.

### Zustand for UI State

Zustand manages lightweight application UI state:

```text
selectedImageId
isViewerOpen
```

This keeps viewer-related state separate from server and real-time data.

### Local State

React `useState` is used for component-level state such as the controlled comment input.

### InstantDB for Real-Time State

InstantDB is used for reactions, comments, and activities because these interactions need to synchronize between connected clients.

### Separation of Concerns

The project separates:

* UI components
* API services
* React hooks
* Real-time database access
* Application UI state
* Type definitions

This keeps individual parts of the application focused on their responsibilities.

## Infinite Scrolling

The gallery uses an `IntersectionObserver` attached to an element at the bottom of the image list.

When the element becomes visible and another page is available:

```text
IntersectionObserver
        ↓
fetchNextPage()
        ↓
React Query
        ↓
Unsplash
        ↓
More images
```

The pages returned by React Query are flattened before being passed to the gallery.

## Challenges & Solutions

### 1. Infinite Scrolling

The initial gallery loaded a single page of images.

The solution was to combine TanStack React Query's `useInfiniteQuery` with `IntersectionObserver`.

### 2. Real-Time Synchronization

Reactions and comments needed to appear for other users without manually refreshing the page.

InstantDB was used as the real-time data layer so connected clients receive updates automatically.

### 3. Preventing Multiple Reactions

A user should have only one active reaction for an image.

The reaction logic checks the current user's existing reaction before deciding whether to create, remove, or replace it.

### 4. Comment Ownership

Users can delete only their own comments.

Each comment stores the generated browser user ID, which is compared against the current user's ID.

### 5. Global Activity Feed

The application needed a global activity feed independent of the currently selected image.

A separate `activities` entity and `useActivities` hook were introduced for this purpose.

### 6. User Identity

The activity feed needed meaningful user attribution without implementing a full authentication system.

A lightweight browser identity flow was implemented using:

```text
First name
+
Generated browser user ID
+
localStorage
```

### 7. Activity Feed Layout

The activity feed is displayed beside the gallery on larger screens.

```text
┌──────────────────────────┬───────────────────┐
│                          │                   │
│        Gallery           │  Activity Feed    │
│         ~70%             │       ~30%         │
│                          │                   │
│                          │ independent       │
│                          │ scrolling          │
└──────────────────────────┴───────────────────┘
```

This allows users to continue browsing the gallery while keeping recent activity visible.

## Real-Time Testing

Real-time functionality was tested using multiple browser tabs.

Example:

```text
Tab A
User adds reaction
      ↓
   InstantDB
      ↓
Tab B
Reaction appears without refresh
```

The same approach was used to verify:

* Reactions
* Comments
* Activity feed updates

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
VITE_INSTANT_APP_ID=your_instant_app_id
```

The environment file is intentionally excluded from Git.

Do not commit API credentials or other environment-specific secrets to the repository.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/amirb17/realtime-gallery.git
cd realtime-gallery
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` and add:

```env
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
VITE_INSTANT_APP_ID=your_instant_app_id
```

### 4. Start development server

```bash
npm run dev
```

The application will be available at the local Vite development URL.

## Development Commands

### Start development server

```bash
npm run dev
```

### Run ESLint

```bash
npm run lint
```

### Create production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Production Readiness

Before deployment, the project should pass:

```bash
npm run lint
npm run build
```

The production build is generated in:

```text
dist/
```

## Deployment

The application can be deployed as a Vite single-page application on a static hosting platform.

Required environment variables must be configured in the deployment platform:

```text
VITE_UNSPLASH_ACCESS_KEY
VITE_INSTANT_APP_ID
```

After deployment, verify:

* User setup works
* Gallery images load
* Infinite scrolling works
* Image viewer works
* Emoji picker works
* Reactions synchronize
* Comments synchronize
* Activity feed updates
* User names appear in activity
* Production environment variables are correctly configured

## Future Improvements

Potential improvements for a production-scale version include:

* Full authentication instead of browser-based identity
* Automated unit and integration tests
* Better conflict handling for simultaneous interactions
* Activity feed pagination or virtualization for large datasets
* Image loading and caching optimizations
* Improved accessibility and keyboard navigation
* More advanced error recovery and retry handling
* Monitoring and production observability

## Assignment Requirements Covered

The implementation covers the main application requirements:

* React functional components
* TypeScript
* Tailwind CSS
* Unsplash API
* Responsive image gallery
* Infinite scrolling
* Focused image view
* Emoji reactions
* Emoji picker
* One reaction per user per image
* Reaction replacement/removal behaviour
* Real-time reaction synchronization
* Real-time comments
* Comment ownership and deletion
* Global real-time activity feed
* User identity
* User-name attribution in activity feed
* Separation of gallery and activity feed logic
* Controlled comment input
* Loading and error handling
* Async/await
* InstantDB real-time data layer
* TanStack React Query
* Zustand UI state management

## License

This project was created as a technical assignment and portfolio project.
