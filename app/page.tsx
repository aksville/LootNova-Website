"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, Clock3, Gamepad2, Gift, LockKeyhole, Search, ShieldCheck, Sparkles } from "lucide-react";

const countries = [
  { name: "India", code: "+91", flag: "🇮🇳", min: 10, max: 10 },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩", min: 10, max: 10 },
  { name: "Pakistan", code: "+92", flag: "🇵🇰", min: 10, max: 10 },
  { name: "Nepal", code: "+977", flag: "🇳🇵", min: 10, max: 10 },
  { name: "United States", code: "+1", flag: "🇺🇸", min: 10, max: 10 },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", min: 10, max: 10 },
  { name: "Indonesia", code: "+62", flag: "🇮🇩", min: 9, max: 12 },
  { name: "Brazil", code: "+55", flag: "🇧🇷", min: 10, max: 11 },
];

const gameData = {
  freefire: { name: "Free Fire", currency: "Diamonds", accent: "#ffd54a", amounts: [100, 310, 520, 1060] },
  roblox: { name: "Roblox", currency: "Robux", accent: "#00e5ff", amounts: [80, 400, 800, 1700] },
} as const;

type GameKey = keyof typeof gameData;
type TrackedRequest = { id: string; game: string; currency: string; amount: number; status: string; createdAt: string };

function statusLabel(status: string) {
  return status === "approved" ? "Approved" : status === "fulfilled" ? "Completed" : status === "rejected" ? "Not approved" : "Under review";
}

