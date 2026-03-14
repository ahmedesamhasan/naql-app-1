const fallback = (value: string | undefined, defaultValue: string) => value || defaultValue;
const getEnv = (): Partial<ImportMetaEnv> => (import.meta as ImportMeta).env || {};

export const createRoutes = (env: Partial<ImportMetaEnv> = getEnv()) => ({
  home: fallback(env.VITE_HOME_ROUTE, "/"),
  login: fallback(env.VITE_LOGIN_ROUTE, "/login"),
  updatePassword: fallback(env.VITE_UPDATE_PASSWORD_ROUTE, "/update-password"),
  dashboard: fallback(env.VITE_DASHBOARD_ROUTE, "/dashboard"),
  profile: fallback(env.VITE_PROFILE_ROUTE, "/profile"),
  users: fallback(env.VITE_USERS_ROUTE, "/users"),
  drivers: fallback(env.VITE_DRIVERS_ROUTE, "/drivers"),
  vehicles: fallback(env.VITE_VEHICLES_ROUTE, "/vehicles"),
  trips: fallback(env.VITE_TRIPS_ROUTE, "/trips"),
  vehicleTypes: fallback(env.VITE_VEHICLE_TYPES_ROUTE, "/vehicle-types"),
  coupons: fallback(env.VITE_COUPONS_ROUTE, "/coupons"),
  ads: fallback(env.VITE_ADS_ROUTE, "/ads"),
  complaints: fallback(env.VITE_COMPLAINTS_ROUTE, "/complaints"),
  notifications: fallback(env.VITE_NOTIFICATIONS_ROUTE, "/notifications"),
  packages: fallback(env.VITE_PACKAGES_ROUTE, "/packages"),
  payment: fallback(env.VITE_PAYMENT_ROUTE, "/payment"),
  otp: fallback(env.VITE_OTP_ROUTE, "/otp"),
  resetPassword: fallback(env.VITE_RESET_PASSWORD_ROUTE, "/reset-password"),
});

export const routes = createRoutes();
