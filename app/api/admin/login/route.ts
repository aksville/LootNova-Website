import { cookies } from "next/headers";
import { createAdminToken, validAdminCredentials } from "../../../../lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json() as { phone?: string; password?: string };
  const phone = String(body.phone || "").replace(/\D/g, "");
  const password = String(body.password || "");
  if (!validAdminCredentials(phone, password)) return Response.json({ error: "Phone number or password is incorrect." }, { status: 401 });
  (await cookies()).set("lootnova_admin", await createAdminToken(), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 60 * 60 * 12 });
  return Response.json({ ok: true });
}
