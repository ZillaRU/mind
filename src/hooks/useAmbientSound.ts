import { useRef, useCallback, useEffect } from 'react';

// Procedural ambient sound generation using Web Audio API
// Designed to sound natural, organic, and non-mechanical
// Key techniques: longer buffers, layered noise, convolver reverb,
// slow random modulation, stereo width, and natural variation

type SoundType = 'rain' | 'fire' | 'cafe' | 'wind' | 'ocean' | 'silence';

export function useAmbientSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ gain: GainNode; sources: AudioNode[] } | null>(null);
  const currentSoundRef = useRef<SoundType>('silence');

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const stopAll = useCallback(() => {
    if (nodesRef.current) {
      nodesRef.current.gain.gain.linearRampToValueAtTime(0, getCtx().currentTime + 1.5);
      setTimeout(() => {
        nodesRef.current?.sources.forEach(s => {
          try { (s as any).stop?.(); } catch {}
          try { s.disconnect(); } catch {}
        });
        nodesRef.current = null;
      }, 1800);
    }
  }, [getCtx]);

  // Create a noise buffer with much longer duration for natural looping
  const createNoise = useCallback((
    ctx: AudioContext,
    type: 'white' | 'pink' | 'brown' = 'brown',
    duration = 8
  ): AudioBufferSourceNode => {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      if (type === 'white') {
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
      } else if (type === 'pink') {
        // Voss-McCartney algorithm for better pink noise
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }
      } else {
        // Brown noise with slight stereo decorrelation
        let last = 0;
        const drift = channel === 0 ? 0.02 : 0.0198; // Slight L/R difference
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (last + drift * white) / 1.02;
          last = data[i];
          data[i] *= 3.5;
        }
      }
    }

    // Crossfade loop points for seamless looping
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }, []);

  // Create a simple impulse response for reverb
  const createReverb = useCallback((ctx: AudioContext, duration = 2, decay = 2): ConvolverNode => {
    const length = ctx.sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }, []);

  // Create a slow random LFO for natural variation
  const createSlowLFO = useCallback((
    ctx: AudioContext,
    target: AudioParam,
    rate: number,     // Hz - very slow, like 0.05-0.3
    depth: number,    // modulation amount
    _baseValue: number // center value (used by caller to set initial value)
  ) => {
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(rate, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(depth, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(target);
    lfo.start();
    return lfo;
  }, []);

  // Create a random "event" generator (for fire crackles, rain drops, etc.)
  const createEventNoise = useCallback((
    ctx: AudioContext,
    minInterval: number, // seconds between events
    maxInterval: number,
    filterFreq: number,
    filterQ: number,
    duration: number,    // event duration in seconds
    volume: number,
    masterGain: GainNode
  ) => {
    const sources: AudioNode[] = [];

    const scheduleEvent = () => {
      const delay = minInterval + Math.random() * (maxInterval - minInterval);
      setTimeout(() => {
        if (!nodesRef.current) return; // stopped

        // Create a short noise burst
        const bufSize = ctx.sampleRate * duration;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
          const env = Math.pow(1 - i / bufSize, 3); // Sharp attack, long decay
          d[i] = (Math.random() * 2 - 1) * env;
        }

        const src = ctx.createBufferSource();
        src.buffer = buf;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume * (0.5 + Math.random() * 0.5), ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(filterFreq * (0.8 + Math.random() * 0.4), ctx.currentTime);
        filter.Q.setValueAtTime(filterQ, ctx.currentTime);

        // Stereo spread
        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.random() * 2 - 1, ctx.currentTime);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(panner);
        panner.connect(masterGain);
        src.start();
        sources.push(src);

        src.onended = () => {
          try { src.disconnect(); } catch {}
        };

        scheduleEvent();
      }, delay * 1000);
    };

    scheduleEvent();
    return sources;
  }, []);

  const play = useCallback((soundType: SoundType) => {
    if (soundType === currentSoundRef.current) return;
    currentSoundRef.current = soundType;

    const ctx = getCtx();
    stopAll();

    if (soundType === 'silence') return;

    setTimeout(() => {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 3); // Slower fade in
      masterGain.connect(ctx.destination);

      // Reverb bus for natural spaciousness
      const reverb = createReverb(ctx, 2.5, 1.8);
      const reverbGain = ctx.createGain();
      reverbGain.gain.setValueAtTime(0.15, ctx.currentTime);
      reverb.connect(reverbGain);
      reverbGain.connect(masterGain);

      const sources: AudioNode[] = [];

      switch (soundType) {
        case 'rain': {
          // Layer 1: Deep distant rumble (brown, very low pass)
          const rumble = createNoise(ctx, 'brown', 10);
          const rumbleGain = ctx.createGain();
          rumbleGain.gain.setValueAtTime(0.25, ctx.currentTime);
          const rumbleFilter = ctx.createBiquadFilter();
          rumbleFilter.type = 'lowpass';
          rumbleFilter.frequency.setValueAtTime(400, ctx.currentTime);
          rumbleFilter.Q.setValueAtTime(0.7, ctx.currentTime);
          rumble.connect(rumbleFilter);
          rumbleFilter.connect(rumbleGain);
          rumbleGain.connect(masterGain);
          rumbleGain.connect(reverb); // Send to reverb for spaciousness
          rumble.start();
          sources.push(rumble);

          // Layer 2: Main rain texture (pink, bandpass)
          const rain = createNoise(ctx, 'pink', 8);
          const rainGain = ctx.createGain();
          rainGain.gain.setValueAtTime(0.12, ctx.currentTime);
          const rainFilter = ctx.createBiquadFilter();
          rainFilter.type = 'bandpass';
          rainFilter.frequency.setValueAtTime(2500, ctx.currentTime);
          rainFilter.Q.setValueAtTime(0.4, ctx.currentTime);
          rain.connect(rainFilter);
          rainFilter.connect(rainGain);
          rainGain.connect(masterGain);
          rainGain.connect(reverb);
          rain.start();
          sources.push(rain);

          // Layer 3: Shimmer / high frequency rain on leaves
          const shimmer = createNoise(ctx, 'white', 6);
          const shimmerGain = ctx.createGain();
          shimmerGain.gain.setValueAtTime(0.02, ctx.currentTime);
          const shimmerFilter = ctx.createBiquadFilter();
          shimmerFilter.type = 'highpass';
          shimmerFilter.frequency.setValueAtTime(7000, ctx.currentTime);
          shimmer.connect(shimmerFilter);
          shimmerFilter.connect(shimmerGain);
          shimmerGain.connect(masterGain);
          shimmer.start();
          sources.push(shimmer);

          // Layer 4: Random drip events for realism
          const dripSources = createEventNoise(
            ctx, 0.3, 1.5, 8000, 3, 0.04, 0.06, masterGain
          );
          sources.push(...dripSources);

          // Natural variation: slowly modulate rain intensity
          createSlowLFO(ctx, rainGain.gain, 0.07, 0.03, 0.12);
          createSlowLFO(ctx, shimmerGain.gain, 0.05, 0.008, 0.02);
          break;
        }

        case 'fire': {
          // Layer 1: Deep warm bed (brown, very low)
          const bed = createNoise(ctx, 'brown', 10);
          const bedGain = ctx.createGain();
          bedGain.gain.setValueAtTime(0.3, ctx.currentTime);
          const bedFilter = ctx.createBiquadFilter();
          bedFilter.type = 'lowpass';
          bedFilter.frequency.setValueAtTime(300, ctx.currentTime);
          bedFilter.Q.setValueAtTime(0.8, ctx.currentTime);
          bed.connect(bedFilter);
          bedFilter.connect(bedGain);
          bedGain.connect(masterGain);
          bedGain.connect(reverb);
          bed.start();
          sources.push(bed);

          // Layer 2: Mid-range crackle texture
          const crackle = createNoise(ctx, 'pink', 7);
          const crackleGain = ctx.createGain();
          crackleGain.gain.setValueAtTime(0.08, ctx.currentTime);
          const crackleFilter = ctx.createBiquadFilter();
          crackleFilter.type = 'bandpass';
          crackleFilter.frequency.setValueAtTime(800, ctx.currentTime);
          crackleFilter.Q.setValueAtTime(0.6, ctx.currentTime);
          crackle.connect(crackleFilter);
          crackleFilter.connect(crackleGain);
          crackleGain.connect(masterGain);
          crackle.start();
          sources.push(crackle);

          // Layer 3: Warm harmonic hum (like resonating wood)
          const hum1 = ctx.createOscillator();
          hum1.type = 'sine';
          hum1.frequency.setValueAtTime(55, ctx.currentTime); // Low A
          const hum1Gain = ctx.createGain();
          hum1Gain.gain.setValueAtTime(0.04, ctx.currentTime);
          hum1.connect(hum1Gain);
          hum1Gain.connect(masterGain);
          hum1.start();
          sources.push(hum1);

          const hum2 = ctx.createOscillator();
          hum2.type = 'sine';
          hum2.frequency.setValueAtTime(82.5, ctx.currentTime); // E above
          const hum2Gain = ctx.createGain();
          hum2Gain.gain.setValueAtTime(0.02, ctx.currentTime);
          hum2.connect(hum2Gain);
          hum2Gain.connect(masterGain);
          hum2.start();
          sources.push(hum2);

          // Layer 4: Random crackle/snap events
          const snapSources = createEventNoise(
            ctx, 0.1, 0.8, 3000, 2, 0.015, 0.1, masterGain
          );
          sources.push(...snapSources);

          // Layer 5: Occasional louder pops
          const popSources = createEventNoise(
            ctx, 1.5, 5, 1500, 1.5, 0.06, 0.15, masterGain
          );
          sources.push(...popSources);

          // Natural variation
          createSlowLFO(ctx, crackleGain.gain, 0.08, 0.02, 0.08);
          createSlowLFO(ctx, bedGain.gain, 0.04, 0.05, 0.3);
          break;
        }

        case 'cafe': {
          // Layer 1: General ambient murmur (pink, low-mid)
          const murmur = createNoise(ctx, 'pink', 10);
          const murmurGain = ctx.createGain();
          murmurGain.gain.setValueAtTime(0.08, ctx.currentTime);
          const murmurFilter = ctx.createBiquadFilter();
          murmurFilter.type = 'bandpass';
          murmurFilter.frequency.setValueAtTime(800, ctx.currentTime);
          murmurFilter.Q.setValueAtTime(0.3, ctx.currentTime);
          murmur.connect(murmurFilter);
          murmurFilter.connect(murmurGain);
          murmurGain.connect(masterGain);
          murmurGain.connect(reverb);
          murmur.start();
          sources.push(murmur);

          // Layer 2: Higher murmur (conversation-like)
          const chatter = createNoise(ctx, 'pink', 8);
          const chatterGain = ctx.createGain();
          chatterGain.gain.setValueAtTime(0.04, ctx.currentTime);
          const chatterFilter = ctx.createBiquadFilter();
          chatterFilter.type = 'bandpass';
          chatterFilter.frequency.setValueAtTime(2000, ctx.currentTime);
          chatterFilter.Q.setValueAtTime(0.5, ctx.currentTime);
          chatter.connect(chatterFilter);
          chatterFilter.connect(chatterGain);
          chatterGain.connect(masterGain);
          chatterGain.connect(reverb);
          chatter.start();
          sources.push(chatter);

          // Layer 3: Espresso machine hum
          const machine = ctx.createOscillator();
          machine.type = 'sawtooth';
          machine.frequency.setValueAtTime(120, ctx.currentTime);
          const machineGain = ctx.createGain();
          machineGain.gain.setValueAtTime(0.008, ctx.currentTime);
          const machineFilter = ctx.createBiquadFilter();
          machineFilter.type = 'lowpass';
          machineFilter.frequency.setValueAtTime(200, ctx.currentTime);
          machine.connect(machineFilter);
          machineFilter.connect(machineGain);
          machineGain.connect(masterGain);
          machine.start();
          sources.push(machine);

          // Layer 4: Random cup/metal sounds
          const cupSources = createEventNoise(
            ctx, 2, 8, 6000, 5, 0.02, 0.03, masterGain
          );
          sources.push(...cupSources);

          // Layer 5: Occasional door/chair sounds
          const chairSources = createEventNoise(
            ctx, 5, 15, 400, 1, 0.08, 0.04, masterGain
          );
          sources.push(...chairSources);

          // Natural variation - cafe gets busier and quieter
          createSlowLFO(ctx, murmurGain.gain, 0.03, 0.025, 0.08);
          createSlowLFO(ctx, chatterGain.gain, 0.05, 0.015, 0.04);
          break;
        }

        case 'wind': {
          // Layer 1: Deep wind bed
          const deep = createNoise(ctx, 'brown', 12);
          const deepGain = ctx.createGain();
          deepGain.gain.setValueAtTime(0.2, ctx.currentTime);
          const deepFilter = ctx.createBiquadFilter();
          deepFilter.type = 'lowpass';
          deepFilter.frequency.setValueAtTime(350, ctx.currentTime);
          deepFilter.Q.setValueAtTime(0.5, ctx.currentTime);
          deep.connect(deepFilter);
          deepFilter.connect(deepGain);
          deepGain.connect(masterGain);
          deepGain.connect(reverb);
          deep.start();
          sources.push(deep);

          // Layer 2: Mid howl
          const howl = createNoise(ctx, 'pink', 10);
          const howlGain = ctx.createGain();
          howlGain.gain.setValueAtTime(0.06, ctx.currentTime);
          const howlFilter = ctx.createBiquadFilter();
          howlFilter.type = 'bandpass';
          howlFilter.frequency.setValueAtTime(1200, ctx.currentTime);
          howlFilter.Q.setValueAtTime(0.4, ctx.currentTime);
          howl.connect(howlFilter);
          howlFilter.connect(howlGain);
          howlGain.connect(masterGain);
          howlGain.connect(reverb);
          howl.start();
          sources.push(howl);

          // Layer 3: High whistle
          const whistle = createNoise(ctx, 'white', 8);
          const whistleGain = ctx.createGain();
          whistleGain.gain.setValueAtTime(0.01, ctx.currentTime);
          const whistleFilter = ctx.createBiquadFilter();
          whistleFilter.type = 'bandpass';
          whistleFilter.frequency.setValueAtTime(4000, ctx.currentTime);
          whistleFilter.Q.setValueAtTime(2, ctx.currentTime);
          whistle.connect(whistleFilter);
          whistleFilter.connect(whistleGain);
          whistleGain.connect(masterGain);
          whistle.start();
          sources.push(whistle);

          // Layer 4: Leaf rustle events
          const leafSources = createEventNoise(
            ctx, 0.5, 3, 5000, 2, 0.03, 0.04, masterGain
          );
          sources.push(...leafSources);

          // Complex wind variation - multiple LFOs at different rates
          createSlowLFO(ctx, deepGain.gain, 0.06, 0.12, 0.2);
          createSlowLFO(ctx, howlGain.gain, 0.1, 0.03, 0.06);
          createSlowLFO(ctx, howlFilter.frequency, 0.08, 400, 1200);
          createSlowLFO(ctx, whistleGain.gain, 0.15, 0.006, 0.01);
          break;
        }

        case 'ocean': {
          // Layer 1: Deep ocean bed
          const deep = createNoise(ctx, 'brown', 12);
          const deepGain = ctx.createGain();
          deepGain.gain.setValueAtTime(0.25, ctx.currentTime);
          const deepFilter = ctx.createBiquadFilter();
          deepFilter.type = 'lowpass';
          deepFilter.frequency.setValueAtTime(500, ctx.currentTime);
          deepFilter.Q.setValueAtTime(0.6, ctx.currentTime);
          deep.connect(deepFilter);
          deepFilter.connect(deepGain);
          deepGain.connect(masterGain);
          deepGain.connect(reverb);
          deep.start();
          sources.push(deep);

          // Layer 2: Wave crash (modulated pink noise)
          const wave = createNoise(ctx, 'pink', 10);
          const waveGain = ctx.createGain();
          waveGain.gain.setValueAtTime(0.08, ctx.currentTime);
          const waveFilter = ctx.createBiquadFilter();
          waveFilter.type = 'bandpass';
          waveFilter.frequency.setValueAtTime(1800, ctx.currentTime);
          waveFilter.Q.setValueAtTime(0.3, ctx.currentTime);
          wave.connect(waveFilter);
          waveFilter.connect(waveGain);
          waveGain.connect(masterGain);
          waveGain.connect(reverb);
          wave.start();
          sources.push(wave);

          // Layer 3: Surf hiss
          const surf = createNoise(ctx, 'white', 8);
          const surfGain = ctx.createGain();
          surfGain.gain.setValueAtTime(0.012, ctx.currentTime);
          const surfFilter = ctx.createBiquadFilter();
          surfFilter.type = 'highpass';
          surfFilter.frequency.setValueAtTime(6000, ctx.currentTime);
          surf.connect(surfFilter);
          surfFilter.connect(surfGain);
          surfGain.connect(masterGain);
          surf.start();
          sources.push(surf);

          // Layer 4: Foam/bubble events
          const foamSources = createEventNoise(
            ctx, 0.8, 3, 7000, 3, 0.02, 0.025, masterGain
          );
          sources.push(...foamSources);

          // Wave rhythm: primary swell (~10s) + secondary (~6s)
          createSlowLFO(ctx, waveGain.gain, 0.1, 0.06, 0.08);
          createSlowLFO(ctx, deepGain.gain, 0.067, 0.08, 0.25);
          createSlowLFO(ctx, surfGain.gain, 0.1, 0.006, 0.012);
          break;
        }
      }

      nodesRef.current = { gain: masterGain, sources };
    }, 1800);
  }, [getCtx, stopAll, createNoise, createReverb, createSlowLFO, createEventNoise]);

  useEffect(() => {
    return () => {
      stopAll();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [stopAll]);

  return { play, current: currentSoundRef };
}
