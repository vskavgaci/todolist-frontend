# TodoList Frontend

React 19 + TypeScript + Vite + Tailwind CSS v4 + TanStack Query

## Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **TanStack Query** - Server state management
- **React Router** - Routing
- **dnd-kit** - Drag and drop (to be added)

## Development

The app runs on `http://localhost:3000` by default.

Make sure the backend API is running on the URL specified in `.env` (default: `http://localhost:3001`).

## Available Routes

- `/` - Home page (todo list)
- `/login` - Login page
- `/register` - Register page
