/**
 * Four-Part Harmony Grader - Chord Spelling & Inversions Lab
 * จัดการหน้าบทเรียนและแบบฝึกหัด:
 * 1. โน้ตในคอร์ด 12 คีย์ (Triads & 7th Chords: Major, Minor, Diminished, Augmented)
 * 2. การพลิกกลับของ Triad และ 7th Chord (Root, 1st, 2nd, 3rd Inversions)
 */

class ChordLabController {
  constructor(mode) {
    this.mode = mode; // 'chords' | 'inversions'
    this.prefix = mode === 'chords' ? 'cl' : 'inv';
    this.selectedNoteIndex = 0;
    this.userNotes = [];
    this.currentQuestion = null;
    this.stats = { correct: 0, total: 0 };
    this.pianoOpen = true;

    this.triadLessonExamples = [];
    this.seventhLessonExamples = [];
  }

  init() {
    this.populateFilters();
    this.renderLessons();
    this.renderPianoKeyboard();
    this.generateQuestion();
  }

  populateFilters() {
    const rootSel = document.getElementById(`${this.prefix}-root-filter`);
    if (rootSel) {
      let html = `<option value="random">🎲 สุ่มทั้ง 12 คีย์</option>`;
      Theory.TWELVE_ROOTS.forEach(r => {
        const display = r.altLabel || r.label;
        html += `<option value="${r.id}">${display}</option>`;
      });
      rootSel.innerHTML = html;
    }
  }

  // =========================================================================
  // ส่วนบทเรียนและโน้ตตัวอย่างบนบรรทัด 5 เส้น
  // =========================================================================
  renderLessons() {
    const cRoot = Theory.TWELVE_ROOTS[0]; // C

    if (this.mode === 'chords') {
      this.triadLessonExamples = [
        { label: 'C (Major)', sublabel: 'M3 + m3', notes: Theory.buildChordNotes(cRoot, 'triad_maj', 0, 4) },
        { label: 'Cm (Minor)', sublabel: 'm3 + M3', notes: Theory.buildChordNotes(cRoot, 'triad_min', 0, 4) },
        { label: 'C° (Dim)', sublabel: 'm3 + m3', notes: Theory.buildChordNotes(cRoot, 'triad_dim', 0, 4) },
        { label: 'C+ (Aug)', sublabel: 'M3 + M3', notes: Theory.buildChordNotes(cRoot, 'triad_aug', 0, 4) }
      ];

      this.seventhLessonExamples = [
        { label: 'Cmaj7', sublabel: 'Maj + M7', notes: Theory.buildChordNotes(cRoot, 'sev_maj', 0, 4) },
        { label: 'Cm7', sublabel: 'Min + m7', notes: Theory.buildChordNotes(cRoot, 'sev_min', 0, 4) },
        { label: 'C°7', sublabel: 'Dim + d7', notes: Theory.buildChordNotes(cRoot, 'sev_dim', 0, 4) },
        { label: 'C+7', sublabel: 'Aug + m7', notes: Theory.buildChordNotes(cRoot, 'sev_aug', 0, 4) }
      ];

      ChordLabRenderer.renderLessonExamples(
        `${this.prefix}-lesson-triads-staff`,
        this.triadLessonExamples,
        `window.chordLabChords.playLessonTriad`
      );
      ChordLabRenderer.renderLessonExamples(
        `${this.prefix}-lesson-sevenths-staff`,
        this.seventhLessonExamples,
        `window.chordLabChords.playLessonSeventh`
      );
    } else {
      // หน้า Inversions (วาดบนบรรทัด 5 เส้นเดียว Treble Clef)
      this.triadLessonExamples = [
        { label: 'C (Root)', sublabel: 'Bass: C (Root)', notes: Theory.buildChordNotes(cRoot, 'triad_maj', 0, 4) },
        { label: 'C/E (6)', sublabel: '1st Inv: Bass E', notes: Theory.buildChordNotes(cRoot, 'triad_maj', 1, 4) },
        { label: 'C/G (6/4)', sublabel: '2nd Inv: Bass G', notes: Theory.buildChordNotes(cRoot, 'triad_maj', 2, 4) }
      ];

      this.seventhLessonExamples = [
        { label: 'Cmaj7 (7)', sublabel: 'Root: Bass C', notes: Theory.buildChordNotes(cRoot, 'sev_maj', 0, 4) },
        { label: 'Cmaj7/E (6/5)', sublabel: '1st: Bass E', notes: Theory.buildChordNotes(cRoot, 'sev_maj', 1, 4) },
        { label: 'Cmaj7/G (4/3)', sublabel: '2nd: Bass G', notes: Theory.buildChordNotes(cRoot, 'sev_maj', 2, 4) },
        { label: 'Cmaj7/B (4/2)', sublabel: '3rd: Bass B', notes: Theory.buildChordNotes(cRoot, 'sev_maj', 3, 3) }
      ];

      ChordLabRenderer.renderLessonExamples(
        `${this.prefix}-lesson-triads-staff`,
        this.triadLessonExamples,
        `window.chordLabInversions.playLessonTriad`,
        'treble'
      );
      ChordLabRenderer.renderLessonExamples(
        `${this.prefix}-lesson-sevenths-staff`,
        this.seventhLessonExamples,
        `window.chordLabInversions.playLessonSeventh`,
        'treble'
      );
    }
  }

