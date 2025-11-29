"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MusicEngine = {
  ctx: AudioContext;
  gain: GainNode;
  intervalId: number;
};

function playStartTone() {
  try {
    if (typeof window === "undefined") return;
    const audioContextConstructor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
    if (!audioContextConstructor) return;
    const ctx = new audioContextConstructor();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.12);
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    oscillator.connect(gainNode).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.25);
  } catch {
    // Silenciamos errores porque el audio es un efecto opcional.
  }
}

function startRetroLoop(): MusicEngine | null {
  if (typeof window === "undefined") return null;
  const audioContextConstructor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
  if (!audioContextConstructor) return null;

  const ctx = new audioContextConstructor();
  const gain = ctx.createGain();
  gain.gain.value = 0.05;
  gain.connect(ctx.destination);

  const pattern = [523.25, 659.25, 784, 659.25, 880, 659.25, 784, 659.25];
  let step = 0;
  const intervalId = window.setInterval(() => {
    const osc = ctx.createOscillator();
    const now = ctx.currentTime;
    osc.type = "square";
    osc.frequency.setValueAtTime(pattern[step % pattern.length], now);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.2);
    step += 1;
  }, 220);

  return { ctx, gain, intervalId };
}

function stopRetroLoop(engine: MusicEngine | null) {
  if (!engine) return;
  window.clearInterval(engine.intervalId);
  try {
    engine.gain.disconnect();
    engine.ctx.close();
  } catch {
    // Ignoramos errores al cerrar el audio.
  }
}

export default function Home() {
  const pelletCount = 12;
  const [musicEnabled, setMusicEnabled] = useState(false);
  const musicEngineRef = useRef<MusicEngine | null>(null);

  const toggleMusic = () => {
    if (musicEnabled) {
      stopRetroLoop(musicEngineRef.current);
      musicEngineRef.current = null;
      setMusicEnabled(false);
      return;
    }
    const engine = startRetroLoop();
    if (engine) {
      musicEngineRef.current = engine;
      setMusicEnabled(true);
    }
  };

  useEffect(() => {
    return () => {
      stopRetroLoop(musicEngineRef.current);
    };
  }, []);

  return (
    <main className="home-screen relative min-h-screen flex items-center justify-center bg-black bg-maze px-6 py-12">
      <div className="home-grid">
        <header className="hud-panel">
          <div>
            <p className="hud-label">score</p>
            <p className="hud-value">002580</p>
          </div>
          <div>
            <p className="hud-label">vidas</p>
            <p className="hud-lives">
              <span className="full">♥</span>
              <span className="full">♥</span>
              <span>♥</span>
            </p>
          </div>
          <div className="hud-level-chip">
            Nivel Retro
            <span className="chip-dot" />
          </div>
        </header>

        <section className="arcade-shell">
          <div className="arcade-glow" aria-hidden />
          <div className="screen-content">
            <p className="mode-pill">Modo historia</p>
            <h1 className="neon-title text-4xl md:text-6xl">Proyecto Final</h1>
            <p className="neon-by text-xl md:text-2xl mb-6">by Jessika</p>

            <div className="start-instructions">
              <p className="start-instructions-title">Instrucciones</p>
              <ul>
                <li>Califica cada nivel con corazones.</li>
                <li>Desbloquea el siguiente al puntuar.</li>
                <li>Completa los 9 para ver la sorpresa.</li>
              </ul>
            </div>

            <div className="music-controls">
              <button
                type="button"
                className={`music-toggle ${musicEnabled ? "on" : ""}`}
                onClick={toggleMusic}
              >
                {musicEnabled ? "Apagar música" : "Música Pac-Man"}
              </button>
              <span className="music-hint">Loop retro opcional • requiere interacción</span>
            </div>

            <div className="start-actions">
              <Link href="/levels" onClick={playStartTone} className="press-start-btn">
                START
              </Link>
              <span className="press-enter">Presiona ENTER • Insert Coin</span>
            </div>

            <div className="pellet-lane" aria-hidden>
              {Array.from({ length: pelletCount }).map((_, index) => (
                <span key={`pellet-${index}`} className="lane-pellet" />
              ))}
              <span className="lane-pacman" />
            </div>
          </div>
        </section>
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
