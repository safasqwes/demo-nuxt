# NovelHub - Web Novel Platform

A modern web novel reading platform built with Nuxt 4.1.3.

## Installation

Install dependencies:

```bash
npm install
```

## Development

Start the development server at `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Static Generation

Generate static site:

```bash
npm run generate
```

Start Node.js server to serve static files:

```bash
npm run serve
```

## Features

- ✅ **Latest Technology**: Built with Nuxt 4.1.3 and Vue 3
- ✅ **Fast Performance**: Static Site Generation (SSG) for lightning-fast loads
- ✅ **SEO Optimized**: Pre-rendered HTML for better search engine visibility
- ✅ **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ✅ **TypeScript**: Full TypeScript support for type safety
- ✅ **Modern UI**: Beautiful gradient design with smooth animations
- ✅ **State Management**: Pinia for reactive state management
- ✅ **API Protection**: Automatic fingerprint protection for all API requests
- ✅ **Authentication**: Complete user authentication system

## Project Structure

```
demo-nuxt/
├── assets/          # Static assets (CSS, images, etc.)
├── components/      # Vue components
├── composables/     # Reusable composables
│   ├── useAuthToken.ts
│   └── useNotification.ts
├── config/          # Application configuration
├── layouts/         # Layout components
├── pages/           # Page components (auto-routing)
│   ├── index.vue   # Home page
│   └── about.vue   # About page
├── plugins/         # Nuxt plugins
├── server/          # Server API routes
│   └── api/
├── stores/          # Pinia state stores
│   ├── user.ts     # User authentication
│   └── app.ts      # Application state
├── utils/           # Utility functions
│   ├── http.ts     # HTTP client with fingerprint
│   ├── fingerprint.ts
│   └── xcode.ts
├── server.js        # Node.js Express server
├── app.vue          # Root component
├── nuxt.config.ts   # Nuxt configuration
└── package.json     # Project dependencies
```

## Platform Features

- 📚 Vast library of web novels and light novels
- 🌍 Multi-language support and translations
- ⚡ Lightning-fast page loads with SSG technology
- 📱 Responsive design for all devices
- 🔖 Bookmark and reading progress tracking
- 🎨 Customizable reading experience
- 🔒 Secure API with fingerprint protection (fp/fp1)
- 👤 User authentication and profile management
- 🗄️ Pinia state management for reactive data

## Authentication System

- ✅ User Registration with validation
- ✅ User Login with remember me
- ✅ Forgot Password flow
- ✅ Password Reset
- ✅ Change Password
- ✅ Personal Center/Profile
- ✅ Protected Routes (middleware)
- ✅ Auto Token Refresh

### Demo Account

For testing purposes:
- **Email**: demo@novelhub.com
- **Password**: password

### Available Routes

**Public Pages:**
- `/` - Home page
- `/about` - About page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/forgot-password` - Forgot password
- `/auth/reset-password` - Reset password (requires token)

**Protected Pages:**
- `/profile` - Personal center (requires login)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:3000
# Try demo account: demo@novelhub.com / password
```

## API Integration

All API requests automatically include fingerprint protection:

```typescript
import { http } from '~/utils/http'

// GET request
const novels = await http.get('/novels')

// POST request  
const result = await http.post('/user/profile', { username: 'newname' })
```

## State Management

Using Pinia for state management:

```typescript
// User store
const userStore = useUserStore()
await userStore.login(email, password)
console.log(userStore.displayName)

// App store
const appStore = useAppStore()
appStore.setTheme('dark')
```

## Learn More

- [Nuxt 4 Documentation](https://nuxt.com/docs/getting-started/introduction)
- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Express Documentation](https://expressjs.com/)