  playLessonTriad(idx) {
    const ex = this.triadLessonExamples[idx];
    if (ex) this.playNotesArray(ex.notes);
  }

  playLessonSeventh(idx) {
    const ex = this.seventhLessonExamples[idx];
    if (ex) this.playNotesArray(ex.notes);
  }

  getAudio() {
    if (window.harmonyApp && window.harmonyApp.audio) {
      return window.harmonyApp.audio;
    }
    if (!this._fallbackAudio && typeof HarmonyAudio !== 'undefined') {
      this._fallbackAudio = new HarmonyAudio();
    }
    return this._fallbackAudio || null;
  }

  playNotesArray(notes) {
    const audio = this.getAudio();
    if (!audio || !notes || notes.length === 0) return;
    audio.initContext();
    const now = audio.ctx.currentTime;
    notes.forEach((n, idx) => {
      const midi = Theory.noteToMidi(n);
      if (midi) {
        const freq = audio.midiToFreq(midi);
        const gain = idx === 0 ? 0.25 : 0.22;
        audio.synthVoice(freq, now, 1.5, gain);
      }
    });
  }

  // =========================================================================
  // ส่วนแบบฝึกหัดและการสุ่มโจทย์ 12 คีย์ x 4 ชนิด
  // =========================================================================
  generateQuestion() {
    const catFilter = document.getElementById(`${this.prefix}-category-filter`)?.value || 'all';
    const rootFilter = document.getElementById(`${this.prefix}-root-filter`)?.value || 'random';
    const qualFilter = document.getElementById(`${this.prefix}-quality-filter`)?.value || 'all';
    const invFilter = document.getElementById(`${this.prefix}-inv-filter`)?.value || 'random';
    const clefFilter = document.getElementById(`${this.prefix}-clef-filter`)?.value || 'random';

    // สุ่มกุญแจ (Clef): แสดง 1 ชนิดต่อข้อ ('treble' หรือ 'bass')
    const clef = clefFilter === 'random'
      ? (Math.random() < 0.5 ? 'treble' : 'bass')
      : clefFilter;

    // เลือก Root
    let rootObj;
    if (rootFilter === 'random') {
      rootObj = Theory.TWELVE_ROOTS[Math.floor(Math.random() * Theory.TWELVE_ROOTS.length)];
    } else {
      rootObj = Theory.TWELVE_ROOTS.find(r => r.id === rootFilter) || Theory.TWELVE_ROOTS[0];
    }

    // เลือก Quality
    const allQuals = Object.values(Theory.CHORD_QUALITIES);
    let pool = allQuals.filter(q => {
      if (catFilter !== 'all' && q.category !== catFilter) return false;
      if (qualFilter !== 'all') {
        return q.key.endsWith(`_${qualFilter}`);
      }
      return true;
    });
    if (pool.length === 0) pool = allQuals;
    const quality = pool[Math.floor(Math.random() * pool.length)];

    // เลือก Inversion
    let invIndex = 0;
    if (this.mode === 'inversions') {
      const maxInv = quality.category === 'triad' ? 2 : 3;
      if (invFilter === 'random') {
        invIndex = Math.floor(Math.random() * (maxInv + 1));
      } else {
        const parsed = parseInt(invFilter, 10);
        invIndex = Math.min(isNaN(parsed) ? 0 : parsed, maxInv);
      }
    }

    // จัดวาง Octave ของเฉลยให้เหมาะสมกับ Clef ที่สุ่มได้ (อยู่ในบรรทัด 5 เส้นสวยๆ)
    let baseOctave = 4;
    if (clef === 'bass') {
      baseOctave = Theory.NOTE_SEMITONES[rootObj.step] >= 7 ? 2 : 3;
    }
    const expectedNotes = Theory.buildChordNotes(rootObj, quality.key, invIndex, baseOctave);
    const lowestMidi = Theory.noteToMidi(expectedNotes[0]);
    if (clef === 'treble' && lowestMidi >= 70) {
      expectedNotes.forEach(n => { n.octave -= 1; });
    } else if (clef === 'bass' && lowestMidi >= 54) {
      expectedNotes.forEach(n => { n.octave -= 1; });
    }

    const invMeta = Theory.INVERSIONS[quality.category][invIndex];

    const baseSymbol = `${rootObj.label}${quality.symbolSuffix}`;
    this.currentQuestion = {
      clef,
      rootObj,
      quality,
      invIndex,
      invMeta,
      expectedNotes,
      chordSymbol: `${baseSymbol}${this.mode === 'inversions' && invMeta.figure ? ' ' + invMeta.figure : ''}`,
      chordHtml: this.formatChordSymbolHtml(baseSymbol, quality.category, invIndex)
    };

    // ตั้งค่าโน้ตเริ่มต้นให้นักเรียนแก้ไขในระดับ Octave ที่ตรงกับ Clef (เรียงล่างขึ้นบน)
    const startOct = clef === 'treble' ? 4 : 3;
    const noteCount = expectedNotes.length;
    this.userNotes = [
      { step: 'C', alter: 0, octave: startOct },
      { step: 'E', alter: 0, octave: startOct },
      { step: 'G', alter: 0, octave: startOct },
      { step: 'B', alter: 0, octave: startOct }
    ].slice(0, noteCount);
    this.selectedNoteIndex = 0;

    this.renderQuestionBanner();
    this.renderVoiceTabs();
    this.renderAll();
    this.clearFeedback();
  }

