## Packages
framer-motion | Essential for the smooth, modern animations required for a premium gaming UI
date-fns | Required for formatting tournament dates and timestamps cleanly
recharts | Needed for the player statistics and ELO charts on the dashboard
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility to efficiently merge Tailwind CSS classes

## Notes
- Using provided static images at /images/: bgmi.png, valorant.png, freefire.webp
- Assuming Replit Auth is handled via the provided useAuth hook and /api/login endpoint
- App forces a dark theme for the esports aesthetic
- Tailwind config assumes CSS variables are used for colors as defined in index.css
