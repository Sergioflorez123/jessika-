"use client";
import Link from "next/link";

function playStartTone() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(440, ctx.currentTime);
    o.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.25);
  } catch {}
}

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black bg-maze px-6">
      <div className="absolute top-4 left-6 text-cyan-300 text-sm md:text-base">
        <span className="mr-6">Score: 0000</span>
        <span>Lives: ♥ ♥ ♥</span>
      </div>
      <div className="text-center space-y-6">
        <h1 className="neon-title text-4xl md:text-6xl">Proyecto Final</h1>
        <p className="neon-by text-xl md:text-2xl">by Jessika</p>
        <Link
          href="/levels"
          onClick={playStartTone}
          className="press-start inline-block px-6 py-3 text-xl border-4 border-cyan-400 text-yellow-300 transition-transform hover:scale-105"
        >
          START
        </Link>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <span className="ghost ghost-run ghost-red" />
        <span className="ghost ghost-run ghost-pink" style={{ animationDelay: "0.6s" }} />
        <span className="ghost ghost-run ghost-cyan" style={{ animationDelay: "1.2s" }} />
        <span className="ghost ghost-run ghost-orange" style={{ animationDelay: "1.8s" }} />
      </div>
    </main>
  );
}
