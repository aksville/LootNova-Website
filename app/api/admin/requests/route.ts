import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { rewardRequests } from "../../../../db/schema";
import { isAdmin } from "../../../../lib/admin-auth";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await getDb().select().from(rewardRequests).orderBy(desc(rewardRequests.createdAt)).limit(250);
  return Response.json({ requests: rows });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { id?: string; status?: string };
  const statuses = ["pending", "approved", "fulfilled", "rejected"];
  if (!body.id || !body.status || !statuses.includes(body.status)) return Response.json({ error: "Invalid update." }, { status: 400 });
  await getDb().update(rewardRequests).set({ status: body.status, updatedAt: new Date() }).where(eq(rewardRequests.id, body.id));
  return Response.json({ ok: true });
}