export default function Home() {
  const [game, setGame] = useState<GameKey>("freefire");
  const [countryIndex, setCountryIndex] = useState(0);
  const [phone, setPhone] = useState("");
  const [gameUsername, setGameUsername] = useState("");
  const [amount, setAmount] = useState(100);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [tracked, setTracked] = useState<TrackedRequest | null>(null);
  const [tracking, setTracking] = useState(false);
  const selected = gameData[game];
  const country = countries[countryIndex];
  const cleanPhone = useMemo(() => phone.replace(/\D/g, ""), [phone]);

  function changeGame(value: GameKey) {
    setGame(value);
    setAmount(gameData[value].amounts[0]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (cleanPhone.length < country.min || cleanPhone.length > country.max) return setError(`Enter a valid ${country.name} phone number.`);
    if (gameUsername.trim().length < 3) return setError("Enter your correct in-game username or player ID.");
    if (!agreed) return setError("Please accept the giveaway terms before submitting.");
    setLoading(true);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: country.name, countryCode: country.code, phone: cleanPhone, game, gameUsername: gameUsername.trim(), amount }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit your request.");
      setSuccessId(data.request.id);
      setTrackId(data.request.id);
      setPhone("");
      setGameUsername("");
      setAgreed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  async function track(e: React.FormEvent) {
    e.preventDefault();
    setTracking(true);
    setTracked(null);
    try {
      const response = await fetch(`/api/requests?id=${encodeURIComponent(trackId.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request not found.");
      setTracked(data.request);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request not found.");
    } finally { setTracking(false); }
  }

  return (
    <main className="site-shell">
      <div className="aurora aurora-one" /><div className="aurora aurora-two" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="LootNova home">
          <span className="brand-mark"><Gift size={21} /></span><span>Loot<span>Nova</span></span>
        </a>
        <nav><a href="#request">Request</a><a href="#track">Track</a><a href="/admin" className="admin-link"><LockKeyhole size={15} /> Admin</a></nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> Community giveaways</div>
          <h1>Request game rewards.<br /><span>Track every step.</span></h1>
          <p>Submit one reward request for admin review. No game password, OTP or payment is ever required.</p>
          <div className="trust-row"><span><ShieldCheck size={17} /> No passwords</span><span><Clock3 size={17} /> Manual review</span><span><Search size={17} /> Status tracking</span></div>
        </div>
        <div className="reward-orbit" aria-hidden="true">
          <div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="core-gift"><Gift size={56} /></div>
          <span className="coin coin-one">R$</span><span className="coin coin-two">◆</span><span className="coin coin-three">+</span>
        </div>
      </section>

      <section id="request" className="workspace-grid">
        <div className="panel request-panel">
          <div className="panel-heading"><span className="step-number">01</span><div><p className="kicker">New request</p><h2>Choose your reward</h2></div></div>
          {successId ? (
            <div className="success-card">
              <span className="success-icon"><CheckCircle2 size={34} /></span><p className="kicker">Request received</p><h3>Saved for admin review</h3>
              <p>Keep this private tracking ID:</p><button className="tracking-id" onClick={() => navigator.clipboard.writeText(successId)}>{successId}</button>
              <small>Tap the ID to copy it.</small><button className="secondary-button" onClick={() => setSuccessId("")}>Submit another request</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label className="field-label">Select game</label>
              <div className="game-picker">
                {(Object.keys(gameData) as GameKey[]).map((key) => (
                  <button type="button" key={key} onClick={() => changeGame(key)} className={`game-card ${game === key ? "active" : ""}`}>
                    <span className="game-icon" style={{ color: gameData[key].accent }}><Gamepad2 size={24} /></span>
                    <span><strong>{gameData[key].name}</strong><small>{gameData[key].currency}</small></span><span className="radio-dot" />
                  </button>
                ))}
              </div>
              <div className="field-grid">
                <label><span className="field-label">Country</span><select value={countryIndex} onChange={(e) => setCountryIndex(Number(e.target.value))}>
                  {countries.map((item, index) => <option key={item.code + item.name} value={index}>{item.flag} {item.name} ({item.code})</option>)}
                </select></label>
                <label><span className="field-label">Phone number</span><div className="phone-input"><span>{country.code}</span>
                  <input inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, country.max))} placeholder="Phone number" />
                </div></label>
              </div>
              <label><span className="field-label">{selected.name} username / player ID</span>
                <input value={gameUsername} onChange={(e) => setGameUsername(e.target.value)} maxLength={40} placeholder={game === "freefire" ? "Enter Free Fire player ID" : "Enter Roblox username"} />
              </label>
              <span className="field-label">How many {selected.currency}?</span>
              <div className="amount-grid">{selected.amounts.map((value) => <button type="button" key={value} onClick={() => setAmount(value)} className={amount === value ? "active" : ""}><strong>{value.toLocaleString()}</strong><small>{selected.currency}</small></button>)}</div>
              <label className="consent"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} /><span>I understand this is a manual giveaway request, not a guaranteed reward. I will never share a password or OTP.</span></label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="primary-button" disabled={loading}>{loading ? "Submitting…" : <>Send request <ChevronRight size={18} /></>}</button>
            </form>
          )}
        </div>
        <aside className="side-stack">
          <div className="panel mini-panel">
            <div className="panel-heading compact"><span className="step-number">02</span><div><p className="kicker">What happens next</p><h2>Admin reviews it</h2></div></div>
            <ol className="process-list"><li><span>1</span><div><strong>Request saved</strong><small>You receive a private tracking ID.</small></div></li><li><span>2</span><div><strong>Details checked</strong><small>Admin verifies your in-game ID.</small></div></li><li><span>3</span><div><strong>Status updated</strong><small>Track pending, approved or completed.</small></div></li></ol>
          </div>
          <div id="track" className="panel track-panel">
            <p className="kicker">Already submitted?</p><h2>Track your request</h2>
            <form onSubmit={track} className="track-form"><input value={trackId} onChange={(e) => setTrackId(e.target.value.toUpperCase())} placeholder="Enter tracking ID" /><button disabled={tracking || !trackId.trim()} aria-label="Track request"><Search size={19} /></button></form>
            {tracked && <div className="status-result"><div><small>{tracked.game}</small><strong>{tracked.amount.toLocaleString()} {tracked.currency}</strong></div><span className={`status ${tracked.status}`}>{statusLabel(tracked.status)}</span></div>}
          </div>
        </aside>
      </section>
      <footer><span>LootNova</span><p>Independent community giveaway request portal. Not affiliated with Garena, Free Fire, Roblox Corporation, or their partners.</p></footer>
    </main>
  );
}
