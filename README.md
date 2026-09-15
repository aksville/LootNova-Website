# LootNova Reward Request Hub

Full-stack community giveaway request portal for Free Fire Diamonds and Roblox Robux.

## Features

- Country code and phone-number request form
- Free Fire player ID or Roblox username
- Reward amount selection
- Private tracking IDs
- Admin dashboard with pending, approved, completed and rejected states
- Cloudflare D1 database
- Secure HTTP-only admin session
- Responsive dark cyan interface

This project does not generate game currency automatically. An administrator reviews and fulfills eligible requests manually. Never ask users for game passwords, OTPs or payments.

## Local setup

1. Install Node.js 22.13 or newer.
2. Run `pnpm install`.
3. Configure the D1 database and these server-side environment variables:
   - `ADMIN_PHONE`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
4. Run `pnpm db:generate` after schema changes.
5. Run `pnpm dev` for development or `pnpm build` for production.

Never put real admin credentials in frontend files or commit them to Git.
