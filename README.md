# Realtime Gallery

A multi-user real-time image interaction application built with React, TypeScript, Tailwind CSS, React Query, and InstantDB.

The application allows users to browse an image gallery, open focused image views, add emoji reactions, post comments, and see interactions synchronize in real time across multiple users. A global activity feed displays interactions happening across the gallery.

## Features

* Image gallery powered by the Unsplash API
* Responsive image grid
* Infinite scrolling with React Query
* Focused image viewer
* Emoji reactions on images
* One reaction per user per image
* Clicking the same reaction removes it
* Selecting a different reaction replaces the previous reaction
* Real-time reaction synchronization with InstantDB
* Real-time comments
* Users can delete their own comments
* Global real-time activity feed
* Activity feed displays reactions and comments from across the gallery
* Gallery and activity feed have independent scrolling
* Loading and error states
* Two-tab testing for real-time synchronization

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* TanStack React Query
* InstantDB
* Unsplash API
* Zustand
* Git & GitHub

## Project Structure

```text
src/
├── components/
│   ├── activity/
│   │   └── ActivityFeed.tsx
│   └── gallery/
│       ├── ImageCard.tsx
│       ├── ImageGrid.tsx
│       ├── ImageViewer.tsx
│       └── ReactionBar.tsx
│
├── hooks/
│   ├── useActivities.ts
│   ├── useComments.ts
│   ├── useImages.ts
│   └── useReactions.ts
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
├── pages/
├── utils/
├── App.tsx
└── main.tsx
```

## Setup Instructions

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

Create a `.env` file in the project root:

```env
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
VITE_INSTANT_APP_ID=your_instant_app_id
```

The Unsplash access key is used by the application to request gallery images.

The InstantDB application ID connects the frontend to the configured InstantDB application.

Do not commit the `.env` file or expose private credentials in the repository.

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local Vite development URL.

## API Handling Strategy

Unsplash is used as the external image API.

The API logic is kept separate from the React components in:

```text
src/services/unsplash.ts
```

The service converts the Unsplash response into the application's `GalleryImage` structure instead of exposing the complete Unsplash response throughout the UI.

React Query is responsible for handling the API request and server state.

The gallery uses `useInfiniteQuery` to implement infinite scrolling.

The page flow is:

```text
ImageGrid
    ↓
useImages
    ↓
React Query
    ↓
Unsplash API
```

Each page requests a fixed number of images. When the user reaches the bottom of the gallery, an `IntersectionObserver` triggers `fetchNextPage()`.

The pages returned by React Query are flattened before being passed to the gallery.

## InstantDB Schema & Usage

InstantDB is used as the real-time data layer for user interactions.

The application stores interaction data separately from the Unsplash image data.

### Comments

Comments contain information such as:

```text
imageId
text
userId
createdAt
```

Comments are queried using the selected image ID, so the image viewer only displays comments related to that image.

When a comment is created or deleted, InstantDB synchronizes the change with connected clients without requiring a manual refresh.

### Reactions

Reactions contain:

```text
imageId
emoji
userId
createdAt
```

The application identifies the current browser/user using a generated user ID stored locally.

The reaction logic ensures that a user has one active reaction per image:

```text
First click
    ↓
Add reaction

Same reaction clicked again
    ↓
Remove reaction

Different reaction selected
    ↓
Replace previous reaction
```

Reaction counts are calculated from the synchronized reaction data.

### Activities

The activity feed stores global interaction events such as:

```text
imageId
type
emoji
text
createdAt
```

Activity records are created for interactions and are queried separately from image-specific comments and reactions.

The Activity Feed subscribes to InstantDB data, allowing new activity to appear in real time.

## Real-Time Architecture

The application separates external API data from real-time interaction data.

```text
                    ┌─────────────────┐
                    │   Unsplash API  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  React Query    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Gallery     │
                    └─────────────────┘


                    ┌─────────────────┐
                    │    InstantDB    │
                    └────────┬────────┘
                             │
             ┌───────────────┼───────────────┐
             ▼               ▼               ▼
        Reactions        Comments        Activities
             │               │               │
             └───────────────┼───────────────┘
                             ▼
                    Real-time UI updates
```

