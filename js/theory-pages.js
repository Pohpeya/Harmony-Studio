/**
 * Harmony Studio - Interactive Controller for:
 * Page 4: Major Mode (Tetrachord & 7 Modes)
 * Page 5: Figured Bass (Basso Continuo & Accidentals)
 * Page 6: Diatonic Substitution & Chord Spelling Formula
 */

const TheoryPages = {
  // ข้อมูล 7 Modes ใน C Major สำหรับบทเรียน, กราฟิกบรรทัด 5 เส้น และเสียงสเกล
  MODES: [
    {
      id: 'ionian', degree: 1, name: 'Ionian', sub: 'Major Scale',
      t1: 'Major', t2: 'Major', pattern: 'W W H W W W H',
      formula: '1 – 2 – 3 – 4 – 5 – 6 – 7', parallelKey: 'C Major',
      family: 'major', halfSteps: 'E–F, B–C',
      displayNotes: 'C – D – E^F – G – A – B^C',
      notes: [
        { step: 'C', alter: 0, octave: 4 }, { step: 'D', alter: 0, octave: 4 },
        { step: 'E', alter: 0, octave: 4 }, { step: 'F', alter: 0, octave: 4 },
        { step: 'G', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 },
        { step: 'B', alter: 0, octave: 4 }, { step: 'C', alter: 0, octave: 5 }
      ]
    },
    {
      id: 'dorian', degree: 2, name: 'Dorian', sub: '2nd Mode',
      t1: 'Minor', t2: 'Minor', pattern: 'W H W W W H W',
      formula: '1 – 2 – ♭3 – 4 – 5 – 6 – ♭7', parallelKey: 'B♭ Major',
      family: 'minor', halfSteps: 'E–F, B–C',
      displayNotes: 'D – E^F – G – A – B^C – D',
      notes: [
        { step: 'D', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 },
        { step: 'F', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 },
        { step: 'A', alter: 0, octave: 4 }, { step: 'B', alter: 0, octave: 4 },
        { step: 'C', alter: 0, octave: 5 }, { step: 'D', alter: 0, octave: 5 }
      ]
    },
    {
      id: 'phrygian', degree: 3, name: 'Phrygian', sub: '3rd Mode',
      t1: 'Phrygian', t2: 'Phrygian', pattern: 'H W W W H W W',
      formula: '1 – ♭2 – ♭3 – 4 – 5 – ♭6 – ♭7', parallelKey: 'A♭ Major',
      family: 'minor', halfSteps: 'E–F, B–C',
      displayNotes: 'E^F – G – A – B^C – D – E',
      notes: [
        { step: 'E', alter: 0, octave: 4 }, { step: 'F', alter: 0, octave: 4 },
        { step: 'G', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 },
        { step: 'B', alter: 0, octave: 4 }, { step: 'C', alter: 0, octave: 5 },
        { step: 'D', alter: 0, octave: 5 }, { step: 'E', alter: 0, octave: 5 }
      ]
    },
    {
      id: 'lydian', degree: 4, name: 'Lydian', sub: '4th Mode',
      t1: 'Wholetone', t2: 'Major', pattern: 'W W W H W W H',
      formula: '1 – 2 – 3 – ♯4 – 5 – 6 – 7', parallelKey: 'G Major',
      family: 'major', halfSteps: 'B–C, E–F',
      displayNotes: 'F – G – A – B^C – D – E^F',
      notes: [
        { step: 'F', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 },
        { step: 'A', alter: 0, octave: 4 }, { step: 'B', alter: 0, octave: 4 },
        { step: 'C', alter: 0, octave: 5 }, { step: 'D', alter: 0, octave: 5 },
        { step: 'E', alter: 0, octave: 5 }, { step: 'F', alter: 0, octave: 5 }
      ]
    },
    {
      id: 'mixolydian', degree: 5, name: 'Mixolydian', sub: '5th Mode',
      t1: 'Major', t2: 'Minor', pattern: 'W W H W W H W',
      formula: '1 – 2 – 3 – 4 – 5 – 6 – ♭7', parallelKey: 'F Major',
      family: 'major', halfSteps: 'B–C, E–F',
      displayNotes: 'G – A – B^C – D – E^F – G',
      notes: [
        { step: 'G', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 },
        { step: 'B', alter: 0, octave: 4 }, { step: 'C', alter: 0, octave: 5 },
        { step: 'D', alter: 0, octave: 5 }, { step: 'E', alter: 0, octave: 5 },
        { step: 'F', alter: 0, octave: 5 }, { step: 'G', alter: 0, octave: 5 }
      ]
    },
    {
      id: 'aeolian', degree: 6, name: 'Aeolian', sub: 'Natural Minor',
      t1: 'Minor', t2: 'Phrygian', pattern: 'W H W W H W W',
      formula: '1 – 2 – ♭3 – 4 – 5 – ♭6 – ♭7', parallelKey: 'E♭ Major',
      family: 'minor', halfSteps: 'B–C, E–F',
      displayNotes: 'A – B^C – D – E^F – G – A',
      notes: [
        { step: 'A', alter: 0, octave: 4 }, { step: 'B', alter: 0, octave: 4 },
        { step: 'C', alter: 0, octave: 5 }, { step: 'D', alter: 0, octave: 5 },
        { step: 'E', alter: 0, octave: 5 }, { step: 'F', alter: 0, octave: 5 },
        { step: 'G', alter: 0, octave: 5 }, { step: 'A', alter: 0, octave: 5 }
      ]
    },
    {
      id: 'locrian', degree: 7, name: 'Locrian', sub: '7th Mode',
      t1: 'Phrygian', t2: 'Wholetone', pattern: 'H W W H W W W',
      formula: '1 – ♭2 – ♭3 – 4 – ♭5 – ♭6 – ♭7', parallelKey: 'D♭ Major',
      family: 'minor', halfSteps: 'B–C, E–F',
      displayNotes: 'B^C – D – E^F – G – A – B',
      notes: [
        { step: 'B', alter: 0, octave: 3 }, { step: 'C', alter: 0, octave: 4 },
        { step: 'D', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 },
        { step: 'F', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 },
        { step: 'A', alter: 0, octave: 4 }, { step: 'B', alter: 0, octave: 4 }
      ]
    }
  ],

  modeStats: { correct: 0, total: 0 },
  fbStats: { correct: 0, total: 0 },
  dsStats: { correct: 0, total: 0 },

  currentModeQuiz: null,
  modeAnswered: false,
  currentFbQuiz: null,
  fbAnswered: false,
  currentDsQuiz: null,
  dsAnswered: false,
  modeQuizBank: [],
  dsQuizBank: [],

  init() {
    this.populate12KeyFilters();
    this.renderModePage();
    this.renderFiguredBassPage();
    this.renderDiatonicSubPage();

    this.buildModeQuizBank();
    this.buildDiatonicSubBank();

    this.nextModeQuiz();
    this.nextFiguredBassQuiz();
    this.nextDiatonicSubQuiz();
  },

  populate12KeyFilters() {
    if (typeof Theory === 'undefined' || !Theory.TWELVE_MAJOR_KEYS) return;
    const modeSel = document.getElementById('mode-key-filter');
    if (modeSel) {
      let html = `<option value="random">🎲 สุ่มทั้ง 12 คีย์ (252 ข้อ)</option>`;
      Theory.TWELVE_MAJOR_KEYS.forEach(kId => {
        const info = Theory.KEYS[kId];
        html += `<option value="${kId}">อ้างอิงคีย์ ${info.name} (${Theory.formatKeySignatureInfo(kId)})</option>`;
      });
      modeSel.innerHTML = html;
    }

    const dsSel = document.getElementById('ds-key-filter');
    if (dsSel) {
      let html = `<option value="random">🎲 สุ่มทั้ง 12 คีย์ (108 ข้อ)</option>`;
      Theory.TWELVE_MAJOR_KEYS.forEach(kId => {
        const info = Theory.KEYS[kId];
        html += `<option value="${kId}">คีย์ ${info.name} (${Theory.formatKeySignatureInfo(kId)})</option>`;
      });
      dsSel.innerHTML = html;
    }
  },

  buildModeScaleNotes(parentKeyId, modeDegreeZeroIdx) {
    const scale = Theory.getScaleDegrees(parentKeyId);
    const startDeg = scale[modeDegreeZeroIdx];
    const startOct = (startDeg.step === 'A' || startDeg.step === 'B') ? 3 : 4;
    const notes = [];
    for (let i = 0; i < 8; i++) {
      const deg = scale[(modeDegreeZeroIdx + i) % 7];
      let oct = startOct;
      if (notes.length > 0) {
        const prev = notes[notes.length - 1];
        oct = prev.octave;
        if (Theory.noteToDiatonicStep({ ...deg, octave: oct }) <= Theory.noteToDiatonicStep(prev)) {
          oct += 1;
        }
      }
      notes.push({ step: deg.step, alter: deg.alter || 0, octave: oct });
    }
    const halfIdx = [];
    for (let i = 0; i < notes.length - 1; i++) {
      if (Theory.noteToMidi(notes[i + 1]) - Theory.noteToMidi(notes[i]) === 1) halfIdx.push(i);
    }
    return { scale, notes, halfIdx, rootName: Theory.formatPitchClass(startDeg) };
  },

  getDiatonicChordNotes(scale, startDegZeroIdx, count = 4) {
    const startDeg = scale[startDegZeroIdx % 7];
    const startOct = (['G', 'A', 'B'].includes(startDeg.step)) ? 3 : 4;
    const out = [];
    for (let i = 0; i < count; i++) {
      const idx = startDegZeroIdx + i * 2;
      const deg = scale[idx % 7];
      let oct = startOct;
      if (out.length > 0) {
        const prev = out[out.length - 1];
        oct = prev.octave;
        while (Theory.noteToDiatonicStep({ ...deg, octave: oct }) <= Theory.noteToDiatonicStep(prev)) {
          oct += 1;
        }
      }
      out.push({ step: deg.step, alter: deg.alter || 0, octave: oct });
    }
    return out;
  },

  getAudio() {
    return (window.harmonyApp && window.harmonyApp.audio) ? window.harmonyApp.audio : null;
  },

  /**
   * วาดสเกลบนบรรทัด 5 เส้นเดี่ยว (Treble Clef) พร้อมจุดครึ่งเสียงชัดเจน (ใช้แก้ปัญหาโน้ตจากเอกสารต้นฉบับ)
   */
  renderScaleSvg(notes, halfStepIndices = []) {
    const proto = StaffRenderer.prototype;
    const lineSpacing = 8.5;
    const half = lineSpacing / 2;
    const svgWidth = 340;
    const startX = 14;
    const endX = svgWidth - 10;
    const bottomStep = 30; // E4
    const topStep = 38;    // F5

    const steps = notes.map(n => Theory.noteToDiatonicStep(n));
    const minStep = steps.length ? Math.min(...steps) : bottomStep;
    const maxStep = steps.length ? Math.max(...steps) : topStep;
    const extraTop = Math.max(0, (maxStep - topStep) * half);

    const staffTopY = Math.max(24, 14 + extraTop);
    const staffBottomY = staffTopY + 4 * lineSpacing;
    const lowestNoteY = staffBottomY + Math.max(0, (bottomStep - minStep) * half);
    const labelY = Math.max(staffBottomY + 20, lowestNoteY + 18);
    const totalHeight = labelY + 12;

    let svg = `<svg width="${svgWidth}" height="${totalHeight}" viewBox="0 0 ${svgWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto; display:block; margin:0 auto;">`;
    svg += `<line x1="${startX}" y1="${staffTopY}" x2="${startX}" y2="${staffBottomY}" stroke="#1e293b" stroke-width="1.4" />`;
    svg += proto.renderStaffLines(startX, endX, staffTopY, lineSpacing);
    svg += proto.renderTrebleClef(startX + 8, staffTopY - 2);
    svg += `<line x1="${endX}" y1="${staffTopY}" x2="${endX}" y2="${staffBottomY}" stroke="#1e293b" stroke-width="1.6" />`;

    const firstNoteX = 68;
    const noteGap = (endX - firstNoteX - 18) / Math.max(1, notes.length - 1);

    notes.forEach((n, idx) => {
      const x = firstNoteX + idx * noteGap;
      const step = Theory.noteToDiatonicStep(n);
      const y = staffBottomY - (step - bottomStep) * half;

      if (step <= bottomStep - 2) {
        for (let s = bottomStep - 2; s >= step; s -= 2) {
          const ly = staffBottomY + (bottomStep - s) * half;
          svg += `<line x1="${x - 7.5}" y1="${ly}" x2="${x + 7.5}" y2="${ly}" stroke="#1e293b" stroke-width="1" />`;
        }
      }
      if (step >= topStep + 2) {
        for (let s = topStep + 2; s <= step; s += 2) {
          const ly = staffTopY - (s - topStep) * half;
          svg += `<line x1="${x - 7.5}" y1="${ly}" x2="${x + 7.5}" y2="${ly}" stroke="#1e293b" stroke-width="1" />`;
        }
      }

      const isRoot = idx === 0 || idx === notes.length - 1;
      const fill = isRoot ? '#2563eb' : '#0f172a';
      svg += `<ellipse cx="${x}" cy="${y}" rx="4.8" ry="3.4" transform="rotate(-15 ${x} ${y})" fill="${fill}" />`;
      if (n.alter === 1) svg += proto.renderSharp(x - 10, y, fill, 0.78);
      else if (n.alter === -1) svg += proto.renderFlat(x - 9.5, y, fill, 0.78);

      svg += `<text x="${x}" y="${labelY}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="${isRoot ? '#1d4ed8' : '#334155'}">${Theory.formatPitchClass(n)}</text>`;

      if (halfStepIndices.includes(idx)) {
        const nextX = firstNoteX + (idx + 1) * noteGap;
        const midX = (x + nextX) / 2;
        svg += `<text x="${midX}" y="${labelY}" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#dc2626">^</text>`;
      }
    });

    svg += `</svg>`;
    return svg;
  },

  playScaleSequence(notes) {
    const audio = this.getAudio();
    if (!audio || !notes || notes.length === 0) return;
    audio.stop();
    audio.initContext();
    const now = audio.ctx.currentTime;
    notes.forEach((n, idx) => {
      const freq = audio.midiToFreq(Theory.noteToMidi(n));
      audio.synthVoice(freq, now + idx * 0.24, 0.45, 0.26);
    });
  },

  playChordList(noteLists) {
    const audio = this.getAudio();
    if (!audio || !noteLists || noteLists.length === 0) return;
    audio.stop();
    audio.initContext();
    const now = audio.ctx.currentTime;
    noteLists.forEach((notes, chordIdx) => {
      const start = now + chordIdx * 0.95;
      notes.forEach(n => {
        audio.synthVoice(audio.midiToFreq(Theory.noteToMidi(n)), start, 0.9, 0.2);
      });
    });
  },

  // =========================================================================
  // PAGE 4: MAJOR MODE
  // =========================================================================
  renderModePage() {
    // 1. Tetrachord ตัวอย่าง 4 ชนิด
    const tetraWrap = document.getElementById('mode-tetrachords-grid');
    if (tetraWrap) {
      const tets = [
        { name: 'Major Tetrachord', deg: 'เริ่มที่ 1st degree', half: 'ลำดับ 3–4', formula: 'W – W – H', halfIdx: [2], notes: this.MODES[0].notes.slice(0, 4) },
        { name: 'Minor Tetrachord', deg: 'เริ่มที่ 2nd degree', half: 'ลำดับ 2–3', formula: 'W – H – W', halfIdx: [1], notes: this.MODES[1].notes.slice(0, 4) },
        { name: 'Phrygian Tetrachord', deg: 'เริ่มที่ 3rd degree', half: 'ลำดับ 1–2', formula: 'H – W – W', halfIdx: [0], notes: this.MODES[2].notes.slice(0, 4) },
        { name: 'Wholetone Tetrachord', deg: 'เริ่มที่ 4th degree', half: 'ไม่มีครึ่งเสียงในกลุ่ม', formula: 'W – W – W', halfIdx: [], notes: this.MODES[3].notes.slice(0, 4) }
      ];
      tetraWrap.innerHTML = tets.map((t, i) => `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <div>
              <strong style="color:#0f172a;">${t.name}</strong>
              <div style="font-size:0.78rem; color:#475569;">${t.deg} • ครึ่งเสียง: <strong>${t.half}</strong> (${t.formula})</div>
            </div>
            <button class="btn btn-success btn-xs" onclick="window.theoryPages.playTetrachord(${i})">🔊 ฟัง</button>
          </div>
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:6px;">
            ${this.renderScaleSvg(t.notes, t.halfIdx)}
          </div>
        </div>
      `).join('');
      this._tets = tets;
    }

    // 2. 7 Modes พร้อมสเกล + กดฟัง
    const modesWrap = document.getElementById('mode-seven-list');
    if (modesWrap) {
      modesWrap.innerHTML = this.MODES.map((m, idx) => {
        const halfIdx = [];
        for (let i = 0; i < m.notes.length - 1; i++) {
          if (Theory.noteToMidi(m.notes[i + 1]) - Theory.noteToMidi(m.notes[i]) === 1) halfIdx.push(i);
        }
        const badgeBg = m.family === 'major' ? '#fef3c7; color:#b45309' : '#ede9fe; color:#6d28d9';
        return `
          <div class="mode-row-card">
            <div class="mode-row-info">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:3px;">
                <span class="slot-rank-badge" style="background:#2563eb;">${m.degree}</span>
                <strong style="font-size:1rem; color:#0f172a;">${m.name}</strong>
                <span style="font-size:0.74rem; padding:2px 8px; border-radius:999px; font-weight:700; background:${badgeBg};">${m.family === 'major' ? 'Major Family' : 'Minor Family'}</span>
              </div>
              <div style="font-size:0.8rem; color:#475569;">${m.t1} + ${m.t2} Tetrachord</div>
              <div style="font-size:0.78rem; color:#1d4ed8; font-weight:700;">สูตร: ${m.formula}</div>
            </div>
            <div class="mode-row-staff">
              ${this.renderScaleSvg(m.notes, halfIdx)}
            </div>
            <button class="btn btn-success btn-sm mode-row-play-btn" onclick="window.theoryPages.playMode(${idx})">🔊 ฟัง</button>
          </div>
        `;
      }).join('');
    }
  },

  playTetrachord(i) {
    if (this._tets && this._tets[i]) this.playScaleSequence(this._tets[i].notes);
  },

  playMode(idx) {
    if (this.MODES[idx]) this.playScaleSequence(this.MODES[idx].notes);
  },

  buildModeQuizBank() {
    this.modeQuizBank = [];
    if (typeof Theory === 'undefined' || !Theory.TWELVE_MAJOR_KEYS) return;

    const allKeys = Theory.TWELVE_MAJOR_KEYS;
    const degRoman = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
    const seventhQuals = ['Major 7 (Maj7)', 'minor 7 (m7)', 'minor 7 (m7)', 'Major 7 (Maj7)', 'Dominant 7 (7)', 'minor 7 (m7)', 'half-diminished 7 (m7♭5)'];

    allKeys.forEach(parentKeyId => {
      const parentInfo = Theory.KEYS[parentKeyId];
      const sigText = Theory.formatKeySignatureInfo(parentKeyId);

      this.MODES.forEach((m, idx) => {
        const built = this.buildModeScaleNotes(parentKeyId, idx);
        const noteStr = built.notes.map(n => Theory.formatPitchClass(n)).join(' – ');

        // 1. Identify Mode จากสเกล 12 คีย์ + เสียง
        this.modeQuizBank.push({
          id: `mode_id_${parentKeyId}_${m.id}`,
          keyId: parentKeyId,
          scaleNotes: built.notes,
          halfIdx: built.halfIdx,
          prompt: `[คีย์ตั้งต้น: <strong>${parentInfo.name}</strong>] โน้ตชุดนี้เริ่มที่ <strong>${built.rootName}</strong> (${noteStr}) และใช้ Key Signature ${sigText} คือ <strong>Mode ชนิดใด</strong>?`,
          answer: m.id,
          explain: `<strong>${built.rootName} ${m.name}</strong> เป็นลำดับที่ ${m.degree} ของ <strong>${parentInfo.name}</strong> (สูตร ${m.formula}, ${m.t1} + ${m.t2} Tetrachord, กลุ่ม ${m.family === 'major' ? 'Major Chord Family' : 'Minor Chord Family'})`
        });

        // 2. หา Parent Major Scale (วิธีที่ 2)
        const otherKeys = allKeys.filter(k => k !== parentKeyId);
        const wrongKeys = [];
        for (let step of [2, 5, 8]) {
          wrongKeys.push(otherKeys[(allKeys.indexOf(parentKeyId) + step) % otherKeys.length]);
        }
        const keyOpts = [parentKeyId, ...wrongKeys].sort();
        this.modeQuizBank.push({
          id: `mode_parent_${parentKeyId}_${m.id}`,
          keyId: parentKeyId,
          scaleNotes: built.notes,
          halfIdx: built.halfIdx,
          prompt: `โหมด <strong>${built.rootName} ${m.name}</strong> (ลำดับที่ ${m.degree} ของ Major Scale) ใช้ Key Signature เดียวกับคีย์ใด?`,
          answer: parentKeyId,
          options: keyOpts.map(k => ({ k, t: `${Theory.KEYS[k].name} (${Theory.formatKeySignatureInfo(k)})` })),
          explain: `นับถอยหลัง ${m.degree} ขั้นตาม Major Scale: <strong>${built.rootName}</strong> เป็นขั้นที่ ${m.degree} ของ <strong>${parentInfo.name}</strong> จึงใช้ ${sigText} (${noteStr})`
        });

        // 3. โครงสร้าง Tetrachord / Chord Family / Scale Degree
        this.modeQuizBank.push({
          id: `mode_deg_${parentKeyId}_${m.id}`,
          keyId: parentKeyId,
          scaleNotes: built.notes,
          halfIdx: built.halfIdx,
          prompt: `ในคีย์ <strong>${parentInfo.name}</strong> คอร์ดลำดับที่ <strong>${degRoman[idx]} (${built.rootName})</strong> มีคู่ 7th ชนิดใด และตรงกับโครงสร้าง Tetrachord ใด?`,
          answer: `q_${idx}`,
          options: [
            { k: `q_${idx}`, t: `${seventhQuals[idx]} • ${m.t1} + ${m.t2} Tetrachord` },
            { k: 'd1', t: `${seventhQuals[(idx + 1) % 7]} • ${this.MODES[(idx + 1) % 7].t1} + ${this.MODES[(idx + 1) % 7].t2}` },
            { k: 'd2', t: `${seventhQuals[(idx + 3) % 7]} • ${this.MODES[(idx + 3) % 7].t1} + ${this.MODES[(idx + 3) % 7].t2}` },
            { k: 'd3', t: `${seventhQuals[(idx + 5) % 7]} • ${this.MODES[(idx + 5) % 7].t1} + ${this.MODES[(idx + 5) % 7].t2}` }
          ],
          explain: `ขั้นที่ ${m.degree} (${degRoman[idx]}) ของ Major Scale สัมพันธ์กับ <strong>${m.name}</strong> ให้คอร์ด <strong>${seventhQuals[idx]}</strong> และเกิดจาก <strong>${m.t1} + ${m.t2} Tetrachord</strong> (${m.formula})`
        });
      });
    });
  },

  nextModeQuiz() {
    if (!this.modeQuizBank || this.modeQuizBank.length === 0) this.buildModeQuizBank();
    const filterEl = document.getElementById('mode-key-filter');
    const selectedKey = filterEl ? filterEl.value : 'random';
    const pool = (selectedKey && selectedKey !== 'random')
      ? this.modeQuizBank.filter(q => q.keyId === selectedKey)
      : this.modeQuizBank;

    if (pool.length === 0) return;
    let next;
    do {
      next = pool[Math.floor(Math.random() * pool.length)];
    } while (this.currentModeQuiz && pool.length > 1 && next.id === this.currentModeQuiz.id);

    this.currentModeQuiz = next;
    this.modeAnswered = false;

    const staffEl = document.getElementById('mode-quiz-staff');
    if (staffEl && this.currentModeQuiz.scaleNotes) {
      staffEl.innerHTML = `<div style="display:flex; justify-content:center;">${this.renderScaleSvg(this.currentModeQuiz.scaleNotes, this.currentModeQuiz.halfIdx)}</div>`;
    }

    const qEl = document.getElementById('mode-quiz-prompt');
    const optEl = document.getElementById('mode-quiz-options');
    const fbEl = document.getElementById('mode-quiz-feedback');

    if (qEl) qEl.innerHTML = this.currentModeQuiz.prompt;
    if (fbEl) fbEl.innerHTML = `<div style="color:#64748b; font-size:0.86rem;">กดฟังเสียงสเกลประกอบหรือเลือกคำตอบที่ถูกต้องด้านบน (คลังโจทย์ 12 คีย์ • ${pool.length} ข้อ)</div>`;

    const opts = (this.currentModeQuiz.options || [
      { k: 'ionian', t: '1. Ionian' },
      { k: 'dorian', t: '2. Dorian' },
      { k: 'phrygian', t: '3. Phrygian' },
      { k: 'lydian', t: '4. Lydian' },
      { k: 'mixolydian', t: '5. Mixolydian' },
      { k: 'aeolian', t: '6. Aeolian' },
      { k: 'locrian', t: '7. Locrian' }
    ]).slice();

    // สลับลำดับเฉพาะข้อที่มี custom 4 options เพื่อไม่ให้ข้อแรกถูกเสมอ
    if (this.currentModeQuiz.options) {
      opts.sort(() => Math.random() - 0.5);
    }

    if (optEl) {
      optEl.innerHTML = opts.map(o => `
        <button class="btn btn-outline mode-choice-btn" data-val="${o.k}" onclick="window.theoryPages.submitModeQuiz('${o.k}')">${o.t}</button>
      `).join('');
    }
    this.updateBadge('mode-stats-badge', this.modeStats);
  },

  playCurrentModeQuiz() {
    if (this.currentModeQuiz && this.currentModeQuiz.scaleNotes) {
      this.playScaleSequence(this.currentModeQuiz.scaleNotes);
    }
  },

  submitModeQuiz(val) {
    if (!this.currentModeQuiz || this.modeAnswered) return;
    this.modeAnswered = true;
    this.modeStats.total += 1;
    const ok = val === this.currentModeQuiz.answer;
    if (ok) this.modeStats.correct += 1;

    document.querySelectorAll('.mode-choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.val === this.currentModeQuiz.answer) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-success');
      } else if (btn.dataset.val === val && !ok) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-danger');
      }
    });

    const fbEl = document.getElementById('mode-quiz-feedback');
    if (fbEl) {
      fbEl.innerHTML = ok
        ? `<div class="issue-card" style="border-left:4px solid #16a34a; background:#f0fdf4;"><div class="issue-title" style="color:#15803d;">✅ ถูกต้อง!</div><div class="issue-detail">${this.currentModeQuiz.explain}</div></div>`
        : `<div class="issue-card error"><div class="issue-title">❌ ยังไม่ถูกต้อง</div><div class="issue-detail">${this.currentModeQuiz.explain}</div></div>`;
    }
    if (!ok) {
      this.showQuizErrorPopup('.mode-choice-btn', val, this.currentModeQuiz.answer, 'แบบฝึกหัด Major Mode & Tetrachord', this.currentModeQuiz.explain);
    }
    this.playCurrentModeQuiz();
    this.updateBadge('mode-stats-badge', this.modeStats);
  },

  // =========================================================================
  // PAGE 5: FIGURED BASS
  // =========================================================================
  renderFiguredBassPage() {
    // ตัวอย่างโน้ตการ Realize จาก Bass C3 / G3
    this._fbExamples = [
      {
        label: 'C (5/3 Blank)', sub: 'C–E–G', notes: [
          { step: 'C', alter: 0, octave: 3 }, { step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }
        ]
      },
      {
        label: 'Bass E + 6', sub: 'E–G–C', notes: [
          { step: 'E', alter: 0, octave: 3 }, { step: 'G', alter: 0, octave: 3 }, { step: 'C', alter: 0, octave: 4 }
        ]
      },
      {
        label: 'Bass G + 6/4', sub: 'G–C–E', notes: [
          { step: 'G', alter: 0, octave: 3 }, { step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }
        ]
      },
      {
        label: 'Bass C + ♯ (3rd)', sub: 'C–E–G (♯3 → E)', notes: [
          { step: 'A', alter: 0, octave: 2 }, { step: 'C', alter: 1, octave: 4 }, { step: 'E', alter: 0, octave: 4 }
        ]
      }
    ];
    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples(
        'fb-lesson-staff',
        this._fbExamples,
        'window.theoryPages.playFbExample',
        'bass'
      );
    }
  },

  playFbExample(idx) {
    if (this._fbExamples && this._fbExamples[idx]) {
      this.playChordList([this._fbExamples[idx].notes]);
    }
  },

  nextFiguredBassQuiz() {
    const bank = [
      {
        prompt: 'หากโน้ตเบสคือ <strong>E</strong> และมีตัวเลข Figured Bass กำกับว่า <strong>6</strong> (เช่น I⁶ ใน C Major) จะหมายถึงการสร้างคอร์ดที่มีโน้ตใดบ้าง?',
        answer: 'C_E_G',
        opts: [
          { k: 'C_E_G', t: 'E – G – C (โน้ต E เป็น 3rd ของคอร์ด C Major)' },
          { k: 'E_G_B', t: 'E – G – B (Root Position ของ E minor)' },
          { k: 'A_C_E', t: 'E – A – C (2nd Inversion ของ A minor)' },
          { k: 'F_A_C', t: 'E – G – F (คอร์ด 7th)' }
        ],
        chord: [{ step: 'E', alter: 0, octave: 3 }, { step: 'G', alter: 0, octave: 3 }, { step: 'C', alter: 0, octave: 4 }],
        explain: 'เลข <strong>6</strong> ย่อมาจาก <strong>6/3</strong> หมายถึงคอร์ด <strong>1st Inversion</strong> โดยนับคู่ 3 (G) และคู่ 6 (C) เหนือเบส E จะได้คอร์ด C Major (C–E–G)!'
      },
      {
        prompt: 'หากโน้ตเบสมีเครื่องหมายแปลงเสียงลอยๆ <strong>♯</strong> (ไม่มีตัวเลขกำกับ) เครื่องหมายนั้นกระทำกับโน้ตขั้นคู่ใดเหนือโน้ตเบส?',
        answer: '3rd',
        opts: [
          { k: '3rd', t: 'ขั้นคู่ที่ 3 (3rd) เหนือโน้ตเบสเสมอ' },
          { k: '5th', t: 'ขั้นคู่ที่ 5 (5th) เหนือโน้ตเบสเสมอ' },
          { k: '6th', t: 'ขั้นคู่ที่ 6 (6th) เหนือโน้ตเบสเสมอ' },
          { k: '8th', t: 'โน้ตเบสตัวนั้นเอง' }
        ],
        chord: [{ step: 'A', alter: 0, octave: 3 }, { step: 'C', alter: 1, octave: 4 }, { step: 'E', alter: 0, octave: 4 }],
        explain: '<strong>Orphaned Accidentals</strong> (เครื่องหมายที่เขียนลอยๆ ไม่มีตัวเลข) ใน Figured Bass ใช้ปรับโน้ต <strong>ขั้นคู่ที่ 3 (3rd)</strong> เหนือเบส เช่น เบส A มี ♯ = เปลี่ยน C เป็น C♯ (ได้คอร์ด A Major)'
      },
      {
        prompt: 'สัญลักษณ์เต็มของตัวเลข <strong>4/3</strong> สำหรับ 7th Chord พลิกกลับครั้งที่ 2 คือข้อใด?',
        answer: '643',
        opts: [
          { k: '643', t: '6 / 4 / 3 (ละเลข 6 ไว้)' },
          { k: '753', t: '7 / 5 / 3 (ละเลข 5, 3 ไว้)' },
          { k: '653', t: '6 / 5 / 3 (ละเลข 3 ไว้)' },
          { k: '642', t: '6 / 4 / 2 (ละเลข 6 ไว้)' }
        ],
        chord: [{ step: 'D', alter: 0, octave: 3 }, { step: 'F', alter: 0, octave: 3 }, { step: 'G', alter: 0, octave: 3 }, { step: 'B', alter: 0, octave: 3 }],
        explain: '2nd Inversion ของ 7th Chord มีสัญลักษณ์เต็มคือ <strong>6/4/3</strong> นิยมย่อเหลือ <strong>4/3</strong> (ละเลข 6)'
      },
      {
        prompt: 'สัญลักษณ์ขีดทับตัวเลข (Slash ผ่านเลข) หรือเครื่องหมายบวก <strong>(+)</strong> หน้าตัวเลขใน Figured Bass หมายความว่าอย่างไร?',
        answer: 'sharp',
        opts: [
          { k: 'sharp', t: 'เพิ่มเสียงขั้นคู่นั้นขึ้นครึ่งเสียง (Sharp)' },
          { k: 'flat', t: 'ลดเสียงขั้นคู่นั้นลงครึ่งเสียง (Flat)' },
          { k: 'omit', t: 'ไม่ต้องเล่นขั้นคู่นั้น (Omit)' },
          { k: 'double', t: 'ให้ซ้ำเสียงขั้นคู่นั้นในแนว Soprano' }
        ],
        chord: [{ step: 'B', alter: 0, octave: 2 }, { step: 'D', alter: 0, octave: 3 }, { step: 'G', alter: 1, octave: 3 }],
        explain: 'การขีดทับตัวเลข (Slash) หรือใส่เครื่องหมาย <strong>+</strong> ในยุคบาโรกมีความหมายเท่ากับการเพิ่มเสียงขั้นคู่นั้นขึ้น <strong>1 ครึ่งเสียง (Sharp)</strong>'
      },
      {
        prompt: 'สำหรับ 7th Chord ในตำแหน่ง <strong>3rd Inversion (โน้ตที่ 7 เป็นเบส)</strong> ใช้สัญลักษณ์ย่อใน Figured Bass ว่าอย่างไร?',
        answer: '42',
        opts: [
          { k: '42', t: '4/2 หรือ 2 (ย่อจาก 6/4/2)' },
          { k: '65', t: '6/5 (ย่อจาก 6/5/3)' },
          { k: '43', t: '4/3 (ย่อจาก 6/4/3)' },
          { k: '64', t: '6/4' }
        ],
        chord: [{ step: 'F', alter: 0, octave: 3 }, { step: 'G', alter: 0, octave: 3 }, { step: 'B', alter: 0, octave: 3 }, { step: 'D', alter: 0, octave: 4 }],
        explain: '3rd Inversion ของ 7th Chord ย่อจาก 6/4/2 เป็น <strong>4/2</strong> (หรือเลข <strong>2</strong> ตัวเดียว)'
      }
    ];

    this.currentFbQuiz = bank[Math.floor(Math.random() * bank.length)];
    this.fbAnswered = false;

    const qEl = document.getElementById('fb-quiz-prompt');
    const optEl = document.getElementById('fb-quiz-options');
    const fbEl = document.getElementById('fb-quiz-feedback');
    if (qEl) qEl.innerHTML = this.currentFbQuiz.prompt;
    if (fbEl) fbEl.innerHTML = `<div style="color:#64748b; font-size:0.86rem;">เลือกคำตอบที่ถูกต้องตามหลัก Figured Bass</div>`;
    if (optEl) {
      optEl.innerHTML = this.currentFbQuiz.opts.map(o => `
        <button class="btn btn-outline fb-choice-btn" data-val="${o.k}" onclick="window.theoryPages.submitFiguredBassQuiz('${o.k}')">${o.t}</button>
      `).join('');
    }
    this.updateBadge('fb-stats-badge', this.fbStats);
  },

  playCurrentFbQuiz() {
    if (this.currentFbQuiz) this.playChordList([this.currentFbQuiz.chord]);
  },

  submitFiguredBassQuiz(val) {
    if (!this.currentFbQuiz || this.fbAnswered) return;
    this.fbAnswered = true;
    this.fbStats.total += 1;
    const ok = val === this.currentFbQuiz.answer;
    if (ok) this.fbStats.correct += 1;

    document.querySelectorAll('.fb-choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.val === this.currentFbQuiz.answer) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-success');
      } else if (btn.dataset.val === val && !ok) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-danger');
      }
    });

    const fbEl = document.getElementById('fb-quiz-feedback');
    if (fbEl) {
      fbEl.innerHTML = ok
        ? `<div class="issue-card" style="border-left:4px solid #16a34a; background:#f0fdf4;"><div class="issue-title" style="color:#15803d;">✅ ถูกต้อง!</div><div class="issue-detail">${this.currentFbQuiz.explain}</div></div>`
        : `<div class="issue-card error"><div class="issue-title">❌ ยังไม่ถูกต้อง</div><div class="issue-detail">${this.currentFbQuiz.explain}</div></div>`;
    }
    if (!ok) {
      this.showQuizErrorPopup('.fb-choice-btn', val, this.currentFbQuiz.answer, 'แบบฝึกหัด Figured Bass & Accidentals', this.currentFbQuiz.explain);
    }
    this.playCurrentFbQuiz();
    this.updateBadge('fb-stats-badge', this.fbStats);
  },

  // =========================================================================
  // PAGE 6: DIATONIC SUBSTITUTION & CHORD SPELLING FORMULA
  // =========================================================================
  renderDiatonicSubPage() {
    // ตัวอย่าง C Major: C ↔ Em และ Cmaj7 ↔ Em7 บนบรรทัด 5 เส้น
    this._dsExamples = {
      triadSub: [
        { label: 'C (I)', sublabel: 'C – E – G', notes: [{ step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }] },
        { label: 'Em (iii)', sublabel: 'E – G – B', notes: [{ step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }, { step: 'B', alter: 0, octave: 4 }] }
      ],
      spellingPair1: [
        { label: 'Dm7', sublabel: 'D–F–A–C', notes: [{ step: 'D', alter: 0, octave: 4 }, { step: 'F', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }, { step: 'C', alter: 0, octave: 5 }] },
        { label: 'Fmaj6', sublabel: 'F–A–C–D', notes: [{ step: 'F', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }, { step: 'C', alter: 0, octave: 5 }, { step: 'D', alter: 0, octave: 5 }] }
      ],
      spellingPair2: [
        { label: 'Bm7(♭5)', sublabel: 'B–D–F–A', notes: [{ step: 'B', alter: 0, octave: 3 }, { step: 'D', alter: 0, octave: 4 }, { step: 'F', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }] },
        { label: 'Dm6', sublabel: 'D–F–A–B', notes: [{ step: 'D', alter: 0, octave: 4 }, { step: 'F', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }, { step: 'B', alter: 0, octave: 4 }] }
      ]
    };

    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples('ds-lesson-triad-staff', this._dsExamples.triadSub, 'window.theoryPages.playDsTriadEx', 'treble');
      ChordLabRenderer.renderLessonExamples('ds-lesson-spell1-staff', this._dsExamples.spellingPair1, 'window.theoryPages.playDsSpell1Ex', 'treble');
      ChordLabRenderer.renderLessonExamples('ds-lesson-spell2-staff', this._dsExamples.spellingPair2, 'window.theoryPages.playDsSpell2Ex', 'treble');
    }
  },

  playDsTriadEx(idx) {
    this.playChordList([this._dsExamples.triadSub[idx].notes]);
  },
  playDsSpell1Ex(idx) {
    this.playChordList([this._dsExamples.spellingPair1[idx].notes]);
  },
  playDsSpell2Ex(idx) {
    this.playChordList([this._dsExamples.spellingPair2[idx].notes]);
  },

  playDsPairCompare(key) {
    const pairs = {
      'I_iii': [
        [{ step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }, { step: 'B', alter: 0, octave: 4 }],
        [{ step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }, { step: 'B', alter: 0, octave: 4 }, { step: 'D', alter: 0, octave: 5 }]
      ],
      'ii_IV': [
        [{ step: 'D', alter: 0, octave: 4 }, { step: 'F', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }, { step: 'C', alter: 0, octave: 5 }],
        [{ step: 'F', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }, { step: 'C', alter: 0, octave: 5 }, { step: 'E', alter: 0, octave: 5 }]
      ],
      'V_vii': [
        [{ step: 'G', alter: 0, octave: 3 }, { step: 'B', alter: 0, octave: 3 }, { step: 'D', alter: 0, octave: 4 }, { step: 'F', alter: 0, octave: 4 }],
        [{ step: 'B', alter: 0, octave: 3 }, { step: 'D', alter: 0, octave: 4 }, { step: 'F', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }]
      ],
      'Dm7_Fmaj6': this._dsExamples.spellingPair1.map(x => x.notes),
      'Am7_Cmaj6': [
        [{ step: 'A', alter: 0, octave: 3 }, { step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }],
        [{ step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }]
      ],
      'Em7_Gmaj6': [
        [{ step: 'E', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }, { step: 'B', alter: 0, octave: 4 }, { step: 'D', alter: 0, octave: 5 }],
        [{ step: 'G', alter: 0, octave: 4 }, { step: 'B', alter: 0, octave: 4 }, { step: 'D', alter: 0, octave: 5 }, { step: 'E', alter: 0, octave: 5 }]
      ],
      'Bm7b5_Dm6': this._dsExamples.spellingPair2.map(x => x.notes)
    };
    if (pairs[key]) this.playChordList(pairs[key]);
  },

  buildDiatonicSubBank() {
    this.dsQuizBank = [];
    if (typeof Theory === 'undefined' || !Theory.TWELVE_MAJOR_KEYS) return;

    Theory.TWELVE_MAJOR_KEYS.forEach(keyId => {
      const kInfo = Theory.KEYS[keyId];
      const scale = Theory.getScaleDegrees(keyId);
      const n = scale.map(d => Theory.formatPitchClass(d));

      const tri1 = this.getDiatonicChordNotes(scale, 0, 3);
      const tri3 = this.getDiatonicChordNotes(scale, 2, 3);
      const sev1 = this.getDiatonicChordNotes(scale, 0, 4);
      const sev2 = this.getDiatonicChordNotes(scale, 1, 4);
      const sev3 = this.getDiatonicChordNotes(scale, 2, 4);
      const sev4 = this.getDiatonicChordNotes(scale, 3, 4);
      const sev5 = this.getDiatonicChordNotes(scale, 4, 4);
      const sev6 = this.getDiatonicChordNotes(scale, 5, 4);
      const sev7 = this.getDiatonicChordNotes(scale, 6, 4);

      const makeInversionFromBottom = (chordNotes) => {
        const cloned = chordNotes.map(x => ({ ...x }));
        const first = cloned.shift();
        first.octave += 1;
        cloned.push(first);
        return cloned;
      };

      // 1. I <-> iii (7th Sub)
      this.dsQuizBank.push({
        id: `ds_I_iii_${keyId}`,
        keyId,
        chordPair: [
          { label: `${n[0]}maj7 (I)`, sublabel: `${n[0]}–${n[2]}–${n[4]}–${n[6]}`, notes: sev1 },
          { label: `${n[2]}m7 (iii)`, sublabel: `${n[2]}–${n[4]}–${n[6]}–${n[1]}`, notes: sev3 }
        ],
        prompt: `[คีย์ <strong>${kInfo.name}</strong>] คอร์ด <strong>${n[0]}maj7 (I)</strong> สามารถใช้คอร์ดลำดับที่ <strong>iii</strong> ตัวใดมาเล่นแทนได้ (มีโน้ตร่วม ${n[2]}, ${n[4]}, ${n[6]})?`,
        answer: `${n[2]}m7`,
        opts: [
          { k: `${n[2]}m7`, t: `${n[2]}m7 (iii • ${n[2]}–${n[4]}–${n[6]}–${n[1]})` },
          { k: `${n[1]}m7`, t: `${n[1]}m7 (ii)` },
          { k: `${n[3]}maj7`, t: `${n[3]}maj7 (IV)` },
          { k: `${n[4]}7`, t: `${n[4]}7 (V7)` }
        ],
        explain: `ในคีย์ ${kInfo.name} คอร์ด I (${n[0]}maj7) แทนด้วยคอร์ด iii ซึ่งก็คือ <strong>${n[2]}m7</strong> เพราะมีโน้ตร่วมกันมากถึง 3 โน้ต (${n[2]}, ${n[4]}, ${n[6]})`
      });

      // 2. ii <-> IV (7th Sub)
      this.dsQuizBank.push({
        id: `ds_ii_IV_${keyId}`,
        keyId,
        chordPair: [
          { label: `${n[1]}m7 (ii)`, sublabel: `${n[1]}–${n[3]}–${n[5]}–${n[0]}`, notes: sev2 },
          { label: `${n[3]}maj7 (IV)`, sublabel: `${n[3]}–${n[5]}–${n[0]}–${n[2]}`, notes: sev4 }
        ],
        prompt: `[คีย์ <strong>${kInfo.name}</strong>] คอร์ด <strong>${n[1]}m7 (ii)</strong> สามารถแทนด้วยคอร์ดลำดับที่ <strong>IV</strong> ตัวใด?`,
        answer: `${n[3]}maj7`,
        opts: [
          { k: `${n[3]}maj7`, t: `${n[3]}maj7 (IV • ${n[3]}–${n[5]}–${n[0]}–${n[2]})` },
          { k: `${n[4]}7`, t: `${n[4]}7 (V7)` },
          { k: `${n[2]}m7`, t: `${n[2]}m7 (iii)` },
          { k: `${n[6]}m7b5`, t: `${n[6]}m7(♭5) (vii°)` }
        ],
        explain: `คู่คอร์ด ii ↔ IV ในคีย์ ${kInfo.name} คือ <strong>${n[1]}m7 ↔ ${n[3]}maj7</strong> โดยแชร์โน้ตร่วมคือ ${n[3]}, ${n[5]}, ${n[0]}`
      });

      // 3. V <-> vii (7th Sub)
      this.dsQuizBank.push({
        id: `ds_V_vii_${keyId}`,
        keyId,
        chordPair: [
          { label: `${n[4]}7 (V7)`, sublabel: `${n[4]}–${n[6]}–${n[1]}–${n[3]}`, notes: sev5 },
          { label: `${n[6]}m7(♭5) (vii)`, sublabel: `${n[6]}–${n[1]}–${n[3]}–${n[5]}`, notes: sev7 }
        ],
        prompt: `[คีย์ <strong>${kInfo.name}</strong>] คอร์ด <strong>${n[4]}7 (V7)</strong> สามารถใช้คอร์ดลำดับที่ <strong>vii</strong> ชนิดใดแทนหน้าที่ Dominant ได้?`,
        answer: `${n[6]}m7b5`,
        opts: [
          { k: `${n[6]}m7b5`, t: `${n[6]}m7(♭5) (vii • ${n[6]}–${n[1]}–${n[3]}–${n[5]})` },
          { k: `${n[0]}maj7`, t: `${n[0]}maj7 (I)` },
          { k: `${n[3]}maj7`, t: `${n[3]}maj7 (IV)` },
          { k: `${n[5]}m7`, t: `${n[5]}m7 (vi)` }
        ],
        explain: `ในคีย์ ${kInfo.name} คอร์ด V7 (${n[4]}7) แทนด้วยคอร์ด vii คือ <strong>${n[6]}m7(♭5)</strong> มีโน้ตสำคัญ (${n[6]}, ${n[1]}, ${n[3]}) เหมือนกัน`
      });

      // 4. I <-> iii Triad (66.66%)
      this.dsQuizBank.push({
        id: `ds_triad_${keyId}`,
        keyId,
        chordPair: [
          { label: `${n[0]} (I)`, sublabel: `${n[0]}–${n[2]}–${n[4]}`, notes: tri1 },
          { label: `${n[2]}m (iii)`, sublabel: `${n[2]}–${n[4]}–${n[6]}`, notes: tri3 }
        ],
        prompt: `[คีย์ <strong>${kInfo.name}</strong>] คอร์ด Triad <strong>${n[0]} (${n[0]}–${n[2]}–${n[4]})</strong> มีโน้ตร่วม 2 ตัวกับคอร์ดใด (คล้ายเดิม 66.66%)?`,
        answer: `${n[2]}m`,
        opts: [
          { k: `${n[2]}m`, t: `${n[2]}m (${n[2]}–${n[4]}–${n[6]})` },
          { k: `${n[1]}m`, t: `${n[1]}m (${n[1]}–${n[3]}–${n[5]})` },
          { k: `${n[4]}`, t: `${n[4]} (${n[4]}–${n[6]}–${n[1]})` },
          { k: `${n[3]}`, t: `${n[3]} (${n[3]}–${n[5]}–${n[0]})` }
        ],
        explain: `<strong>${n[0]}</strong> (${n[0]}–${n[2]}–${n[4]}) และ <strong>${n[2]}m</strong> (${n[2]}–${n[4]}–${n[6]}) มีโน้ตร่วม 2 จาก 3 ตัว (${n[2]}, ${n[4]}) จึงคล้ายเดิม 66.66%`
      });

      // 5. Spelling: ii m7 <-> IV Maj6
      this.dsQuizBank.push({
        id: `ds_sp_ii_${keyId}`,
        keyId,
        chordPair: [
          { label: `${n[1]}m7`, sublabel: `${n[1]}–${n[3]}–${n[5]}–${n[0]}`, notes: sev2 },
          { label: `${n[3]}maj6`, sublabel: `${n[3]}–${n[5]}–${n[0]}–${n[1]}`, notes: makeInversionFromBottom(sev2) }
        ],
        prompt: `[คีย์ <strong>${kInfo.name}</strong>] คอร์ด <strong>${n[1]}m7 (${n[1]}–${n[3]}–${n[5]}–${n[0]})</strong> เมื่อพลิกโน้ต 1 ตัวมาเริ่มที่ <strong>${n[3]}</strong> จะตรงกับคอร์ด Major6 ใด?`,
        answer: `${n[3]}maj6`,
        opts: [
          { k: `${n[3]}maj6`, t: `${n[3]}Maj6 (${n[3]}–${n[5]}–${n[0]}–${n[1]})` },
          { k: `${n[3]}m6`, t: `${n[3]}m6 (Minor6)` },
          { k: `${n[0]}maj6`, t: `${n[0]}Maj6` },
          { k: `${n[4]}maj6`, t: `${n[4]}Maj6` }
        ],
        explain: `ตามสูตร <strong>Minor7 (1, ♭3, 5, ♭7) ↔ Major6 (1, 3, 5, 6)</strong> ดังนั้น ${n[1]}m7 = <strong>${n[3]}Maj6</strong>`
      });

      // 6. Spelling: iii m7 <-> V Maj6
      this.dsQuizBank.push({
        id: `ds_sp_iii_${keyId}`,
        keyId,
        chordPair: [
          { label: `${n[2]}m7`, sublabel: `${n[2]}–${n[4]}–${n[6]}–${n[1]}`, notes: sev3 },
          { label: `${n[4]}maj6`, sublabel: `${n[4]}–${n[6]}–${n[1]}–${n[2]}`, notes: makeInversionFromBottom(sev3) }
        ],
        prompt: `[คีย์ <strong>${kInfo.name}</strong>] คอร์ด <strong>${n[2]}m7 (${n[2]}–${n[4]}–${n[6]}–${n[1]})</strong> เมื่อพลิกโน้ตมาเริ่มที่ <strong>${n[4]}</strong> จะได้คอร์ดใด?`,
        answer: `${n[4]}maj6`,
        opts: [
          { k: `${n[4]}maj6`, t: `${n[4]}Maj6 (${n[4]}–${n[6]}–${n[1]}–${n[2]})` },
          { k: `${n[4]}m6`, t: `${n[4]}m6 (Minor6)` },
          { k: `${n[1]}m6`, t: `${n[1]}m6` },
          { k: `${n[0]}maj6`, t: `${n[0]}Maj6` }
        ],
        explain: `ตามสูตร <strong>Minor7 ↔ Major6</strong> เมื่อพลิก ${n[2]}m7 (${n[2]}–${n[4]}–${n[6]}–${n[1]}) เริ่มจากขั้น ♭3 (${n[4]}) จะได้ <strong>${n[4]}Maj6</strong>`
      });

      // 7. Spelling: vi m7 <-> I Maj6
      this.dsQuizBank.push({
        id: `ds_sp_vi_${keyId}`,
        keyId,
        chordPair: [
          { label: `${n[5]}m7`, sublabel: `${n[5]}–${n[0]}–${n[2]}–${n[4]}`, notes: sev6 },
          { label: `${n[0]}maj6`, sublabel: `${n[0]}–${n[2]}–${n[4]}–${n[5]}`, notes: makeInversionFromBottom(sev6) }
        ],
        prompt: `[คีย์ <strong>${kInfo.name}</strong>] คอร์ด <strong>${n[5]}m7 (${n[5]}–${n[0]}–${n[2]}–${n[4]})</strong> เป็นคอร์ดคู่แฝดชุดโน้ตเดียวกับคอร์ดใด?`,
        answer: `${n[0]}maj6`,
        opts: [
          { k: `${n[0]}maj6`, t: `${n[0]}Maj6 (${n[0]}–${n[2]}–${n[4]}–${n[5]})` },
          { k: `${n[3]}maj6`, t: `${n[3]}Maj6` },
          { k: `${n[0]}m6`, t: `${n[0]}m6` },
          { k: `${n[1]}m6`, t: `${n[1]}m6` }
        ],
        explain: `${n[5]}m7 (${n[5]}–${n[0]}–${n[2]}–${n[4]}) เมื่อพลิกโน้ตเริ่มที่ ${n[0]} จะตรงกับสูตร Major6 (1, 3, 5, 6) ของ <strong>${n[0]}Maj6</strong>`
      });

      // 8. Spelling: vii halfdim7 <-> ii Minor6
      this.dsQuizBank.push({
        id: `ds_sp_vii_${keyId}`,
        keyId,
        chordPair: [
          { label: `${n[6]}m7(♭5)`, sublabel: `${n[6]}–${n[1]}–${n[3]}–${n[5]}`, notes: sev7 },
          { label: `${n[1]}m6`, sublabel: `${n[1]}–${n[3]}–${n[5]}–${n[6]}`, notes: makeInversionFromBottom(sev7) }
        ],
        prompt: `[คีย์ <strong>${kInfo.name}</strong>] คอร์ด <strong>${n[6]}m7(♭5) (${n[6]}–${n[1]}–${n[3]}–${n[5]})</strong> เมื่อพลิกโน้ต 1 ตัวมาเริ่มที่ <strong>${n[1]}</strong> จะได้คอร์ดใด?`,
        answer: `${n[1]}m6`,
        opts: [
          { k: `${n[1]}m6`, t: `${n[1]}m6 (สูตร Minor6: 1, ♭3, 5, 6)` },
          { k: `${n[1]}maj6`, t: `${n[1]}Maj6 (1, 3, 5, 6)` },
          { k: `${n[3]}maj6`, t: `${n[3]}Maj6` },
          { k: `${n[5]}m6`, t: `${n[5]}m6` }
        ],
        explain: `ตามสูตร <strong>Halfdim7 (1, ♭3, ♭5, ♭7) ↔ Minor6 (1, ♭3, 5, 6)</strong> ดังนั้น ${n[6]}m7(♭5) = <strong>${n[1]}m6</strong> (${n[1]}–${n[3]}–${n[5]}–${n[6]})`
      });

      // 9. Similarity rule (%) with contextual chord pair
      this.dsQuizBank.push({
        id: `ds_pct_${keyId}`,
        keyId,
        chordPair: [
          { label: `${n[0]}maj7`, sublabel: `4 โน้ต`, notes: sev1 },
          { label: `${n[2]}m7`, sublabel: `4 โน้ต`, notes: sev3 }
        ],
        prompt: `[คีย์ <strong>${kInfo.name}</strong>] ในโครงสร้าง <strong>7th Chord</strong> (4 โน้ต) และ <strong>Triad</strong> (3 โน้ต) หากมีโน้ตร่วมกัน 2 โน้ต จะให้ความคล้ายคลึงเสียงเดิมกี่เปอร์เซ็นต์ตามลำดับ?`,
        answer: '50_66',
        opts: [
          { k: '50_66', t: '7th = 50%  |  Triad = 66.66%' },
          { k: '66_50', t: '7th = 66.66%  |  Triad = 50%' },
          { k: '25_33', t: '7th = 25%  |  Triad = 33.33%' },
          { k: '75_66', t: '7th = 75%  |  Triad = 66.66%' }
        ],
        explain: `โน้ตร่วม 2 ตัวใน <strong>7th Chord (2/4) = 50%</strong> และโน้ตร่วม 2 ตัวใน <strong>Triad (2/3) = 66.66%</strong> (หากร่วมเพียง 1 ตัวถือว่าเกี่ยวข้องน้อยเกินไป)`
      });
    });
  },

  nextDiatonicSubQuiz() {
    if (!this.dsQuizBank || this.dsQuizBank.length === 0) this.buildDiatonicSubBank();
    const filterEl = document.getElementById('ds-key-filter');
    const selectedKey = filterEl ? filterEl.value : 'random';
    const pool = (selectedKey && selectedKey !== 'random')
      ? this.dsQuizBank.filter(q => q.keyId === selectedKey)
      : this.dsQuizBank;

    if (pool.length === 0) return;
    let next;
    do {
      next = pool[Math.floor(Math.random() * pool.length)];
    } while (this.currentDsQuiz && pool.length > 1 && next.id === this.currentDsQuiz.id);

    this.currentDsQuiz = next;
    this.dsAnswered = false;

    if (typeof ChordLabRenderer !== 'undefined' && this.currentDsQuiz.chordPair) {
      ChordLabRenderer.renderLessonExamples(
        'ds-quiz-staff',
        this.currentDsQuiz.chordPair,
        'window.theoryPages.playDsQuizSingle',
        'treble'
      );
    }

    const qEl = document.getElementById('ds-quiz-prompt');
    const optEl = document.getElementById('ds-quiz-options');
    const fbEl = document.getElementById('ds-quiz-feedback');
    if (qEl) qEl.innerHTML = this.currentDsQuiz.prompt;
    if (fbEl) fbEl.innerHTML = `<div style="color:#64748b; font-size:0.86rem;">กดฟังคอร์ดเปรียบเทียบหรือเลือกคำตอบที่ถูกต้อง (คลังโจทย์ 12 คีย์ • ${pool.length} ข้อ)</div>`;
    if (optEl) {
      const opts = this.currentDsQuiz.opts.slice().sort(() => Math.random() - 0.5);
      optEl.innerHTML = opts.map(o => `
        <button class="btn btn-outline ds-choice-btn" data-val="${o.k}" onclick="window.theoryPages.submitDiatonicSubQuiz('${o.k}')">${o.t}</button>
      `).join('');
    }
    this.updateBadge('ds-stats-badge', this.dsStats);
  },

  playDsQuizSingle(idx) {
    if (this.currentDsQuiz && this.currentDsQuiz.chordPair && this.currentDsQuiz.chordPair[idx]) {
      this.playChordList([this.currentDsQuiz.chordPair[idx].notes]);
    }
  },

  playCurrentDsQuiz() {
    if (this.currentDsQuiz && this.currentDsQuiz.chordPair) {
      this.playChordList(this.currentDsQuiz.chordPair.map(x => x.notes));
    }
  },

  submitDiatonicSubQuiz(val) {
    if (!this.currentDsQuiz || this.dsAnswered) return;
    this.dsAnswered = true;
    this.dsStats.total += 1;
    const ok = val === this.currentDsQuiz.answer;
    if (ok) this.dsStats.correct += 1;

    document.querySelectorAll('.ds-choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.val === this.currentDsQuiz.answer) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-success');
      } else if (btn.dataset.val === val && !ok) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-danger');
      }
    });

    const fbEl = document.getElementById('ds-quiz-feedback');
    if (fbEl) {
      fbEl.innerHTML = ok
        ? `<div class="issue-card" style="border-left:4px solid #16a34a; background:#f0fdf4;"><div class="issue-title" style="color:#15803d;">✅ ถูกต้อง!</div><div class="issue-detail">${this.currentDsQuiz.explain}</div></div>`
        : `<div class="issue-card error"><div class="issue-title">❌ ยังไม่ถูกต้อง</div><div class="issue-detail">${this.currentDsQuiz.explain}</div></div>`;
    }
    if (!ok) {
      this.showQuizErrorPopup('.ds-choice-btn', val, this.currentDsQuiz.answer, 'แบบฝึกหัด Diatonic Substitution & Chord Spelling', this.currentDsQuiz.explain);
    }
    this.playCurrentDsQuiz();
    this.updateBadge('ds-stats-badge', this.dsStats);
  },

  showQuizErrorPopup(btnSelector, chosenVal, correctVal, subtitle, explain) {
    if (typeof window.showErrorPopup !== 'function') return;
    const chosenBtn = document.querySelector(`${btnSelector}[data-val="${chosenVal}"]`);
    const correctBtn = document.querySelector(`${btnSelector}[data-val="${correctVal}"]`);
    const chosenText = chosenBtn ? chosenBtn.textContent.trim() : chosenVal;
    const correctText = correctBtn ? correctBtn.textContent.trim() : correctVal;

    window.showErrorPopup({
      title: 'คำตอบยังไม่ถูกต้อง — มาดูเหตุผลกัน!',
      subtitle,
      reasons: [
        `❌ <strong>คำตอบที่คุณเลือก:</strong> ${chosenText}`,
        `✅ <strong>คำตอบที่ถูกต้อง:</strong> ${correctText}`
      ],
      tip: `💡 <strong>ผิดเพราะอะไร / คำอธิบาย:</strong> ${explain}`
    });
  },

  updateBadge(id, stats) {
    const el = document.getElementById(id);
    if (el) el.textContent = `คะแนนสะสม: ${stats.correct} / ${stats.total} ข้อ`;
  }
};

window.TheoryPages = TheoryPages;
