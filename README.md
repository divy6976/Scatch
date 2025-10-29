## Zomato Scroll

An Instagram Reels-style food discovery app with a Node.js/Express backend and React/Vite frontend. Users can browse short food reels, like, save, and visit partner stores. Food partners can upload reels.

### Features
- Reels-style vertical feed with auto-play/pause on scroll
- Like and Save interactions with optimistic UI updates
- Saved reels page with identical UI to the Home feed
- Clean SVG iconography and counts-only labels
- Auth-protected API endpoints
- ImageKit upload integration for videos

### Tech Stack
- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: React (Vite), React Router, Axios
- Auth: JWT (middleware in `backend/src/middleware/auth.js`)
- Media: ImageKit via `backend/src/services/storageservices.js`

### Monorepo Structure
```
backend/
  src/
    app.js
    routes/
    model/
    middleware/
    services/
frontend/
  src/
    pages/
    routes/
    styles/
```

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas connection string)
- ImageKit account (or replace upload service with your own storage)

### Environment Variables
Create `.env` in `backend/` with:
```
PORT=6969
MONGO_URI=mongodb://localhost:27017/zomato-scroll
JWT_SECRET=replace_me
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_endpoint
```

Create `.env` in `frontend/` if you want to override defaults. Axios is configured in `frontend/src/config/axios.js`.

### Install and Run
From the project root:
```bash
# Backend
cd backend
npm install
npm run dev   # starts server on http://localhost:6969

# Frontend (in a separate terminal)
cd ../frontend
npm install
npm run dev   # starts Vite on http://localhost:5173
```

### Key Scripts
Backend `package.json`:
- `npm run dev`: start with nodemon
- `npm start`: production start

Frontend `package.json`:
- `npm run dev`: Vite dev server
- `npm run build`: production build
- `npm run preview`: preview built app

### API Overview (selected)
- `POST /api/v1/food/add` (auth: seller or foodPartner): upload a reel
- `GET /api/v1/food/get?page=1&limit=10` (auth: buyer or foodPartner): list feed with like/save counts and current user state
- `POST /api/v1/food/like` (auth): toggle like `{ foodId }`
- `POST /api/v1/food/save` (auth): toggle save `{ foodId }`
- `GET /api/v1/food/saved` (auth): current user saved reels

### Frontend Highlights
- Home feed: `frontend/src/pages/general/Home.jsx`
- Saved feed: `frontend/src/pages/general/Saved.jsx`
- Styles: `frontend/src/pages/general/reels.css`, `frontend/src/styles/theme.css`
- Router: `frontend/src/routes/Approutes.jsx`

### Development Notes
- SVG icons are used consistently across Home and Saved pages; labels show counts only
- Optimistic updates are applied for like/save, with automatic rollback on failure
- IntersectionObserver manages video play/pause behavior for performance

### Contributing
1. Create a feature branch
2. Make changes with clear commit messages
3. Open a PR to `main`