  formatChordSymbolHtml(baseSymbol, category, invIndex) {
    if (this.mode !== 'inversions') return baseSymbol;
    if (category === 'triad') {
      if (invIndex === 0) return baseSymbol;
      if (invIndex === 1) return `${baseSymbol}<span class="fig-stack-chip"><span>6</span></span>`;
      if (invIndex === 2) return `${baseSymbol}<span class="fig-stack-chip"><span>6</span><span>4</span></span>`;
    } else {
      const rootQual = baseSymbol.endsWith('7') ? baseSymbol.slice(0, -1) : baseSymbol;
      if (invIndex === 0) return `${rootQual}<span class="fig-stack-chip"><span>7</span></span>`;
      if (invIndex === 1) return `${rootQual}<span class="fig-stack-chip"><span>6</span><span>5</span></span>`;
      if (invIndex === 2) return `${rootQual}<span class="fig-stack-chip"><span>4</span><span>3</span></span>`;
      if (invIndex === 3) return `${rootQual}<span class="fig-stack-chip"><span>4</span><span>2</span></span>`;
    }
    return baseSymbol;
  }

  renderQuestionBanner() {
    const q = this.currentQuestion;
    if (!q) return;

    const titleEl = document.getElementById(`${this.prefix}-question-title`);
    const subEl = document.getElementById(`${this.prefix}-question-subtitle`);
    const statsEl = document.getElementById(`${this.prefix}-stats-badge`);
    const clefText = q.clef === 'bass' ? '𝄢 กุญแจฟา (Bass Clef)' : '𝄞 กุญแจซอล (Treble Clef)';

    if (titleEl) {
      titleEl.className = 'question-banner-title';
      titleEl.innerHTML = `<span>โจทย์: จงเขียนโน้ตคอร์ด</span> <span class="question-chord-chip">${q.chordHtml || q.chordSymbol}</span> <span class="question-quality-tag">${q.quality.nameTh}</span> <span class="question-clef-chip">${clefText}</span>`;
    }
    if (subEl) {
      subEl.className = 'question-banner-subtitle';
      if (this.mode === 'chords') {
        subEl.innerHTML = `โครงสร้าง: <strong>${q.quality.formula}</strong> • วางโน้ต ${q.expectedNotes.length} ตัวเรียงลำดับจาก <strong>ล่าง → บน (ตัวที่ 1 คือ Root)</strong>`;
      } else {
        const bassNoteName = Theory.formatPitchClass(q.expectedNotes[0]);
        subEl.innerHTML = `ตำแหน่ง: <strong>${q.invMeta.label}</strong> • ตัวที่ 1 (Bass ล่างสุด) ต้องเป็นเสียง <strong>${q.invMeta.bassRole}</strong> (${bassNoteName})`;
      }
    }
    if (statsEl) {
      statsEl.textContent = `คะแนนสะสม: ${this.stats.correct} / ${this.stats.total} ข้อ`;
    }
  }

