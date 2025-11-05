# NeuraChat - Realtime AI Chat  
A realtime group chat demo built with Node.js + Socket.IO (backend) and React + Vite (frontend). The app demonstrates encrypted group messaging (client-side group key using libsodium), typing indicators, a simple AI-bot placeholder, and a modern responsive UI.

## Table of contents

- Project overview
- Quick start (dev)
- Architecture & key files
- Encryption notes
- Environment variables
- Folder structure
- Contributing
- License

## Project overview

This repository contains a small realtime chat application intended as a demo / starting point for building secure group chat experiences:

- Backend: Node.js + Express + Socket.IO handles rooms, broadcast events, and simple health checks.
- Frontend: React + Vite UI that connects to the backend via Socket.IO client. The frontend contains a client-side group key implementation using libsodium for symmetric encryption of chat text.

Key features:

- Realtime group chat (joinRoom, chatMessage, typing indicators)
- Client-side message encryption (XChaCha20-Poly1305 via libsodium)
- Basic group key generation and localStorage persistence (demo only)
- Modern React UI with components and Framer Motion transitions

## Quick start (development)

These instructions assume you have Node.js (16+) and npm installed.

1) Backend

Open a terminal, navigate to the `backend` folder, install deps and start the server:

```powershell
cd backend
npm install
# start the server directly (server.js is the server file)
node server.js
```

By default the server listens on port 4600. You can set a different port using `PORT` in a `.env` file.

2) Frontend

Open a second terminal, navigate to the `frontend` folder and start the Vite dev server:

```powershell
cd frontend
npm install
npm run dev
```

3) Connect frontend to backend locally

- The frontend WebSocket client (`frontend/src/ws.js`) currently points at a production URL. For local development, change the URL to your local backend, e.g.:

```js
// frontend/src/ws.js
// replace production URL with your local backend URL
const socket = io('http://localhost:4600');
```

- The backend reads `process.env.FRONTEND_URL` for CORS. For local dev create `backend/.env` with:

```text
PORT=4600
FRONTEND_URL=http://localhost:5173
```

Then restart the backend.

## Architecture & key files

- `backend/server.js` — Express + Socket.IO server. Handles join, chatMessage, typing events and broadcasts to the `group` room.
- `frontend/src/ws.js` — Socket.IO client wrapper and helper functions to send/receive encrypted messages.
- `frontend/src/utils/encryptionService.js` — Uses `libsodium-wrappers` to generate a group key, encrypt (crypto_secretbox) and decrypt messages. Stores group key in localStorage for demo use.
- `frontend/src/App.jsx` — Main React app that wires socket events into UI components.

## Encryption (important notes)

- The frontend demo encrypts message text using a symmetric group key (libsodium secretbox). The group key is generated and stored in `localStorage` for convenience.
- This is a demo: storing keys in localStorage and broadcasting plaintext/shared keys is not secure for production.

If you plan to extend this into a real app, consider:

- Proper key exchange (asymmetric public-key handshake or Signal Protocol for pairwise encryption)
- Secure storage for keys (OS-level secure storage / keychain / secure enclave)
- Avoid sending plaintext group keys over the network
- Use TLS (HTTPS / WSS) in production (Render/Vercel endpoints above use HTTPS)

## Environment variables

Backend requires (optional):

- `PORT` — port for the backend server (default 4600)
- `FRONTEND_URL` — allowed origin for CORS (set to your frontend address during dev)

Create a `.env` in the `backend` folder to set these values.

## Scripts & dependencies

- Backend (`backend/package.json`): dependencies include `express`, `socket.io`, `dotenv`.
	- There is no `start` script defined; run `node server.js` or add a script:

```json
// backend/package.json (add)
"scripts": {
	"start": "node server.js"
}
```

- Frontend (`frontend/package.json`): uses Vite. Common scripts:
	- `npm run dev` — start dev server
	- `npm run build` — build production bundle
	- `npm run preview` — preview build

Important frontend dependencies: `react`, `react-dom`, `socket.io-client`, `libsodium-wrappers`, `libsignal-protocol` (present but not fully wired), `framer-motion`.

## Folder structure (top-level)

```
backend/                # Node + Socket.IO server
frontend/               # React + Vite frontend
	src/                  # React source files (App.jsx, components, ws.js, utils)
	public/               # static assets
README.md               # this file
```

## Common troubleshooting

- Backend unreachable from frontend: ensure backend is running and `frontend/src/ws.js` points to the correct backend URL and `FRONTEND_URL` is set in backend `.env`.
- CORS errors: set `FRONTEND_URL` to the exact origin of your running frontend (including port) or `*` for local testing only.
- Encryption errors: make sure `libsodium-wrappers` is available and that the browser has loaded the library (`sodium.ready` is awaited in `encryptionService.js`).

## Contributing

This project is a demo. If you'd like to contribute:

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description

Recommended small improvements:

- Implement secure key exchange (Signal Protocol integration)
- Add automated tests for encryption functions
- Add CI, linting and format checks

## License

This repository does not currently specify a license. Add one in `LICENSE` if you plan to publish or accept contributions.

---

If you'd like, I can also:

- Add a `start` script to the backend package.json and create a `.env.example` file
- Update `frontend/src/ws.js` to read a configurable environment variable for the WebSocket URL
- Add a short CONTRIBUTING.md template

Tell me which of the above you'd like me to do next and I will update the repository.
