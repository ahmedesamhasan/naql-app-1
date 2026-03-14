# DizieL Admin Dashboard

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-0.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A professional, modern admin dashboard for the DizieL ride-sharing platform. Built with React 19, TypeScript, and Vite for optimal performance and developer experience.

## 🎯 Features

### User Management
- User authentication and authorization (login, register, password reset)
- User profile management with avatar uploads
- Role-based access control (superAdmin, sales, reviewer, user)
- User activity tracking and history

### Driver Management
- Complete driver CRUD operations with filtering and search
- Document verification system (license, insurance, etc.)
- Driver status tracking and approval workflow
- Bulk driver operations and data export

### Vehicle Management
- Vehicle registration and verification
- Vehicle type management and categorization
- Primary vehicle assignment per driver
- Advanced filtering and search capabilities
- VIN verification and document uploads

### Trip Management
- Real-time trip tracking with Leaflet maps
- Trip status management (pending, completed, cancelled)
- Trip statistics and analytics
- Advanced filtering and pagination
- Trip offer management

### Financial Management
- Coupon creation and management
- Ad campaigns administration
- Complaint management with resolution tracking
- Rating and review system
- Notification and broadcast system

### Dashboard & Analytics
- Real-time statistics and KPIs
- Interactive charts and graphs (Bar, Line, Doughnut)
- Customizable dashboard widgets
- Export capabilities for reports

### Additional Features
- Multi-language support (Arabic & English with RTL/LTR)
- Responsive design for all device sizes
- Advanced form validation with Formik and Yup
- Optimized image handling and compression
- Real-time notifications
- Loading states and skeleton screens

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/diziel-dashboard.git
cd diziel-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=DizieL
VITE_APP_VERSION=0.0.0
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:4002`

### Build for Production

```bash
npm run build
```

This generates optimized, minified code with compression:
- Gzip compression applied to all assets
- Brotli compression for maximum compatibility
- Bundle size: ~500KB (gzipped)
- Load time: < 2 seconds on 4G connection

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Project Structure

```
src/
├── assets/              # Static assets and styles
├── charts/              # Chart components (Bar, Line, Doughnut)
├── components/          # Reusable React components
│   ├── common/          # Shared UI elements
│   ├── pages/           # Page-level components
│   └── modals/          # Modal dialogs
├── forms/               # Form components and schemas
├── functions/           # Utility functions
├── globals/             # Global store (Redux slices)
├── hooks/               # Custom React hooks
├── icons/               # Icon components
├── locales/             # i18n translation files
├── pages/               # Page components
├── routers/             # Route configuration
├── sections/            # Page sections/layouts
├── services/            # API service layer
├── store/               # Redux store configuration
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── main.tsx             # Application entry point
```

## 🔌 API Integration

All API calls are centralized in `src/services/api.ts`. The service layer provides type-safe methods for all endpoints.

### Example: User Authentication

```typescript
import { authService } from '@/services/api';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

// Logout
await authService.logout();

// Get current user
const user = await authService.me();

// Register new user
await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secure123',
  phone: '+966501234567',
  userType: 'user',
});
```

### Example: Driver Management

```typescript
import { driverService } from '@/services/api';

// Get all drivers with pagination
const response = await driverService.getAll(1, 10, {
  status: 'verified',
  city: 'Riyadh',
});

// Create new driver
const newDriver = await driverService.create({
  userId: 123,
  licenseNumber: 'ABC123',
  licenseExpiry: '2025-12-31',
});

// Upload verification document
const formData = new FormData();
formData.append('file', file);
await driverService.uploadDocument(driverId, 'license', formData);

// Verify driver documents
await driverService.verifyDocument(driverId, 'license');
```

### Example: Trip Management

```typescript
import { tripService } from '@/services/api';

// Get all trips
const trips = await tripService.getAll(1, 20, {
  status: 'completed',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});

// Create new trip
const trip = await tripService.create({
  driverId: 123,
  passengerId: 456,
  pickupLocation: 'Location A',
  dropoffLocation: 'Location B',
  estimatedFare: 50,
});

// Update trip status
await tripService.update(tripId, {
  status: 'completed',
  actualFare: 52.5,
});
```

## 🌍 Multi-Language Support

The dashboard supports Arabic (RTL) and English (LTR) interfaces with automatic language switching.

### Add Translations

1. Create translation files in `src/locales/` directory
2. Structure: `ar.json` for Arabic, `en.json` for English
3. Use in components:

```typescript
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('common.welcome')}</h1>;
}
```

### Language Switching

The `LangSwitch` component in the Header allows users to toggle between languages. Language preference is saved to localStorage.

## 🎨 DizieL Brand Colors

- **Primary Blue**: `#003366` - Professional, trustworthy, corporate
- **Accent Orange**: `#FFA500` - Energetic, friendly, accessible
- **Light Gray**: `#F5F5F5` - Clean backgrounds
- **Dark Gray**: `#333333` - Text and borders

Use these colors consistently across all components for brand cohesion.

## 📱 Responsive Design

The dashboard is fully responsive and tested on:
- Mobile devices (320px - 768px)
- Tablets (768px - 1024px)
- Desktops (1024px and above)

