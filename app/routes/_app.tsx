import { Outlet, NavLink } from "react-router";
import { Home, Music, Zap, TrendingUp, Star } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/practice", label: "Practice", icon: Music, end: false },
  { to: "/warmup", label: "Warm-Up", icon: Zap, end: false },
  { to: "/progress", label: "Progress", icon: TrendingUp, end: false },
  { to: "/audition", label: "Audition", icon: Star, end: false },
];

export default function AppLayout() {
  const { config, loading } = useConfigurables();
  const primary = config?.brandColor?.primary ?? "#7C3AED";

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto relative">
      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 shadow-lg z-50"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center justify-around px-2 py-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "text-purple-700"
                    : "text-gray-400 hover:text-gray-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    style={isActive ? { color: primary } : undefined}
                  />
                  <span
                    className={`text-xs font-medium leading-none ${isActive ? "font-semibold" : ""}`}
                    style={isActive ? { color: primary } : undefined}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
