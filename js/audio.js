/**
 * Four-Part Harmony Grader - Web Audio Synthesizer
 * รองรับ 2 เสียง:
 * 1. Grand Piano (เปียโนอะคูสติก คมชัด กังวาน)
 * 2. Electric Piano (เปียโนไฟฟ้า Rhodes Bell-Tine ใส ชัดเจน ฟังคอร์ดง่าย)
 */

class HarmonyAudio {
  constructor() {
    this.ctx = null;
    this.masterCompressor = null;
    this.instrument = 'grand_piano'; // 'grand_piano' | 'electric_piano'
    this.isPlaying = false;
    this.playTimeout = null;
    this.activeNodes = [];
  }

  setInstrument(instrumentName) {
    if (instrumentName === 'grand_piano' || instrumentName === 'electric_piano') {
      this.instrument = instrumentName;
    }
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master compressor ป้องกันเสียงแตกเมื่อเล่น 4 แนวพร้อมกัน
      this.masterCompressor = this.ctx.createDynamicsCompressor();
      this.masterCompressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.masterCompressor.knee.setValueAtTime(18, this.ctx.currentTime);
      this.masterCompressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.masterCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.masterCompressor.release.setValueAtTime(0.2, this.ctx.currentTime);
      this.masterCompressor.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // แปลง MIDI เป็นความถี่เสียง (Hz)
  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /**
   * เล่นโน้ตเดี่ยว 1 ตัว (เช่น เมื่อคลิกเลือกโน้ตหรือกดคีย์เปียโน)
   */
  playNote(note, duration = 0.9) {
    if (!note) return;
    this.initContext();
    const midi = Theory.noteToMidi(note);
    if (!midi) return;
    const freq = this.midiToFreq(midi);

    const now = this.ctx.currentTime;
    this.synthVoice(freq, now, duration, 0.34);
  }

  /**
   * เล่นคอร์ดพร้อมกัน 4 แนว (SATB Polyphony)
   */
  playChord(chord, duration = 1.6, onEnded = null) {
    if (!chord) return;
    this.initContext();

    const voices = ['bass', 'tenor', 'alto', 'soprano'];
    const now = this.ctx.currentTime;

    voices.forEach((v, idx) => {
      const note = chord[v];
      if (note) {
        const midi = Theory.noteToMidi(note);
        const freq = this.midiToFreq(midi);

        // Balance น้ำหนักเสียงแต่ละแนว
        let gain = 0.24;
        if (v === 'soprano') gain = 0.28;
        else if (v === 'bass') gain = 0.27;
        else gain = 0.20;

        this.synthVoice(freq, now + idx * 0.004, duration, gain);
      }
    });

    if (onEnded) {
      setTimeout(onEnded, duration * 1000);
    }
  }

  /**
   * เลือกสังเคราะห์เสียงตามเครื่องดนตรีที่เลือก
   */
  synthVoice(freq, startTime, duration, peakGain = 0.26) {
    if (this.instrument === 'electric_piano') {
      this.synthElectricPiano(freq, startTime, duration, peakGain);
    } else {
      this.synthGrandPiano(freq, startTime, duration, peakGain);
    }
  }

  /**
   * 1. เสียง Grand Piano (Acoustic Concert Piano)
   */
  synthGrandPiano(freq, startTime, duration, peakGain = 0.26) {
    const ctx = this.ctx;
    const dest = this.masterCompressor || ctx.destination;

    // Dynamic Brightness Filter (ค้อนตีสว่างตอนแรกแล้วค่อยๆ นุ่มลง)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(0.85, startTime);
    const brightFreq = Math.min(freq * 10, 9500);
    const warmFreq = Math.min(freq * 2.5, 2100);
    filter.frequency.setValueAtTime(brightFreq, startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.max(warmFreq, 180), startTime + 0.52);

    // Amplitude Envelope (Sharp hammer attack + natural exponential decay)
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.linearRampToValueAtTime(peakGain, startTime + 0.005);
    const decayTime = Math.max(duration * 0.45, 0.25);
    env.gain.exponentialRampToValueAtTime(peakGain * 0.34, startTime + decayTime);
    env.gain.exponentialRampToValueAtTime(0.0008, startTime + duration);

    // Fundamental (Triangle)
    const oscFund = ctx.createOscillator();
    oscFund.type = 'triangle';
    oscFund.frequency.setValueAtTime(freq, startTime);

    // Detuned Unison String (+1.8 cents)
    const oscDetune = ctx.createOscillator();
    oscDetune.type = 'triangle';
    oscDetune.frequency.setValueAtTime(freq, startTime);
    oscDetune.detune.setValueAtTime(1.8, startTime);
    const detuneGain = ctx.createGain();
    detuneGain.gain.setValueAtTime(0.45, startTime);

    // 2nd Harmonic (Octave)
    const osc2nd = ctx.createOscillator();
    osc2nd.type = 'sine';
    osc2nd.frequency.setValueAtTime(freq * 2, startTime);
    const harm2Gain = ctx.createGain();
    harm2Gain.gain.setValueAtTime(0.28, startTime);
    harm2Gain.gain.exponentialRampToValueAtTime(0.05, startTime + 0.45);

    // 3rd Harmonic (Fifth above octave - คมชัดตอน hammer strike)
    const osc3rd = ctx.createOscillator();
    osc3rd.type = 'sine';
    osc3rd.frequency.setValueAtTime(freq * 3, startTime);
    const harm3Gain = ctx.createGain();
    harm3Gain.gain.setValueAtTime(0.15, startTime);
    harm3Gain.gain.exponentialRampToValueAtTime(0.004, startTime + 0.22);

    oscFund.connect(filter);
    oscDetune.connect(detuneGain);
    detuneGain.connect(filter);
    osc2nd.connect(harm2Gain);
    harm2Gain.connect(filter);
    osc3rd.connect(harm3Gain);
    harm3Gain.connect(filter);

    filter.connect(env);
    env.connect(dest);

    const stopTime = startTime + duration + 0.05;
    oscFund.start(startTime);
    oscDetune.start(startTime);
    osc2nd.start(startTime);
    osc3rd.start(startTime);

    oscFund.stop(stopTime);
    oscDetune.stop(stopTime);
    osc2nd.stop(stopTime);
    osc3rd.stop(stopTime);

    this.activeNodes.push(oscFund, oscDetune, osc2nd, osc3rd);
  }

  /**
   * 2. เสียง Electric Piano (Classic Rhodes Tine-Bell Timbre)
   */
  synthElectricPiano(freq, startTime, duration, peakGain = 0.26) {
    const ctx = this.ctx;
    const dest = this.masterCompressor || ctx.destination;

    // Warm lowpass สำหรับ body
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 8, 6500), startTime);