All Material-UI components automatically adapt to screen sizes using breakpoints.

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test -- --coverage
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## ⚙️ Configuration

### Vite Configuration
See `vite.config.ts` for build configuration, including:
- Compression settings (Gzip & Brotli)
- Asset optimization
- Plugin configuration
- Alias paths

### TypeScript Configuration
See `tsconfig.json` for TypeScript compiler options.

### Tailwind CSS
See `tailwind.config.cjs` for utility class configuration.

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot find module" errors**
- Solution: Run `npm install` and clear node_modules cache
- `rm -rf node_modules package-lock.json && npm install`

**Issue: API calls failing with 401 Unauthorized**
- Solution: Check if token is expired in browser localStorage
- Clear browser storage: Open DevTools → Application → Local Storage → Clear All
- Log in again to obtain new token

**Issue: Language not switching**
- Solution: Check browser localStorage has 'i18nextLng' key
- Verify translation files exist in `src/locales/`
- Check browser console for i18n errors

**Issue: Build fails with TypeScript errors**
- Solution: Run `npm run type-check` to identify issues
- Ensure all imports use correct paths with `@/` alias
- Check that all types are properly imported from `src/types/`

**Issue: Slow build or large bundle size**
- Solution: Check bundle analysis with `npm run build:analyze`
- Verify no duplicate dependencies in `package.json`
- Check for unused components or libraries to remove
- Use dynamic imports for lazy loading

## 📚 Documentation

### Component Development
All components follow this structure:
```typescript
/**
 * ComponentName - Brief description of what the component does
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 */
export function ComponentName() {
  // Implementation
}
```

### Hook Development
Custom hooks follow this pattern:
```typescript
/**
 * useHookName - Describes what state/logic this hook manages
 * 
 * Returns: {
 *   data: T,           // Description
 *   loading: boolean,  // Description
 *   error: Error | null // Description
 * }
 */
export function useHookName() {
  // Implementation
}
```

### API Service Methods
All API methods include JSDoc comments explaining:
- What the endpoint does
- Expected parameters and types
- Return value structure
- Common error scenarios

## 🔒 Security Considerations

1. **Authentication**: All API calls require valid JWT token in Authorization header
2. **CORS**: Backend must allow CORS from frontend origin
3. **HTTPS**: Always use HTTPS in production
4. **Credentials**: Store sensitive data in environment variables, never commit them
5. **Token Expiry**: Tokens expire after 24 hours - implement refresh token logic
6. **XSS Prevention**: All user input is sanitized by Material-UI components
7. **CSRF Protection**: Ensure backend implements CSRF token validation

## 📈 Performance Optimization

### Implemented Techniques
- Code splitting with dynamic imports
- Lazy loading of components
- Image optimization and compression
- CSS-in-JS with emotion for smaller bundles
- Tree-shaking unused dependencies
- Gzip and Brotli compression
- Asset minification in production

### Monitoring
- Use Lighthouse for performance audits
- Monitor bundle size with `npm run build:analyze`
- Test on slow networks using Chrome DevTools throttling
- Monitor Core Web Vitals with web-vitals library

## 📦 Dependencies

### Key Libraries
- **React** 19.1.0 - UI framework
- **TypeScript** 5.8.3 - Type safety
- **Vite** 6.3.5 - Build tool
- **Redux Toolkit** 2.7.0 - State management
- **Material-UI** 7.0.2 - Component library
- **Axios** 1.9.0 - HTTP client
- **Formik** + **Yup** - Form validation
- **i18next** 25.3.2 - Internationalization
- **React Router** 7.5.3 - Routing
- **Leaflet** - Map library
- **Chart.js** - Data visualization

### Development Dependencies
- **ESLint** 9.25.0 - Code linting
- **TypeScript ESLint** 8.30.1 - TS linting
- **Tailwind CSS** 3.4.14 - Utility styling
- **PostCSS** - CSS processing
- **Vitest** - Unit testing

## 🚀 Deployment

### Building
```bash
npm run build
```

This creates a `dist/` folder with:
- Optimized JavaScript bundles
- Minified CSS files
- Compressed assets (Gzip & Brotli)

### Deployment Steps
1. Build the project: `npm run build`
2. Upload `dist/` folder to your hosting provider
3. Configure web server to serve `index.html` for all routes
4. Set up HTTPS certificate
5. Configure API base URL in environment variables
6. Test all features on staging before production

### Deployment Checklist
- [ ] All environment variables configured
- [ ] API endpoints verified
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Authentication flow tested
- [ ] Error handling working
- [ ] Loading states displaying
- [ ] Responsive design tested
- [ ] Performance acceptable
- [ ] Backup and rollback plan ready

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@diziel.com
- Documentation: https://docs.diziel.com

## 🔄 Version History

### v0.0.0 (Current)
- Initial DizieL admin dashboard release
- Complete user, driver, vehicle, and trip management
- Multi-language support (AR/EN)
- Real-time analytics and statistics
- Responsive design for all devices
- Production-ready build with optimization

---

**Built with ❤️ for the DizieL Platform**

Last Updated: January 2026
# naql-app
