import { cookies } from "next/headers";
export async function POST() {
  (await cookies()).set("lootnova_admin", "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
  return Response.json({ ok: true });
}
