"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

type StyleWithVars = CSSProperties & { [key: `--${string}`]: string | number };

type Level = {
  id: number;
  title: string;
  description: string;
  image: string;
  tip: string;
};

const levels: Level[] = [
  {
    id: 1,
    title: "Dragón",
    description:
      "Una pieza que simboliza la fuerza imparable capaz de reducir todo a cenizas cuando se trata de proteger lo que amas.",
    tip: "Inspiración: La fuerza que se puede llegar a tener y hasta volver todo a cenizas por proteger lo que amas.",
    image: "/level1.jpg",
  },
  {
    id: 2,
    title: "Rosa con espinas",
    description: "La dualidad entre una belleza impecable y el dolor que surge cuando no se toma con cuidado.",
    tip: "Inspiración: La belleza de las cosas pero que llegan a lastimar si no se toman con cuidado.",
    image: "/level3.jpg",
  },
  {
    id: 3,
    title: "Gato en la luna",
    description: "Un retrato nostálgico que habla de sueños inmensos y la ilusión que provocan las cosas más pequeñas.",
    tip: "Inspiración: Los sueños y la ilusión que me dan las cosas.",
    image: "/level2.jpg",
  },
  {
    id: 4,
    title: "Michael Jackson",
    description:
      "Un homenaje al rey del pop, a sus canciones icónicas y a esa energía emblemática que merece ser estampada.",
    tip: "Inspiración: El rey del pop y sus canciones me parecen algo muy emblemático, una razón para estamparlo.",
    image: "/level4.jpg",
  },
  {
    id: 5,
    title: "Bailarina",
    description:
      "Una postal de un sueño de infancia que, aunque no se cumplió, sigue siendo un amor platónico por ese momento de la vida.",
    tip: "Inspiración: Quiero reflejar mi sueño de pequeña que lastimosamente no se cumplió pero sigue siendo un amor platónico hacia este lindo momento de mi vida.",
    image: "/level5.jpg",
  },
  {
    id: 6,
    title: "Colibrí alimentándose",
    description:
      "Celebración vibrante de la flora y fauna colombiana que despierta un agradecimiento enorme por vivir en un país tan hermoso.",
    tip: "Inspiración: La belleza de la flora y fauna colombiana que me produce un agradecimiento enorme de vivir en este hermoso país.",
    image: "/level6.jpg",
  },
  {
    id: 7,
    title: "Autorretrato",
    description:
      "Una pieza íntima en la que se plasma un instante de autoestima plena, capturado con esta técnica que realza cada detalle.",
    tip: "Inspiración: Sentí que en esa foto refleja mi autoestima y lo plasmé con esta gran técnica.",
    image: "/level7.jpg",
  },
  {
    id: 8,
    title: "Ave Fénix",
    description:
      "Retrato luminoso de la resiliencia: aunque todo parezca terminado, siempre existe una forma de levantarse una y otra vez.",
    tip: "Inspiración: La belleza de saber que por más acabado que te sientas siempre se va a encontrar la forma de levantarse de nuevo y las veces que sea.",
    image: "/level8.jpg",
  },
  {
    id: 9,
    title: "Alacrán y ave",
    description:
      "Una unión entre rudeza y delicadeza en un solo elemento que grita versatilidad y refleja la manera en que eres.",
    tip: "Inspiración: La rudeza y la delicadeza en un solo elemento que reflejan la versatilidad de como soy.",
    image: "/level9.jpg",
  },
];

