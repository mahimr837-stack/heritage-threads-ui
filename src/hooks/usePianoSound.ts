/**
 * Piano Sound System — Für Elise × C# Minor Nocturne
 * Pure Web Audio API — zero dependencies, zero audio files
 */

let audioCtx: AudioContext | null = null;
let soundOn = false;
let masterGain: GainNode | null = null;
let pianoLoop: ReturnType<typeof setTimeout> | null = null;
let startScheduler: ((t0: number) => void) | null = null;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const SR = audioCtx.sampleRate;

  const rvLen = Math.floor(SR * 4.2);
  const rvBuf = audioCtx.createBuffer(2, rvLen, SR);
  for (let ch = 0; ch < 2; ch++) {
    const d = rvBuf.getChannelData(ch);
    for (let i = 0; i < rvLen; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rvLen, 1.4) * (i < SR * 0.01 ? i / (SR * 0.01) : 1);
  }
  const rev = audioCtx.createConvolver();
  rev.buffer = rvBuf;

  const rvG = audioCtx.createGain(); rvG.gain.value = 0.50;
  rev.connect(rvG);

  const rvLP = audioCtx.createBiquadFilter();
  rvLP.type = 'lowpass'; rvLP.frequency.value = 3200; rvLP.Q.value = 0.4;
  rvG.connect(rvLP);

  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0;
  rvLP.connect(masterGain);
  masterGain.connect(audioCtx.destination);

  const dry = audioCtx.createGain();
  dry.gain.value = 1;
  dry.connect(masterGain);

  function pianoNote(freq: number, dur: number, vel: number, t0: number) {
    if (!audioCtx) return;
    const bright = Math.min(freq / 880, 1);
    const parts = [
      { m: 1, g: 0.72 },
      { m: 2, g: 0.20 + bright * 0.08 },
      { m: 3, g: 0.11 + bright * 0.05 },
      { m: 4, g: 0.055 },
      { m: 5, g: 0.028 + bright * 0.015 },
      { m: 6, g: 0.014 },
      { m: 7, g: 0.007 },
    ];

    const env = audioCtx.createGain();
    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(vel, t0 + 0.009);
    env.gain.exponentialRampToValueAtTime(vel * 0.38, t0 + 0.12);
    env.gain.exponentialRampToValueAtTime(vel * 0.22, t0 + 0.45);
    env.gain.setValueAtTime(vel * 0.22, t0 + Math.max(dur - 0.08, t0 + 0.5));
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 1.4);
    env.connect(dry);
    env.connect(rev);

    parts.forEach(p => {
      const o = audioCtx!.createOscillator();
      const g = audioCtx!.createGain();
      o.type = 'sine';
      o.frequency.value = freq * p.m;
      o.detune.value = p.m > 1 ? (p.m - 1) * 1.8 : 0;
      const decayT = 0.35 + 0.15 / p.m;
      g.gain.setValueAtTime(p.g, t0);
      g.gain.exponentialRampToValueAtTime(p.g * 0.06, t0 + decayT);
      g.gain.exponentialRampToValueAtTime(0.00001, t0 + dur + 1.2);
      o.connect(g); g.connect(env);
      o.start(t0); o.stop(t0 + dur + 1.6);
    });

    const nBuf = audioCtx.createBuffer(1, Math.floor(SR * 0.015), SR);
    const nd = nBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++)
      nd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nd.length, 3);
    const ns = audioCtx.createBufferSource(); ns.buffer = nBuf;
    const ng = audioCtx.createGain(); ng.gain.value = vel * 0.08;
    ns.connect(ng); ng.connect(env); ns.start(t0);
  }

  const N: Record<string, number> = {
    C2:65.41,Cs2:69.30,D2:73.42,Ds2:77.78,E2:82.41,F2:87.31,Fs2:92.50,G2:98.00,Gs2:103.83,A2:110.00,B2:123.47,
    C3:130.81,Cs3:138.59,D3:146.83,Ds3:155.56,E3:164.81,F3:174.61,Fs3:185.00,G3:196.00,Gs3:207.65,A3:220.00,As3:233.08,B3:246.94,
    C4:261.63,Cs4:277.18,D4:293.66,Ds4:311.13,E4:329.63,F4:349.23,Fs4:369.99,G4:392.00,Gs4:415.30,A4:440.00,As4:466.16,B4:493.88,
    C5:523.25,Cs5:554.37,D5:587.33,Ds5:622.25,E5:659.25,F5:698.46,Fs5:739.99,G5:783.99,Gs5:830.61,A5:880.00,As5:932.33,B5:987.77,
    C6:1046.50,Cs6:1108.73,E6:1318.51,
  };

  const Q = 1.034, E = Q / 2, S = Q / 4, H = Q * 2, W = Q * 4;

  function bassArp(root1: string, m1: string, m2: string, t0: number, bars: number) {
    const out: any[] = [];
    for (let b = 0; b < bars; b++) {
      const even = b % 2 === 0;
      const [r, a, b2] = even ? [root1, m1, m2] : [m1, m2, root1];
      [r, a, b2, a].forEach((n, i) =>
        out.push({ n, t: t0 + b * Q + i * S, dur: S, vel: 0.24 + (!i ? 0.04 : 0) })
      );
    }
    return out;
  }

  function nocBass(root: string, mid: string, hi: string, t0: number, bars: number) {
    const out: any[] = [];
    for (let b = 0; b < bars; b++) {
      [root, mid, hi, mid].forEach((n, i) =>
        out.push({ n, t: t0 + b * Q + i * S, dur: S, vel: i === 0 ? 0.27 : 0.21 })
      );
    }
    return out;
  }

  // Section 1 — Für Elise Theme A
  const sec1R = [
    {n:'E5',t:0,dur:S,vel:0.62},{n:'Ds5',t:S,dur:S,vel:0.57},{n:'E5',t:S*2,dur:S,vel:0.64},{n:'Ds5',t:S*3,dur:S,vel:0.57},
    {n:'E5',t:S*4,dur:S,vel:0.66},{n:'B4',t:S*5,dur:S,vel:0.54},{n:'D5',t:S*6,dur:S,vel:0.60},{n:'C5',t:S*7,dur:S,vel:0.57},
    {n:'A4',t:Q*2,dur:E,vel:0.65},{n:'C4',t:Q*2+E,dur:S,vel:0.47},{n:'E4',t:Q*2+E+S,dur:S,vel:0.52},
    {n:'A4',t:Q*3,dur:E,vel:0.60},{n:'B4',t:Q*3+E,dur:S,vel:0.54},{n:'E4',t:Q*3+E+S,dur:S,vel:0.49},
    {n:'Gs4',t:Q*4,dur:E,vel:0.57},{n:'B4',t:Q*4+E,dur:S,vel:0.53},{n:'E5',t:Q*5,dur:E,vel:0.63},{n:'Gs4',t:Q*5+E,dur:S,vel:0.49},
    {n:'E5',t:Q*6,dur:S,vel:0.62},{n:'Ds5',t:Q*6+S,dur:S,vel:0.57},{n:'E5',t:Q*6+S*2,dur:S,vel:0.64},{n:'Ds5',t:Q*6+S*3,dur:S,vel:0.57},
    {n:'E5',t:Q*7,dur:S,vel:0.65},{n:'B4',t:Q*7+S,dur:S,vel:0.54},{n:'D5',t:Q*7+S*2,dur:S,vel:0.59},{n:'C5',t:Q*7+S*3,dur:S,vel:0.56},
    {n:'A4',t:Q*8,dur:E,vel:0.68},{n:'C4',t:Q*8+E,dur:S,vel:0.45},{n:'E4',t:Q*8+E+S,dur:S,vel:0.50},
    {n:'A4',t:Q*9,dur:E,vel:0.60},{n:'F4',t:Q*9+E,dur:S,vel:0.50},{n:'A4',t:Q*9+E+S,dur:S,vel:0.56},
    {n:'B4',t:Q*10,dur:E,vel:0.62},{n:'G4',t:Q*10+E,dur:S,vel:0.50},{n:'E4',t:Q*10+E+S,dur:S,vel:0.48},
    {n:'C5',t:Q*11,dur:E,vel:0.64},{n:'D5',t:Q*11+E,dur:S,vel:0.60},{n:'C5',t:Q*12,dur:E,vel:0.62},
    {n:'B4',t:Q*12+E,dur:S,vel:0.56},{n:'A4',t:Q*12+E+S,dur:S,vel:0.52},
    {n:'E5',t:Q*13,dur:S,vel:0.62},{n:'Ds5',t:Q*13+S,dur:S,vel:0.57},{n:'E5',t:Q*13+S*2,dur:S,vel:0.64},{n:'Ds5',t:Q*13+S*3,dur:S,vel:0.57},
    {n:'E5',t:Q*14,dur:S,vel:0.66},{n:'B4',t:Q*14+S,dur:S,vel:0.54},{n:'D5',t:Q*14+S*2,dur:S,vel:0.59},{n:'C5',t:Q*14+S*3,dur:S,vel:0.56},
    {n:'A4',t:Q*15,dur:E,vel:0.70},{n:'C4',t:Q*15+E,dur:S,vel:0.46},{n:'E4',t:Q*15+E+S,dur:S,vel:0.51},
    {n:'A3',t:Q*16,dur:H,vel:0.65},
  ];
  const sec1L = [
    ...bassArp('A2','E3','A3',0,4),...bassArp('E3','Gs3','B3',Q*4,4),
    ...bassArp('A2','E3','A3',Q*8,4),...bassArp('D3','F3','A3',Q*12,2),
    ...bassArp('E3','Gs3','B3',Q*14,2),
    {n:'A2',t:Q*16,dur:H,vel:0.28},{n:'E3',t:Q*16+S,dur:E,vel:0.22},{n:'A3',t:Q*16+E,dur:E,vel:0.20},
  ];

  // Section 2 — Für Elise Theme B
  const sec2R = [
    {n:'C5',t:0,dur:E,vel:0.55},{n:'C5',t:E,dur:S,vel:0.50},{n:'B4',t:E+S,dur:S,vel:0.46},
    {n:'C5',t:Q,dur:E,vel:0.58},{n:'E4',t:Q+E,dur:S,vel:0.42},{n:'F4',t:Q+E+S,dur:S,vel:0.44},
    {n:'A4',t:Q*2,dur:E,vel:0.60},{n:'C5',t:Q*2+E,dur:S,vel:0.55},{n:'C5',t:Q*2+E+S,dur:S,vel:0.50},
    {n:'B4',t:Q*3,dur:E,vel:0.56},{n:'C5',t:Q*3+E,dur:S,vel:0.52},
    {n:'E5',t:Q*4,dur:E,vel:0.60},{n:'F5',t:Q*4+E,dur:S,vel:0.55},{n:'E5',t:Q*4+E+S,dur:S,vel:0.52},
    {n:'C5',t:Q*5,dur:E,vel:0.58},{n:'A4',t:Q*5+E,dur:S,vel:0.50},{n:'B4',t:Q*5+E+S,dur:S,vel:0.52},
    {n:'E5',t:Q*6,dur:E,vel:0.60},{n:'A5',t:Q*6+E,dur:E,vel:0.55},{n:'E5',t:Q*7,dur:E,vel:0.58},
    {n:'C5',t:Q*7+E,dur:S,vel:0.54},{n:'B4',t:Q*8,dur:E,vel:0.56},{n:'A4',t:Q*8+E,dur:S,vel:0.52},{n:'Gs4',t:Q*8+E+S,dur:S,vel:0.48},
    {n:'A4',t:Q*9,dur:H,vel:0.62},
    {n:'C5',t:Q*11,dur:E,vel:0.55},{n:'D5',t:Q*11+E,dur:S,vel:0.50},
    {n:'E5',t:Q*12,dur:E,vel:0.60},{n:'F5',t:Q*12+E,dur:S,vel:0.55},{n:'E5',t:Q*12+E+S,dur:S,vel:0.52},
    {n:'D5',t:Q*13,dur:E,vel:0.57},{n:'C5',t:Q*13+E,dur:S,vel:0.53},{n:'B4',t:Q*13+E+S,dur:S,vel:0.49},
    {n:'C5',t:Q*14,dur:H,vel:0.62},
    {n:'A4',t:Q*16,dur:E,vel:0.60},{n:'C5',t:Q*16+E,dur:S,vel:0.55},
    {n:'E5',t:Q*17,dur:E,vel:0.63},{n:'A5',t:Q*17+E,dur:E,vel:0.58},
    {n:'Gs5',t:Q*18,dur:E,vel:0.60},{n:'A5',t:Q*18+E,dur:H,vel:0.55},
  ];
  const sec2L = [
    ...bassArp('F3','A3','C4',0,2),...bassArp('C3','E3','G3',Q*2,2),
    ...bassArp('F3','A3','C4',Q*4,2),...bassArp('A2','E3','A3',Q*6,2),
    ...bassArp('A2','E3','A3',Q*8,3),...bassArp('F3','A3','C4',Q*11,4),
    ...bassArp('C3','G3','E4',Q*15,2),...bassArp('A2','E3','A3',Q*17,2),
    {n:'A2',t:Q*19,dur:H,vel:0.28},{n:'E3',t:Q*19+E,dur:E,vel:0.22},
  ];

  // Section 3 — C# Minor Nocturne
  const sec3R = [
    {n:'Cs5',t:0,dur:E+S,vel:0.62},{n:'B4',t:E+S,dur:S,vel:0.56},
    {n:'A4',t:Q,dur:E,vel:0.58},{n:'Gs4',t:Q+E,dur:E+S,vel:0.52},
    {n:'Fs4',t:Q*2+S,dur:S,vel:0.50},{n:'A4',t:Q*2+E,dur:S,vel:0.54},
    {n:'Cs5',t:Q*2+E+S,dur:S,vel:0.58},{n:'E5',t:Q*3,dur:E,vel:0.65},
    {n:'Ds5',t:Q*3+E,dur:S,vel:0.61},{n:'Cs5',t:Q*3+E+S,dur:S,vel:0.57},
    {n:'B4',t:Q*4,dur:S,vel:0.53},{n:'A4',t:Q*4+S,dur:S,vel:0.50},
    {n:'Cs5',t:Q*4+E,dur:H,vel:0.62},
    {n:'A4',t:Q*6+E,dur:S,vel:0.48},{n:'Gs4',t:Q*7,dur:S,vel:0.45},{n:'Fs4',t:Q*7+S,dur:S,vel:0.42},
    {n:'Gs4',t:Q*7+E,dur:S,vel:0.50},{n:'A4',t:Q*7+E+S,dur:S,vel:0.54},
    {n:'B4',t:Q*8,dur:E,vel:0.58},{n:'Cs5',t:Q*8+E,dur:S,vel:0.60},
    {n:'Ds5',t:Q*8+E+S,dur:S,vel:0.62},{n:'E5',t:Q*9,dur:E,vel:0.68},
    {n:'Fs5',t:Q*9+E,dur:S,vel:0.65},{n:'E5',t:Q*9+E+S,dur:S,vel:0.61},
    {n:'Ds5',t:Q*10,dur:E,vel:0.62},{n:'Cs5',t:Q*10+E,dur:E,vel:0.58},
    {n:'B4',t:Q*11,dur:H,vel:0.60},
    {n:'A4',t:Q*13,dur:E,vel:0.52},{n:'Gs4',t:Q*13+E,dur:S,vel:0.48},
    {n:'Fs4',t:Q*13+E+S,dur:S,vel:0.46},{n:'E4',t:Q*14,dur:E,vel:0.52},
    {n:'Fs4',t:Q*14+E,dur:S,vel:0.50},{n:'Gs4',t:Q*14+E+S,dur:S,vel:0.52},
    {n:'A4',t:Q*15,dur:E,vel:0.56},{n:'B4',t:Q*15+E,dur:S,vel:0.54},
    {n:'Cs5',t:Q*16,dur:H,vel:0.64},
    {n:'A4',t:Q*18,dur:S,vel:0.48},{n:'Gs4',t:Q*18+S,dur:S,vel:0.45},{n:'Fs4',t:Q*18+E,dur:S,vel:0.42},
    {n:'Cs4',t:Q*19,dur:H,vel:0.55},
  ];
  const sec3L = [
    ...nocBass('Cs3','Gs3','Cs4',0,4),...nocBass('Fs3','A3','Cs4',Q*4,4),
    ...nocBass('Gs3','B3','Ds4',Q*8,4),...nocBass('Cs3','Gs3','Cs4',Q*12,4),
    ...nocBass('Fs3','A3','Cs4',Q*16,2),...nocBass('Gs3','B3','Ds4',Q*18,1),
    {n:'Cs3',t:Q*19,dur:H,vel:0.30},{n:'Gs3',t:Q*19+S,dur:E,vel:0.22},
  ];

  // Section 4 — G# Major Episode
  const sec4R = [
    {n:'Gs4',t:0,dur:E,vel:0.55},{n:'B4',t:E,dur:S,vel:0.52},{n:'Ds5',t:E+S,dur:S,vel:0.55},
    {n:'Gs5',t:Q,dur:E,vel:0.62},{n:'Fs5',t:Q+E,dur:S,vel:0.58},{n:'Ds5',t:Q+E+S,dur:S,vel:0.54},
    {n:'B4',t:Q*2,dur:E,vel:0.58},{n:'Cs5',t:Q*2+E,dur:S,vel:0.55},
    {n:'Ds5',t:Q*3,dur:E,vel:0.60},{n:'E5',t:Q*3+E,dur:E,vel:0.65},
    {n:'Fs5',t:Q*4,dur:S,vel:0.62},{n:'E5',t:Q*4+S,dur:S,vel:0.58},
    {n:'Ds5',t:Q*4+E,dur:S,vel:0.55},{n:'Cs5',t:Q*4+E+S,dur:S,vel:0.52},
    {n:'B4',t:Q*5,dur:E,vel:0.58},{n:'A4',t:Q*5+E,dur:E,vel:0.54},
    {n:'Gs4',t:Q*6,dur:E,vel:0.56},{n:'As4',t:Q*6+E,dur:S,vel:0.50},
    {n:'B4',t:Q*6+E+S,dur:S,vel:0.53},{n:'Cs5',t:Q*7,dur:E,vel:0.58},
    {n:'Ds5',t:Q*7+E,dur:S,vel:0.55},{n:'E5',t:Q*7+E+S,dur:S,vel:0.58},
    {n:'Fs5',t:Q*8,dur:H,vel:0.65},
    {n:'E5',t:Q*10,dur:E,vel:0.60},{n:'Ds5',t:Q*10+E,dur:S,vel:0.55},
    {n:'Cs5',t:Q*11,dur:S,vel:0.58},{n:'B4',t:Q*11+S,dur:S,vel:0.54},
    {n:'A4',t:Q*11+E,dur:S,vel:0.51},{n:'Gs4',t:Q*11+E+S,dur:S,vel:0.48},
    {n:'Fs4',t:Q*12,dur:E,vel:0.52},{n:'E4',t:Q*12+E,dur:S,vel:0.48},
    {n:'Ds4',t:Q*12+E+S,dur:S,vel:0.45},{n:'Cs4',t:Q*13,dur:H,vel:0.55},
    {n:'Gs4',t:Q*15,dur:E,vel:0.52},{n:'B4',t:Q*15+E,dur:E,vel:0.56},
    {n:'Cs5',t:Q*16,dur:H,vel:0.60},
  ];
  const sec4L = [
    ...nocBass('Gs3','B3','Ds4',0,4),...nocBass('Ds3','Fs3','As3',Q*4,2),
    ...nocBass('Gs3','B3','Ds4',Q*6,2),...nocBass('Cs3','E3','Gs3',Q*8,4),
    ...nocBass('Fs3','A3','Cs4',Q*12,2),...nocBass('Gs3','B3','Ds4',Q*14,2),
    ...nocBass('Cs3','Gs3','Cs4',Q*16,1),
    {n:'Cs3',t:Q*17,dur:H,vel:0.28},{n:'Gs3',t:Q*17+E,dur:E,vel:0.21},
  ];

  // Section 5 — Reprise & Coda
  const sec5R = [
    {n:'E5',t:0,dur:S,vel:0.56},{n:'Ds5',t:S,dur:S,vel:0.52},{n:'E5',t:S*2,dur:S,vel:0.58},{n:'Ds5',t:S*3,dur:S,vel:0.52},
    {n:'E5',t:S*4,dur:S,vel:0.60},{n:'B4',t:S*5,dur:S,vel:0.50},{n:'D5',t:S*6,dur:S,vel:0.55},{n:'C5',t:S*7,dur:S,vel:0.53},
    {n:'A4',t:Q*2,dur:E,vel:0.62},{n:'C4',t:Q*2+E,dur:S,vel:0.44},{n:'E4',t:Q*2+E+S,dur:S,vel:0.48},
    {n:'A4',t:Q*3,dur:H,vel:0.58},
    {n:'Cs5',t:Q*5,dur:E+S,vel:0.60},{n:'B4',t:Q*5+E+S,dur:S,vel:0.55},
    {n:'A4',t:Q*6,dur:E,vel:0.57},{n:'Gs4',t:Q*6+E,dur:H,vel:0.52},
    {n:'Fs4',t:Q*8+E,dur:S,vel:0.46},{n:'Gs4',t:Q*9,dur:E,vel:0.50},
    {n:'A4',t:Q*9+E,dur:E,vel:0.54},{n:'B4',t:Q*10,dur:E,vel:0.57},
    {n:'Cs5',t:Q*10+E,dur:H,vel:0.58},
    {n:'E5',t:Q*12+E,dur:S,vel:0.52},{n:'Ds5',t:Q*13,dur:E,vel:0.49},
    {n:'Cs5',t:Q*13+E,dur:E,vel:0.52},{n:'B4',t:Q*14,dur:E,vel:0.48},
    {n:'A4',t:Q*14+E,dur:E,vel:0.45},
    {n:'Gs4',t:Q*15,dur:E,vel:0.44},{n:'Fs4',t:Q*15+E,dur:S,vel:0.42},
    {n:'E4',t:Q*16,dur:H,vel:0.48},
    {n:'Cs5',t:Q*18,dur:H,vel:0.42},{n:'A4',t:Q*20,dur:H,vel:0.36},
    {n:'Cs4',t:Q*22,dur:W,vel:0.32},
  ];
  const sec5L = [
    ...bassArp('A2','E3','A3',0,4),...bassArp('E3','Gs3','B3',Q*4,1),
    ...nocBass('Cs3','Gs3','Cs4',Q*5,4),...nocBass('Fs3','A3','Cs4',Q*9,2),
    ...nocBass('Gs3','B3','Ds4',Q*11,2),...nocBass('Cs3','Gs3','Cs4',Q*13,4),
    ...nocBass('Fs3','A3','Cs4',Q*17,2),...nocBass('Gs3','B3','Ds4',Q*19,1),
    {n:'Cs3',t:Q*20,dur:Q*6,vel:0.22},{n:'Gs3',t:Q*20+E,dur:Q*4,vel:0.16},
  ];

  const SECTIONS = [
    { r: sec1R, l: sec1L, bars: 17 },
    { r: sec2R, l: sec2L, bars: 20 },
    { r: sec3R, l: sec3L, bars: 20 },
    { r: sec4R, l: sec4L, bars: 18 },
    { r: sec5R, l: sec5L, bars: 26 },
  ];

  let phase = 0;

  function scheduleSection(t0: number) {
    if (!audioCtx) return;
    const sec = SECTIONS[phase % SECTIONS.length];
    const durSec = sec.bars * Q + 1.2;

    sec.l.forEach(n => {
      const f = N[n.n]; if (!f) return;
      const jit = (Math.random() - 0.5) * 0.020;
      const vv = n.vel * (1 + (Math.random() - 0.5) * 0.09);
      pianoNote(f, n.dur, vv, t0 + n.t + jit);
    });

    sec.r.forEach(n => {
      const f = N[n.n]; if (!f) return;
      const jit = (Math.random() - 0.5) * 0.015;
      const vv = n.vel * (1 + (Math.random() - 0.5) * 0.07);
      pianoNote(f, n.dur, vv, t0 + n.t + jit);
    });

    phase++;

    pianoLoop = setTimeout(() => {
      if (soundOn) scheduleSection(audioCtx!.currentTime + 0.14);
    }, (durSec - 0.20) * 1000);
  }

  startScheduler = scheduleSection;
}

