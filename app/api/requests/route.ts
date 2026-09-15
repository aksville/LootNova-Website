import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { rewardRequests } from "../../../db/schema";

const allowed = {
  freefire: { currency: "Diamonds", amounts: [100, 310, 520, 1060] },
  roblox: { currency: "Robux", amounts: [80, 400, 800, 1700] },
} as const;

function id() {
  return `LNV-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const game = String(body.game || "") as keyof typeof allowed;
    const country = String(body.country || "").trim().slice(0, 40);
    const countryCode = String(body.countryCode || "").trim().slice(0, 6);
    const phone = String(body.phone || "").replace(/\D/g, "").slice(0, 15);
    const gameUsername = String(body.gameUsername || "").trim().slice(0, 40);
    const amount = Number(body.amount);
    if (!allowed[game] || !allowed[game].amounts.includes(amount as never)) return Response.json({ error: "Choose a valid game reward." }, { status: 400 });
    if (!country || !/^\+\d{1,4}$/.test(countryCode) || phone.length < 7 || gameUsername.length < 3) return Response.json({ error: "Please check your details." }, { status: 400 });

    const now = new Date();
    const row = { id: id(), country, countryCode, phone, game, gameUsername, amount, currency: allowed[game].currency, status: "pending", createdAt: now, updatedAt: now };
    await getDb().insert(rewardRequests).values(row);
    return Response.json({ request: { id: row.id, status: row.status } }, { status: 201 });
  } catch {
    return Response.json({ error: "Requests are temporarily unavailable. Please try again." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const requestId = new URL(request.url).searchParams.get("id")?.trim().toUpperCase() || "";
  if (!/^LNV-[A-F0-9]{8}$/.test(requestId)) return Response.json({ error: "Enter a valid tracking ID." }, { status: 400 });
  try {
    const [row] = await getDb().select({ id: rewardRequests.id, game: rewardRequests.game, currency: rewardRequests.currency, amount: rewardRequests.amount, status: rewardRequests.status, createdAt: rewardRequests.createdAt }).from(rewardRequests).where(eq(rewardRequests.id, requestId)).limit(1);
    if (!row) return Response.json({ error: "Request not found." }, { status: 404 });
    return Response.json({ request: row });
  } catch {
    return Response.json({ error: "Tracking is temporarily unavailable." }, { status: 500 });
  }
}
