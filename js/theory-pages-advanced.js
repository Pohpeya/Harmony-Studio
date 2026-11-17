/**
 * Harmony Studio - Interactive Controller for 4 Advanced Theory Pages:
 * - Minor Scale & Diatonic Minor
 * - Mode in Melodic Minor (7 Modes & Tensions)
 * - Secondary Dominant & Substitutions
 * - Modulation (Key Relationships, Pivot, Chromatic Mediant & Direct)
 */

const AdvancedTheoryPages = {
  MINOR_KEY_BASES: [
    { id: 'A_min',  root: 'A', alter: 0,  name: 'A Minor',  relMaj: 'C Major (0♯/0♭)' },
    { id: 'Bb_min', root: 'B', alter: -1, name: 'B♭ Minor', relMaj: 'D♭ Major (5♭)' },
    { id: 'B_min',  root: 'B', alter: 0,  name: 'B Minor',  relMaj: 'D Major (2♯)' },
    { id: 'C_min',  root: 'C', alter: 0,  name: 'C Minor',  relMaj: 'E♭ Major (3♭)' },
    { id: 'Cs_min', root: 'C', alter: 1,  name: 'C♯ Minor', relMaj: 'E Major (4♯)' },
    { id: 'D_min',  root: 'D', alter: 0,  name: 'D Minor',  relMaj: 'F Major (1♭)' },
    { id: 'Eb_min', root: 'E', alter: -1, name: 'E♭ Minor', relMaj: 'G♭ Major (6♭)' },
    { id: 'E_min',  root: 'E', alter: 0,  name: 'E Minor',  relMaj: 'G Major (1♯)' },
    { id: 'F_min',  root: 'F', alter: 0,  name: 'F Minor',  relMaj: 'A♭ Major (4♭)' },
    { id: 'Fs_min', root: 'F', alter: 1,  name: 'F♯ Minor', relMaj: 'A Major (3♯)' },
    { id: 'G_min',  root: 'G', alter: 0,  name: 'G Minor',  relMaj: 'B♭ Major (2♭)' },
    { id: 'Gs_min', root: 'G', alter: 1,  name: 'G♯ Minor', relMaj: 'B Major (5♯)' }
  ],

  MINOR_SCALE_TYPES: [
    {
      id: 'natural',
      name: 'Natural Minor',
      formula: '1 – 2 – ♭3 – 4 – 5 – ♭6 – ♭7 – 8',
      arpeggio: 'm7 (1, ♭3, 5, ♭7)',
      tetrachord: 'Minor + Phrygian',
      semitones: [0, 2, 3, 5, 7, 8, 10, 12],
      steps: [0, 1, 2, 3, 4, 5, 6, 7],
      halfIdx: [1, 4],
      desc: 'สเกลไมเนอร์พื้นฐานตรงตาม Key Signature มีขั้นครึ่งเสียงที่ 2–3 และ 5–6'
    },
    {
      id: 'harmonic',
      name: 'Harmonic Minor',
      formula: '1 – 2 – ♭3 – 4 – 5 – ♭6 – 7 – 8',
      arpeggio: 'mM7 (1, ♭3, 5, 7)',
      tetrachord: 'Minor + Harmonic',
      semitones: [0, 2, 3, 5, 7, 8, 11, 12],
      steps: [0, 1, 2, 3, 4, 5, 6, 7],
      halfIdx: [1, 4, 6],
      augIdx: 5,
      desc: 'ยกขั้นที่ 7 ขึ้นครึ่งเสียงเพื่อสร้าง Leading Tone (7→8) ทำให้ช่วง ♭6–7 ห่าง 1 เสียงครึ่ง (3 semitones)'
    },
    {
      id: 'melodic',
      name: 'Melodic Minor (Ascending)',
      formula: '1 – 2 – ♭3 – 4 – 5 – 6 – 7 – 8',
      arpeggio: 'mM7 (1, ♭3, 5, 7)',
      tetrachord: 'Minor + Major',
      semitones: [0, 2, 3, 5, 7, 9, 11, 12],
      steps: [0, 1, 2, 3, 4, 5, 6, 7],
      halfIdx: [1, 6],
      desc: 'ยกทั้งขั้นที่ 6 และ 7 ขึ้นครึ่งเสียง ลดช่วงกระโดด 1 เสียงครึ่งให้ทำนองลื่นไหล (ครึ่งเสียงที่ 2–3, 7–8)'
    }
  ],

  MELODIC_MODES: [
    {
      id: 'melodic_minor', degree: 1, degreeLabel: '1st', name: 'Melodic minor',
      formula: '1 – 2 – ♭3 – 4 – 5 – 6 – 7 – 8',
      tensions: '1, 2, ♭3, 11, 5, 6, 7',
      arpeggio: 'mM7',
      tetrachord: 'minor + major',
      semitones: [0, 2, 3, 5, 7, 9, 11, 12],
      halfIdx: [1, 6]
    },
    {
      id: 'dorian_b2', degree: 2, degreeLabel: '2nd', name: 'Dorian ♭2 (♭9)',
      formula: '1 – ♭2 – ♭3 – 4 – 5 – 6 – ♭7 – 8',
      tensions: '1, ♭9, ♭3, 11, 5, 13, ♭7',
      arpeggio: 'm7, m7(♭9)',
      tetrachord: 'phrygian + minor',
      semitones: [0, 1, 3, 5, 7, 9, 10, 12],
      halfIdx: [0, 5]
    },
    {
      id: 'lydian_aug', degree: 3, degreeLabel: '3rd', name: 'Lydian augmented',
      formula: '1 – 2 – 3 – ♯4 – ♯5 – 6 – 7 – 8',
      tensions: '1, 2, 3, ♯11, ♯5, 13, 7',
      arpeggio: 'M7(♯5)',
      tetrachord: 'wholetone + diminished',
      semitones: [0, 2, 4, 6, 8, 9, 11, 12],
      halfIdx: [4, 6]
    },
    {
      id: 'lydian_dom', degree: 4, degreeLabel: '4th', name: 'Lydian dominant',
      formula: '1 – 2 – 3 – ♯4 – 5 – 6 – ♭7 – 8',
      tensions: '1, 9, 3, ♯11, 5, 13, ♭7',
      arpeggio: 'dominant7, 7, 7(♯11)',
      tetrachord: 'wholetone + minor',
      semitones: [0, 2, 4, 6, 7, 9, 10, 12],
      halfIdx: [3, 5]
    },
    {
      id: 'dom_b13', degree: 5, degreeLabel: '5th', name: 'Dominant7 ♭13',
      formula: '1 – 2 – 3 – 4 – 5 – ♭6 – ♭7 – 8',
      tensions: '1, 9, 3, 11, 5, ♭13, ♭7',
      arpeggio: 'dominant7, 7, 7(♭13)',
      tetrachord: 'major + phrygian',
      semitones: [0, 2, 4, 5, 7, 8, 10, 12],
      halfIdx: [2, 4]
    },
    {
      id: 'locrian_s2', degree: 6, degreeLabel: '6th', name: 'Locrian ♯2',
      formula: '1 – 2 – ♭3 – 4 – ♭5 – ♭6 – ♭7 – 8',
      tensions: '1, 9, ♭3, 11, ♭5, ♭13, ♭7',
      arpeggio: 'dim, half dim, m7♭5',
      tetrachord: 'minor + wholetone',
      semitones: [0, 2, 3, 5, 6, 8, 10, 12],
      halfIdx: [1, 3]
    },
    {
      id: 'altered', degree: 7, degreeLabel: '7th', name: 'Altered (Super Locrian)',
      formula: '1 – ♭2 – ♭3 – ♭4 – ♭5 – ♭6 – ♭7 – 8',
      tensions: '1, ♭9, ♯9, 3, ♯11, ♭13, ♭7',
      arpeggio: '7altered, 7(♭9), 7(♭9 ♯9)',
      tetrachord: 'diminished + wholetone',
      semitones: [0, 1, 3, 4, 6, 8, 10, 12],
      halfIdx: [0, 2]
    }
  ],

  CIRCLE_MAJOR_ORDER: [
    'C_maj', 'G_maj', 'D_maj', 'A_maj', 'E_maj', 'B_maj',
    'Fs_maj', 'Db_maj', 'Ab_maj', 'Eb_maj', 'Bb_maj', 'F_maj'
  ],

  msStats:  { correct: 0, total: 0 },
  mmStats:  { correct: 0, total: 0 },
  sdStats:  { correct: 0, total: 0 },
  modStats: { correct: 0, total: 0 },

  msQuizBank: [],
  mmQuizBank: [],
  sdQuizBank: [],
  modQuizBank: [],

  currentMsQuiz: null,  msAnswered: false,
  currentMmQuiz: null,  mmAnswered: false,
  currentSdQuiz: null,  sdAnswered: false,
  currentModQuiz: null, modAnswered: false,

  lessonMinorNotesCache: [],
  lessonMelodicModesCache: [],
  lessonSecDomTriadsCache: [],
  lessonSecDomSeventhsCache: [],
  lessonSecDomSubCache: [],
  lessonModPivotCache: [],
  lessonModCmCache: [],

  init() {
    this.populateFilters();
    this.renderMinorScalePage();
    this.renderMelodicModesPage();
    this.renderSecDomPage();
    this.renderModulationPage();

    this.buildMinorScaleBank();
    this.buildMelodicModesBank();
    this.buildSecDomBank();
    this.buildModulationBank();

    this.nextMinorScaleQuiz();
    this.nextMelodicModesQuiz();
    this.nextSecDomQuiz();
    this.nextModulationQuiz();
  },

  populateFilters() {
    if (typeof Theory === 'undefined') return;

    const fillMinorSelect = (id, allText) => {
      const el = document.getElementById(id);
      if (!el) return;
      let html = allText ? `<option value="random">${allText}</option>` : '';
      this.MINOR_KEY_BASES.forEach(k => {
        html += `<option value="${k.id}">${k.name} (${k.relMaj})</option>`;
      });
      el.innerHTML = html;
    };

    const fillMajorSelect = (id, allText) => {
      const el = document.getElementById(id);
      if (!el) return;
      let html = allText ? `<option value="random">${allText}</option>` : '';
      Theory.TWELVE_MAJOR_KEYS.forEach(kId => {
        const info = Theory.KEYS[kId];
        html += `<option value="${kId}">คีย์ ${info.name} (${Theory.formatKeySignatureInfo(kId)})</option>`;
      });
      el.innerHTML = html;
    };

    fillMinorSelect('ms-lesson-key', null);
    fillMinorSelect('ms-key-filter', '🎲 สุ่มทั้ง 12 คีย์ไมเนอร์ (120 ข้อ)');

    const mmLesson = document.getElementById('mm-lesson-key');
    if (mmLesson) {
      mmLesson.innerHTML = this.MINOR_KEY_BASES.map(k => `<option value="${k.id}">อ้างอิง ${k.name}</option>`).join('');
    }
    fillMinorSelect('mm-key-filter', '🎲 สุ่มทั้ง 12 คีย์ (252 ข้อ)');

    fillMajorSelect('sd-lesson-key', null);
    fillMajorSelect('sd-key-filter', '🎲 สุ่มทั้ง 12 คีย์ (108 ข้อ)');

    fillMajorSelect('mod-lesson-key', null);
    fillMajorSelect('mod-key-filter', '🎲 สุ่มทั้ง 12 คีย์ (96 ข้อ)');
  },

  spellScaleFromRoot(rootStep, rootAlter, semitones, baseOctave = 4) {
    const octStart = (rootStep === 'A' || rootStep === 'B') ? 3 : baseOctave;
    return semitones.map((semi, i) => Theory.spellIntervalNote(rootStep, rootAlter || 0, octStart, i, semi));
  },

  spellCustomChord(rootStep, rootAlter, stepOffsets, semitones, baseOctave = 4) {
    const oct = (rootStep === 'A' || rootStep === 'B') ? 3 : baseOctave;
    return stepOffsets.map((st, idx) => Theory.spellIntervalNote(rootStep, rootAlter || 0, oct, st, semitones[idx]));
  },

  getChordSymbol(noteObj, suffix) {
    return `${Theory.formatPitchClass(noteObj)}${suffix}`;
  },

  getMinorScaleDegrees(keyBase, typeId) {
    const def = this.MINOR_SCALE_TYPES.find(t => t.id === typeId) || this.MINOR_SCALE_TYPES[0];
    return this.spellScaleFromRoot(keyBase.root, keyBase.alter, def.semitones).slice(0, 7);
  },

  getDiatonicChordFromScale(scale7, degZeroIdx, isSeventh) {
    const count = isSeventh ? 4 : 3;
    const notes = TheoryPages.getDiatonicChordNotes(scale7, degZeroIdx, count);
    const rootMidi = Theory.noteToMidi(notes[0]);
    const ints = notes.map(n => Theory.noteToMidi(n) - rootMidi);
    const key = ints.join(',');
    const map = {
      '0,4,7': { suffix: '', label: 'Major Triad' },
      '0,3,7': { suffix: 'm', label: 'Minor Triad' },
      '0,3,6': { suffix: '°', label: 'Diminished Triad' },
      '0,4,8': { suffix: '+', label: 'Augmented Triad' },
      '0,4,7,11': { suffix: 'maj7', label: 'Major 7th' },
      '0,3,7,10': { suffix: 'm7', label: 'Minor 7th' },
      '0,4,7,10': { suffix: '7', label: 'Dominant 7th' },
      '0,3,6,10': { suffix: 'm7♭5', label: 'Half Diminished (ø7)' },
      '0,3,6,9':  { suffix: '°7', label: 'Full Diminished (°7)' },
      '0,3,7,11': { suffix: 'mM7', label: 'Minor-Major 7th' },
      '0,4,8,11': { suffix: 'maj7♯5', label: 'Augmented Major 7th' }
    };
    const meta = map[key] || { suffix: '', label: '' };
    return { notes, symbol: `${Theory.formatPitchClass(notes[0])}${meta.suffix}`, quality: meta.label, suffix: meta.suffix };
  },

  // =========================================================================
  // 1) PAGE: MINOR SCALE & DIATONIC MINOR
  // =========================================================================
  renderMinorScalePage() {
    const sel = document.getElementById('ms-lesson-key');
    const keyId = sel ? sel.value : 'A_min';
    const keyBase = this.MINOR_KEY_BASES.find(k => k.id === keyId) || this.MINOR_KEY_BASES[0];

    const scalesWrap = document.getElementById('ms-scales-list');
    if (scalesWrap) {
      this.lessonMinorNotesCache = [];
      scalesWrap.innerHTML = this.MINOR_SCALE_TYPES.map((t, idx) => {
        const notes = this.spellScaleFromRoot(keyBase.root, keyBase.alter, t.semitones);
        this.lessonMinorNotesCache.push(notes);
        const noteNames = notes.map(n => Theory.formatPitchClass(n)).join(' – ');
        return `
          <div class="mode-row-card">
            <div class="mode-row-info">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
                <span class="slot-rank-badge" style="background:#4f46e5;">${idx + 1}</span>
                <strong style="font-size:1.02rem; color:#0f172a;">${keyBase.name.replace(' Minor', '')} ${t.name}</strong>
              </div>
              <div style="font-size:0.82rem; color:#1e40af; font-weight:700;">Formula: ${t.formula}</div>
              <div style="font-size:0.8rem; color:#475569;">Arpeggio: <strong>${t.arpeggio}</strong> | Tetrachord: <strong>${t.tetrachord}</strong></div>
              <div style="font-size:0.78rem; color:#0f766e; margin-top:2px;">โน้ต: ${noteNames}</div>
              <div style="font-size:0.78rem; color:#64748b; margin-top:2px;">${t.desc}</div>
            </div>
            <div class="mode-row-staff">
              ${TheoryPages.renderScaleSvg(notes, t.halfIdx)}
            </div>
            <button class="btn btn-success btn-sm mode-row-play-btn" onclick="window.advancedTheoryPages.playMinorScale(${idx})">🔊 ฟัง</button>
          </div>
        `;
      }).join('');
    }

    const diaWrap = document.getElementById('ms-diatonic-table');
    if (diaWrap) {
      const natScale = this.getMinorScaleDegrees(keyBase, 'natural');
      const harScale = this.getMinorScaleDegrees(keyBase, 'harmonic');
      const melScale = this.getMinorScaleDegrees(keyBase, 'melodic');

      const buildRow = (title, scale, is7th, rareSet, accent) => {
        const cols = [0, 1, 2, 3, 4, 5, 6].map(d => {
          const ch = this.getDiatonicChordFromScale(scale, d, is7th);
          const isRare = rareSet.includes(d);
          return `<td style="text-align:center; padding:8px 6px;">
            <strong style="color:#0f172a;">${ch.symbol}</strong>
            ${isRare ? '<div style="margin-top:3px;"><span style="background:#e2e8f0; color:#475569; font-size:0.7rem; padding:1px 6px; border-radius:4px;">rare</span></div>' : ''}
          </td>`;
        }).join('');
        return `<tr><td style="font-weight:700; color:${accent}; white-space:nowrap;">${title}</td>${cols}</tr>`;
      };

      const romanTriad = ['i', 'ii°', 'III / III+', 'iv', 'v / V', 'VI / vi°', 'VII / vii°'];
      diaWrap.innerHTML = `
        <div style="margin-bottom:12px;">
          <strong style="font-size:0.9rem; color:#1e293b;">ตาราง Diatonic Triad ในคีย์ ${keyBase.name} (เทียบ Natural / Harmonic / Melodic):</strong>
          <table class="theory-table" style="margin-top:6px;">
            <thead><tr><th>Scale</th>${romanTriad.map(r => `<th style="text-align:center;">${r}</th>`).join('')}</tr></thead>
            <tbody>
              ${buildRow('Natural', natScale, false, [4, 6], '#0369a1')}
              ${buildRow('Harmonic', harScale, false, [2], '#7c3aed')}
              ${buildRow('Melodic', melScale, false, [1, 2, 3, 5], '#0f766e')}
            </tbody>
          </table>
        </div>
        <div>
          <strong style="font-size:0.9rem; color:#1e293b;">ตาราง Diatonic 7th Chord ในคีย์ ${keyBase.name}:</strong>
          <table class="theory-table" style="margin-top:6px;">
            <thead><tr><th>Scale</th>${['1', '2', '3', '4', '5', '6', '7'].map(r => `<th style="text-align:center;">ขั้นที่ ${r}</th>`).join('')}</tr></thead>
            <tbody>
              ${buildRow('Natural (7th)', natScale, true, [], '#0369a1')}
              ${buildRow('Harmonic (7th)', harScale, true, [], '#7c3aed')}
              ${buildRow('Melodic (7th)', melScale, true, [], '#0f766e')}
            </tbody>
          </table>
        </div>
      `;
    }

    const harStaffEl = document.getElementById('ms-harmonic-staff-examples');
    if (harStaffEl && typeof ChordLabRenderer !== 'undefined') {
      const harScale = this.getMinorScaleDegrees(keyBase, 'harmonic');
      const triadExamples = [0, 1, 2, 3, 4, 5, 6].map((d, i) => {
        const ch = this.getDiatonicChordFromScale(harScale, d, false);
        const roms = ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'];
        return { label: roms[i], sublabel: ch.symbol, notes: ch.notes };
      });
      this.msHarmTriads = triadExamples;
      ChordLabRenderer.renderLessonExamples('ms-harmonic-staff-examples', triadExamples, 'window.advancedTheoryPages.playMinorTriadEx', 'treble');
    }
  },

  playMinorScale(idx) {
    if (this.lessonMinorNotesCache[idx]) TheoryPages.playScaleSequence(this.lessonMinorNotesCache[idx], 0.34);
  },

  playMinorTriadEx(idx) {
    if (this.msHarmTriads && this.msHarmTriads[idx]) {
      TheoryPages.playChordList([this.msHarmTriads[idx].notes]);
    }
  },

  buildMinorScaleBank() {
    if (typeof Theory === 'undefined') return;
    const bank = [];
    this.MINOR_KEY_BASES.forEach(kb => {
      // 1-3: Scale identification (Natural / Harmonic / Melodic) by sound & staff
      this.MINOR_SCALE_TYPES.forEach(t => {
        const notes = this.spellScaleFromRoot(kb.root, kb.alter, t.semitones);
        bank.push({
          keyId: kb.id,
          keyLabel: kb.name,
          prompt: `สังเกตและฟังเสียงสเกลเริ่มต้นที่โน้ต ${kb.name.replace(' Minor', '')} นี้ — คือสเกล Minor ชนิดใด?`,
          svgHtml: TheoryPages.renderScaleSvg(notes, t.halfIdx),
          playNotes: notes,
          opts: [
            { k: 'natural',  t: 'Natural Minor (1 2 ♭3 4 5 ♭6 ♭7)' },
            { k: 'harmonic', t: 'Harmonic Minor (1 2 ♭3 4 5 ♭6 7)' },
            { k: 'melodic',  t: 'Melodic Minor (1 2 ♭3 4 5 6 7)' },
            { k: 'dorian',   t: 'Major / Ionian Scale (1 2 3 4 5 6 7)' }
          ],
          answer: t.id,
          explain: `สเกลนี้ใน ${kb.name} คือ <strong>${t.name}</strong> สูตร <code>${t.formula}</code> (${t.tetrachord}) ประกอบด้วยโน้ต ${notes.map(n => Theory.formatPitchClass(n)).join(' – ')}`
        });
      });

      // 4-6: Tetrachord & Arpeggio & Augmented 2nd rules
      this.MINOR_SCALE_TYPES.forEach(t => {
        bank.push({
          keyId: kb.id,
          keyLabel: kb.name,
          prompt: `ใน ${kb.name} • โครงสร้าง Tetrachord ของ ${t.name} ประกอบด้วยอะไร?`,
          svgHtml: TheoryPages.renderScaleSvg(this.spellScaleFromRoot(kb.root, kb.alter, t.semitones), t.halfIdx),
          playNotes: this.spellScaleFromRoot(kb.root, kb.alter, t.semitones),
          opts: [
            { k: 'Minor + Phrygian', t: 'Minor + Phrygian Tetrachord' },
            { k: 'Minor + Harmonic', t: 'Minor + Harmonic Tetrachord' },
            { k: 'Minor + Major',    t: 'Minor + Major Tetrachord' },
            { k: 'Major + Minor',    t: 'Major + Minor Tetrachord' }
          ],
          answer: t.tetrachord,
          explain: `${t.name} ใช้ <strong>${t.tetrachord} Tetrachord</strong> (${t.formula}) และ Arpeggio คือ <strong>${t.arpeggio}</strong>`
        });
      });

      // 7: Harmonic Minor V7 / vii°7 / III+ chord in key
      const harScale = this.getMinorScaleDegrees(kb, 'harmonic');
      const chIII = this.getDiatonicChordFromScale(harScale, 2, false);
      const chV7 = this.getDiatonicChordFromScale(harScale, 4, true);
      const chViiDim = this.getDiatonicChordFromScale(harScale, 6, true);
      const chIIHalf = this.getDiatonicChordFromScale(harScale, 1, true);

      bank.push({
        keyId: kb.id,
        keyLabel: kb.name,
        prompt: `ใน ${kb.name} (Harmonic Minor) • คอร์ดขั้นที่ 3 (III+) ที่เกิดจากโน้ตในบันไดเสียงคือคอร์ดใด?`,
        svgHtml: ChordLabRenderer.renderLessonExamples('__none__', [], '', 'treble') || '',
        chordNotes: chIII.notes,
        opts: [
          { k: chIII.symbol, t: `${chIII.symbol} (Augmented)` },
          { k: `${Theory.formatPitchClass(harScale[2])}`, t: `${Theory.formatPitchClass(harScale[2])} (Major)` },
          { k: `${Theory.formatPitchClass(harScale[2])}m`, t: `${Theory.formatPitchClass(harScale[2])}m (Minor)` },
          { k: `${Theory.formatPitchClass(harScale[2])}°`, t: `${Theory.formatPitchClass(harScale[2])}° (Diminished)` }
        ],
        answer: chIII.symbol,
        explain: `ใน Harmonic Minor ขั้นที่ 7 ถูกยกขึ้นครึ่งเสียง ทำให้ Triad ขั้นที่ 3 มีระยะเป็น 1–3–♯5 กลายเป็น <strong>III+ (${chIII.symbol})</strong>`
      });

      bank.push({
        keyId: kb.id,
        keyLabel: kb.name,
        prompt: `ใน ${kb.name} (Harmonic Minor) • คอร์ด 7th ขั้นที่ 7 (vii°7) คือคอร์ดใด?`,
        chordNotes: chViiDim.notes,
        opts: [
          { k: chViiDim.symbol, t: `${chViiDim.symbol} (Full Diminished 7th)` },
          { k: `${Theory.formatPitchClass(harScale[6])}m7♭5`, t: `${Theory.formatPitchClass(harScale[6])}m7♭5 (Half Diminished)` },
          { k: `${Theory.formatPitchClass(harScale[6])}m7`, t: `${Theory.formatPitchClass(harScale[6])}m7 (Minor 7th)` },
          { k: `${Theory.formatPitchClass(harScale[6])}7`, t: `${Theory.formatPitchClass(harScale[6])}7 (Dominant 7th)` }
        ],
        answer: chViiDim.symbol,
        explain: `คอร์ดขั้นที่ 7 ใน Harmonic Minor เป็นโครงสร้าง Full Diminished (<code>1 ♭3 ♭5 ♭♭7</code>) คือ <strong>${chViiDim.symbol}</strong> ส่วนคอร์ดขั้นที่ 2 เป็น Half Diminished (${chIIHalf.symbol})`
      });

      bank.push({
        keyId: kb.id,
        keyLabel: kb.name,
        prompt: `เปรียบเทียบคู่ ii–V แบบ 7th Chord ในคีย์ Minor (${kb.name}) ข้อใดถูกต้อง?`,
        chordNotes: chIIHalf.notes,
        opts: [
          { k: 'iiø7_V7b9b13', t: `iiø7 – V7(♭9,♭13) (${chIIHalf.symbol} – ${chV7.symbol})` },
          { k: 'ii7_V7',       t: `ii7 – V7 (${Theory.formatPitchClass(harScale[1])}m7 – ${chV7.symbol})` },
          { k: 'iimaj7_V7',    t: `IImaj7 – V7` },
          { k: 'iv7_V',        t: `iv7 – V` }
        ],
        answer: 'iiø7_V7b9b13',
        explain: `ตามตารางเปรียบเทียบ Major กับ Minor: Major ใช้ <code>ii7 – V7</code> แต่ Minor ใช้ <strong>iiø7 – V7(♭9,♭13)</strong> (${chIIHalf.symbol} – ${chV7.symbol})`
      });

      bank.push({
        keyId: kb.id,
        keyLabel: kb.name,
        prompt: `ใน ${kb.name} โครงสร้าง Full Diminished 7th ต่างจาก Half Diminished อย่างไร?`,
        chordNotes: chViiDim.notes,
        opts: [
          { k: 'bb7', t: 'Full dim ใช้ ♭♭7 (1 ♭3 ♭5 ♭♭7) ส่วน Half dim ใช้ ♭7 (1 ♭3 ♭5 ♭7)' },
          { k: 'maj7', t: 'Full dim ใช้ 7 (Major 7th) ส่วน Half dim ใช้ ♭7' },
          { k: 'p5', t: 'Full dim ใช้ 5 (Perfect 5th) ส่วน Half dim ใช้ ♭5' },
          { k: 'm3', t: 'Full dim ใช้ 3 (Major 3rd) ส่วน Half dim ใช้ ♭3' }
        ],
        answer: 'bb7',
        explain: `กฎ Diminished ทั้ง 3 ชนิด: Triad = <code>1 ♭3 ♭5</code> | Half diminished = <code>1 ♭3 ♭5 ♭7</code> | Full diminished = <code>1 ♭3 ♭5 ♭♭7</code>`
      });
    });

    this.msQuizBank = bank;
  },

  nextMinorScaleQuiz() {
    const filter = document.getElementById('ms-key-filter')?.value || 'random';
    const pool = (filter === 'random') ? this.msQuizBank : this.msQuizBank.filter(q => q.keyId === filter);
    const q = pool[Math.floor(Math.random() * pool.length)];
    if (!q) return;
    this.currentMsQuiz = q;
    this.msAnswered = false;

    const badge = document.getElementById('ms-quiz-key-badge');
    if (badge) badge.textContent = `คีย์: ${q.keyLabel}`;
    const promptEl = document.getElementById('ms-quiz-prompt');
    if (promptEl) promptEl.textContent = q.prompt;

    const staffEl = document.getElementById('ms-quiz-staff');
    if (staffEl) {
      if (q.playNotes) {
        staffEl.innerHTML = q.svgHtml;
      } else if (q.chordNotes) {
        staffEl.innerHTML = '';
        const id = 'ms-quiz-chord-svg';
        staffEl.innerHTML = `<div id="${id}"></div>`;
        ChordLabRenderer.renderLessonExamples(id, [{ label: q.keyLabel, sublabel: 'คลิกฟังเสียง', notes: q.chordNotes }], 'window.advancedTheoryPages.playCurrentMsQuiz', 'treble');
      }
    }

    const fb = document.getElementById('ms-quiz-feedback');
    if (fb) fb.innerHTML = '';

    const optsEl = document.getElementById('ms-quiz-options');
    if (optsEl) {
      const shuffled = q.opts.slice().sort(() => Math.random() - 0.5);
      optsEl.innerHTML = shuffled.map(o => `
        <button class="btn btn-outline ms-choice-btn" data-val="${o.k}" onclick="window.advancedTheoryPages.submitMinorScaleQuiz('${o.k}')">${o.t}</button>
      `).join('');
    }
    TheoryPages.updateBadge('ms-stats-badge', this.msStats);
  },

  playCurrentMsQuiz() {
    if (!this.currentMsQuiz) return;
    if (this.currentMsQuiz.playNotes) TheoryPages.playScaleSequence(this.currentMsQuiz.playNotes, 0.34);
    else if (this.currentMsQuiz.chordNotes) TheoryPages.playChordList([this.currentMsQuiz.chordNotes]);
  },

  submitMinorScaleQuiz(val) {
    if (!this.currentMsQuiz || this.msAnswered) return;
    this.msAnswered = true;
    this.msStats.total += 1;
    const ok = val === this.currentMsQuiz.answer;
    if (ok) this.msStats.correct += 1;

    document.querySelectorAll('.ms-choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.val === this.currentMsQuiz.answer) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-success');
      } else if (btn.dataset.val === val && !ok) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-danger');
      }
    });

    const fb = document.getElementById('ms-quiz-feedback');
    if (fb) {
      fb.innerHTML = ok
        ? `<div class="issue-card" style="border-left:4px solid #16a34a; background:#f0fdf4;"><div class="issue-title" style="color:#15803d;">✅ ถูกต้อง!</div><div class="issue-detail">${this.currentMsQuiz.explain}</div></div>`
        : `<div class="issue-card error"><div class="issue-title">❌ ยังไม่ถูกต้อง</div><div class="issue-detail">${this.currentMsQuiz.explain}</div></div>`;
    }
    if (!ok) {
      TheoryPages.showQuizErrorPopup('.ms-choice-btn', val, this.currentMsQuiz.answer, `แบบฝึกหัด Minor Scale (${this.currentMsQuiz.keyLabel})`, this.currentMsQuiz.explain);
    }
    this.playCurrentMsQuiz();
    TheoryPages.updateBadge('ms-stats-badge', this.msStats);
  },

  // =========================================================================
  // 2) PAGE: MODE IN MELODIC MINOR (7 MODES & TENSIONS)
  // =========================================================================
  buildMelodicModeNotes(keyBase, modeIdx) {
    const melScale = this.getMinorScaleDegrees(keyBase, 'melodic');
    const startDeg = melScale[modeIdx % 7];
    const m = this.MELODIC_MODES[modeIdx % 7];
    return this.spellScaleFromRoot(startDeg.step, startDeg.alter || 0, m.semitones);
  },

  renderMelodicModesPage() {
    const sel = document.getElementById('mm-lesson-key');
    const keyId = sel ? sel.value : 'A_min';
    const keyBase = this.MINOR_KEY_BASES.find(k => k.id === keyId) || this.MINOR_KEY_BASES[0];

    const listEl = document.getElementById('mm-modes-list');
    if (!listEl) return;

    this.lessonMelodicModesCache = [];
    listEl.innerHTML = this.MELODIC_MODES.map((m, idx) => {
      const notes = this.buildMelodicModeNotes(keyBase, idx);
      this.lessonMelodicModesCache.push(notes);
      const rootName = Theory.formatPitchClass(notes[0]);
      const isDom = m.arpeggio.includes('dominant') || m.arpeggio.includes('7altered');
      const badgeStyle = isDom ? 'background:#fef3c7; color:#b45309;' : 'background:#ede9fe; color:#6d28d9;';
      return `
        <div class="mode-row-card">
          <div class="mode-row-info">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
              <span class="slot-rank-badge" style="background:#7c3aed;">${m.degreeLabel}</span>
              <strong style="font-size:1rem; color:#0f172a;">${rootName} ${m.name}</strong>
              <span style="font-size:0.74rem; padding:2px 8px; border-radius:999px; font-weight:700; ${badgeStyle}">Arpeggio: ${m.arpeggio}</span>
            </div>
            <div style="font-size:0.8rem; color:#1d4ed8; font-weight:700;">Formula: ${m.formula}</div>
            <div style="font-size:0.78rem; color:#475569;">Tetrachord: <strong>${m.tetrachord}</strong> | Tensions: <code>${m.tensions}</code></div>
          </div>
          <div class="mode-row-staff">
            ${TheoryPages.renderScaleSvg(notes, m.halfIdx)}
          </div>
          <button class="btn btn-success btn-sm mode-row-play-btn" onclick="window.advancedTheoryPages.playMelodicMode(${idx})">🔊 ฟัง</button>
        </div>
      `;
    }).join('');
  },

  playMelodicMode(idx) {
    if (this.lessonMelodicModesCache[idx]) TheoryPages.playScaleSequence(this.lessonMelodicModesCache[idx], 0.34);
  },

  buildMelodicModesBank() {
    const bank = [];
    this.MINOR_KEY_BASES.forEach(kb => {
      this.MELODIC_MODES.forEach((m, idx) => {
        const notes = this.buildMelodicModeNotes(kb, idx);
        const rootName = Theory.formatPitchClass(notes[0]);

        // Style 1: Identify Mode from degree/staff/sound
        const otherModes = this.MELODIC_MODES.filter(x => x.id !== m.id).sort(() => Math.random() - 0.5).slice(0, 3);
        bank.push({
          keyId: kb.id,
          keyLabel: `${kb.name} (${rootName})`,
          prompt: `โน้ตขั้นที่ ${m.degreeLabel} ของ ${kb.name.replace(' Minor', '')} Melodic Minor (เริ่มที่ ${rootName}) คือ Mode ใด?`,
          notes,
          halfIdx: m.halfIdx,
          opts: [m, ...otherModes].map(x => ({ k: x.id, t: `${x.name} (${x.degreeLabel})` })),
          answer: m.id,
          explain: `ขั้นที่ ${m.degreeLabel} ของ ${kb.name.replace(' Minor', '')} Melodic Minor คือ <strong>${rootName} ${m.name}</strong> สูตร <code>${m.formula}</code> | Arpeggio: <strong>${m.arpeggio}</strong> | Tetrachord: <strong>${m.tetrachord}</strong>`
        });

        // Style 2: Ask Arpeggio
        const arps = ['mM7', 'm7, m7(♭9)', 'M7(♯5)', 'dominant7, 7, 7(♯11)', 'dominant7, 7, 7(♭13)', 'dim, half dim, m7♭5', '7altered, 7(♭9), 7(♭9 ♯9)']
          .filter(a => a !== m.arpeggio).sort(() => Math.random() - 0.5).slice(0, 3);
        bank.push({
          keyId: kb.id,
          keyLabel: `${kb.name} (${rootName})`,
          prompt: `Mode <strong>${rootName} ${m.name}</strong> ใช้ Arpeggio / คอร์ดประจำโหมดแบบใด?`,
          notes,
          halfIdx: m.halfIdx,
          opts: [m.arpeggio, ...arps].map(a => ({ k: a, t: a })),
          answer: m.arpeggio,
          explain: `${m.name} มีสูตรโครงสร้าง <code>${m.formula}</code> จึงให้เสียงคอร์ด/Arpeggio เป็น <strong>${m.arpeggio}</strong> (Tensions: ${m.tensions})`
        });

        // Style 3: Ask Tetrachord
        const tetras = ['minor + major', 'phrygian + minor', 'wholetone + diminished', 'wholetone + minor', 'major + phrygian', 'minor + wholetone', 'diminished + wholetone']
          .filter(t => t !== m.tetrachord).sort(() => Math.random() - 0.5).slice(0, 3);
        bank.push({
          keyId: kb.id,
          keyLabel: `${kb.name} (${rootName})`,
          prompt: `โครงสร้าง Tetrachord ของ <strong>${rootName} ${m.name}</strong> (ขั้นที่ ${m.degreeLabel} ใน ${kb.name}) คือคู่ใด?`,
          notes,
          halfIdx: m.halfIdx,
          opts: [m.tetrachord, ...tetras].map(t => ({ k: t, t })),
          answer: m.tetrachord,
          explain: `${m.name} (${m.formula}) แบ่งครึ่งสเกลเป็น <strong>${m.tetrachord}</strong>`
        });
      });
    });
    this.mmQuizBank = bank;
  },

  nextMelodicModesQuiz() {
    const filter = document.getElementById('mm-key-filter')?.value || 'random';
    const pool = (filter === 'random') ? this.mmQuizBank : this.mmQuizBank.filter(q => q.keyId === filter);
    const q = pool[Math.floor(Math.random() * pool.length)];
    if (!q) return;
    this.currentMmQuiz = q;
    this.mmAnswered = false;

    const badge = document.getElementById('mm-quiz-key-badge');
    if (badge) badge.textContent = `คีย์: ${q.keyLabel}`;
    const promptEl = document.getElementById('mm-quiz-prompt');
    if (promptEl) promptEl.innerHTML = q.prompt;
    const staffEl = document.getElementById('mm-quiz-staff');
    if (staffEl) staffEl.innerHTML = TheoryPages.renderScaleSvg(q.notes, q.halfIdx);
    const fb = document.getElementById('mm-quiz-feedback');
    if (fb) fb.innerHTML = '';

    const optsEl = document.getElementById('mm-quiz-options');
    if (optsEl) {
      const shuffled = q.opts.slice().sort(() => Math.random() - 0.5);
      optsEl.innerHTML = shuffled.map(o => `
        <button class="btn btn-outline mm-choice-btn" data-val="${o.k}" onclick="window.advancedTheoryPages.submitMelodicModesQuiz('${o.k.replace(/'/g, "\\'")}')">${o.t}</button>
      `).join('');
    }
    TheoryPages.updateBadge('mm-stats-badge', this.mmStats);
  },

  playCurrentMmQuiz() {
    if (this.currentMmQuiz && this.currentMmQuiz.notes) {
      TheoryPages.playScaleSequence(this.currentMmQuiz.notes, 0.34);
    }
  },

  submitMelodicModesQuiz(val) {
    if (!this.currentMmQuiz || this.mmAnswered) return;
    this.mmAnswered = true;
    this.mmStats.total += 1;
    const ok = val === this.currentMmQuiz.answer;
    if (ok) this.mmStats.correct += 1;

    document.querySelectorAll('.mm-choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.val === this.currentMmQuiz.answer) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-success');
      } else if (btn.dataset.val === val && !ok) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-danger');
      }
    });

    const fb = document.getElementById('mm-quiz-feedback');
    if (fb) {
      fb.innerHTML = ok
        ? `<div class="issue-card" style="border-left:4px solid #16a34a; background:#f0fdf4;"><div class="issue-title" style="color:#15803d;">✅ ถูกต้อง!</div><div class="issue-detail">${this.currentMmQuiz.explain}</div></div>`
        : `<div class="issue-card error"><div class="issue-title">❌ ยังไม่ถูกต้อง</div><div class="issue-detail">${this.currentMmQuiz.explain}</div></div>`;
    }
    if (!ok) {
      TheoryPages.showQuizErrorPopup('.mm-choice-btn', val, this.currentMmQuiz.answer, `แบบฝึกหัด Mode in Melodic Minor (${this.currentMmQuiz.keyLabel})`, this.currentMmQuiz.explain);
    }
    this.playCurrentMmQuiz();
    TheoryPages.updateBadge('mm-stats-badge', this.mmStats);
  },

  // =========================================================================
  // 3) PAGE: SECONDARY DOMINANT
  // =========================================================================
  getSecDomDataForKey(keyId) {
    const scale = Theory.getScaleDegrees(keyId);
    // Targets: ii(1), iii(2), IV(3), V(4), vi(5)
    const targets = [
      { degIdx: 1, romanTarget: 'ii' },
      { degIdx: 2, romanTarget: 'iii' },
      { degIdx: 3, romanTarget: 'IV' },
      { degIdx: 4, romanTarget: 'V' },
      { degIdx: 5, romanTarget: 'vi' }
    ];
    return targets.map(t => {
      const targetRoot = scale[t.degIdx];
      // Dominant of target is P5 above target (step +4, semi +7) -> same as P4 below
      const domRoot = Theory.spellIntervalNote(targetRoot.step, targetRoot.alter || 0, 4, 4, 7);
      const ltNote = Theory.spellIntervalNote(domRoot.step, domRoot.alter || 0, 4, 2, 4); // M3 of dom = Leading tone to target
      const seventhNote = Theory.spellIntervalNote(domRoot.step, domRoot.alter || 0, 4, 6, 10); // m7 of dom
      const triadNotes = this.spellCustomChord(domRoot.step, domRoot.alter || 0, [0, 2, 4], [0, 4, 7], 4);
      const dom7Notes = this.spellCustomChord(domRoot.step, domRoot.alter || 0, [0, 2, 4, 6], [0, 4, 7, 10], 4);
      const halfDimNotes = this.spellCustomChord(ltNote.step, ltNote.alter || 0, [0, 2, 4, 6], [0, 3, 6, 10], 4);
      const fullDimNotes = this.spellCustomChord(ltNote.step, ltNote.alter || 0, [0, 2, 4, 6], [0, 3, 6, 9], 4);
      const targetNotes = this.spellCustomChord(targetRoot.step, targetRoot.alter || 0, [0, 2, 4], (t.romanTarget === 'IV' || t.romanTarget === 'V') ? [0, 4, 7] : [0, 3, 7], 4);

      return {
        romanTarget: t.romanTarget,
        targetSym: `${Theory.formatPitchClass(targetRoot)}${(t.romanTarget === 'IV' || t.romanTarget === 'V') ? '' : 'm'}`,
        triadRoman: `V/${t.romanTarget}`,
        dom7Roman: `V7/${t.romanTarget}`,
        triadSym: `${Theory.formatPitchClass(domRoot)}maj`,
        dom7Sym: `${Theory.formatPitchClass(domRoot)}7`,
        halfDimRoman: `viiø7/${t.romanTarget}`,
        halfDimSym: `${Theory.formatPitchClass(ltNote)}m7♭5`,
        fullDimRoman: `vii°7/${t.romanTarget}`,
        fullDimSym: `${Theory.formatPitchClass(ltNote)}°7`,
        ltName: Theory.formatPitchClass(ltNote),
        seventhName: Theory.formatPitchClass(seventhNote),
        triadNotes,
        dom7Notes,
        halfDimNotes,
        fullDimNotes,
        targetNotes
      };
    });
  },

  renderSecDomPage() {
    const keyId = document.getElementById('sd-lesson-key')?.value || 'C_maj';
    const items = this.getSecDomDataForKey(keyId);

    this.lessonSecDomTriadsCache = items.map(it => ({ label: it.triadSym, sublabel: it.triadRoman, notes: it.triadNotes }));
    this.lessonSecDomSeventhsCache = items.map(it => ({ label: it.dom7Sym, sublabel: it.dom7Roman, notes: it.dom7Notes }));

    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples('sd-triads-staff', this.lessonSecDomTriadsCache, 'window.advancedTheoryPages.playSecDomTriad', 'treble');
      ChordLabRenderer.renderLessonExamples('sd-sevenths-staff', this.lessonSecDomSeventhsCache, 'window.advancedTheoryPages.playSecDomSeventh', 'treble');

      const vOfV = items.find(i => i.romanTarget === 'V');
      if (vOfV) {
        this.lessonSecDomSubCache = [
          { label: `${vOfV.dom7Sym} → ${vOfV.targetSym}`, sublabel: 'V7/V (Dom7)', notes: vOfV.dom7Notes },
          { label: `${vOfV.halfDimSym} → ${vOfV.targetSym}`, sublabel: 'viiø7/V (m7♭5)', notes: vOfV.halfDimNotes },
          { label: `${vOfV.fullDimSym} → ${vOfV.targetSym}`, sublabel: 'vii°7/V (°7)', notes: vOfV.fullDimNotes }
        ];
        ChordLabRenderer.renderLessonExamples('sd-sub-staff', this.lessonSecDomSubCache, 'window.advancedTheoryPages.playSecDomSub', 'treble');
      }
    }
  },

  playSecDomTriad(idx) {
    if (this.lessonSecDomTriadsCache[idx]) TheoryPages.playChordList([this.lessonSecDomTriadsCache[idx].notes]);
  },

  playSecDomSeventh(idx) {
    if (this.lessonSecDomSeventhsCache[idx]) TheoryPages.playChordList([this.lessonSecDomSeventhsCache[idx].notes]);
  },

  playSecDomSub(idx) {
    const keyId = document.getElementById('sd-lesson-key')?.value || 'C_maj';
    const items = this.getSecDomDataForKey(keyId);
    const vOfV = items.find(i => i.romanTarget === 'V');
    if (this.lessonSecDomSubCache[idx] && vOfV) {
      TheoryPages.playChordList([this.lessonSecDomSubCache[idx].notes, vOfV.targetNotes]);
    }
  },

  playCircleChain() {
    const keyId = document.getElementById('sd-lesson-key')?.value || 'C_maj';
    const items = this.getSecDomDataForKey(keyId);
    const scale = Theory.getScaleDegrees(keyId);
    const v7Root = scale[4];
    const iRoot = scale[0];
    const order = ['iii', 'vi', 'ii', 'V'];
    const chain = order.map(r => items.find(i => i.romanTarget === r).dom7Notes);
    chain.push(this.spellCustomChord(v7Root.step, v7Root.alter || 0, [0, 2, 4, 6], [0, 4, 7, 10], 4));
    chain.push(this.spellCustomChord(iRoot.step, iRoot.alter || 0, [0, 2, 4], [0, 4, 7], 4));
    TheoryPages.playChordList(chain, 600);
  },

  buildSecDomBank() {
    const bank = [];
    Theory.TWELVE_MAJOR_KEYS.forEach(kId => {
      const kName = Theory.KEYS[kId].name;
      const items = this.getSecDomDataForKey(kId);

      // 5 questions: Given Secondary Dominant chord -> identify Roman numeral
      items.forEach(it => {
        const wrong = items.filter(x => x.romanTarget !== it.romanTarget).sort(() => Math.random() - 0.5).slice(0, 3);
        bank.push({
          keyId: kId,
          keyLabel: kName,
          prompt: `ในคีย์ <strong>${kName}</strong> • คอร์ด <strong>${it.dom7Sym}</strong> ที่ส่งเข้าหาคอร์ด <strong>${it.targetSym}</strong> มีสัญลักษณ์วิเคราะห์เป็นข้อใด?`,
          pair: [
            { label: it.dom7Sym, sublabel: 'Secondary Dom', notes: it.dom7Notes },
            { label: it.targetSym, sublabel: it.romanTarget, notes: it.targetNotes }
          ],
          opts: [it, ...wrong].map(x => ({ k: x.dom7Roman, t: `${x.dom7Roman} (ส่งเข้า ${x.targetSym})` })),
          answer: it.dom7Roman,
          explain: `ในคีย์ ${kName} คอร์ด ${it.targetSym} คือ ${it.romanTarget} ดังนั้นคอร์ด Dominant ที่อยู่เหนือขึ้นไปคู่ 5 คือ <strong>${it.dom7Sym} = ${it.dom7Roman}</strong> (มี Leading Tone ${it.ltName} ส่งเข้า ${it.targetSym})`
        });
      });

      // 2 questions: Leading Tone added note
      const vItem = items.find(i => i.romanTarget === 'V');
      const iiItem = items.find(i => i.romanTarget === 'ii');
      bank.push({
        keyId: kId,
        keyLabel: kName,
        prompt: `ในคีย์ <strong>${kName}</strong> • คอร์ด <strong>V7/V (${vItem.dom7Sym})</strong> เพิ่มโน้ต Leading Tone ตัวใดเพื่อส่งเข้าหาคอร์ด ${vItem.targetSym}?`,
        pair: [
          { label: vItem.dom7Sym, sublabel: 'V7/V', notes: vItem.dom7Notes },
          { label: vItem.targetSym, sublabel: 'V', notes: vItem.targetNotes }
        ],
        opts: [
          { k: vItem.ltName, t: `${vItem.ltName} (ขั้นที่ 3 ของ ${vItem.dom7Sym})` },
          { k: iiItem.ltName, t: iiItem.ltName },
          { k: vItem.seventhName, t: `${vItem.seventhName} (ตัว 7 Resolve ลงหา 3)` },
          { k: Theory.formatPitchClass(Theory.getScaleDegrees(kId)[0]), t: Theory.formatPitchClass(Theory.getScaleDegrees(kId)[0]) }
        ],
        answer: vItem.ltName,
        explain: `คอร์ด V7/V ในคีย์ ${kName} คือ ${vItem.dom7Sym} ซึ่งเพิ่มโน้ต <strong>${vItem.ltName}</strong> เป็น Leading Tone พุ่งขึ้นหา ${vItem.targetSym} และใช้ ${vItem.seventhName} เป็นตัว 7 Resolve 7→3`
      });

      // 2 questions: Substitution (Half-dim & Full-dim replacing V7/V)
      bank.push({
        keyId: kId,
        keyLabel: kName,
        prompt: `ในคีย์ <strong>${kName}</strong> • คอร์ด Half Diminished ใดที่ใช้แทน <strong>V7/V (${vItem.dom7Sym})</strong> ได้ (viiø7/V)?`,
        pair: [
          { label: vItem.halfDimSym, sublabel: 'viiø7/V', notes: vItem.halfDimNotes },
          { label: vItem.targetSym, sublabel: 'V', notes: vItem.targetNotes }
        ],
        opts: [
          { k: vItem.halfDimSym, t: `${vItem.halfDimSym} (viiø7/V)` },
          { k: vItem.fullDimSym, t: `${vItem.fullDimSym} (vii°7/V - Full dim)` },
          { k: iiItem.halfDimSym, t: `${iiItem.halfDimSym} (viiø7/ii)` },
          { k: `${vItem.targetSym}m7`, t: `${vItem.targetSym}m7` }
        ],
        answer: vItem.halfDimSym,
        explain: `จากหลัก V = vii ทำให้ <strong>V7/V (${vItem.dom7Sym})</strong> แทนด้วย Half Diminished <strong>${vItem.halfDimSym} (viiø7/V)</strong> ได้ (เพิ่ม Leading tone ${vItem.ltName} + ตัว Resolve 5–3)`
      });

      bank.push({
        keyId: kId,
        keyLabel: kName,
        prompt: `เมื่อแทน <strong>V7/V</strong> ด้วย Full Diminished <strong>${vItem.fullDimSym} (vii°7/V)</strong> จะมีแนวการ Resolve ใดเพิ่มขึ้นจากแบบ Half Diminished?`,
        pair: [
          { label: vItem.fullDimSym, sublabel: 'vii°7/V', notes: vItem.fullDimNotes },
          { label: vItem.targetSym, sublabel: 'V', notes: vItem.targetNotes }
        ],
        opts: [
          { k: '7to5', t: 'เพิ่มตัว Resolve 7 → 5 นอกเหนือจาก Leading tone และ 5 → 3' },
          { k: 'no_lt', t: 'ตัด Leading tone ออกทั้งหมด' },
          { k: 'root_up', t: 'โน้ตเบสกระโดดลงคู่ 5 เสมอ' },
          { k: 'only_triad', t: 'ลดรูปเหลือแค่ 3 โน้ต' }
        ],
        answer: '7to5',
        explain: `ตามตัวอย่าง Half-dim (${vItem.halfDimSym}) มี Leading tone + Resolve 5→3 แต่เมื่อใช้ <strong>Full Diminished (${vItem.fullDimSym})</strong> โน้ตที่ ♭♭7 จะช่วยเพิ่มตัว <strong>Resolve 7 → 5</strong> เข้าสู่คอร์ด ${vItem.targetSym} ด้วย`
      });

      // Why vii° has no V/vii°
      bank.push({
        keyId: kId,
        keyLabel: kName,
        prompt: `ในคีย์ <strong>${kName}</strong> • เพราะเหตุใดคอร์ดขั้นที่ 7 (vii°) จึงไม่นิยมสร้าง Secondary Dominant (V/vii°)?`,
        pair: [
          { label: vItem.dom7Sym, sublabel: 'V7/V', notes: vItem.dom7Notes },
          { label: vItem.targetSym, sublabel: 'V', notes: vItem.targetNotes }
        ],
        opts: [
          { k: 'dim_unstable', t: 'เพราะ vii° เป็นคอร์ด Diminished ไม่สามารถทำหน้าที่เป็น Tonic เป้าหมายที่มั่นคงได้' },
          { k: 'no_root', t: 'เพราะไม่มีโน้ตขั้นที่ 7 ใน Major Scale' },
          { k: 'only_minor', t: 'เพราะใช้ได้เฉพาะในสเกล Natural Minor' },
          { k: 'too_low', t: 'เพราะระดับเสียงต่ำกว่าช่วงเปียโน' }
        ],
        answer: 'dim_unstable',
        explain: `Secondary Dominant ใช้ส่งเข้าคอร์ดที่มีคุณภาพเป็น Major หรือ Minor (ii, iii, IV, V, vi) แต่คอร์ดขั้นที่ 7 (vii°) เป็น <strong>Diminished</strong> จึงไม่ทำหน้าที่เป็นเป้าหมาย Tonic ชั่วคราว`
      });
    });

    this.sdQuizBank = bank;
  },

  nextSecDomQuiz() {
    const filter = document.getElementById('sd-key-filter')?.value || 'random';
    const pool = (filter === 'random') ? this.sdQuizBank : this.sdQuizBank.filter(q => q.keyId === filter);
    const q = pool[Math.floor(Math.random() * pool.length)];
    if (!q) return;
    this.currentSdQuiz = q;
    this.sdAnswered = false;

    const badge = document.getElementById('sd-quiz-key-badge');
    if (badge) badge.textContent = `คีย์: ${q.keyLabel}`;
    const promptEl = document.getElementById('sd-quiz-prompt');
    if (promptEl) promptEl.innerHTML = q.prompt;
    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples('sd-quiz-staff', q.pair, 'window.advancedTheoryPages.playCurrentSdSingle', 'treble');
    }
    const fb = document.getElementById('sd-quiz-feedback');
    if (fb) fb.innerHTML = '';

    const optsEl = document.getElementById('sd-quiz-options');
    if (optsEl) {
      const shuffled = q.opts.slice().sort(() => Math.random() - 0.5);
      optsEl.innerHTML = shuffled.map(o => `
        <button class="btn btn-outline sd-choice-btn" data-val="${o.k}" onclick="window.advancedTheoryPages.submitSecDomQuiz('${o.k.replace(/'/g, "\\'")}')">${o.t}</button>
      `).join('');
    }
    TheoryPages.updateBadge('sd-stats-badge', this.sdStats);
  },

  playCurrentSdSingle(idx) {
    if (this.currentSdQuiz && this.currentSdQuiz.pair[idx]) {
      TheoryPages.playChordList([this.currentSdQuiz.pair[idx].notes]);
    }
  },

  playCurrentSdQuiz() {
    if (this.currentSdQuiz && this.currentSdQuiz.pair) {
      TheoryPages.playChordList(this.currentSdQuiz.pair.map(p => p.notes), 650);
    }
  },

  submitSecDomQuiz(val) {
    if (!this.currentSdQuiz || this.sdAnswered) return;
    this.sdAnswered = true;
    this.sdStats.total += 1;
    const ok = val === this.currentSdQuiz.answer;
    if (ok) this.sdStats.correct += 1;

    document.querySelectorAll('.sd-choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.val === this.currentSdQuiz.answer) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-success');
      } else if (btn.dataset.val === val && !ok) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-danger');
      }
    });

    const fb = document.getElementById('sd-quiz-feedback');
    if (fb) {
      fb.innerHTML = ok
        ? `<div class="issue-card" style="border-left:4px solid #16a34a; background:#f0fdf4;"><div class="issue-title" style="color:#15803d;">✅ ถูกต้อง!</div><div class="issue-detail">${this.currentSdQuiz.explain}</div></div>`
        : `<div class="issue-card error"><div class="issue-title">❌ ยังไม่ถูกต้อง</div><div class="issue-detail">${this.currentSdQuiz.explain}</div></div>`;
    }
    if (!ok) {
      TheoryPages.showQuizErrorPopup('.sd-choice-btn', val, this.currentSdQuiz.answer, `แบบฝึกหัด Secondary Dominant (${this.currentSdQuiz.keyLabel})`, this.currentSdQuiz.explain);
    }
    this.playCurrentSdQuiz();
    TheoryPages.updateBadge('sd-stats-badge', this.sdStats);
  },

  // =========================================================================
  // 4) PAGE: MODULATION (KEY RELATIONSHIPS, PIVOT, CHROMATIC MEDIANT)
  // =========================================================================
  getCloselyRelatedKeys(majorKeyId) {
    const idx = this.CIRCLE_MAJOR_ORDER.indexOf(majorKeyId);
    const scale = Theory.getScaleDegrees(majorKeyId);
    const domId = this.CIRCLE_MAJOR_ORDER[(idx + 1) % 12];
    const subId = this.CIRCLE_MAJOR_ORDER[(idx + 11) % 12];

    const majName = Theory.KEYS[majorKeyId].name;
    const domName = Theory.KEYS[domId].name;
    const subName = Theory.KEYS[subId].name;
    const relVi   = `${Theory.formatPitchClass(scale[5])} minor`; // relative of I
    const relIii  = `${Theory.formatPitchClass(scale[2])} minor`; // relative of V
    const relIi   = `${Theory.formatPitchClass(scale[1])} minor`; // relative of IV

    return {
      homeName: majName,
      domId, subId, domName, subName,
      relHome: relVi, relDom: relIii, relSub: relIi,
      allFive: [domName, subName, relVi, relIii, relIi],
      // Common-chord pivots with V key: I=IV, iii=vi, V=I, vi=ii
      pivotsWithDom: [
        { chord: Theory.formatPitchClass(scale[0]), inHome: 'I',   inNew: 'IV' },
        { chord: `${Theory.formatPitchClass(scale[2])}m`, inHome: 'iii', inNew: 'vi' },
        { chord: Theory.formatPitchClass(scale[4]), inHome: 'V',   inNew: 'I' },
        { chord: `${Theory.formatPitchClass(scale[5])}m`, inHome: 'vi',  inNew: 'ii' }
      ],
      foreignId: this.CIRCLE_MAJOR_ORDER[(idx + 6) % 12] // tritone away (6 diff)
    };
  },

  getChromaticMediantsForKey(majorKeyId) {
    const info = Theory.KEYS[majorKeyId];
    const rootNote = { step: info.root, alter: info.rootAlter || 0, octave: 4 };
    const homeChord = this.spellCustomChord(info.root, info.rootAlter || 0, [0, 2, 4], [0, 4, 7], 4);
    const homeName = Theory.formatPitchClass(rootNote);
    const home3rd = Theory.formatPitchClass(homeChord[1]);
    const home5th = Theory.formatPitchClass(homeChord[2]);

    // 4 chromatic mediants of Major: M3 up (e.g. E), m3 up (Eb), M3 down (Ab), m3 down (A)
    const specs = [
      { label: 'Major 3rd ขึ้น', stepOff: 2, semiOff: 4, common: home3rd, role: `3rd ของ ${homeName} = Root ของคีย์ใหม่` },
      { label: 'Minor 3rd ขึ้น', stepOff: 2, semiOff: 3, common: home5th, role: `5th ของ ${homeName} = 3rd ของคีย์ใหม่` },
      { label: 'Major 3rd ลง',  stepOff: 5, semiOff: 8, common: homeName, role: `Root ของ ${homeName} = 3rd ของคีย์ใหม่` },
      { label: 'Minor 3rd ลง',  stepOff: 5, semiOff: 9, common: home3rd, role: `3rd ของ ${homeName} = 5th ของคีย์ใหม่` }
    ];

    return specs.map(sp => {
      const targetRoot = Theory.spellIntervalNote(info.root, info.rootAlter || 0, 4, sp.stepOff, sp.semiOff);
      // Simplify double accidentals cleanly via pitch lookup if any
      const targetChord = this.spellCustomChord(targetRoot.step, targetRoot.alter || 0, [0, 2, 4], [0, 4, 7], 4);
      return {
        homeChord,
        homeName: `${homeName} Major`,
        targetName: `${Theory.formatPitchClass(targetRoot)} Major`,
        targetChord,
        intervalLabel: sp.label,
        commonTone: sp.common,
        roleDesc: sp.role
      };
    });
  },

  renderModulationPage() {
    const keyId = document.getElementById('mod-lesson-key')?.value || 'C_maj';
    const rel = this.getCloselyRelatedKeys(keyId);
    const cms = this.getChromaticMediantsForKey(keyId);

    const summaryEl = document.getElementById('mod-closely-summary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap:12px;">
          <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:12px;">
            <strong style="color:#1d4ed8;">คีย์ตั้งต้น: ${rel.homeName}</strong>
            <div style="font-size:0.84rem; color:#334155; margin-top:4px;">คีย์ที่สนิทกัน (Closely Related Keys) ทั้ง 5 คีย์ ได้แก่:</div>
            <ul style="margin:6px 0 0 18px; font-size:0.84rem; color:#0f172a;">
              <li><strong>V (ขวา +1):</strong> ${rel.domName} (Relative: ${rel.relDom})</li>
              <li><strong>IV (ซ้าย -1):</strong> ${rel.subName} (Relative: ${rel.relSub})</li>
              <li><strong>Relative ของคีย์หลัก:</strong> ${rel.relHome}</li>
            </ul>
          </div>
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:12px;">
            <strong style="color:#15803d;">คอร์ดร่วม (Common-Chord Pivot: ${rel.homeName} → ${rel.domName})</strong>
            <div style="font-size:0.84rem; color:#334155; margin-top:4px;">มี 4 คอร์ดที่เป็น Diatonic ร่วมกัน:</div>
            <ul style="margin:6px 0 0 18px; font-size:0.84rem; color:#0f172a;">
              ${rel.pivotsWithDom.map(p => `<li><strong>${p.chord}:</strong> เป็น <code>${p.inHome}</code> ใน ${rel.homeName} = <code>${p.inNew}</code> ใน ${rel.domName}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    const cmTableEl = document.getElementById('mod-cm-table');
    if (cmTableEl) {
      cmTableEl.innerHTML = `
        <table class="theory-table">
          <thead>
            <tr>
              <th>คีย์ตั้งต้น</th>
              <th>คีย์ปลายทาง</th>
              <th>ระยะห่างของ Root</th>
              <th>ประเภท</th>
              <th>โน้ตร่วม (Common Tone)</th>
              <th>ฟังเสียงเชื่อม</th>
            </tr>
          </thead>
          <tbody>
            ${cms.map((cm, idx) => `
              <tr>
                <td><strong>${cm.homeName}</strong></td>
                <td><strong style="color:#be185d;">${cm.targetName}</strong></td>
                <td>${cm.intervalLabel}</td>
                <td>Major → Major</td>
                <td><strong>โน้ต ${cm.commonTone}</strong> (${cm.roleDesc})</td>
                <td><button class="btn btn-success btn-xs" onclick="window.advancedTheoryPages.playModCmPair(${idx})">🔊 ฟังคู่คอร์ด</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    this.lessonModCmCache = cms;
    if (typeof ChordLabRenderer !== 'undefined' && cms[0]) {
      this.lessonModPivotCache = [
        { label: cms[0].homeName, sublabel: 'คีย์เดิม', notes: cms[0].homeChord },
        { label: cms[0].targetName, sublabel: `Common Tone: ${cms[0].commonTone}`, notes: cms[0].targetChord }
      ];
      ChordLabRenderer.renderLessonExamples('mod-cm-staff', this.lessonModPivotCache, 'window.advancedTheoryPages.playModCmStaff', 'treble');
    }
  },

  playModCmPair(idx) {
    if (this.lessonModCmCache[idx]) {
      const cm = this.lessonModCmCache[idx];
      TheoryPages.playChordList([cm.homeChord, cm.targetChord], 700);
    }
  },

  playModCmStaff(idx) {
    if (this.lessonModPivotCache[idx]) TheoryPages.playChordList([this.lessonModPivotCache[idx].notes]);
  },

  buildModulationBank() {
    const bank = [];
    Theory.TWELVE_MAJOR_KEYS.forEach(kId => {
      const rel = this.getCloselyRelatedKeys(kId);
      const cms = this.getChromaticMediantsForKey(kId);
      const foreignName = Theory.KEYS[rel.foreignId].name;

      // Q1-2: Closely related keys
      bank.push({
        keyId: kId,
        keyLabel: rel.homeName,
        prompt: `คีย์ใดต่อไปนี้ <strong>"เป็น"</strong> หนึ่งใน 5 Closely Related Keys (คีย์สนิท Key Sig ต่าง ≤ 1) ของคีย์ <strong>${rel.homeName}</strong>?`,
        pair: [
          { label: rel.homeName, sublabel: 'Home Key', notes: cms[0].homeChord },
          { label: cms[1].targetName, sublabel: 'เทียบระยะห่าง', notes: cms[1].targetChord }
        ],
        opts: [
          { k: rel.domName,     t: `${rel.domName} (คีย์ V • ต่าง 1 ขั้นใน Circle of Fifths)` },
          { k: foreignName,     t: `${foreignName} (ต่างกัน 6 เครื่องหมายแปลงเสียง)` },
          { k: cms[0].targetName, t: `${cms[0].targetName} (Chromatic Mediant)` },
          { k: cms[1].targetName, t: `${cms[1].targetName} (Chromatic Mediant)` }
        ],
        answer: rel.domName,
        explain: `Closely Related Keys ทั้ง 5 ของ ${rel.homeName} คือ <strong>${rel.allFive.join(', ')}</strong> (ใช้สูตร Circle of Fifths ซ้าย-ขวา + Relative) ส่วน ${foreignName} เป็น Foreign Key`
      });

      // Q3: Pivot chord role in V key modulation
      const pv = rel.pivotsWithDom[1]; // iii = vi (or V = I)
      bank.push({
        keyId: kId,
        keyLabel: rel.homeName,
        prompt: `ในการเปลี่ยนคีย์แบบ Diatonic Common-Chord จาก <strong>${rel.homeName} → ${rel.domName}</strong> คอร์ดเชื่อม <strong>${pv.chord}</strong> ทำหน้าที่เป็นคอร์ดใด?`,
        pair: [
          { label: rel.homeName, sublabel: `ในคีย์เดิม = ${pv.inHome}`, notes: cms[0].homeChord },
          { label: rel.domName,  sublabel: `ในคีย์ใหม่ = ${pv.inNew}`,  notes: cms[0].homeChord }
        ],
        opts: [
          { k: 'correct', t: `${pv.inHome} ใน ${rel.homeName} และเป็น ${pv.inNew} ใน ${rel.domName}` },
          { k: 'w1',      t: `I ใน ${rel.homeName} และเป็น V ใน ${rel.domName}` },
          { k: 'w2',      t: `V7/V ใน ${rel.homeName} (Altered Chord)` },
          { k: 'w3',      t: `ii° ใน ${rel.homeName} และเป็น VII ใน ${rel.domName}` }
        ],
        answer: 'correct',
        explain: `คอร์ด <strong>${pv.chord}</strong> อยู่ในทั้ง 2 คีย์โดยเป็น <strong>${pv.inHome}</strong> ใน ${rel.homeName} และเป็น <strong>${pv.inNew}</strong> ใน ${rel.domName} จึงใช้เป็นจุดหมุน (Pivot Chord) ได้อย่างแนบเนียน`
      });

      // Q4-5: Chromatic Mediant & Common Tone
      [cms[0], cms[1]].forEach(cm => {
        const wrongNotes = cm.homeChord.map(n => Theory.formatPitchClass(n)).filter(x => x !== cm.commonTone);
        bank.push({
          keyId: kId,
          keyLabel: rel.homeName,
          prompt: `คู่คีย์ <strong>${cm.homeName} ↔ ${cm.targetName}</strong> มีความสัมพันธ์แบบ <strong>Chromatic Mediant</strong> (${cm.intervalLabel}) — โน้ตตัวใดคือ <strong>โน้ตร่วม (Common Tone)</strong> เพียงตัวเดียวที่เชื่อมทั้งสองคีย์?`,
          pair: [
            { label: cm.homeName,   sublabel: 'Home Key', notes: cm.homeChord },
            { label: cm.targetName, sublabel: 'Chromatic Mediant', notes: cm.targetChord }
          ],
          opts: [
            { k: cm.commonTone, t: `โน้ต ${cm.commonTone} (${cm.roleDesc})` },
            { k: wrongNotes[0] || 'F♯', t: `โน้ต ${wrongNotes[0] || 'F♯'}` },
            { k: wrongNotes[1] || 'B♭', t: `โน้ต ${wrongNotes[1] || 'B♭'}` },
            { k: 'none', t: 'ไม่มีโน้ตร่วมเลย (Foreign Key ต้องใช้ Sequence)' }
          ],
          answer: cm.commonTone,
          explain: `${cm.homeName} และ ${cm.targetName} ห่างกันเป็นคู่ 3 และเป็น Major เหมือนกัน จึงเป็น <strong>Chromatic Mediant</strong> ที่มีโน้ตร่วม 1 ตัวคือ <strong>โน้ต ${cm.commonTone}</strong>`
        });
      });

      // Q6-8: Concepts (Enharmonic, Parallel/Change of Mode, Phrase, Altered Pivot)
      bank.push({
        keyId: kId,
        keyLabel: rel.homeName,
        prompt: `การเปลี่ยนระหว่างคีย์ <strong>${rel.homeName} → ${rel.homeName.replace('Major', 'minor')}</strong> (Tonic เดียวกัน) ในทางทฤษฎีเรียกว่าอะไร?`,
        pair: [
          { label: rel.homeName, sublabel: 'Parallel Major', notes: cms[0].homeChord },
          { label: rel.homeName.replace('Major', 'minor'), sublabel: 'Parallel Minor', notes: this.spellCustomChord(Theory.KEYS[kId].root, Theory.KEYS[kId].rootAlter || 0, [0, 2, 4], [0, 3, 7], 4) }
        ],
        opts: [
          { k: 'change_mode', t: 'Change of Mode (การเปลี่ยนบันไดเสียง • Parallel Keys)' },
          { k: 'enharmonic',  t: 'Enharmonically Equivalent (เสียงเหมือนเขียนต่าง)' },
          { k: 'sequential',  t: 'Sequential Modulation (ซีเควนซ์)' },
          { k: 'altered',     t: 'Altered Common-Chord Modulation' }
        ],
        answer: 'change_mode',
        explain: `คีย์ที่มี Tonic เดียวกันแต่เปลี่ยนชนิดสเกล (Major ↔ Minor) เรียกว่า Parallel Keys ซึ่งการเปลี่ยนแบบนี้เรียกว่า <strong>Change of Mode</strong> มากกว่าจะเรียกว่า Modulation`
      });

      bank.push({
        keyId: kId,
        keyLabel: rel.homeName,
        prompt: `การเปลี่ยนคีย์แบบจบประโยคแรกแล้วขึ้นประโยคใหม่ในคีย์ <strong>${foreignName}</strong> ทันทีตรงรอยต่อวลีโดยไม่มีคอร์ดเชื่อม เรียกว่าอะไร?`,
        pair: [
          { label: rel.homeName, sublabel: 'จบประโยค 1', notes: cms[0].homeChord },
          { label: foreignName,  sublabel: 'ขึ้นประโยค 2 ทันที', notes: cms[2].targetChord }
        ],
        opts: [
          { k: 'direct', t: 'Direct / Phrase Modulation (เปลี่ยนฉับพลันตรงรอยต่อวลี)' },
          { k: 'pivot',  t: 'Diatonic Common-Chord Modulation' },
          { k: 'mono',   t: 'Monophonic Modulation (โน้ตเดียว)' },
          { k: 'not_mod', t: 'Enharmonic Equivalent (ไม่ใช่ Modulation)' }
        ],
        answer: 'direct',
        explain: `เมื่อจบประโยคแล้วขึ้นคีย์ใหม่ทันทีตรงรอยต่อของวลี (Phrase) โดยไม่มี Pivot Chord หรือ Common Tone เลย เรียกว่า <strong>Direct Modulation / Phrase Modulation</strong>`
      });

      bank.push({
        keyId: kId,
        keyLabel: rel.homeName,
        prompt: `ในคีย์ <strong>${rel.homeName}</strong> • หากต้องการเชื่อมเข้าคีย์ <strong>${rel.domName}</strong> โดยใช้คอร์ดแปลงเสียง (Altered Chord) คอร์ดใดสามารถทำหน้าที่เป็น <strong>V7/V ใน ${rel.homeName}</strong> และเป็น <strong>V7 ใน ${rel.domName}</strong>?`,
        pair: [
          { label: rel.homeName, sublabel: 'คอร์ด V7/V ของคีย์เดิม', notes: cms[0].homeChord },
          { label: rel.domName,  sublabel: 'กลายเป็น V7 คีย์ใหม่',    notes: cms[0].targetChord }
        ],
        opts: [
          { k: 'v7_of_v', t: `คอร์ด V7/V ของ ${rel.homeName} (เช่นใน G→D คือ A7)` },
          { k: 'ii7',     t: `คอร์ด ii7 ของ ${rel.homeName}` },
          { k: 'iv_maj7', t: `คอร์ด IVmaj7 ของ ${rel.homeName}` },
          { k: 'enh',     t: `คอร์ด Enharmonic Equivalent ของคีย์หลัก` }
        ],
        answer: 'v7_of_v',
        explain: `เทคนิค Altered Chords as Common Chords นิยมใช้ <strong>V7/V</strong> ของคีย์เดิม (ซึ่งก็คือ V7 แท้ของคีย์ ${rel.domName}) มาเป็นตัวเชื่อมส่งเข้า Tonic ใหม่ได้อย่างลงตัว`
      });

      bank.push({
        keyId: kId,
        keyLabel: rel.homeName,
        prompt: `ในขั้นตอนการวิเคราะห์ Modulation เมื่อเจอคอร์ดแรกของคีย์ใหม่แล้ว ขั้นตอนถัดไปต้องทำอย่างไร?`,
        pair: [
          { label: rel.homeName, sublabel: 'คีย์เดิม', notes: cms[0].homeChord },
          { label: rel.domName,  sublabel: 'คีย์ใหม่', notes: cms[0].targetChord }
        ],
        opts: [
          { k: 'step_back', t: 'ถอยหลัง 1 คอร์ดเพื่อตรวจว่าเป็น Common Chord, Common Tone หรือ Phrase Modulation' },
          { k: 'skip_end',  t: 'ข้ามไปดูโน้ตสุดท้ายของทั้งเพลงเลย' },
          { k: 'check_ts',  t: 'ดูเฉพาะ Time Signature' },
          { k: 'count_bar', t: 'นับเฉพาะจำนวนห้องเพลง' }
        ],
        answer: 'step_back',
        explain: `ขั้นตอนวิเคราะห์ 3 ขั้น: 1) ฟังหาจุดเปลี่ยนสีสัน → 2) หาคอร์ดแรกของคีย์ใหม่ → 3) <strong>ถอยหลังมา 1 คอร์ด</strong> เพื่อระบุว่าเป็น Common Chord, Common Tone/Chromatic Mediant หรือ Direct/Phrase Modulation`
      });
    });

    this.modQuizBank = bank;
  },

  nextModulationQuiz() {
    const filter = document.getElementById('mod-key-filter')?.value || 'random';
    const pool = (filter === 'random') ? this.modQuizBank : this.modQuizBank.filter(q => q.keyId === filter);
    const q = pool[Math.floor(Math.random() * pool.length)];
    if (!q) return;
    this.currentModQuiz = q;
    this.modAnswered = false;

    const badge = document.getElementById('mod-quiz-key-badge');
    if (badge) badge.textContent = `คีย์: ${q.keyLabel}`;
    const promptEl = document.getElementById('mod-quiz-prompt');
    if (promptEl) promptEl.innerHTML = q.prompt;
    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples('mod-quiz-staff', q.pair, 'window.advancedTheoryPages.playCurrentModSingle', 'treble');
    }
    const fb = document.getElementById('mod-quiz-feedback');
    if (fb) fb.innerHTML = '';

    const optsEl = document.getElementById('mod-quiz-options');
    if (optsEl) {
      const shuffled = q.opts.slice().sort(() => Math.random() - 0.5);
      optsEl.innerHTML = shuffled.map(o => `
        <button class="btn btn-outline mod-choice-btn" data-val="${o.k}" onclick="window.advancedTheoryPages.submitModulationQuiz('${o.k.replace(/'/g, "\\'")}')">${o.t}</button>
      `).join('');
    }
    TheoryPages.updateBadge('mod-stats-badge', this.modStats);
  },

  playCurrentModSingle(idx) {
    if (this.currentModQuiz && this.currentModQuiz.pair[idx]) {
      TheoryPages.playChordList([this.currentModQuiz.pair[idx].notes]);
    }
  },

  playCurrentModQuiz() {
    if (this.currentModQuiz && this.currentModQuiz.pair) {
      TheoryPages.playChordList(this.currentModQuiz.pair.map(p => p.notes), 700);
    }
  },

  submitModulationQuiz(val) {
    if (!this.currentModQuiz || this.modAnswered) return;
    this.modAnswered = true;
    this.modStats.total += 1;
    const ok = val === this.currentModQuiz.answer;
    if (ok) this.modStats.correct += 1;

    document.querySelectorAll('.mod-choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.val === this.currentModQuiz.answer) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-success');
      } else if (btn.dataset.val === val && !ok) {
        btn.classList.remove('btn-outline'); btn.classList.add('btn-danger');
      }
    });

    const fb = document.getElementById('mod-quiz-feedback');
    if (fb) {
      fb.innerHTML = ok
        ? `<div class="issue-card" style="border-left:4px solid #16a34a; background:#f0fdf4;"><div class="issue-title" style="color:#15803d;">✅ ถูกต้อง!</div><div class="issue-detail">${this.currentModQuiz.explain}</div></div>`
        : `<div class="issue-card error"><div class="issue-title">❌ ยังไม่ถูกต้อง</div><div class="issue-detail">${this.currentModQuiz.explain}</div></div>`;
    }
    if (!ok) {
      TheoryPages.showQuizErrorPopup('.mod-choice-btn', val, this.currentModQuiz.answer, `แบบฝึกหัด Modulation (${this.currentModQuiz.keyLabel})`, this.currentModQuiz.explain);
    }
    this.playCurrentModQuiz();
    TheoryPages.updateBadge('mod-stats-badge', this.modStats);
  }
};

window.AdvancedTheoryPages = AdvancedTheoryPages;
