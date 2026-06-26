# Dark Mode & Google OAuth Implementation

## 🌓 Dark Mode Implementation

### Features
- Animated toggle button with sun/moon icons
- Smooth transitions between light and dark themes
- Persistent theme selection using next-themes
- Toggle button positioned in top-right navbar
- System preference support

### Components Updated

#### 1. ThemeToggle Component
**Location**: `src/components/ui/ThemeToggle.tsx`

- Animated sun/moon icon rotation
- Scale transitions
- Positioned in navbar (desktop & mobile)

#### 2. All Pages with Dark Mode Classes
- Landing page (`/`)
- Dashboard (`/dashboard`)
- Map page (`/map`)
- Climate Data page (`/climate-data`)
- Auth page (`/auth`)
- Profile page (`/profile`)

#### 3. UI Components
- `Button.tsx` - Dark mode variants
- `Card.tsx` - Dark backgrounds and borders
- `Input.tsx` - Dark mode input fields
- `Navbar.tsx` - Dark mode navigation

#### 4. Global Styles
**Location**: `src/styles/globals.css`

```css
body {
  @apply bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100;
}
```

### Usage

The theme toggle automatically appears in the navbar. Users can:
1. Click the sun/moon icon to toggle themes
2. Theme preference is saved automatically
3. Respects system preference on first visit

### Color Scheme

**Light Mode**:
- Background: `bg-white`, `bg-gray-50`
- Text: `text-gray-900`, `text-gray-600`
- Borders: `border-gray-200`

**Dark Mode**:
- Background: `dark:bg-gray-900`, `dark:bg-gray-800`
- Text: `dark:text-white`, `dark:text-gray-300`
- Borders: `dark:border-gray-700`

---

## 🔐 Google OAuth Implementation

### Features
- "Continue with Google" button on auth page
- Google OAuth 2.0 flow
- Environment variable configuration
- Callback handler for authorization code
- Mock authentication for development

### Setup

#### 1. Environment Variables
**File**: `.env.local` (create from `.env.example`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:8001

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
7. Copy Client ID and Client Secret

#### 3. Files Created

**Auth Page with Google Login**
- `src/app/auth/page.tsx` - Added Google OAuth button

**Callback Handler**
- `src/app/auth/callback/page.tsx` - Handles OAuth redirect

### Google Login Flow

1. User clicks "Continue with Google"
2. Redirects to Google OAuth consent screen
3. User authorizes the application
4. Google redirects back to `/auth/callback?code=...`
5. Callback page processes the code
6. User is authenticated and redirected to dashboard

### Mock Authentication

For development without real Google OAuth:
- Email/password login works with any credentials
- Google login is mocked to simulate OAuth flow
- User data is stored in Zustand state

### Security Notes

⚠️ **Important for Production**:
1. Store `GOOGLE_CLIENT_SECRET` securely (server-side only)
2. Implement server-side token exchange
3. Validate OAuth tokens on backend
4. Use HTTPS in production
5. Implement CSRF protection
6. Add rate limiting on auth endpoints

### Backend Integration

To connect with real backend API:

```typescript
// In auth page
const handleGoogleLogin = async () => {
  const response = await fetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  const data = await response.json();
  setUser(data.user);
};
```

---

## 🎨 UI/UX Enhancements

### Animations
- Theme toggle has rotation and scale animations
- Smooth color transitions on all elements
- 200ms transition duration for theme changes

### Accessibility
- Proper ARIA labels on theme toggle
- Focus states maintained in dark mode
- High contrast ratios in both themes
- Keyboard navigation support

### Responsive Design
- Theme toggle visible on all screen sizes
- Mobile menu includes theme toggle
- Consistent spacing in both themes

---

## 🧪 Testing

### Test Dark Mode
1. Click theme toggle in navbar
2. Verify all pages switch themes
3. Refresh page - theme should persist
4. Check system preference sync

### Test Google OAuth
1. Click "Continue with Google" button
2. Should redirect to Google login (or mock flow)
3. After auth, redirects to dashboard
4. User data appears in profile

---

## 📁 File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── page.tsx              # Auth page with Google login
│   │   └── callback/
│   │       └── page.tsx          # OAuth callback handler
│   ├── dashboard/page.tsx        # Dark mode enabled
│   ├── map/page.tsx              # Dark mode enabled
│   ├── climate-data/page.tsx    # Dark mode enabled
│   ├── profile/page.tsx          # Dark mode enabled
│   └── page.tsx                  # Landing with dark mode
├── components/
│   ├── ui/
│   │   ├── ThemeToggle.tsx       # Theme toggle button
│   │   ├── Button.tsx            # Dark mode variants
│   │   ├── Card.tsx              # Dark mode variants
│   │   └── Input.tsx             # Dark mode variants
│   └── common/
│       └── Navbar.tsx            # Includes theme toggle
└── styles/
    └── globals.css               # Dark mode base styles
```

---

## 🚀 Quick Start

1. **Install dependencies** (if not done):
   ```bash
   cd client
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Add your Google OAuth credentials
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Test features**:
   - Navigate to http://localhost:3000
   - Click theme toggle in navbar
   - Try Google login at /auth

---

## 🔧 Customization

### Change Dark Mode Colors

Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#1a1a1a',
        card: '#2d2d2d',
      }
    }
  }
}
```

### Modify Theme Toggle Position

Edit `src/components/common/Navbar.tsx`:
```tsx
<ThemeToggle /> {/* Move or restyle */}
```

---

## ✅ Checklist

- [x] Dark mode toggle button created
- [x] All pages support dark mode
- [x] UI components have dark variants
- [x] Theme persists across sessions
- [x] Google OAuth button added
- [x] OAuth callback handler implemented
- [x] Environment variables configured
- [x] Smooth animations added
- [x] Mobile responsive
- [x] Accessible

---

**Built with ❤️ for INDRA Climate Intelligence Platform**
