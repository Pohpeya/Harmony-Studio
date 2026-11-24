/**
 * Harmony Studio - Basic Four-Part Writing Page
 * Covers all 5 uploaded documents:
 * 1. Four Part-Writing Basics (Notation, SATB Ranges, Outer/Inner Part, Spacing, Stem, 5 Motions)
 * 2. Note Doubling (Root, 3rd, 5th, vii°6 exception, V 3rd/LT exception)
 * 3. Open vs Close Voicing (Structure) + Kostka 5th Edition examples
 * 4. Parallel Motion & Forbidden Parallels (3rd/6th <=3, P5/P8, Contrary 5/8, Unequal 5th, Hidden/Direct)
 * 5. Melody (Horizontal Line: Rhythm, Harmonic, Leaps, Tendency Tones 4->3, 7->1)
 * + Independent chord/key selectors under each section + 120-question interactive quiz
 */

const Basic4PartPage = {
  CHORD_KEYS: [
    'C_maj', 'G_maj', 'D_maj', 'A_maj', 'E_maj', 'F_maj',
    'Bb_maj', 'Eb_maj', 'Ab_maj', 'Db_maj', 'Gb_maj', 'B_maj'
  ],

  KOSTKA_VOICINGS: [
    { id: 'k1', label: '1. Close (A: ii = Bm)', chord: 'Bm', structure: 'Close', notes: [
      { step: 'D', alter: 0, octave: 4 }, { step: 'F', alter: 1, octave: 4 }, { step: 'B', alter: 0, octave: 4 }
    ], desc: 'Soprano–Tenor < 1 Octave (B4–D4 = M6)' },
    { id: 'k2', label: '2. Open (F: vi = Dm)', chord: 'Dm', structure: 'Open', notes: [
      { step: 'F', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }, { step: 'D', alter: 0, octave: 5 }
    ], desc: 'Soprano–Tenor ≥ 1 Octave (D5–F4 / หรือข้ามเสียงในคอร์ด)' },
    { id: 'k3', label: '3. Close (c: V = G)', chord: 'G', structure: 'Close', notes: [
      { step: 'D', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }, { step: 'B', alter: 0, octave: 4 }
    ], desc: 'S–A–T เรียงชิด (D4–G4–B4) ระยะ S–T = M6 (< 8ve)' },
    { id: 'k4', label: '4. Close (D: I = D)', chord: 'D', structure: 'Close', notes: [
      { step: 'A', alter: 0, octave: 3 }, { step: 'D', alter: 0, octave: 4 }, { step: 'F', alter: 1, octave: 4 }
    ], desc: 'S–A–T เรียงชิด (A3–D4–F♯4) ระยะ S–T = M6 (< 8ve)' },
    { id: 'k5', label: '5. Open (g: VI = E♭)', chord: 'E♭', structure: 'Open', notes: [
      { step: 'G', alter: 0, octave: 3 }, { step: 'E', alter: -1, octave: 4 }, { step: 'B', alter: -1, octave: 4 }
    ], desc: 'S–A–T เว้นข้ามโน้ตในคอร์ด 1 ตัว (G3–E♭4–B♭4) ระยะ S–T = m10 (≥ 8ve)' },
    { id: 'k6', label: '6. Open (a: iv = Dm)', chord: 'Dm', structure: 'Open', notes: [
      { step: 'F', alter: 0, octave: 3 }, { step: 'D', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }
    ], desc: 'S–A–T เว้นข้ามโน้ต (F3–D4–A4) ระยะ S–T = M10 (≥ 8ve)' },
    { id: 'k7', label: '7. Close (B♭: V = F)', chord: 'F', structure: 'Close', notes: [
      { step: 'A', alter: 0, octave: 3 }, { step: 'C', alter: 0, octave: 4 }, { step: 'F', alter: 0, octave: 4 }
    ], desc: 'S–A–T เรียงชิด (A3–C4–F4) ระยะ S–T = m6 (< 8ve)' },
    { id: 'k8', label: '8. Open (f♯: III = A)', chord: 'A', structure: 'Open', notes: [
      { step: 'E', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }, { step: 'C', alter: 1, octave: 5 }
    ], desc: 'Open Structure ในคีย์ f♯ minor (A–C♯–E)' }
  ],

  quizBank: [],
  currentQuiz: null,
  answered: false,
  stats: { correct: 0, total: 0 },
  doublingStaffCache: [],
  voicingStaffCache: [],
  motionStaffCache: [],
  melodyStaffCache: [],

  init() {
    const keyOpts = this.CHORD_KEYS.map(k => {
      const name = Theory.formatPitchClass(Theory.getScaleDegrees(k)[0]);
      return `<option value="${k}">คอร์ด ${name} (คีย์ ${name} Major)</option>`;
    }).join('');

    const dblSel = document.getElementById('b4p-doubling-key');
    const voicSel = document.getElementById('b4p-voicing-key');
    const melSel = document.getElementById('b4p-melody-key');
    const filterSel = document.getElementById('b4p-key-filter');

    if (dblSel) { dblSel.innerHTML = keyOpts; dblSel.value = 'C_maj'; }
    if (voicSel) { voicSel.innerHTML = keyOpts; voicSel.value = 'D_maj'; }
    if (melSel) { melSel.innerHTML = keyOpts; melSel.value = 'G_maj'; }

    if (filterSel) {
      filterSel.innerHTML = `<option value="ALL">🎲 สุ่มทั้ง 12 คีย์ (120 ข้อ)</option>` +
        this.CHORD_KEYS.map(k => {
          const name = Theory.formatPitchClass(Theory.getScaleDegrees(k)[0]);
          return `<option value="${k}">เจาะจงคีย์ ${name} Major</option>`;
        }).join('');
      filterSel.value = 'ALL';
    }

    this.renderAll();
    this.buildQuizBank();
    this.nextQuiz();
  },

  spellChord(rootDeg, stepOffsets, semiOffsets, baseOct = 4) {
    return stepOffsets.map((so, i) =>
      Theory.spellIntervalNote(rootDeg.step, rootDeg.alter || 0, baseOct, so, semiOffsets[i])
    );
  },

  getKeyData(keyId) {
    const scale = Theory.getScaleDegrees(keyId);
    const pc = (deg) => Theory.formatPitchClass(deg);
    const d1 = scale[0], d2 = scale[1], d3 = scale[2], d4 = scale[3],
          d5 = scale[4], d6 = scale[5], d7 = scale[6];

    const baseOct = ['A', 'B'].includes(d1.step) ? 3 : 4;
    // Close voicing of I (e.g. C4-E4-G4) vs Open voicing of I (e.g. G3-E4-C5 -> using comfortable treble notes: E4-C5-G5 or C4-G4-E5)
    const iClose = this.spellChord(d1, [0, 2, 4], [0, 4, 7], baseOct);          // 1, 3, 5 (S-T = P5 < 8ve)
    const iOpen = this.spellChord(d1, [0, 4, 9], [0, 7, 16], baseOct);          // 1, 5, 3' (S-T = M10 >= 8ve)
    const iDblRoot = this.spellChord(d1, [0, 2, 4, 7], [0, 4, 7, 12], baseOct); // 1, 3, 5, 1'
    const iNo5 = this.spellChord(d1, [0, 2, 7], [0, 4, 12], baseOct);           // 1, 3, 1' (5th omitted)
    const vii6Dbl3 = this.spellChord(d2, [0, 2, 5, 7], [0, 3, 9, 12], ['G', 'A', 'B'].includes(d2.step) ? 3 : 4); // 2, 4, 7, 2'
    const viDbl3 = this.spellChord(d6, [0, 2, 4, 9], [0, 3, 7, 15], ['G', 'A', 'B'].includes(d6.step) ? 3 : 4); // minor triad double 3rd
    const vTriad = this.spellChord(d5, [0, 2, 4], [0, 4, 7], ['G', 'A', 'B'].includes(d5.step) ? 3 : 4);

    // Melody tendency tones: 4 -> 3 and 7 -> 1
    const n4Note = Theory.spellIntervalNote(d1.step, d1.alter || 0, baseOct, 3, 5);
    const n3Note = Theory.spellIntervalNote(d1.step, d1.alter || 0, baseOct, 2, 4);
    const n7Note = Theory.spellIntervalNote(d1.step, d1.alter || 0, baseOct, 6, 11);
    const n8Note = Theory.spellIntervalNote(d1.step, d1.alter || 0, baseOct, 7, 12);

    return {
      keyId,
      n1: pc(d1), n2: pc(d2), n3: pc(d3), n4: pc(d4), n5: pc(d5), n6: pc(d6), n7: pc(d7),
      iSym: pc(d1), iiSym: `${pc(d2)}m`, ivSym: pc(d4), vSym: pc(d5), viSym: `${pc(d6)}m`, viiSym: `${pc(d7)}°`,
      iClose, iOpen, iDblRoot, iNo5, vii6Dbl3, viDbl3, vTriad,
      n4Note, n3Note, n7Note, n8Note
    };
  },

  renderAll() {
    this.renderSpacingSection();
    this.renderDoublingSection();
    this.renderVoicingSection();
    this.renderMotionSection();
    this.renderMelodySection();
  },

  renderSpacingSection() {
    const container = document.getElementById('b4p-spacing-staff');
    if (!container || typeof StaffRenderer === 'undefined') return;

    this.spacingExamples = [
      {
        romanNumeral: '✓ Close',
        bass:    { step: 'C', alter: 0, octave: 3 },
        tenor:   { step: 'G', alter: 0, octave: 3 },
        alto:    { step: 'C', alter: 0, octave: 4 },
        soprano: { step: 'E', alter: 0, octave: 4 }
      },
      {
        romanNumeral: '✓ T–B > 8',
        bass:    { step: 'C', alter: 0, octave: 2 },
        tenor:   { step: 'G', alter: 0, octave: 3 },
        alto:    { step: 'C', alter: 0, octave: 4 },
        soprano: { step: 'E', alter: 0, octave: 4 }
      },
      {
        romanNumeral: '✗ S–A > 8',
        bass:    { step: 'C', alter: 0, octave: 3 },
        tenor:   { step: 'G', alter: 0, octave: 3 },
        alto:    { step: 'C', alter: 0, octave: 4 },
        soprano: { step: 'E', alter: 0, octave: 5 }
      },
      {
        romanNumeral: '✗ A–T > 8',
        bass:    { step: 'C', alter: 0, octave: 3 },
        tenor:   { step: 'C', alter: 0, octave: 3 },
        alto:    { step: 'E', alter: 0, octave: 4 },
        soprano: { step: 'G', alter: 0, octave: 4 }
      }
    ];

    const renderer = new StaffRenderer('b4p-spacing-staff', {
      colorCoded: true,
      showErrors: true,
      showSpacingBadges: true,
      showParallelLines: false,
      showCommonToneTies: false,
      chordWidth: 158
    });
    const analysis = (typeof HarmonyRules !== 'undefined' && typeof HarmonyRules.analyze === 'function')
      ? HarmonyRules.analyze(this.spacingExamples, 'C_maj')
      : null;
    renderer.render(this.spacingExamples, 'C_maj', analysis);
  },

  playSpacingExamples() {
    if (!this.spacingExamples) return;
    const noteLists = this.spacingExamples.map(ch => [ch.bass, ch.tenor, ch.alto, ch.soprano]);
    TheoryPages.playChordList(noteLists, 800);
  },

  renderDoublingSection() {
    const keyId = document.getElementById('b4p-doubling-key')?.value || 'C_maj';
    const d = this.getKeyData(keyId);

    const sum = document.getElementById('b4p-doubling-summary');
    if (sum) {
      sum.innerHTML = `
        <div class="theory-table-wrap">
          <table class="theory-table">
            <thead>
              <tr>
                <th>ตัวอย่างในคีย์ ${d.iSym}</th>
                <th>คอร์ด</th>
                <th>การเบิ้ล / ตัดโน้ตที่ถูกต้อง</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Double Root (มาตรฐาน)</strong></td>
                <td>${d.iSym}, ${d.ivSym}, ${d.vSym}, ${d.iiSym}, ${d.viSym}</td>
                <td>เบิ้ล Root เช่น คอร์ด ${d.iSym} เบิ้ล <strong>${d.n1}</strong> (${d.n1}–${d.n3}–${d.n5}–${d.n1})</td>
              </tr>
              <tr>
                <td><strong>ข้อยกเว้น vii°⁶</strong></td>
                <td><strong>${d.viiSym}/${d.n2}</strong></td>
                <td>ห้ามเบิ้ล ${d.n7} (Leading Tone) → ให้ <strong>Double 3rd (${d.n2})</strong> แทน</td>
              </tr>
              <tr>
                <td><strong>ข้อยกเว้น 3rd &amp; 5th</strong></td>
                <td>${d.vSym} / ${d.viSym} / ${d.iSym}</td>
                <td>คอร์ด <strong>${d.vSym}</strong> ห้ามเบิ้ล 3rd (${d.n7}) | คอร์ด <strong>${d.viSym}</strong> เบิ้ล minor 3rd (${d.n1}) ได้ | คอร์ด <strong>${d.iSym}</strong> ตัด 5th (${d.n5}) ได้</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    this.doublingStaffCache = [
      { label: `${d.iSym} (Dbl Root)`, sublabel: `เบิ้ล ${d.n1} ✓`, notes: d.iDblRoot },
      { label: `${d.iSym} (No 5th)`, sublabel: `ตัด ${d.n5} ✓`, notes: d.iNo5 },
      { label: `${d.viSym} (Dbl m3)`, sublabel: `เบิ้ล ${d.n1} ✓`, notes: d.viDbl3 },
      { label: `${d.viiSym}/${d.n2}`, sublabel: `เบิ้ล 3rd (${d.n2}) ✓`, notes: d.vii6Dbl3 }
    ];

    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples('b4p-doubling-staff', this.doublingStaffCache, 'window.basic4PartPage.playDoubling', 'treble');
    }
  },

  renderVoicingSection() {
    const keyId = document.getElementById('b4p-voicing-key')?.value || 'D_maj';
    const d = this.getKeyData(keyId);

    const sum = document.getElementById('b4p-voicing-summary');
    if (sum) {
      sum.innerHTML = `
        <div class="theory-table-wrap">
          <table class="theory-table">
            <thead>
              <tr>
                <th>โครงสร้าง Voicing คอร์ด ${d.iSym}</th>
                <th>การเรียงโน้ต 3 แนวบน (T–A–S)</th>
                <th>ระยะห่าง Soprano – Tenor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Close Voicing (ชิด)</strong></td>
                <td>${d.n1} – ${d.n3} – ${d.n5} (ติดกัน ไม่มีโน้ตในคอร์ดแทรกกลาง)</td>
                <td><strong>น้อยกว่า 1 Octave (&lt; 8ve)</strong></td>
              </tr>
              <tr>
                <td><strong>Open Voicing (โปร่ง)</strong></td>
                <td>${d.n1} – ${d.n5} – ${d.n3} (เว้นข้ามโน้ตในคอร์ดไป 1 ตัว)</td>
                <td><strong>มากกว่าหรือเท่ากับ 1 Octave (≥ 8ve)</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    this.voicingStaffCache = [
      { label: `${d.iSym} Close`, sublabel: 'S–T < 8ve', notes: d.iClose },
      { label: `${d.iSym} Open`, sublabel: 'S–T ≥ 8ve', notes: d.iOpen }
    ];

    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples('b4p-voicing-staff', this.voicingStaffCache, 'window.basic4PartPage.playVoicing', 'treble');
    }
  },

  renderMotionSection() {
    const container = document.getElementById('b4p-motion-staff');
    if (!container) return;

    // All 5 Motion types with Chord 1 -> Chord 2 clearly shown in separate playable cards
    const defs = [
      {
        id: 'static', title: '1. Static motion (ค้างทั้งคู่)', badgeColor: '#475569',
        chords: [
          { label: 'คอร์ด 1', sublabel: 'C–E', notes: [{ step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }] },
          { label: '→ คอร์ด 2', sublabel: 'C–E (ค้าง)', notes: [{ step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }] }
        ]
      },
      {
        id: 'oblique', title: '2. Oblique motion (ค้าง 1 เดิน 1)', badgeColor: '#0284c7',
        chords: [
          { label: 'คอร์ด 1', sublabel: 'C–E', notes: [{ step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }] },
          { label: '→ คอร์ด 2', sublabel: 'C–G (บนขึ้น)', notes: [{ step: 'C', alter: 0, octave: 4 }, { step: 'G', alter: 0, octave: 4 }] }
        ]
      },
      {
        id: 'contrary', title: '3. Contrary motion (สวนทางกัน ✓)', badgeColor: '#16a34a',
        chords: [
          { label: 'คอร์ด 1', sublabel: 'C–E', notes: [{ step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }] },
          { label: '→ คอร์ด 2', sublabel: 'B–G (แยกออก)', notes: [{ step: 'B', alter: 0, octave: 3 }, { step: 'G', alter: 0, octave: 4 }] }
        ]
      },
      {
        id: 'similar', title: '4. Similar motion (ทางเดียวกัน ขั้นคู่เปลี่ยน)', badgeColor: '#d97706',
        chords: [
          { label: 'คอร์ด 1', sublabel: 'C–E (คู่ 3)', notes: [{ step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }] },
          { label: '→ คอร์ด 2', sublabel: 'D–A (คู่ 5)', notes: [{ step: 'D', alter: 0, octave: 4 }, { step: 'A', alter: 0, octave: 4 }] }
        ]
      },
      {
        id: 'parallel', title: '5. Parallel motion (ขนานกัน ขั้นคู่เดิม)', badgeColor: '#7c3aed',
        chords: [
          { label: 'คอร์ด 1', sublabel: 'C–E (คู่ 3)', notes: [{ step: 'C', alter: 0, octave: 4 }, { step: 'E', alter: 0, octave: 4 }] },
          { label: '→ คอร์ด 2', sublabel: 'D–F (คู่ 3)', notes: [{ step: 'D', alter: 0, octave: 4 }, { step: 'F', alter: 0, octave: 4 }] }
        ]
      }
    ];

    this.motionStaffCache = defs.map(m => ({ pair: m.chords.map(c => c.notes) }));

    container.innerHTML = defs.map((m, idx) => `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:10px; display:flex; flex-direction:column; gap:6px;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; flex-wrap:wrap;">
          <strong style="font-size:0.84rem; color:${m.badgeColor};">${m.title}</strong>
          <button type="button" class="btn btn-outline btn-xs" style="padding:3px 8px; font-size:0.76rem;" onclick="window.basic4PartPage.playMotion(${idx})">🔊 ฟัง</button>
        </div>
        <div id="b4p-motion-card-${idx}" style="display:flex; justify-content:center; overflow-x:auto;"></div>
      </div>
    `).join('');

    if (typeof ChordLabRenderer !== 'undefined') {
      defs.forEach((m, idx) => {
        ChordLabRenderer.renderLessonExamples(
          `b4p-motion-card-${idx}`,
          m.chords,
          `window.basic4PartPage.playMotionCard_${idx}`,
          'treble'
        );
        this[`playMotionCard_${idx}`] = () => this.playMotion(idx);
      });
    }
  },

  renderMelodySection() {
    const keyId = document.getElementById('b4p-melody-key')?.value || 'G_maj';
    const d = this.getKeyData(keyId);

    const sum = document.getElementById('b4p-melody-summary');
    if (sum) {
      sum.innerHTML = `
        <div class="theory-table-wrap">
          <table class="theory-table">
            <thead>
              <tr>
                <th>Tendency Tones ในคีย์ ${d.iSym}</th>
                <th>โน้ตตัวนำ → โน้ตเป้าหมาย</th>
                <th>ทิศทางการเกลาทำนอง</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>ขั้นที่ 4 → ขั้นที่ 3</strong></td>
                <td><strong>${d.n4} → ${d.n3}</strong></td>
                <td>คลี่คลาย <strong>ลงครึ่งเสียง</strong> ไปหาขั้นที่ 3 ของคีย์</td>
              </tr>
              <tr>
                <td><strong>ขั้นที่ 7 → ขั้นที่ 1</strong></td>
                <td><strong>${d.n7} → ${d.n1}</strong></td>
                <td>Leading Tone คลี่คลาย <strong>ขึ้นครึ่งเสียง</strong> กลับสู่ Tonic</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    const container = document.getElementById('b4p-melody-staff');
    if (!container) return;

    this.melodyStaffCache = [
      { pair: [[d.n4Note], [d.n3Note]] },
      { pair: [[d.n7Note], [d.n8Note]] }
    ];

    // Draw ONE single Treble 5-line staff with EXACTLY 2 measures:
    // Bar 1 = 4 -> 3 (2 notes inside the same bar)
    // Bar 2 = 7 -> 1 (2 notes inside the same bar)
    const ls = 10;
    const half = ls / 2;
    const stepE4 = 30; // E4 = bottom line of treble staff
    const allNotes = [d.n4Note, d.n3Note, d.n7Note, d.n8Note];
    const maxStep = Math.max(38, ...allNotes.map(n => Theory.noteToDiatonicStep(n)));
    const minStep = Math.min(30, ...allNotes.map(n => Theory.noteToDiatonicStep(n)));
    const topY = 38 + Math.max(0, (maxStep - 38) * half);
    const botY = topY + 4 * ls;
    const labelY = Math.max(botY + 34, botY + Math.max(0, (stepE4 - minStep) * half) + 22);
    const totalH = labelY + 30;
    const totalW = 470;
    const bar1Start = 64;
    const barMid = 264;
    const barEnd = 456;

    const noteY = (n) => botY - (Theory.noteToDiatonicStep(n) - stepE4) * half;
    const accSym = (n) => n.alter === 1 ? '♯' : (n.alter === -1 ? '♭' : '');

    const drawNote = (n, x, color, degText) => {
      const y = noteY(n);
      let s = '';
      // Ledger lines if above F5 (step 38) or below E4 (step 30)
      const st = Theory.noteToDiatonicStep(n);
      for (let l = 40; l <= st; l += 2) {
        const ly = botY - (l - stepE4) * half;
        s += `<line x1="${x - 11}" y1="${ly}" x2="${x + 11}" y2="${ly}" stroke="#64748b" stroke-width="1.2"/>`;
      }
      for (let l = 28; l >= st; l -= 2) {
        const ly = botY - (l - stepE4) * half;
        s += `<line x1="${x - 11}" y1="${ly}" x2="${x + 11}" y2="${ly}" stroke="#64748b" stroke-width="1.2"/>`;
      }
      const acc = accSym(n);
      if (acc) {
        s += `<text x="${x - 16}" y="${y + 4}" font-size="14" font-weight="700" fill="${color}" font-family="serif">${acc}</text>`;
      }
      s += `<ellipse cx="${x}" cy="${y}" rx="6.5" ry="4.8" transform="rotate(-18 ${x} ${y})" fill="${color}"/>`;
      const stemUp = st < 34;
      if (stemUp) {
        s += `<line x1="${x + 6}" y1="${y}" x2="${x + 6}" y2="${y - 28}" stroke="${color}" stroke-width="1.6"/>`;
      } else {
        s += `<line x1="${x - 6}" y1="${y}" x2="${x - 6}" y2="${y + 28}" stroke="${color}" stroke-width="1.6"/>`;
      }
      s += `<text x="${x}" y="${labelY}" text-anchor="middle" font-size="12" font-weight="700" fill="${color}" font-family="Sarabun, sans-serif">${Theory.formatPitchClass(n)} (${degText})</text>`;
      return s;
    };

    let staffLines = '';
    for (let i = 0; i < 5; i++) {
      const y = topY + i * ls;
      staffLines += `<line x1="14" y1="${y}" x2="${barEnd}" y2="${y}" stroke="#64748b" stroke-width="1.1"/>`;
    }

    const svg = `
      <svg viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" style="max-width:100%; height:auto; display:block;">
        ${staffLines}
        <line x1="14" y1="${topY}" x2="14" y2="${botY}" stroke="#334155" stroke-width="1.6"/>
        <text x="20" y="${botY - 6}" font-size="44" fill="#1e293b" font-family="serif">𝄞</text>

        <!-- Measure 1: 4 -> 3 -->
        <g style="cursor:pointer;" onclick="window.basic4PartPage.playMelody(0)">
          <rect x="${bar1Start}" y="4" width="${barMid - bar1Start - 4}" height="${totalH - 8}" rx="8" fill="transparent"/>
          <text x="${(bar1Start + barMid) / 2}" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#0284c7" font-family="Prompt, sans-serif">ห้องที่ 1: 4 → 3 (ลงครึ่งเสียง) 🔊</text>
          ${drawNote(d.n4Note, 118, '#0284c7', 'ขั้น 4')}
          <text x="164" y="${(noteY(d.n4Note) + noteY(d.n3Note)) / 2 + 4}" text-anchor="middle" font-size="15" font-weight="700" fill="#0284c7">→</text>
          ${drawNote(d.n3Note, 210, '#0284c7', 'ขั้น 3')}
        </g>

        <!-- Center Barline -->
        <line x1="${barMid}" y1="${topY}" x2="${barMid}" y2="${botY}" stroke="#334155" stroke-width="1.5"/>

        <!-- Measure 2: 7 -> 1 -->
        <g style="cursor:pointer;" onclick="window.basic4PartPage.playMelody(1)">
          <rect x="${barMid + 4}" y="4" width="${barEnd - barMid - 8}" height="${totalH - 8}" rx="8" fill="transparent"/>
          <text x="${(barMid + barEnd) / 2}" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#059669" font-family="Prompt, sans-serif">ห้องที่ 2: 7 → 1 (ขึ้นครึ่งเสียง) 🔊</text>
          ${drawNote(d.n7Note, 314, '#059669', 'ขั้น 7')}
          <text x="360" y="${(noteY(d.n7Note) + noteY(d.n8Note)) / 2 + 4}" text-anchor="middle" font-size="15" font-weight="700" fill="#059669">→</text>
          ${drawNote(d.n8Note, 406, '#059669', 'ขั้น 1')}
        </g>

        <!-- Final Double Barline -->
        <line x1="${barEnd - 5}" y1="${topY}" x2="${barEnd - 5}" y2="${botY}" stroke="#334155" stroke-width="1.3"/>
        <line x1="${barEnd}" y1="${topY}" x2="${barEnd}" y2="${botY}" stroke="#0f172a" stroke-width="3.2"/>
      </svg>
    `;
    container.innerHTML = svg;
  },

  playDoubling(idx) {
    if (this.doublingStaffCache[idx]) TheoryPages.playChordList([this.doublingStaffCache[idx].notes]);
  },
  playVoicing(idx) {
    if (this.voicingStaffCache[idx]) TheoryPages.playChordList([this.voicingStaffCache[idx].notes]);
  },
  playMotion(idx) {
    if (this.motionStaffCache[idx]) TheoryPages.playChordList(this.motionStaffCache[idx].pair, 600);
  },
  playMelody(idx) {
    if (this.melodyStaffCache[idx]) TheoryPages.playChordList(this.melodyStaffCache[idx].pair, 550);
  },

  buildQuizBank() {
    this.quizBank = [];

    this.CHORD_KEYS.forEach(keyId => {
      const d = this.getKeyData(keyId);
      const kLabel = `คีย์ ${d.iSym} Major`;

      // 1. Spacing rule (S-A, A-T, T-B)
      this.quizBank.push({
        id: `b4p_space_${keyId}`, keyId, keyLabel: kLabel,
        prompt: `กฎระยะห่างของแนวเสียง (Spacing) ใน Four-Part Writing (SATB) ข้อใดถูกต้อง?`,
        staffItems: [{ label: `${d.iSym} (SATB)`, sublabel: 'Spacing Check', notes: d.iDblRoot }],
        choices: [
          { val: 'ok', label: 'S–A และ A–T ห่างไม่เกิน 1 Octave (≤ 8) แต่ T–B ห่างเกิน 1 Octave ได้' },
          { val: 'all8', label: 'ทุกคู่แนวเสียง (รวมทั้ง T–B) ห้ามห่างเกินคู่ 5' },
          { val: 'sa12', label: 'S–A ห่างได้ถึง 2 Octaves แต่ T–B ห้ามเกินคู่ 3' },
          { val: 'any', label: 'ระยะห่างไม่มีข้อจำกัดในแนวเสียงใดเลย' }
        ],
        answer: 'ok',
        explain: `กฎ <strong>Spacing</strong>: ระยะห่างระหว่าง <strong>Soprano–Alto</strong> และ <strong>Alto–Tenor</strong> ต้อง<strong>ไม่เกิน 1 Octave (≤ 8)</strong> ส่วนระหว่าง <strong>Tenor–Bass</strong> สามารถห่างเกิน 1 Octave ได้ (เช่น ถึงคู่ 12)`,
        playPairs: [d.iDblRoot]
      });

      // 2. Outer vs Inner Part & Stem Direction
      this.quizBank.push({
        id: `b4p_stem_${keyId}`, keyId, keyLabel: kLabel,
        prompt: `ในการบันทึกโน้ตแบบ Grand Staff (2 บรรทัด) แนวเสียงใดคือ Outer Part และทิศทางหางโน้ต (Stem) ที่ถูกต้องคือข้อใด?`,
        staffItems: [{ label: `${d.iSym}`, sublabel: 'Outer / Inner & Stem', notes: d.iClose }],
        choices: [
          { val: 'ok', label: 'Outer = Soprano & Bass | หางโน้ต: S ขึ้น, A ลง, T ขึ้น, B ลง' },
          { val: 'wrong1', label: 'Outer = Alto & Tenor | หางโน้ต: S ลง, A ขึ้น, T ลง, B ขึ้น' },
          { val: 'wrong2', label: 'Outer = Soprano & Alto | หางโน้ตขึ้นทุกแนวเสียง' },
          { val: 'wrong3', label: 'Outer = Tenor & Bass | หางโน้ตลงทุกแนวเสียง' }
        ],
        answer: 'ok',
        explain: `<strong>Outer Parts</strong> คือแนวขอบนอกสุด (<strong>Soprano &amp; Bass</strong>) ส่วน <strong>Inner Parts</strong> คือ Alto &amp; Tenor และหางโน้ตมาตรฐานใน 4 แนวคือ <strong>S ขึ้น, A ลง, T ขึ้น, B ลง</strong>`,
        playPairs: [d.iClose]
      });

      // 3. Note Doubling: Root & vii°6 exception
      this.quizBank.push({
        id: `b4p_dbl_vii_${keyId}`, keyId, keyLabel: kLabel,
        prompt: `ในคีย์ ${d.iSym}: คอร์ด ${d.viiSym} (vii°) เหตุใดจึงไม่นิยมเบิ้ล Root (${d.n7}) และควรแก้ด้วยการเบิ้ลโน้ตตัวใด?`,
        staffItems: [{ label: `❓ ${d.viiSym}`, sublabel: 'Doubling Rule', notes: d.vii6Dbl3 }],
        revealItems: [{ label: `${d.viiSym}/${d.n2}`, sublabel: `Double 3rd (${d.n2})`, notes: d.vii6Dbl3 }],
        choices: [
          { val: 'dbl3', label: `เพราะ ${d.n7} เป็น Leading Tone — ให้พลิกกลับเป็น ${d.viiSym}/${d.n2} (vii°⁶) แล้ว Double 3rd (${d.n2})` },
          { val: 'dbl5', label: `เพราะเป็น Major Triad — ให้ตัด 3rd แล้วเบิ้ล 5th (${d.n4})` },
          { val: 'dblR', label: `สามารถเบิ้ล Root (${d.n7}) ใน Root Position ได้ตามปกติ` },
          { val: 'no3', label: `ให้ตัดโน้ต ${d.n2} ออกแล้วเล่นแค่ 2 เสียง` }
        ],
        answer: 'dbl3',
        explain: `คอร์ด <strong>${d.viiSym} (vii°)</strong> ไม่นิยมเบิ้ล Root (<strong>${d.n7}</strong>) เพราะเป็น Leading Tone (จะเกิด Parallel 8ves เมื่อคลี่คลาย) จึงนิยมใช้รูปพลิกกลับ <strong>vii°⁶ (${d.viiSym}/${d.n2})</strong> และ <strong>Double 3rd (${d.n2})</strong>`,
        playPairs: [d.vii6Dbl3, d.iClose]
      });

      // 4. Note Doubling: 3rd & 5th
      this.quizBank.push({
        id: `b4p_dbl_35_${keyId}`, keyId, keyLabel: kLabel,
        prompt: `ในคีย์ ${d.iSym}: ข้อใดกล่าวถูกต้องเกี่ยวกับการเบิ้ลหรือตัดโน้ตขั้นที่ 3 และขั้นที่ 5 ใน Four-Part Writing?`,
        staffItems: [{ label: `${d.iSym} (No 5)`, sublabel: 'Omit 5th ✓', notes: d.iNo5 }],
        choices: [
          { val: 'ok', label: `5th (${d.n5}) เบิ้ลหรือตัดออกได้ แต่ 3rd ห้ามตัดออก และคอร์ด ${d.vSym} (V) ห้ามเบิ้ล 3rd (${d.n7})` },
          { val: 'no3', label: `สามารถตัด 3rd ออกได้เสมอ แต่ห้ามตัด 5th เด็ดขาด` },
          { val: 'dblV3', label: `คอร์ด ${d.vSym} (V) ควรเบิ้ล 3rd (${d.n7}) เพื่อเน้นเสียง Leading Tone` },
          { val: 'noMin3', label: `ห้ามเบิ้ล Minor 3rd ในคอร์ด ${d.viSym} หรือ ${d.iiSym} เด็ดขาด` }
        ],
        answer: 'ok',
        explain: `<strong>5th</strong> สามารถเบิ้ลหรือตัดออกได้ (ยังฟังสมบูรณ์) แต่ <strong>3rd</strong> ต้องมีในคอร์ดเสมอ (Minor 3rd เบิ้ลได้, Major 3rd ควรห่าง 2 Octaves) และ <strong>ห้ามเบิ้ล 3rd ของคอร์ด V (${d.n7})</strong> เพราะเป็น Leading Tone`,
        playPairs: [d.iNo5]
      });

      // 5. Open vs Close Voicing (Close)
      this.quizBank.push({
        id: `b4p_close_${keyId}`, keyId, keyLabel: kLabel,
        prompt: `คอร์ด ${d.iSym} ที่แสดงบนบรรทัด 5 เส้น (เรียงโน้ต 3 แนวบนติดกัน ระยะ S–T น้อยกว่า 1 Octave) จัดเป็นโครงสร้างแบบใด?`,
        staffItems: [{ label: `❓ Voicing (${d.iSym})`, sublabel: 'S–T < 8ve', notes: d.iClose }],
        revealItems: [{ label: `${d.iSym} (Close)`, sublabel: 'S–T < 8ve', notes: d.iClose }],
        choices: [
          { val: 'close', label: 'Close Voicing (Close Structure) — S–A–T ชิดกัน ระยะ S–T < 1 Octave' },
          { val: 'open', label: 'Open Voicing (Open Structure) — S–A–T เว้นข้ามโน้ต ระยะ S–T ≥ 1 Octave' },
          { val: 'cross', label: 'Voice Crossing — แนวเสียงไขว้สลับตำแหน่งกัน' },
          { val: 'incomp', label: 'Incomplete Triad — ขาดโน้ตขั้นที่ 3' }
        ],
        answer: 'close',
        explain: `<strong>Close Voicing</strong> คือการจัดวางโน้ต 3 แนวบน (S–A–T) เรียงชิดกันไม่มีโน้ตในคอร์ดแทรกกลาง ทำให้ระยะห่าง Soprano–Tenor <strong>น้อยกว่า 1 Octave (&lt; 8ve)</strong>`,
        playPairs: [d.iClose]
      });

      // 6. Open vs Close Voicing (Open)
      this.quizBank.push({
        id: `b4p_open_${keyId}`, keyId, keyLabel: kLabel,
        prompt: `คอร์ด ${d.iSym} ที่แสดงบนบรรทัด 5 เส้น (เว้นข้ามโน้ตในคอร์ด 1 ตัว ระยะ S–T มากกว่าหรือเท่ากับ 1 Octave) จัดเป็นโครงสร้างแบบใด?`,
        staffItems: [{ label: `❓ Voicing (${d.iSym})`, sublabel: 'S–T ≥ 8ve', notes: d.iOpen }],
        revealItems: [{ label: `${d.iSym} (Open)`, sublabel: 'S–T ≥ 8ve', notes: d.iOpen }],
        choices: [
          { val: 'open', label: 'Open Voicing (Open Structure) — ระยะ S–T ≥ 1 Octave' },
          { val: 'close', label: 'Close Voicing (Close Structure) — ระยะ S–T < 1 Octave' },
          { val: 'cluster', label: 'Tone Cluster — โน้ตติดกันทีละขั้นคู่ 2' },
          { val: 'unison', label: 'Unison Voicing — ร้องโน้ตตัวเดียวกันทุกแนว' }
        ],
        answer: 'open',
        explain: `<strong>Open Voicing</strong> คือการจัดวางโน้ต 3 แนวบน (S–A–T) โดยเว้นข้ามโน้ตในคอร์ดไป 1 ตัว ทำให้ระยะห่าง Soprano–Tenor <strong>มากกว่าหรือเท่ากับ 1 Octave (≥ 8ve)</strong>`,
        playPairs: [d.iOpen]
      });

      // 7. 5 Types of Motion
      this.quizBank.push({
        id: `b4p_motion_${keyId}`, keyId, keyLabel: kLabel,
        prompt: `ทิศทางการเคลื่อนไหว (Motion) แบบใดที่แนวเสียงทั้ง 2 แนวเคลื่อนที่สวนทางกัน (แนวหนึ่งขึ้น อีกแนวลง) และช่วยหลีกเลี่ยง Parallel 5th/8th ได้ดีที่สุด?`,
        staffItems: [
          { label: `${d.iSym}`, sublabel: 'Chord 1', notes: d.iClose },
          { label: `${d.vSym}`, sublabel: 'Motion Check', notes: d.vTriad }
        ],
        choices: [
          { val: 'contrary', label: 'Contrary Motion (เคลื่อนที่สวนทางกัน)' },
          { val: 'parallel', label: 'Parallel Motion (เคลื่อนที่ขนานกันด้วยขั้นคู่เดิม)' },
          { val: 'similar', label: 'Similar Motion (เคลื่อนที่ทิศทางเดียวกัน ขั้นคู่เปลี่ยน)' },
          { val: 'static', label: 'Static Motion (ทั้งสองแนวค้างโน้ตเดิม)' }
        ],
        answer: 'contrary',
        explain: `<strong>Contrary Motion</strong> คือการเคลื่อนที่สวนทางกันระหว่าง 2 แนวเสียง เป็นหัวใจสำคัญของ Counterpoint และช่วยป้องกัน Parallel 5th/8th ได้ดีที่สุด`,
        playPairs: [d.iClose, d.vTriad]
      });

      // 8. Parallel 3rd/6th & Parallel P5/P8
      this.quizBank.push({
        id: `b4p_par_${keyId}`, keyId, keyLabel: kLabel,
        prompt: `กฎเกี่ยวกับ Parallel Motion ใน Four-Part Writing ข้อใดถูกต้อง?`,
        staffItems: [{ label: `${d.iSym} → ${d.vSym}`, sublabel: 'Parallel Rules', notes: d.iClose }],
        choices: [
          { val: 'ok', label: 'Parallel 3rd/6th ใช้ได้แต่ไม่ควรติดกันเกิน 3 ครั้ง | ห้าม Parallel P5/P8 และ Contrary 5th/8th' },
          { val: 'p5ok', label: 'Parallel P5 และ P8 ใช้ได้ไม่จำกัด แต่ห้าม Parallel 3rd/6th' },
          { val: 'contok', label: 'หากเริ่มจาก P8 แล้วสวนทางไปจบที่ P8 ไม่ถือว่าผิด Parallel' },
          { val: 'no36', label: 'ห้ามใช้ Parallel 3rd และ 6th ในทุกกรณี' }
        ],
        answer: 'ok',
        explain: `<strong>Parallel 3rd/6th</strong> ใช้ได้ทั่วไปแต่ไม่ควรติดต่อกันเกิน 3 ครั้ง (เพื่อคงความเป็นอิสระของแนว) ส่วน <strong>Parallel P5/P8</strong> และ <strong>Parallel 5th/8th by Contrary Motion</strong> เป็นข้อห้าม`,
        playPairs: [d.iClose, d.vTriad]
      });

      // 9. Hidden / Direct Parallel 5ths & 8ves
      this.quizBank.push({
        id: `b4p_hidden_${keyId}`, keyId, keyLabel: kLabel,
        prompt: `กรณี Hidden (Direct) Parallel 5th หรือ 8th ใน Outer Parts (Soprano & Bass) เคลื่อนไปทิศทางเดียวกันแล้วจบที่คู่ 5/8 เงื่อนไขใดที่ "ยอมรับได้ (✓)"?`,
        staffItems: [{ label: `${d.vSym} → ${d.iSym}`, sublabel: 'Hidden 5th / 8th', notes: d.vTriad }],
        choices: [
          { val: 'step', label: 'แนวบน (Soprano/Melody) เดินขั้นบันได (Step) เข้าหาคู่ 5 หรือ 8 (แม้ Bass จะกระโดด)' },
          { val: 'leap', label: 'แนวบน (Soprano) กระโดด (Leap) แต่ Bass เดินขั้นบันได (Step)' },
          { val: 'bothleap', label: 'ทั้ง Soprano และ Bass กระโดด (Leap) ไปทิศทางเดียวกันพร้อมกัน' },
          { val: 'never', label: 'ห้ามใช้ในทุกกรณี แม้ Soprano จะเดินขั้นบันไดก็ตาม' }
        ],
        answer: 'step',
        explain: `<strong>Hidden Parallel (Direct 5th/8th)</strong> ใน Outer Parts จะผิดเมื่อ Soprano <strong>กระโดด (Leap)</strong> เข้าหาคู่ 5/8 แต่จะ<strong>ยอมรับได้ (✓)</strong> เมื่อ Soprano <strong>เดินขั้นบันได (Step)</strong> แม้ Bass จะกระโดดก็ตาม`,
        playPairs: [d.vTriad, d.iClose]
      });

      // 10. Melody Rules (Leaps & Tendency Tones)
      this.quizBank.push({
        id: `b4p_melody_${keyId}`, keyId, keyLabel: kLabel,
        prompt: `ในคีย์ ${d.iSym}: ตามหลักการเขียนทำนอง (Melody / Horizontal Line) ข้อใดถูกต้องเรื่องการกระโดด (Leap) และ Tendency Tones?`,
        staffItems: [
          { label: `4 → ?`, sublabel: `จาก ${d.n4}`, notes: [d.n4Note] },
          { label: `7 → ?`, sublabel: `จาก ${d.n7}`, notes: [d.n7Note] }
        ],
        revealItems: [
          { label: `${d.n4} → ${d.n3}`, sublabel: '4 → 3', notes: [d.n3Note] },
          { label: `${d.n7} → ${d.n1}`, sublabel: '7 → 1', notes: [d.n8Note] }
        ],
        choices: [
          { val: 'ok', label: `เลี่ยงขั้นคู่ Aug, 7th, >8ve | หลัง Leap > P4 ให้ Step สวนทาง | Tendency: ${d.n4}→${d.n3} และ ${d.n7}→${d.n1}` },
          { val: 'wrong1', label: `ควรกระโดดขั้นคู่ Augmented และ 7th ติดต่อกันเพื่อสร้างสีสัน` },
          { val: 'wrong2', label: `หลังกระโดดเกิน P4 ให้กระโดดซ้ำไปในทิศทางเดิมต่อทันที` },
          { val: 'wrong3', label: `Tendency Tones คือ ${d.n4}→${d.n5} และ ${d.n7}→${d.n6}` }
        ],
        answer: 'ok',
        explain: `หลัก <strong>Melody</strong>: หลีกเลี่ยงขั้นคู่ Augmented, 7th และเกิน 8ve; หลังกระโดดเกินคู่ P4 ให้เดิน <strong>Step ในทิศทางตรงกันข้าม</strong>; และเกลา Tendency Tones คือ <strong>4→3 (${d.n4}→${d.n3})</strong> และ <strong>7→1 (${d.n7}→${d.n1})</strong>`,
        playPairs: [[d.n4Note], [d.n3Note], [d.n7Note], [d.n8Note]]
      });
    });
  },

  nextQuiz() {
    const filter = document.getElementById('b4p-key-filter')?.value || 'ALL';
    const pool = filter === 'ALL' ? this.quizBank : this.quizBank.filter(q => q.keyId === filter);
    if (!pool.length) return;

    const prevId = this.currentQuiz ? this.currentQuiz.id : null;
    const candidates = pool.length > 1 ? pool.filter(q => q.id !== prevId) : pool;
    const q = candidates[Math.floor(Math.random() * candidates.length)];

    this.currentQuiz = q;
    this.answered = false;

    const badge = document.getElementById('b4p-quiz-key-badge');
    const promptEl = document.getElementById('b4p-quiz-prompt');
    const fb = document.getElementById('b4p-quiz-feedback');
    if (badge) badge.textContent = q.keyLabel;
    if (promptEl) promptEl.textContent = q.prompt;
    if (fb) fb.innerHTML = '';

    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples('b4p-quiz-staff', q.staffItems, 'window.basic4PartPage.playQuizSingle', 'treble');
    }

    const shuffled = [...q.choices].sort(() => Math.random() - 0.5);
    const optEl = document.getElementById('b4p-quiz-options');
    if (optEl) {
      optEl.innerHTML = shuffled.map(c => `
        <button type="button" class="btn btn-outline b4p-choice-btn" data-val="${c.val}"
          style="justify-content:flex-start; text-align:left; padding:12px 14px; font-size:0.9rem; line-height:1.45; white-space:normal;"
          onclick="window.basic4PartPage.submitQuiz('${c.val}')">${c.label}</button>
      `).join('');
    }
  },

  playQuizSingle(idx) {
    if (this.currentQuiz && this.currentQuiz.staffItems[idx]) {
      TheoryPages.playChordList([this.currentQuiz.staffItems[idx].notes]);
    }
  },

  playCurrentQuiz() {
    if (this.currentQuiz && this.currentQuiz.playPairs) {
      TheoryPages.playChordList(this.currentQuiz.playPairs, 600);
    }
  },

  submitQuiz(val) {
    if (!this.currentQuiz || this.answered) return;
    this.answered = true;
    this.stats.total += 1;
    const ok = val === this.currentQuiz.answer;
    if (ok) this.stats.correct += 1;

    if (typeof ChordLabRenderer !== 'undefined' && this.currentQuiz.revealItems) {
      ChordLabRenderer.renderLessonExamples('b4p-quiz-staff', this.currentQuiz.revealItems, 'window.basic4PartPage.playQuizSingle', 'treble');
    }

    document.querySelectorAll('.b4p-choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.val === this.currentQuiz.answer) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-success');
      } else if (btn.dataset.val === val && !ok) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-danger');
      }
    });

    const fb = document.getElementById('b4p-quiz-feedback');
    if (fb) {
      fb.innerHTML = ok
        ? `<div class="issue-card" style="border-left:4px solid #16a34a; background:#f0fdf4;"><div class="issue-title" style="color:#15803d;">✅ ถูกต้อง!</div><div class="issue-detail">${this.currentQuiz.explain}</div></div>`
        : `<div class="issue-card error"><div class="issue-title">❌ ยังไม่ถูกต้อง</div><div class="issue-detail">${this.currentQuiz.explain}</div></div>`;
    }

    if (!ok) {
      TheoryPages.showQuizErrorPopup(
        '.b4p-choice-btn',
        val,
        this.currentQuiz.answer,
        `แบบฝึกหัด Basic Four-Part Writing (${this.currentQuiz.keyLabel})`,
        this.currentQuiz.explain
      );
    }

    this.playCurrentQuiz();
    TheoryPages.updateBadge('b4p-stats-badge', this.stats);
  }
};

window.Basic4PartPage = Basic4PartPage;