  getSlotRoles() {
    const q = this.currentQuestion;
    const isSeventh = q ? q.quality.category === 'seventh' : (this.userNotes.length === 4);
    const baseRoles = isSeventh ? ['Root', '3rd', '5th', '7th'] : ['Root', '3rd', '5th'];
    if (this.mode !== 'inversions' || !q) {
      return baseRoles;
    }
    const inv = q.invIndex % baseRoles.length;
    return [...baseRoles.slice(inv), ...baseRoles.slice(0, inv)];
  }

  renderVoiceTabs() {
    const wrap = document.getElementById(`${this.prefix}-note-tabs`);
    if (!wrap) return;

    const roles = this.getSlotRoles();
    const colors = ChordLabRenderer.NOTE_COLORS;
    const total = this.userNotes.length;

    let html = '';
    this.userNotes.forEach((n, idx) => {
      const isActive = idx === this.selectedNoteIndex;
      const isBass = idx === 0;
      const role = roles[idx] || `ตัวที่ ${idx + 1}`;
      const subHint = isBass
        ? (this.mode === 'chords' ? '★ ฐานคอร์ด (ล่างสุด)' : '★ เบส (ล่างสุด)')
        : (idx === total - 1 ? `ลำดับที่ ${idx + 1} (บนสุด)` : `ลำดับที่ ${idx + 1}`);

      html += `
        <button class="note-slot-btn ${isBass ? 'is-bass-slot' : ''} ${isActive ? 'active' : ''}" data-note-idx="${idx}" onclick="window.${this.globalName()}.selectNoteIndex(${idx})">
          <span class="slot-rank-badge" style="background: ${colors[idx]};">${idx + 1}</span>
          <span class="slot-role-group">
            <span class="slot-role-label">${role}</span>
            <span class="slot-sub-hint">${subHint}</span>
          </span>
          <span class="slot-note-pill">${Theory.formatNoteName(n)}</span>
        </button>
      `;
    });
    wrap.innerHTML = html;
  }

  globalName() {
    return this.mode === 'chords' ? 'chordLabChords' : 'chordLabInversions';
  }

  selectNoteIndex(idx) {
    if (idx < 0 || idx >= this.userNotes.length) return;
    this.selectedNoteIndex = idx;
    const n = this.userNotes[idx];
    const audio = this.getAudio();
    if (n && audio) {
      audio.playNote(n, 0.6);
    }
    this.renderVoiceTabs();
    this.renderAll();
  }