    // Envelope (ใส นุ่มนวล หางเสียงกังวานแบบ Rhodes)
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.linearRampToValueAtTime(peakGain * 1.05, startTime + 0.007);
    env.gain.exponentialRampToValueAtTime(peakGain * 0.48, startTime + Math.max(duration * 0.5, 0.3));
    env.gain.exponentialRampToValueAtTime(0.0008, startTime + duration);

    // 1. Pure Sine Body (เสียงหลักของ Electric Piano)
    const oscBody = ctx.createOscillator();
    oscBody.type = 'sine';
    oscBody.frequency.setValueAtTime(freq, startTime);

    // 2. Subtle Chorus Detuned Sine (-2.5 cents สำหรับความกว้างและนุ่ม)
    const oscChorus = ctx.createOscillator();
    oscChorus.type = 'sine';
    oscChorus.frequency.setValueAtTime(freq, startTime);
    oscChorus.detune.setValueAtTime(-2.5, startTime);
    const chorusGain = ctx.createGain();
    chorusGain.gain.setValueAtTime(0.32, startTime);

    // 3. 2nd Harmonic (ความอุ่นของเนื้อเสียง)
    const osc2nd = ctx.createOscillator();
    osc2nd.type = 'sine';
    osc2nd.frequency.setValueAtTime(freq * 2, startTime);
    const harm2Gain = ctx.createGain();
    harm2Gain.gain.setValueAtTime(0.18, startTime);
    harm2Gain.gain.exponentialRampToValueAtTime(0.04, startTime + 0.5);

    // 4. Tine Bell Overtones (เสียงกระดิ่งใสๆ เฉพาะตอนกดเริ่มต้น ~120ms)
    const oscTine = ctx.createOscillator();
    oscTine.type = 'sine';
    oscTine.frequency.setValueAtTime(freq * 4, startTime);
    const tineGain = ctx.createGain();
    tineGain.gain.setValueAtTime(0.22, startTime);
    tineGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

    // High bell partial (freq * 7) สั้นๆ 60ms ให้เสียงตีโลหะ Tine
    const oscBell = ctx.createOscillator();
    oscBell.type = 'sine';
    oscBell.frequency.setValueAtTime(freq * 7, startTime);
    const bellGain = ctx.createGain();
    bellGain.gain.setValueAtTime(0.07, startTime);
    bellGain.gain.exponentialRampToValueAtTime(0.0005, startTime + 0.06);

    oscBody.connect(filter);
    oscChorus.connect(chorusGain);
    chorusGain.connect(filter);
    osc2nd.connect(harm2Gain);
    harm2Gain.connect(filter);
    oscTine.connect(tineGain);
    tineGain.connect(filter);
    oscBell.connect(bellGain);
    bellGain.connect(filter);

    filter.connect(env);
    env.connect(dest);

    const stopTime = startTime + duration + 0.05;
    oscBody.start(startTime);
    oscChorus.start(startTime);
    osc2nd.start(startTime);
    oscTine.start(startTime);
    oscBell.start(startTime);

    oscBody.stop(stopTime);
    oscChorus.stop(stopTime);
    osc2nd.stop(stopTime);
    oscTine.stop(stopTime);
    oscBell.stop(stopTime);

    this.activeNodes.push(oscBody, oscChorus, osc2nd, oscTine, oscBell);
  }

  /**
   * เล่นเพลงทั้งข้อสอบ / ท่อนเพลงทีละคอร์ด
   */
  playProgression(chords, bpm = 60, onChordStep = null, onFinished = null) {
    if (!chords || chords.length === 0) return;
    this.stop();
    this.isPlaying = true;
    this.initContext();

    const chordDuration = (60 / bpm) * 1.4;
    let currentIdx = 0;

    const playNext = () => {
      if (!this.isPlaying || currentIdx >= chords.length) {
        this.isPlaying = false;
        if (onFinished) onFinished();
        return;
      }

      if (onChordStep) {
        onChordStep(currentIdx);
      }

      this.playChord(chords[currentIdx], chordDuration * 1.15);
      currentIdx++;

      this.playTimeout = setTimeout(playNext, chordDuration * 1000);
    };

    playNext();
  }

  /**
   * หยุดเล่นเสียงทั้งหมดทันที
   */
  stop() {
    this.isPlaying = false;
    if (this.playTimeout) {
      clearTimeout(this.playTimeout);
      this.playTimeout = null;
    }
    if (this.activeNodes.length > 0) {
      this.activeNodes.forEach(node => {
        try { node.stop(); } catch (e) {}
      });
      this.activeNodes = [];
    }
  }
}

// Export global
if (typeof window !== 'undefined') {
  window.HarmonyAudio = HarmonyAudio;
}
