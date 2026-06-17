import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// ──────────────────────────────────────────────────────────────────────────
// Shared cinematic FX primitives for the Motion-Graphics beats.
// Everything here is deterministic (seeded via remotion's `random`) so renders
// are frame-stable, and tuned to read as a premium ad rather than a slideshow.
// ──────────────────────────────────────────────────────────────────────────

// Soft darkened edges so the eye stays on the centre of the stage.
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 46%, rgba(0,0,0,0) 38%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

// A breathing radial spotlight that slowly drifts — gives the flat stage life.
export const Spotlight: React.FC<{color?: string}> = ({color = 'rgba(46,143,230,0.35)'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const x = 50 + Math.sin(t * 0.5) * 8;
  const y = 44 + Math.cos(t * 0.4) * 6;
  const pulse = 0.85 + Math.sin(t * 0.9) * 0.15;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, rgba(0,0,0,0) 55%)`,
        opacity: pulse,
        pointerEvents: 'none',
      }}
    />
  );
};

// Floating gold-dust / bokeh — adds depth and a luxe, "particle ad" feel.
export const Bokeh: React.FC<{count?: number; colors?: string[]; seed?: string}> = ({
  count = 16,
  colors = ['rgba(255,196,46,0.9)', 'rgba(255,255,255,0.8)', 'rgba(46,143,230,0.7)'],
  seed = 'kudoz',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`${seed}-x-${i}`) * 100;
        const y0 = random(`${seed}-y-${i}`) * 100;
        const size = 4 + random(`${seed}-s-${i}`) * 16;
        const speed = 0.15 + random(`${seed}-v-${i}`) * 0.45;
        const phase = random(`${seed}-p-${i}`) * Math.PI * 2;
        const color = colors[i % colors.length];
        // gentle upward drift + lateral sway, wrapping within the frame
        const y = (((y0 - t * speed * 8) % 110) + 110) % 110 - 5;
        const sway = Math.sin(t * 1.2 + phase) * 2.2;
        const twinkle = 0.35 + (Math.sin(t * 2 + phase) * 0.5 + 0.5) * 0.65;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x + sway}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              opacity: twinkle,
              filter: 'blur(1px)',
              boxShadow: `0 0 ${size}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// A bright diagonal light bar that sweeps once across a circular region —
// the classic glint that sells a metallic / glossy hero asset.
export const LightSweep: React.FC<{size: number; at?: number; duration?: number}> = ({
  size,
  at = 8,
  duration = 26,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + duration], [-1.4, 1.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fade = interpolate(frame, [at, at + 4, at + duration - 6, at + duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        mixBlendMode: 'screen',
        opacity: fade,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          left: `${p * 100}%`,
          width: '45%',
          height: '160%',
          transform: 'rotate(18deg)',
          background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)',
          filter: 'blur(6px)',
        }}
      />
    </div>
  );
};

// Expanding ring shockwave, fired once — punctuates the moment a hero lands.
export const ShockwaveRing: React.FC<{at: number; color?: string; max?: number}> = ({
  at,
  color = 'rgba(255,196,46,0.8)',
  max = 900,
}) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < 0 || local > 30) return null;
  const d = interpolate(local, [0, 30], [60, max]);
  const op = interpolate(local, [0, 30], [0.8, 0]);
  const bw = interpolate(local, [0, 30], [10, 1]);
  return (
    <div
      style={{
        position: 'absolute',
        width: d,
        height: d,
        borderRadius: '50%',
        border: `${bw}px solid ${color}`,
        opacity: op,
        pointerEvents: 'none',
      }}
    />
  );
};

// Text with a moving specular highlight (gold/white shimmer) — premium titles.
export const ShineText: React.FC<{
  children: React.ReactNode;
  base?: string;
  highlight?: string;
  period?: number;
  style?: React.CSSProperties;
}> = ({children, base = '#fff', highlight = 'rgba(255,255,255,0.4)', period = 90, style}) => {
  const frame = useCurrentFrame();
  const pos = 130 - ((frame % period) / period) * 260; // sweep right → left
  return (
    <span
      style={{
        ...style,
        backgroundImage: `linear-gradient(100deg, ${base} 0%, ${base} 38%, ${highlight} 50%, ${base} 62%, ${base} 100%)`,
        backgroundSize: '240% 100%',
        backgroundPositionX: `${pos}%`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  );
};

// Confetti burst from the centre — celebratory punch for the outro.
export const Confetti: React.FC<{at?: number; count?: number; colors?: string[]; seed?: string}> = ({
  at = 0,
  count = 48,
  colors = ['#FFC42E', '#E5267E', '#23B26D', '#7A4FE0', '#2E8FE6', '#FF7A1A'],
  seed = 'conf',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const local = frame - at;
        if (local < 0) return null;
        const t = local / fps;
        const ang = random(`${seed}-a-${i}`) * Math.PI * 2;
        const power = 18 + random(`${seed}-pw-${i}`) * 42;
        const spin = (random(`${seed}-sp-${i}`) - 0.5) * 900;
        const w = 8 + random(`${seed}-w-${i}`) * 10;
        const h = 12 + random(`${seed}-h-${i}`) * 16;
        const color = colors[i % colors.length];
        // ballistic: out along angle, gravity pulls down over time
        const x = Math.cos(ang) * power * t * 6;
        const y = Math.sin(ang) * power * t * 6 + 90 * t * t;
        const op = interpolate(local, [0, 6, 60, 80], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '46%',
              width: w,
              height: h,
              borderRadius: 2,
              background: color,
              opacity: op,
              transform: `translate(${x}px, ${y}px) rotate(${spin * t}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Convenience: the deep-navy brand stage shared by every MG beat, with a
// breathing spotlight + drifting gold dust + vignette already layered in.
export const Stage: React.FC<{children: React.ReactNode; bokehSeed?: string}> = ({
  children,
  bokehSeed = 'kudoz',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // slow parallax zoom on the whole stage so nothing ever sits perfectly still
  const drift = spring({frame, fps, config: {damping: 200, mass: 3}, durationInFrames: 120});
  const scale = interpolate(drift, [0, 1], [1.04, 1]);
  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 42%, #0A3D91 0%, #06245A 60%, #03132E 100%)',
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
        <Spotlight />
        <Bokeh seed={bokehSeed} />
        {children}
        <Vignette />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