  renderAll() {
    const clef = this.currentQuestion ? this.currentQuestion.clef : 'treble';
    ChordLabRenderer.renderExerciseStaff(
      `${this.prefix}-staff-container`,
      this.userNotes,
      this.selectedNoteIndex,
      `window.${this.globalName()}.selectNoteIndex`,
      clef
    );
    this.updateEditorUI();
  }

  updateEditorUI() {
    const note = this.userNotes[this.selectedNoteIndex];
    if (!note) return;

    const roles = this.getSlotRoles();
    const roleName = roles[this.selectedNoteIndex] || '';
    const badge = document.getElementById(`${this.prefix}-editing-badge`);
    if (badge) {
      badge.textContent = `กำลังแก้ไข: ตัวที่ ${this.selectedNoteIndex + 1} (${roleName}) • ${Theory.formatNoteName(note)}`;
      badge.style.background = ChordLabRenderer.NOTE_COLORS[this.selectedNoteIndex];
    }

    const panel = document.getElementById(`${this.prefix}-editor-panel`);
    if (!panel) return;

    panel.querySelectorAll('.pitch-step-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.step === note.step);
    });
    panel.querySelectorAll('.pitch-alter-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.alter, 10) === (note.alter || 0));
    });
    panel.querySelectorAll('.pitch-oct-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.octave, 10) === note.octave);
    });

    const currentMidi = Theory.noteToMidi(note);
    const pianoWrap = document.getElementById(`${this.prefix}-piano-container`);
    if (pianoWrap) {
      pianoWrap.querySelectorAll('.piano-key').forEach(k => {
        k.classList.toggle('active-pitch', parseInt(k.dataset.midi, 10) === currentMidi);
      });
    }
  }

  setStep(step) {
    const n = this.userNotes[this.selectedNoteIndex];
    if (!n) return;
    n.step = step;
    this.afterNoteEdit();
  }

  setAlter(alter) {
    const n = this.userNotes[this.selectedNoteIndex];
    if (!n) return;
    n.alter = alter;
    this.afterNoteEdit();
  }

  setOctave(oct) {
    const n = this.userNotes[this.selectedNoteIndex];
    if (!n) return;
    n.octave = oct;
    this.afterNoteEdit();
  }

  shiftSemitone(delta) {
    const n = this.userNotes[this.selectedNoteIndex];
    if (!n) return;
    const newMidi = Math.max(36, Math.min(79, Theory.noteToMidi(n) + delta));
    this.setNoteFromMidi(newMidi);
  }

  setNoteFromMidi(midi) {
    const n = this.userNotes[this.selectedNoteIndex];
    if (!n) return;
    const pc = ((midi % 12) + 12) % 12;
    const oct = Math.floor(midi / 12) - 1;
    const map = [
      { step: 'C', alter: 0 }, { step: 'C', alter: 1 }, { step: 'D', alter: 0 },
      { step: 'E', alter: -1 }, { step: 'E', alter: 0 }, { step: 'F', alter: 0 },
      { step: 'F', alter: 1 }, { step: 'G', alter: 0 }, { step: 'A', alter: -1 },
      { step: 'A', alter: 0 }, { step: 'B', alter: -1 }, { step: 'B', alter: 0 }
    ];
    n.step = map[pc].step;
    n.alter = map[pc].alter;
    n.octave = oct;
    this.afterNoteEdit();
  }

  afterNoteEdit() {
    const n = this.userNotes[this.selectedNoteIndex];
    const audio = this.getAudio();
    if (n && audio) {
      audio.playNote(n, 0.9);
    }
    this.renderVoiceTabs();
    this.renderAll();
  }

  playUserChord() {
    this.playNotesArray(this.userNotes);
  }

  playTargetChord() {
    if (this.currentQuestion) {
      this.playNotesArray(this.currentQuestion.expectedNotes);
    }
  }

  showSolution() {
    if (!this.currentQuestion) return;
    this.userNotes = this.currentQuestion.expectedNotes.map(n => ({ ...n }));
    this.renderVoiceTabs();
    this.renderAll();
    this.playTargetChord();

    const fb = document.getElementById(`${this.prefix}-feedback`);
    if (fb) {
      const names = this.currentQuestion.expectedNotes.map(n => Theory.formatNoteName(n)).join(' – ');
      fb.innerHTML = `
        <div class="issue-card warning">
          <div class="issue-title">💡 แสดงเฉลย: ${this.currentQuestion.chordSymbol}</div>
          <div class="issue-detail">โน้ตที่ถูกต้อง (ล่างขึ้นบน): <strong>${names}</strong></div>
        </div>
      `;
    }
  }

  clearFeedback() {
    const fb = document.getElementById(`${this.prefix}-feedback`);
    if (fb) {
      fb.innerHTML = `<div style="color:#64748b; font-size:0.88rem;">เลือกวางโน้ตบนบรรทัด 5 เส้น แล้วกด <strong>"🔍 ตรวจคำตอบ"</strong></div>`;
    }
  }

  checkAnswer() {
    if (!this.currentQuestion) return;
    const expected = this.currentQuestion.expectedNotes;
    const actualSorted = [...this.userNotes].sort((a, b) => Theory.noteToMidi(a) - Theory.noteToMidi(b));
    const issues = [];

    // 1. ตรวจลำดับเสียงและระยะโน้ตเทียบกับเฉลยทีละตำแหน่ง
    for (let i = 0; i < expected.length; i++) {
      const exp = expected[i];
      const act = actualSorted[i];
      const expPc = ((Theory.noteToMidi(exp) % 12) + 12) % 12;
      const actPc = ((Theory.noteToMidi(act) % 12) + 12) % 12;

      if (expPc !== actPc) {
        issues.push(`❌ ตัวที่ ${i + 1} (จากล่างขึ้นบน): คุณใส่ <strong>${Theory.formatNoteName(act)}</strong> แต่คอร์ดนี้ต้องเป็นเสียง <strong>${Theory.formatPitchClass(exp)}</strong>`);
      } else if (act.step !== exp.step || (act.alter || 0) !== (exp.alter || 0)) {
        issues.push(`⚠️ ตัวที่ ${i + 1}: เสียงตรงกันแต่สะกดตัวโน้ตไม่ตรงตามหลักทฤษฎี — คุณใส่ <strong>${Theory.formatPitchClass(act)}</strong> ควรสะกดเป็น <strong>${Theory.formatPitchClass(exp)}</strong>`);
      }
    }

    // 1.5 ตรวจช่วงระดับเสียงให้เหมาะสมกับกุญแจ (Clef) ที่โจทย์กำหนด
    const minMidi = Theory.noteToMidi(actualSorted[0]);
    const maxMidi = Theory.noteToMidi(actualSorted[actualSorted.length - 1]);
    if (this.currentQuestion.clef === 'treble' && minMidi < 48) {
      issues.push(`⚠️ ระดับเสียงต่ำเกินไปสำหรับกุญแจซอล (Treble Clef): ควรวางคอร์ดให้อยู่ตั้งแต่ C4 ขึ้นไป`);
    } else if (this.currentQuestion.clef === 'bass' && maxMidi >= 72) {
      issues.push(`⚠️ ระดับเสียงสูงเกินไปสำหรับกุญแจฟา (Bass Clef): ควรวางคอร์ดให้อยู่ในช่วง C2–G4`);
    }

    // 2. ตรวจเฉพาะสำหรับหน้าพลิกกลับ: Bass ต้องต่ำสุดตรงตำแหน่ง
    if (this.mode === 'inversions') {
      const bassNote = actualSorted[0];
      const expBass = expected[0];
      if (bassNote.step !== expBass.step || (bassNote.alter || 0) !== (expBass.alter || 0)) {
        const expPc = ((Theory.noteToMidi(expBass) % 12) + 12) % 12;
        const bassPc = ((Theory.noteToMidi(bassNote) % 12) + 12) % 12;
        if (expPc !== bassPc) {
          issues.push(`❌ ตำแหน่งพลิกกลับไม่ถูกต้อง: โน้ตเบส (ต่ำสุด) ของ <strong>${this.currentQuestion.invMeta.label}</strong> ต้องเป็น <strong>${Theory.formatPitchClass(expBass)}</strong> (${this.currentQuestion.invMeta.bassRole})`);
        }
      }
    }

    const fb = document.getElementById(`${this.prefix}-feedback`);
    this.stats.total += 1;

    if (issues.length === 0) {
      this.stats.correct += 1;
      this.playUserChord();
      if (fb) {
        const names = actualSorted.map(n => Theory.formatNoteName(n)).join(' – ');
        fb.innerHTML = `
          <div class="issue-card" style="border-left: 4px solid #16a34a; background: #f0fdf4;">
            <div class="issue-title" style="color: #15803d;">✅ ถูกต้องสมบูรณ์! (${this.currentQuestion.chordSymbol})</div>
            <div class="issue-detail">โน้ตของคุณ: <strong>${names}</strong> ถูกต้องทั้งระดับเสียง การสะกดโน้ต และตำแหน่ง</div>
          </div>
        `;
      }
    } else {
      if (fb) {
        fb.innerHTML = issues.map(msg => `
          <div class="issue-card error">
            <div class="issue-detail">${msg}</div>
          </div>
        `).join('');
      }
      if (typeof window.showErrorPopup === 'function') {
        const chordRule = `<strong>โครงสร้างคอร์ด ${this.currentQuestion.chordSymbol}:</strong> ${this.currentQuestion.typeDef.formula}`;
        const posRule = this.mode === 'inversions'
          ? `<br><strong>ตำแหน่งพลิกกลับ (${this.currentQuestion.invMeta.label}):</strong> ต้องวางโน้ต <strong>${this.currentQuestion.invMeta.bassRole}</strong> ไว้เป็นโน้ตเบส (ต่ำสุด) เสมอ`
          : `<br><strong>หลักการวางคอร์ด:</strong> วางโน้ต <strong>Root → 3rd → 5th${expected.length === 4 ? ' → 7th' : ''}</strong> เรียงจากล่างขึ้นบน`;
        window.showErrorPopup({
          title: `ยังไม่ถูกต้อง (${this.currentQuestion.chordSymbol})`,
          subtitle: this.mode === 'inversions'
            ? `หน้า 3 • แบบฝึกหัดการพลิกกลับ (${this.currentQuestion.invMeta.label})`
            : `หน้า 2 • แบบฝึกหัดโน้ตในคอร์ด 12 คีย์ (${this.currentQuestion.typeDef.name})`,
          reasons: issues,
          tip: `💡 ${chordRule}${posRule}`
        });
      }
    }

    this.renderQuestionBanner();
  }

  togglePiano() {
    this.pianoOpen = !this.pianoOpen;
    const wrap = document.getElementById(`${this.prefix}-piano-wrapper`);
    if (wrap) wrap.style.display = this.pianoOpen ? 'block' : 'none';
  }

  renderPianoKeyboard() {
    const wrap = document.getElementById(`${this.prefix}-piano-container`);
    if (!wrap) return;

    const startMidi = 36; // C2
    const endMidi = 79;   // G5
    const whiteKeys = [0, 2, 4, 5, 7, 9, 11];
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    let html = `<div class="piano-keyboard">`;
    let whiteIndex = 0;

    for (let midi = startMidi; midi <= endMidi; midi++) {
      const pc = midi % 12;
      const isWhite = whiteKeys.includes(pc);
      const oct = Math.floor(midi / 12) - 1;
      const label = `${noteNames[pc]}${oct}`;

      if (isWhite) {
        html += `<div class="piano-key white-key" data-midi="${midi}" title="${label}" style="flex-shrink: 0;" onclick="window.${this.globalName()}.setNoteFromMidi(${midi})">${pc === 0 ? label : ''}</div>`;
        whiteIndex++;
      } else {
        const leftOffset = (whiteIndex * 25) - 8;
        html += `<div class="piano-key black-key" data-midi="${midi}" title="${label}" style="left: ${leftOffset}px;" onclick="window.${this.globalName()}.setNoteFromMidi(${midi})"></div>`;
      }
    }

    html += `</div>`;
    wrap.innerHTML = html;
  }
}

window.ChordLabController = ChordLabController;
