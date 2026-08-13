# BrainDoc 3D Experience

A cinematic, responsive personal-knowledge product experience inspired by the editorial motion and spatial storytelling of Shopify Editions—implemented specifically for BrainDoc without copying Shopify assets or layouts.

## What changed

- Interactive canvas-based 3D knowledge sphere with pointer parallax
- Scroll-led editorial landing page with varied visual chapters
- Pointer-reactive 3D cards, layered document stacks, orbital integrations, and animated privacy vault
- Clickable four-stage RAG workflow
- Interactive grounded-answer demo with source citations
- Responsive mobile navigation and mobile-specific 3D layouts
- Reduced-motion support and keyboard focus states
- Persistent hash-based navigation (`#dashboard`, `#documents`, `#chat`, etc.)
- Working file picker and drag/drop upload simulation with progress and indexing states
- Persistent document state via `localStorage`
- Working document search/filter/preview/delete/re-index flows
- Working AI chat simulation, semantic search, integrations, settings, theme, and notifications
- Spatial dashboard knowledge-core visualization

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Canvas 2D for the dependency-free 3D knowledge graph
- CSS 3D transforms for depth, tilt, cards, orbits, and layered scenes

No Three.js dependency is required. This keeps the experience lightweight and straightforward to maintain.

## Run locally

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Frontend/backend boundary

This project ships a complete interactive frontend prototype. The current document ingestion, AI response, authentication, integration, and search behaviors use realistic local demo state. Replace the simulated handlers with your API calls at these boundaries:

- Authentication: `src/pages/AuthPage.tsx`
- Upload/indexing: `src/components/UploadPanel.tsx` and `src/App.tsx`
- RAG chat: `src/pages/ChatPage.tsx`
- Semantic search: `src/pages/SearchPage.tsx`
- OAuth connections: `src/pages/IntegrationsPage.tsx`

Recommended backend endpoints:

```text
POST   /api/auth/login
POST   /api/auth/register
POST   /api/documents/upload
GET    /api/documents
POST   /api/documents/:id/reindex
DELETE /api/documents/:id
POST   /api/search
POST   /api/conversations/:id/messages   # stream via SSE
GET    /api/integrations
POST   /api/integrations/:provider/connect
```

For production, use secure HTTP-only cookies, signed upload URLs, server-side file validation, per-user vector namespaces, source-level authorization, and streamed answer citations.

## 3D implementation notes

`NeuralScene.tsx` generates a Fibonacci sphere, rotates points in 3D, perspective-projects them onto canvas, and draws depth-aware connections. It caps device pixel ratio and pauses expensive drawing when offscreen. `TiltCard.tsx` uses pointer position to update transform and highlight variables without adding another rendering dependency.

## Spatial workspace

The authenticated workspace now uses a GPU-friendly spatial control-deck system across Dashboard, Documents, AI Chat, Search, Integrations, and Settings. Pointer tilt is event-delegated and updated through `requestAnimationFrame`, so cards gain depth without React re-renders. The shell includes a keyboard command palette (`Cmd/Ctrl + K`), route-specific ambient color, responsive mobile navigation, reduced-motion fallbacks, and glass/depth materials that share the landing page's visual language.

## Precision motion runtime

The final interaction pass centralizes scroll progress, scroll direction, velocity, pointer position, page visibility, and reduced-motion behavior in one requestAnimationFrame-driven runtime. Landing-page scroll no longer causes React tree re-renders. Route changes use the View Transitions API when available, with graceful fallbacks. Dialogs now lock scroll, trap focus, close with Escape, restore focus, and expose correct ARIA semantics. Navigation, notifications, command search, focus states, mobile safe areas, and keyboard operation have also been refined.

## Living Knowledge Core

The landing experience now centers on one scroll-driven concept: scattered source fragments evolving into a cited intelligence core. A procedural WebGPU shader is selected when available, with WebGL2 and Canvas 2D fallbacks. The renderer initializes during idle time, renders only near the viewport, pauses when hidden, caps DPR, monitors frame cost, and reduces resolution under sustained load. Save-Data, low-memory, low-core, reduced-motion, and manual reduced-effects modes use lighter rendering paths. All story copy remains semantic DOM content above the decorative canvas.