This separation allows React Query to handle external API/server data while InstantDB handles collaborative real-time interaction state.

## Key React Decisions

### Functional Components

The application uses React functional components throughout.

Gallery, image viewer, reaction bar, comments, and activity feed functionality are separated into individual components.

### React Query for API State

React Query is used for Unsplash API data because the gallery data is server/API state.

`useInfiniteQuery` is used because the gallery supports infinite scrolling.

### Local State

`useState` is used for UI state such as the currently selected image and controlled comment input.

For example, the selected image is represented by an image ID:

```text
selectedImageId
```

This keeps the UI state small and focused.

### InstantDB for Real-Time State

InstantDB is used for reactions, comments, and activities because these pieces of data need to synchronize between multiple users.

### Controlled Inputs

Comment input is controlled through React state.

The current comment text is stored in state and cleared after a successful comment mutation.

### Separation of Concerns

The project separates:

* UI components
* API services
* React hooks
* Real-time database access
* Application state
* Type definitions

This keeps individual components focused on their responsibilities.

### Infinite Scrolling

An `IntersectionObserver` watches an invisible element at the bottom of the gallery.

When it becomes visible and another page is available, `fetchNextPage()` loads more images.

## Challenges & Solutions

### 1. Implementing Infinite Scrolling

The initial gallery loaded only one page of images.

The solution was to use React Query's `useInfiniteQuery` together with `IntersectionObserver`.

The observer detects when the user reaches the bottom and requests the next page.

### 2. Real-Time Synchronization

The application needed reactions and comments to appear for another user without refreshing.

InstantDB was used as the real-time data layer so connected clients automatically receive updates.

The implementation was tested using multiple browser tabs.

### 3. Preventing Multiple Reactions From the Same User

A user should have one active reaction per image.

The reaction logic checks whether the current user already has a reaction for that image.

The behaviour is:

* No existing reaction → create one
* Same emoji → remove it
* Different emoji → replace the existing reaction

### 4. Comment Ownership

Comments can be deleted by their creator.

The comment stores the user's generated ID, allowing the application to determine whether the current user owns the comment before displaying the delete action.

### 5. Global Activity Feed

The gallery and image-specific interactions needed to remain separate from the global feed.

A separate `activities` entity and `useActivities` hook were introduced so the feed can subscribe to global interactions independently.

### 6. Activity Feed Layout

Initially, the activity feed was placed below the gallery.

Because the gallery uses infinite scrolling, the feed would continuously move farther down the page.

The final design uses a desktop two-column layout:

```text
Gallery                  Activity Feed
~70%                     ~30%
```

The feed has its own scrolling area, allowing users to browse images while continuing to see recent activity.

## Real-Time Testing

The real-time functionality was tested using multiple browser tabs.

For example:

```text
Tab A
User adds reaction
        ↓
     InstantDB
        ↓
Tab B
Reaction appears without refresh
```

The same approach was used to verify comments and activity feed updates.

## What I Would Improve With More Time

* Add a dedicated emoji picker instead of relying on a fixed set of emojis.
* Add a more user-friendly identity system with generated usernames or colors.
* Add subtle animations when new activity appears in the feed.
* Improve the visual design of the activity feed and image interactions.
* Add stronger conflict-handling behaviour for simultaneous interactions.
* Improve automated testing for reactions, comments, infinite scrolling, and real-time synchronization.
* Deploy the application and perform final multi-device real-time testing.

## Development

Start the development server:

```bash
npm run dev
```

Build the production application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Assignment Requirements Covered

The implementation covers the main assignment requirements:

* React functional components
* Tailwind CSS
* Unsplash API
* Scrollable image gallery
* Infinite scrolling
* Focused image view
* Emoji reactions
* Real-time reaction synchronization
* Real-time comments
* Global real-time activity feed
* Separation of gallery and feed logic
* Controlled comment input
* Loading and error handling
* Async/await
* InstantDB real-time data layer

The remaining deployment and final verification steps should be completed before submission.
