"use client";

import { useEffect, useMemo, useState } from "react";
import { Gift, LogOut, ShieldCheck } from "lucide-react";

type Row = { id:string; country:string; countryCode:string; phone:string; game:string; gameUsername:string; amount:number; currency:string; status:string; createdAt:string };

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  async function load() {
    const response = await fetch("/api/admin/requests", { cache: "no-store" });
    if (response.status === 401) return setLoggedIn(false);
    const data = await response.json();
    setRows(data.requests || []);
    setLoggedIn(true);
  }
  useEffect(() => { void load(); }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault(); setError("");
    const response = await fetch("/api/admin/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ phone, password }) });
    const data = await response.json();
    if (!response.ok) return setError(data.error || "Could not sign in.");
    setPassword(""); await load();
  }
  async function update(id:string,status:string) {
    const previous = rows;
    setRows(rows.map((row) => row.id === id ? { ...row, status } : row));
    const response = await fetch("/api/admin/requests", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id, status }) });
    if (!response.ok) { setRows(previous); setError("Status update failed."); }
  }
  async function logout() { await fetch("/api/admin/logout", { method:"POST" }); setLoggedIn(false); }
  const stats = useMemo(() => ({ total:rows.length, pending:rows.filter(r=>r.status==="pending").length, approved:rows.filter(r=>r.status==="approved").length, completed:rows.filter(r=>r.status==="fulfilled").length }), [rows]);

  if (loggedIn === null) return <main className="login-wrap"><p>Checking admin session…</p></main>;
  if (!loggedIn) return <main className="login-wrap"><form className="login-card" onSubmit={login}>
    <div className="icon-box"><ShieldCheck /></div><p className="kicker">Protected area</p><h1>Admin sign in</h1><p>Only the owner can view phone numbers and game request details.</p>
    <label><span>Admin phone</span><input inputMode="numeric" value={phone} onChange={(e)=>setPhone(e.target.value.replace(/\D/g,""))} autoComplete="username" /></label>
    <label><span>Password</span><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="current-password" /></label>
    {error && <p className="form-error">{error}</p>}<button className="primary-button">Sign in</button><a href="/" className="secondary-button" style={{display:"inline-grid",placeItems:"center",width:"100%"}}>Back to site</a>
  </form></main>;

  return <main className="admin-shell"><div className="admin-wrap">
    <header className="admin-head"><div className="admin-title"><span className="icon-box"><Gift size={21}/></span><div><h1>Reward requests</h1><p>Private admin dashboard</p></div></div><button className="logout" onClick={logout}><LogOut size={15}/> Sign out</button></header>
    <section className="stats"><div className="stat-card"><small>Total requests</small><strong>{stats.total}</strong></div><div className="stat-card"><small>Pending</small><strong>{stats.pending}</strong></div><div className="stat-card"><small>Approved</small><strong>{stats.approved}</strong></div><div className="stat-card"><small>Completed</small><strong>{stats.completed}</strong></div></section>
    {error && <p className="form-error">{error}</p>}
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Request</th><th>Contact</th><th>Game account</th><th>Reward</th><th>Date</th><th>Status</th></tr></thead><tbody>
      {rows.length === 0 ? <tr><td colSpan={6}>No requests yet.</td></tr> : rows.map((row)=><tr key={row.id}>
        <td><strong>{row.id}</strong><small>{row.country}</small></td><td>{row.countryCode} {row.phone}</td><td><strong>{row.game === "freefire" ? "Free Fire" : "Roblox"}</strong><small>{row.gameUsername}</small></td><td>{row.amount.toLocaleString()} {row.currency}</td><td>{new Date(row.createdAt).toLocaleString()}</td>
        <td><select value={row.status} onChange={(e)=>update(row.id,e.target.value)}><option value="pending">Pending</option><option value="approved">Approved</option><option value="fulfilled">Completed</option><option value="rejected">Rejected</option></select></td>
      </tr>)}
    </tbody></table></div>
  </div></main>;
}