export default function LevelsPage() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [ratings, setRatings] = useState(() => levels.map(() => 0));
  const [finished, setFinished] = useState(false);

  const progress = useMemo(() => {
    const completed = ratings.filter((score) => score > 0).length;
    return Math.round((completed / levels.length) * 100);
  }, [ratings]);

  const handleRate = (value: number) => {
    setRatings((prev) => {
      const next = [...prev];
      next[currentLevel] = value;
      return next;
    });
  };

  const handleNext = () => {
    if (ratings[currentLevel] === 0) return;
    if (currentLevel === levels.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentLevel((prev) => prev + 1);
  };

  if (finished) {
    return <FinalScreen />;
  }

  const level = levels[currentLevel];
  const canContinue = ratings[currentLevel] > 0;

  return (
    <main className="min-h-screen bg-black bg-maze text-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-6xl levels-wrapper">
        <div className="levels-start-link-wrapper">
          <Link href="/" className="levels-start-link">
            ← Volver al START
          </Link>
        </div>
        <div className="level-layout">
          <div className="level-meta-panel">
            <header className="levels-header">
              <div>
                <p className="text-cyan-300 font-semibold tracking-[0.2em] uppercase text-sm">
                  aventura retro
                </p>
                <h1 className="text-3xl font-black text-yellow-300 drop-shadow-neon">
                  Califica cada nivel antes de avanzar
                </h1>
              </div>
              <div className="text-right">
                <p className="text-xs text-cyan-200 uppercase tracking-[0.35em]">progreso</p>
                <p className="text-2xl font-bold text-yellow-200">{progress}%</p>
              </div>
            </header>

            <LevelHud
              currentLevel={currentLevel}
              totalLevels={levels.length}
              score={ratings[currentLevel]}
            />

            <div className="level-timeline">
              {levels.map((item, index) => {
                const isActive = index === currentLevel;
                const isDone = ratings[index] > 0;
                return (
                  <div
                    key={item.id}
                    className={`level-badge ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
                  >
                    <span>{item.id}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <section className="level-card">
            <div className="level-media">
              <Image
                src={level.image}
                alt={level.title}
                width={900}
                height={600}
                sizes="(max-width: 880px) 100vw, 50vw"
                className="level-image"
                priority={currentLevel === 0}
              />
            </div>
            <div className="level-body">
              <p className="text-xs uppercase text-cyan-200 tracking-[0.4em]">
                Nivel {level.id} de {levels.length}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-yellow-200">{level.title}</h2>
              <p className="text-base text-gray-100 leading-relaxed">{level.description}</p>
              <div className="level-tip">
                <span className="font-semibold text-yellow-300">Tip:</span> {level.tip}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-cyan-200 mb-2">
                  tu puntuación
                </p>
                <HeartRating value={ratings[currentLevel]} onRate={handleRate} />
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canContinue}
                className="level-next-btn"
              >
                {currentLevel === levels.length - 1 ? "Finalizar aventura" : "Siguiente nivel"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

type HeartRatingProps = {
  value: number;
  onRate: (value: number) => void;
};

function HeartRating({ value, onRate }: HeartRatingProps) {
  const audioRef = useRef<null | { ctx: AudioContext; gain: GainNode }>(null);
  const playPac = (level: number) => {
    if (typeof window === "undefined") return;
    const AC = window.AudioContext || (window as Window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
    if (!AC) return;
    let engine = audioRef.current;
    if (!engine) {
      const ctx = new AC();
      const gain = ctx.createGain();
      gain.gain.value = 0.08;
      gain.connect(ctx.destination);
      engine = { ctx, gain };
      audioRef.current = engine;
    }
    void engine.ctx.resume();
    const now = engine.ctx.currentTime;
    const base = 240 + level * 20;
    const step = (startFreq: number, t: number) => {
      const osc = engine.ctx.createOscillator();
      const filter = engine.ctx.createBiquadFilter();
      const env = engine.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 1.4, t + 0.12);
      filter.type = "bandpass";
      filter.Q.value = 0.9;
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.linearRampToValueAtTime(1800, t + 0.12);
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(1, t + 0.02);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(filter);
      filter.connect(env);
      env.connect(engine!.gain);
      osc.start(t);
      osc.stop(t + 0.2);
    };
    step(base, now);
    step(base * 0.9, now + 0.12);
  };

  return (
    <div className="heart-rating" role="radiogroup" aria-label="Calificación con corazones">
      {[1, 2, 3, 4, 5].map((heart) => (
        <button
          key={heart}
          type="button"
          className={`heart ${heart <= value ? "active" : ""}`}
          onClick={() => {
            playPac(heart);
            onRate(heart);
          }}
          aria-pressed={heart <= value}
          aria-label={`${heart} ${heart === 1 ? "corazón" : "corazones"}`}
        >
          ♥
        </button>
      ))}
    </div>
  );
}

type LevelHudProps = {
  currentLevel: number;
  totalLevels: number;
  score: number;
};

function LevelHud({ currentLevel, totalLevels, score }: LevelHudProps) {
  const pellets = totalLevels;
  const pacmanPosition =
    totalLevels > 1 ? (currentLevel / (totalLevels - 1)) * 100 : 0;
  const filledHearts = Math.min(score, 3);

  return (
    <section className="level-hud">
      <div className="hud-block">
        <span className="hud-label">nivel</span>
        <span className="hud-value">
          {currentLevel + 1}/{totalLevels}
        </span>
      </div>
      <div className="hud-block">
        <span className="hud-label">vidas</span>
        <span className="hud-lives">
          {[0, 1, 2].map((life) => (
            <span key={life} className={life < filledHearts ? "full" : ""}>
              ♥
            </span>
          ))}
        </span>
      </div>
      <div className="hud-block hud-pellets">
        <span className="hud-label">pellets</span>
        <div className="pellet-track">
          {Array.from({ length: pellets }).map((_, index) => (
            <span
              key={`pellet-${index}`}
              className={`pellet ${index <= currentLevel ? "eaten" : ""}`}
            />
          ))}
          <span
            className="mini-pacman"
            style={{ left: `calc(${pacmanPosition}% - 12px)` }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

function FinalScreen() {
  const thanksLetters = useMemo(() => "MUCHAS GRACIAS".split(""), []);
  const pacmanDuration = Math.max(2.2, thanksLetters.length * 0.12);
  const letterDisappearDelay = Math.max(pacmanDuration - 0.4, 0);
  const pacmanStyle = useMemo<StyleWithVars>(
    () => ({ ["--pacwalk-duration" as const]: `${pacmanDuration}s` }),
    [pacmanDuration],
  );
  const thanksTrackStyle = useMemo<StyleWithVars>(
    () => ({ ["--letters-delay" as const]: `${letterDisappearDelay}s` }),
    [letterDisappearDelay],
  );
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowExplosion(true), pacmanDuration * 1000);
    return () => clearTimeout(timer);
  }, [pacmanDuration]);

  const [particles] = useState(() =>
    Array.from({ length: 12 }).map((_, index) => ({
      x: Math.random() * 320 - 160,
      y: Math.random() * 180 - 90,
      delay: index * 50,
    })),
  );

  return (
    <main className="min-h-screen bg-black bg-maze text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center space-y-6">
        <p className="text-cyan-200 tracking-[0.4em] uppercase">misión cumplida</p>
        <div
          className="thanks-track"
          role="img"
          aria-label="MUCHAS GRACIAS"
          style={thanksTrackStyle}
        >
          <span className="sr-only">MUCHAS GRACIAS</span>
          {thanksLetters.map((letter, index) => (
            <span key={`${letter}-${index}`} className="thanks-letter">
              <span className="letter-body">{letter === " " ? "\u00A0" : letter}</span>
              <span className="letter-burst" />
            </span>
          ))}
          <div className="pacman-chomp" style={pacmanStyle}>
            <Image src="/pacman.svg" alt="Pac-Man gigante" fill sizes="120px" priority />
          </div>
          <div className={`pac-explosion ${showExplosion ? "visible" : ""}`} aria-hidden>
            {particles.map((particle, index) => (
              <span
                key={`particle-${index}`}
                className="explosion-particle"
                style={{
                  ["--particle-x" as const]: `${particle.x}px`,
                  ["--particle-y" as const]: `${particle.y}px`,
                  ["--particle-delay" as const]: `${particle.delay}ms`,
                } as StyleWithVars}
              />
            ))}
          </div>
        </div>
        <p className="final-subtitle">Pac-Man devoró el mensaje completo. ¿Insertas otra moneda?</p>
        <p className="final-highlight">lo que comenzo como un intento , hoy es una obra nitida y llena de intencion.</p>
        <Link
          href="/"
          className="inline-block px-8 py-3 border-4 border-yellow-300 text-yellow-200 font-bold tracking-[0.3em] uppercase hover:scale-105 transition-transform"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