export function toggleSound(): boolean {
  initAudio();
  soundOn = !soundOn;

  if (!masterGain || !audioCtx) return soundOn;

  masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
  if (soundOn) {
    masterGain.gain.linearRampToValueAtTime(0.72, audioCtx.currentTime + 2.0);
    setTimeout(() => {
      if (soundOn && startScheduler && audioCtx) startScheduler(audioCtx.currentTime + 0.08);
    }, 350);
  } else {
    if (pianoLoop) clearTimeout(pianoLoop);
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2.2);
  }

  return soundOn;
}

export function isSoundOn(): boolean {
  return soundOn;
}

export function sfxClick() {
  if (!soundOn || !audioCtx || !masterGain) return;
  const picks = [277.18, 329.63, 369.99, 415.30, 493.88];
  const freq = picks[Math.floor(Math.random() * picks.length)];
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  const t = audioCtx.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.045, t + 0.009);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.50);
  o.connect(g); g.connect(masterGain);
  o.start(t); o.stop(t + 0.55);
}

export function sfxHover() {
  if (!soundOn || !audioCtx || !masterGain) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'sine'; o.frequency.value = 554.37;
  const t = audioCtx.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.016, t + 0.007);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  o.connect(g); g.connect(masterGain);
  o.start(t); o.stop(t + 0.18);
}

export function sfxSuccess() {
  if (!soundOn || !audioCtx || !masterGain) return;
  [277.18, 329.63, 415.30, 554.37].forEach((freq, i) => {
    const o = audioCtx!.createOscillator();
    const g = audioCtx!.createGain();
    const t = audioCtx!.currentTime + i * 0.11;
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.065, t + 0.010);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    o.connect(g); g.connect(masterGain!);
    o.start(t); o.stop(t + 0.9);
  });
}
