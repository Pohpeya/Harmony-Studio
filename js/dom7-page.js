/**
 * Harmony Studio - Dominant 7th (V7) & Leading-Tone Triad (vii°) Page
 * Covers:
 * - General Voice Leading of V7 (3rd/Leading Tone -> Root, 7th -> 3rd)
 * - Outer Part vs Inner Part (frustrated leading tone leaping down a 3rd to 5th)
 * - Complete (c) vs Incomplete (i) V7 -> I / i (Kostka) & Deceptive V7 -> vi
 * - Inversions of V7: V6/5, V4/3, V4/2
 * - The vii° (upper 3 notes of V7, tendency tones, vii°6 & doubling the 3rd)
 * - Independent chord/key selector under each section (no key-sig #/b clutter)
 * - Interactive 12-key Quiz Bank (120 questions)
 */

const Dom7Page = {
  // Ordered with natural-letter V7 chords first (G7, D7, A7, E7, B7, C7, F7...)
  CHORD_KEY_ORDER: [
    'C_maj', 'G_maj', 'D_maj', 'A_maj', 'E_maj', 'F_maj', 'Bb_maj',
    'Eb_maj', 'Ab_maj', 'Db_maj', 'Gb_maj', 'B_maj'
  ],

  quizBank: [],
  currentQuiz: null,
  answered: false,
  stats: { correct: 0, total: 0 },
  lessonVlPairs: [],
  lessonInvPairs: [],
  lessonViiPairs: [],

  init() {
    const buildOptions = (includeVii = false) => this.CHORD_KEY_ORDER.map(k => {
      const d = this.getKeyData(k);
      const label = includeVii
        ? `${d.v7Sym} / ${d.viiSym} (คีย์ ${d.iSym})`
        : `${d.v7Sym} → ${d.iSym} (คีย์ ${d.iSym})`;
      return `<option value="${k}">${label}</option>`;
    }).join('');

    const sec1Sel = document.getElementById('v7-key-sec1');
    const sec2Sel = document.getElementById('v7-key-sec2');
    const sec3Sel = document.getElementById('v7-key-sec3');
    const filterSel = document.getElementById('v7-key-filter');

    if (sec1Sel) {
      sec1Sel.innerHTML = buildOptions(false);
      sec1Sel.value = 'C_maj'; // G7 -> C
    }
    if (sec2Sel) {
      sec2Sel.innerHTML = buildOptions(false);
      sec2Sel.value = 'G_maj'; // D7 -> G
    }
    if (sec3Sel) {
      sec3Sel.innerHTML = buildOptions(true);
      sec3Sel.value = 'D_maj'; // A7 / C#° -> D
    }

    if (filterSel) {
      filterSel.innerHTML = `<option value="ALL">🎲 สุ่มทั้ง 12 คอร์ด (120 ข้อ)</option>` +
        this.CHORD_KEY_ORDER.map(k => {
          const d = this.getKeyData(k);
          return `<option value="${k}">เจาะจง ${d.v7Sym} (คีย์ ${d.iSym})</option>`;
        }).join('');
      filterSel.value = 'ALL';
    }

    this.renderLesson();
    this.buildQuizBank();
    this.nextQuiz();
  },

  /**
   * Build ascending chord notes from a root degree using Theory.spellIntervalNote
   */
  spellChord(rootDeg, stepOffsets, semiOffsets, baseOct = 4) {
    return stepOffsets.map((so, i) =>
      Theory.spellIntervalNote(rootDeg.step, rootDeg.alter || 0, baseOct, so, semiOffsets[i])
    );
  },

  /**
   * Compute all V7 & vii° theoretical data and playable voicings for a Major key
   */
  getKeyData(keyId) {
    const keyInfo = Theory.KEYS[keyId] || Theory.KEYS.C_maj;
    const scale = Theory.getScaleDegrees(keyId); // 0..6 => 1..7
    const pc = (deg) => Theory.formatPitchClass(deg);

    const d1 = scale[0], d2 = scale[1], d3 = scale[2], d4 = scale[3],
          d5 = scale[4], d6 = scale[5], d7 = scale[6];

    const iSym = pc(d1);
    const iiSym = `${pc(d2)}m`;
    const ivSym = pc(d4);
    const vSym = pc(d5);
    const v7Sym = `${pc(d5)}7`;
    const viSym = `${pc(d6)}m`;
    const viiSym = `${pc(d7)}°`;

    // Choose comfortable treble octave for V7 root & Tonic root
    const vBaseOct = ['G', 'A', 'B'].includes(d5.step) ? 3 : 4;
    const iBaseOct = ['A', 'B'].includes(d1.step) ? 3 : 4;

    // V7 voicings
    const v7Complete = this.spellChord(d5, [0, 2, 4, 6], [0, 4, 7, 10], vBaseOct);        // 5, 7, 2, 4
    const v7Incomplete = this.spellChord(d5, [0, 2, 6, 7], [0, 4, 10, 12], vBaseOct);     // 5, 7, 4, 5 (no 5th, double root)
    const v65 = this.spellChord(d7, [0, 2, 4, 5], [0, 3, 6, 8], ['A', 'B'].includes(d7.step) ? 3 : 4); // 7, 2, 4, 5
    const v43 = this.spellChord(d2, [0, 2, 3, 5], [0, 3, 5, 9], ['G', 'A', 'B'].includes(d2.step) ? 3 : 4); // 2, 4, 5, 7
    const v42 = this.spellChord(d4, [0, 1, 3, 5], [0, 2, 6, 9], ['G', 'A', 'B'].includes(d4.step) ? 3 : 4); // 4, 5, 7, 2

    // Tonic & other target voicings
    const iComplete = this.spellChord(d1, [0, 2, 4], [0, 4, 7], iBaseOct);                // 1, 3, 5
    const iIncomplete = this.spellChord(d1, [0, 2, 7], [0, 4, 12], iBaseOct);             // 1, 3, 1 (no 5th, doubled/tripled root)
    const i6 = this.spellChord(d3, [0, 2, 5], [0, 3, 8], ['A', 'B'].includes(d3.step) ? 3 : 4); // 3, 5, 1
    const viTriad = this.spellChord(d6, [0, 2, 4], [0, 3, 7], ['G', 'A', 'B'].includes(d6.step) ? 3 : 4); // 6, 1, 3

    // vii° voicings
    const viiRoot = this.spellChord(d7, [0, 2, 4], [0, 3, 6], ['A', 'B'].includes(d7.step) ? 3 : 4); // 7, 2, 4
    const vii6 = this.spellChord(d2, [0, 2, 5, 7], [0, 3, 9, 12], ['G', 'A', 'B'].includes(d2.step) ? 3 : 4); // 2, 4, 7, 2 (double 3rd)

    return {
      keyId,
      keyName: keyInfo.name,
      n1: pc(d1), n2: pc(d2), n3: pc(d3), n4: pc(d4), n5: pc(d5), n6: pc(d6), n7: pc(d7),
      iSym, iiSym, ivSym, vSym, v7Sym, viSym, viiSym,
      v7Complete, v7Incomplete, v65, v43, v42,
      iComplete, iIncomplete, i6, viTriad, viiRoot, vii6
    };
  },

  renderLesson() {
    this.renderSection1();
    this.renderSection2();
    this.renderSection3();
  },

  renderSection1() {
    const keyId = document.getElementById('v7-key-sec1')?.value || 'C_maj';
    const d = this.getKeyData(keyId);

    const summaryEl = document.getElementById('v7-sec1-summary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="theory-table-wrap">
          <table class="theory-table">
            <thead>
              <tr>
                <th>ตัวอย่างคอร์ด (${d.v7Sym} → ${d.iSym})</th>
                <th>โน้ตในคอร์ด</th>
                <th>การคลี่คลายเสียง (Voice Leading)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${d.v7Sym} (Complete)</strong> → <strong>${d.iSym} (Incomplete)</strong></td>
                <td>${d.n5} – ${d.n7} – ${d.n2} – ${d.n4}</td>
                <td>3rd (<strong>${d.n7} → ${d.n1}</strong>) ขึ้น | 7th (<strong>${d.n4} → ${d.n3}</strong>) ลง | Inner Part ยอมให้ ${d.n7} ลงไป ${d.n5} ได้</td>
              </tr>
              <tr>
                <td><strong>${d.v7Sym} (No 5)</strong> → <strong>${d.iSym} (Complete)</strong></td>
                <td>${d.n5} – ${d.n7} – ${d.n4} – ${d.n5}</td>
                <td>ตัด 5th (<strong>${d.n2}</strong>) และเบิ้ล Root (<strong>${d.n5}</strong>) → ได้คอร์ด <strong>${d.iSym}</strong> ครบ 3 เสียง (${d.n1}–${d.n3}–${d.n5})</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    this.lessonVlPairs = [
      { label: `${d.v7Sym}`, sublabel: 'Complete V⁷', notes: d.v7Complete, pair: [d.v7Complete, d.iIncomplete] },
      { label: `→ ${d.iSym}`, sublabel: 'Incomplete I (No 5)', notes: d.iIncomplete, pair: [d.v7Complete, d.iIncomplete] },
      { label: `${d.v7Sym} (No 5)`, sublabel: 'Double Root', notes: d.v7Incomplete, pair: [d.v7Incomplete, d.iComplete] },
      { label: `→ ${d.iSym}`, sublabel: 'Complete I', notes: d.iComplete, pair: [d.v7Incomplete, d.iComplete] }
    ];

    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples('v7-vl-staff', this.lessonVlPairs, 'window.dom7Page.playLessonVl', 'treble');
    }
  },

  renderSection2() {
    const keyId = document.getElementById('v7-key-sec2')?.value || 'G_maj';
    const d = this.getKeyData(keyId);

    const summaryEl = document.getElementById('v7-sec2-summary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="theory-table-wrap">
          <table class="theory-table">
            <thead>
              <tr>
                <th>รูปพลิกกลับของ ${d.v7Sym}</th>
                <th>ชื่อคอร์ด (Slash Chord)</th>
                <th>การเดินคอร์ดจริงในคีย์ ${d.iSym}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>V⁶₅</strong> (เบส = 3rd / ${d.n7})</td>
                <td><strong>${d.v7Sym}/${d.n7}</strong></td>
                <td>${d.iSym} – <strong>${d.v7Sym}/${d.n7}</strong> – ${d.iSym} (เบส ${d.n7} → ${d.n1})</td>
              </tr>
              <tr>
                <td><strong>V⁴₃</strong> (เบส = 5th / ${d.n2})</td>
                <td><strong>${d.v7Sym}/${d.n2}</strong></td>
                <td>${d.iSym} – <strong>${d.v7Sym}/${d.n2}</strong> – ${d.iSym}/${d.n3} (เบสเดินเรียบ ${d.n1}–${d.n2}–${d.n3})</td>
              </tr>
              <tr>
                <td><strong>V⁴₂</strong> (เบส = 7th / ${d.n4})</td>
                <td><strong>${d.v7Sym}/${d.n4}</strong></td>
                <td><strong>${d.v7Sym}/${d.n4}</strong> → <strong>${d.iSym}/${d.n3} เสมอ</strong> (เบส ${d.n4} → ${d.n3})</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    this.lessonInvPairs = [
      { label: `${d.v7Sym}/${d.n7}`, sublabel: 'V⁶₅ → ' + d.iSym, notes: d.v65, pair: [d.v65, d.iComplete] },
      { label: `${d.v7Sym}/${d.n2}`, sublabel: 'V⁴₃ → ' + d.iSym + '/' + d.n3, notes: d.v43, pair: [d.iComplete, d.v43, d.i6] },
      { label: `${d.v7Sym}/${d.n4}`, sublabel: 'V⁴₂ → ' + d.iSym + '/' + d.n3, notes: d.v42, pair: [d.v42, d.i6] }
    ];

    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples('v7-inv-staff', this.lessonInvPairs, 'window.dom7Page.playLessonInv', 'treble');
    }
  },

  renderSection3() {
    const keyId = document.getElementById('v7-key-sec3')?.value || 'D_maj';
    const d = this.getKeyData(keyId);

    const summaryEl = document.getElementById('v7-sec3-summary');
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="theory-table-wrap">
          <table class="theory-table">
            <thead>
              <tr>
                <th>เปรียบเทียบ ${d.v7Sym} กับ ${d.viiSym}</th>
                <th>โน้ตในคอร์ด</th>
                <th>หลักการเขียนและเบิ้ลโน้ต</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${d.v7Sym} (V⁷)</strong></td>
                <td>${d.n5} – <strong>${d.n7} – ${d.n2} – ${d.n4}</strong></td>
                <td>มีโน้ต 3 ตัวบนตรงกับคอร์ด <strong>${d.viiSym}</strong> ทุกตัว</td>
              </tr>
              <tr>
                <td><strong>${d.viiSym}/${d.n2} (vii°⁶)</strong></td>
                <td><strong>${d.n7} – ${d.n2} – ${d.n4}</strong> (เบส ${d.n2})</td>
                <td><strong>Double 3rd (${d.n2})</strong> ห้ามเบิ้ล ${d.n7} | คลี่คลาย ${d.n7}→${d.n1} และ ${d.n4}→${d.n3} ไปหา <strong>${d.iSym}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    this.lessonViiPairs = [
      { label: `${d.v7Sym}`, sublabel: `${d.n5}-${d.n7}-${d.n2}-${d.n4}`, notes: d.v7Complete, pair: [d.v7Complete, d.iComplete] },
      { label: `${d.viiSym}/${d.n2}`, sublabel: `vii°⁶ (Double ${d.n2})`, notes: d.vii6, pair: [d.vii6, d.iComplete] },
      { label: `→ ${d.iSym}`, sublabel: `${d.n7}→${d.n1}, ${d.n4}→${d.n3}`, notes: d.iComplete, pair: [d.vii6, d.iComplete] }
    ];

    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples('v7-vii-staff', this.lessonViiPairs, 'window.dom7Page.playLessonVii', 'treble');
    }
  },

  playLessonVl(idx) {
    const item = this.lessonVlPairs[idx];
    if (item) TheoryPages.playChordList(item.pair, 650);
  },

  playLessonInv(idx) {
    const item = this.lessonInvPairs[idx];
    if (item) TheoryPages.playChordList(item.pair, 650);
  },

  playLessonVii(idx) {
    const item = this.lessonViiPairs[idx];
    if (item) TheoryPages.playChordList(item.pair, 650);
  },

  buildQuizBank() {
    this.quizBank = [];

    this.CHORD_KEY_ORDER.forEach(keyId => {
      const d = this.getKeyData(keyId);
      const kLabel = `${d.v7Sym} → ${d.iSym}`;

      // 1. Leading Tone (3rd of V7) in Outer Part (Soprano)
      this.quizBank.push({
        id: `v7_lt_outer_${keyId}`,
        keyId,
        keyLabel: kLabel,
        prompt: `คอร์ด ${d.v7Sym} (V⁷ ในคีย์ ${d.iSym}): โน้ตขั้นที่ 3 (Leading Tone = ${d.n7}) เมื่ออยู่ในแนว Soprano (Outer Part) ต้องคลี่คลายไปที่โน้ตใดของคอร์ด ${d.iSym}?`,
        staffItems: [
          { label: `${d.v7Sym}`, sublabel: `3rd = ${d.n7}`, notes: d.v7Complete },
          { label: '❓ คอร์ดคำตอบ', sublabel: 'Resolve → I', notes: d.iIncomplete }
        ],
        revealItems: [
          { label: `${d.v7Sym}`, sublabel: `3rd = ${d.n7}`, notes: d.v7Complete },
          { label: `${d.iSym}`, sublabel: `${d.n7} → ${d.n1}`, notes: d.iIncomplete }
        ],
        choices: [
          { val: 'root', label: `ขึ้นไปหา Root (${d.n1}) ของคอร์ด ${d.iSym}` },
          { val: 'fifth', label: `กระโดดลงไปหา 5th (${d.n5}) ของคอร์ด ${d.iSym}` },
          { val: 'third', label: `ลงไปหา 3rd (${d.n3}) ของคอร์ด ${d.iSym}` },
          { val: 'stay', label: `ค้างโน้ตเดิม (${d.n7}) ไว้` }
        ],
        answer: 'root',
        explain: `ตามกฎ General Voice Leading ของ ${d.v7Sym}: โน้ตขั้นที่ 3 (Leading Tone = <strong>${d.n7}</strong>) เมื่ออยู่ในแนว <strong>Outer Part (Soprano)</strong> ต้องคลี่คลาย<strong>ขึ้นครึ่งเสียงไปหา Root (${d.n1})</strong> ของคอร์ด ${d.iSym} เสมอ`,
        playPairs: [d.v7Complete, d.iIncomplete]
      });

      // 2. Leading Tone in Inner Part (Alto / Tenor)
      this.quizBank.push({
        id: `v7_lt_inner_${keyId}`,
        keyId,
        keyLabel: kLabel,
        prompt: `คอร์ด ${d.v7Sym} (V⁷ ในคีย์ ${d.iSym}): หาก Leading Tone (${d.n7}) อยู่ในแนวใน (Inner Part: Alto หรือ Tenor) สามารถคลี่คลายแบบพิเศษไปที่ใดเพื่อให้ได้คอร์ด ${d.iSym} แบบ Complete?`,
        staffItems: [
          { label: `${d.v7Sym}`, sublabel: `LT ใน Inner Part`, notes: d.v7Complete },
          { label: '❓ คอร์ดคำตอบ', sublabel: 'Complete I', notes: d.iComplete }
        ],
        revealItems: [
          { label: `${d.v7Sym}`, sublabel: `LT = ${d.n7}`, notes: d.v7Complete },
          { label: `${d.iSym}`, sublabel: `${d.n7} กระโดดลง → ${d.n5}`, notes: d.iComplete }
        ],
        choices: [
          { val: 'leap5', label: `กระโดดลงคู่ 3 ไปหา 5th (${d.n5}) ของคอร์ด ${d.iSym}` },
          { val: 'leap3', label: `กระโดดขึ้นคู่ 4 ไปหา 3rd (${d.n3}) ของคอร์ด ${d.iSym}` },
          { val: 'down4', label: `เดินลงไปหา 4th (${d.n4}) ของคีย์` },
          { val: 'never', label: `ไม่ได้เลย ห้ามกระโดดในทุกแนวเสียง` }
        ],
        answer: 'leap5',
        explain: `เมื่อ Leading Tone (<strong>${d.n7}</strong>) ของ ${d.v7Sym} อยู่ใน <strong>Inner Part (Alto/Tenor)</strong> สามารถ<strong>กระโดดลงคู่ 3 ไปหาขั้นที่ 5 (${d.n5})</strong> ของคอร์ด ${d.iSym} ได้ เพื่อให้ได้คอร์ด Tonic แบบ Complete`,
        playPairs: [d.v7Complete, d.iComplete]
      });

      // 3. 7th of V7 Resolution
      this.quizBank.push({
        id: `v7_7th_res_${keyId}`,
        keyId,
        keyLabel: kLabel,
        prompt: `คอร์ด ${d.v7Sym} (V⁷ ในคีย์ ${d.iSym}): โน้ตขั้นที่ 7 (${d.n4}) ต้องคลี่คลายไปที่โน้ตใดในคอร์ด ${d.iSym}?`,
        staffItems: [
          { label: `${d.v7Sym}`, sublabel: `7th = ${d.n4}`, notes: d.v7Complete },
          { label: '❓ คอร์ดคำตอบ', sublabel: '7th Resolve', notes: d.iComplete }
        ],
        revealItems: [
          { label: `${d.v7Sym}`, sublabel: `7th = ${d.n4}`, notes: d.v7Complete },
          { label: `${d.iSym}`, sublabel: `${d.n4} → ${d.n3}`, notes: d.iComplete }
        ],
        choices: [
          { val: 'third', label: `เดินลงไปหา 3rd (${d.n3}) ของคอร์ด ${d.iSym}` },
          { val: 'fifth', label: `เดินขึ้นไปหา 5th (${d.n5}) ของคอร์ด ${d.iSym}` },
          { val: 'root', label: `กระโดดลงไปหา Root (${d.n1}) ของคอร์ด ${d.iSym}` },
          { val: 'sixth', label: `กระโดดขึ้นไปหา 6th (${d.n6}) ของคีย์` }
        ],
        answer: 'third',
        explain: `โน้ตขั้นที่ 7 ของ ${d.v7Sym} (<strong>${d.n4}</strong>) เป็น Tendency Tone บังคับให้<strong>คลี่คลายลงไปหาขั้นที่ 3 (${d.n3})</strong> ของคอร์ด ${d.iSym} เสมอ`,
        playPairs: [d.v7Complete, d.iComplete]
      });

      // 4. Incomplete V7 Voicing Rule
      this.quizBank.push({
        id: `v7_incomp_${keyId}`,
        keyId,
        keyLabel: kLabel,
        prompt: `เมื่อเขียนคอร์ด ${d.v7Sym} แบบ Incomplete เพื่อให้คลี่คลายไปคอร์ด ${d.iSym} แบบ Complete ต้องตัดโน้ตใดออกและเบิ้ลโน้ตใด?`,
        staffItems: [
          { label: `❓ Incomplete ${d.v7Sym}`, sublabel: 'Omit ? / Double ?', notes: d.v7Incomplete },
          { label: `${d.iSym}`, sublabel: 'Complete I', notes: d.iComplete }
        ],
        revealItems: [
          { label: `${d.v7Sym} (No 5)`, sublabel: `ตัด ${d.n2} เบิ้ล ${d.n5}`, notes: d.v7Incomplete },
          { label: `${d.iSym}`, sublabel: 'Complete I', notes: d.iComplete }
        ],
        choices: [
          { val: 'omit5_dblR', label: `ตัด 5th (${d.n2}) และเบิ้ล Root (${d.n5})` },
          { val: 'omit3_dblR', label: `ตัด 3rd (${d.n7}) และเบิ้ล Root (${d.n5})` },
          { val: 'omit7_dbl5', label: `ตัด 7th (${d.n4}) และเบิ้ล 5th (${d.n2})` },
          { val: 'omitR_dbl3', label: `ตัด Root (${d.n5}) และเบิ้ล 3rd (${d.n7})` }
        ],
        answer: 'omit5_dblR',
        explain: `<strong>Incomplete ${d.v7Sym}</strong> ทำได้วิธีเดียวคือ<strong>ตัดขั้นที่ 5 (${d.n2}) และเบิ้ล Root (${d.n5})</strong> ห้ามตัด 3rd (Leading Tone) หรือ 7th เด็ดขาด`,
        playPairs: [d.v7Incomplete, d.iComplete]
      });

      // 5. Kostka Complete (c) vs Incomplete (i) Pairing
      this.quizBank.push({
        id: `v7_kostka_ci_${keyId}`,
        keyId,
        keyLabel: kLabel,
        prompt: `คู่คอร์ด ${d.v7Sym} → ${d.iSym} ใน Root Position: เมื่อ ${d.v7Sym} เป็น Complete (c) และทุก Tendency Tone คลี่คลายตามปกติ คอร์ด ${d.iSym} ที่ตามมามักมีลักษณะใด?`,
        staffItems: [
          { label: `${d.v7Sym} (c)`, sublabel: `${d.n5}-${d.n7}-${d.n2}-${d.n4}`, notes: d.v7Complete },
          { label: `❓ คอร์ด ${d.iSym}`, sublabel: '(c) หรือ (i)?', notes: d.iIncomplete }
        ],
        revealItems: [
          { label: `${d.v7Sym} (c)`, sublabel: 'Complete', notes: d.v7Complete },
          { label: `${d.iSym} (i)`, sublabel: 'Incomplete (3 Root + 1 3rd)', notes: d.iIncomplete }
        ],
        choices: [
          { val: 'incomp_i', label: `Incomplete ${d.iSym} (i) — มี Root (${d.n1}) 3 ตัว + 3rd (${d.n3}) 1 ตัว (ไม่มี 5th)` },
          { val: 'comp_i_no3', label: `Incomplete ${d.iSym} (i) — ตัด 3rd (${d.n3}) ออกแล้วเบิ้ล 5th (${d.n5})` },
          { val: 'comp_vi', label: `ต้องเปลี่ยนเป็นคอร์ด ${d.viSym} (vi) เสมอ` },
          { val: 'v65_only', label: `ไม่สามารถจบที่ Root Position ${d.iSym} ได้` }
        ],
        answer: 'incomp_i',
        explain: `ในคู่ Root Position <strong>${d.v7Sym}(c) → ${d.iSym}(i)</strong>: เบสเดิน ${d.n5}→${d.n1}, 3rd(${d.n7})→${d.n1}, 5th(${d.n2})→${d.n1}, 7th(${d.n4})→${d.n3} จึงได้คอร์ด <strong>Incomplete ${d.iSym} (i)</strong> ที่มี Root 3 ตัว + 3rd 1 ตัว (ขาด 5th)`,
        playPairs: [d.v7Complete, d.iIncomplete]
      });

      // 6. V6/5 Inversion
      this.quizBank.push({
        id: `v7_v65_${keyId}`,
        keyId,
        keyLabel: kLabel,
        prompt: `คอร์ด ${d.v7Sym}/${d.n7} (V⁶₅) มีโน้ตใดเป็นเบส และมักใช้ในตำแหน่งใดของประโยคเพลง?`,
        staffItems: [
          { label: `❓ V Inversion`, sublabel: `เบส = ${d.n7}`, notes: d.v65 },
          { label: `${d.iSym}`, sublabel: 'Tonic Area', notes: d.iComplete }
        ],
        revealItems: [
          { label: `${d.v7Sym}/${d.n7}`, sublabel: 'V⁶₅ (เบส=LT)', notes: d.v65 },
          { label: `${d.iSym}`, sublabel: 'Tonic', notes: d.iComplete }
        ],
        choices: [
          { val: 'v65', label: `เบสคือ 3rd/LT (${d.n7}) ใช้ใน Weak Position (Tonic Area) เช่น ${d.iSym} – ${d.v7Sym}/${d.n7} – ${d.iSym}` },
          { val: 'v42', label: `เบสคือ 7th (${d.n4}) ใช้ปิด Cadence หนักแน่นที่สุด` },
          { val: 'v43', label: `เบสคือ 5th (${d.n2}) ต้องไปคอร์ด ${d.ivSym} เสมอ` },
          { val: 'root', label: `เบสคือ Root (${d.n5}) มีพลังเท่ากับ Authentic Cadence` }
        ],
        answer: 'v65',
        explain: `<strong>${d.v7Sym}/${d.n7} (V⁶₅ / 1st Inversion)</strong> มีขั้นที่ 3 / Leading Tone (<strong>${d.n7}</strong>) เป็นเบส จึงคลี่คลายขึ้นไปหา ${d.iSym} (<strong>${d.n1}</strong>) มักใช้ใน <strong>Weak Position (Tonic Area)</strong>`,
        playPairs: [d.v65, d.iComplete]
      });

      // 7. V4/3 Inversion
      this.quizBank.push({
        id: `v7_v43_${keyId}`,
        keyId,
        keyLabel: kLabel,
        prompt: `คอร์ด ${d.v7Sym}/${d.n2} (V⁴₃) มีบทบาทหลักอย่างไรในการเดินแนวเบส?`,
        staffItems: [
          { label: `${d.iSym}`, sublabel: `เบส ${d.n1}`, notes: d.iComplete },
          { label: `❓ Passing V`, sublabel: `เบส ${d.n2}`, notes: d.v43 },
          { label: `${d.iSym}/${d.n3}`, sublabel: `เบส ${d.n3}`, notes: d.i6 }
        ],
        revealItems: [
          { label: `${d.iSym}`, sublabel: `${d.n1}`, notes: d.iComplete },
          { label: `${d.v7Sym}/${d.n2}`, sublabel: `V⁴₃ (${d.n2})`, notes: d.v43 },
          { label: `${d.iSym}/${d.n3}`, sublabel: `${d.n3}`, notes: d.i6 }
        ],
        choices: [
          { val: 'passing', label: `ใช้เป็น Passing Chord ใน Tonic Area (เบสเดินขั้นบันได ${d.n1}–${d.n2}–${d.n3} หรือ ${d.n3}–${d.n2}–${d.n1})` },
          { val: 'cadential', label: `ใช้จบเพลงที่ Perfect Authentic Cadence เท่านั้น` },
          { val: 'deceptive', label: `ใช้เชื่อมไปคอร์ด ${d.viSym} (vi) เท่านั้น` },
          { val: 'subdom', label: `ใช้แทนคอร์ด ${d.ivSym} เพื่อกระโดดเบสคู่ 5` }
        ],
        answer: 'passing',
        explain: `<strong>${d.v7Sym}/${d.n2} (V⁴₃ / 2nd Inversion)</strong> มีขั้นที่ 5 (<strong>${d.n2}</strong>) เป็นเบส นิยมใช้เป็น <strong>Passing Chord ใน Tonic Area</strong> ให้เบสเดินเรียบขึ้นหรือลง เช่น <strong>${d.iSym} – ${d.v7Sym}/${d.n2} – ${d.iSym}/${d.n3}</strong>`,
        playPairs: [d.iComplete, d.v43, d.i6]
      });

      // 8. V4/2 Inversion
      this.quizBank.push({
        id: `v7_v42_${keyId}`,
        keyId,
        keyLabel: kLabel,
        prompt: `คอร์ด ${d.v7Sym}/${d.n4} (V⁴₂) มีขั้นที่ 7 (${d.n4}) อยู่ที่แนวเบส จึงแทบจะตามด้วยคอร์ดใดเสมอ?`,
        staffItems: [
          { label: `${d.v7Sym}/${d.n4}`, sublabel: `เบส = 7th (${d.n4})`, notes: d.v42 },
          { label: '❓ คอร์ดคำตอบ', sublabel: 'Mandatory Target', notes: d.i6 }
        ],
        revealItems: [
          { label: `${d.v7Sym}/${d.n4}`, sublabel: `V⁴₂ (${d.n4})`, notes: d.v42 },
          { label: `${d.iSym}/${d.n3}`, sublabel: `I⁶ (${d.n3})`, notes: d.i6 }
        ],
        choices: [
          { val: 'i6', label: `${d.iSym}/${d.n3} (I⁶) — เพราะเบส 7th (${d.n4}) ต้องลงไปหา 3rd (${d.n3})` },
          { val: 'i_root', label: `${d.iSym} (Root Position) — เบสกระโดดลงคู่ 4` },
          { val: 'iv', label: `${d.ivSym} (IV) — เบสค้างที่โน้ต ${d.n4}` },
          { val: 'v65', label: `${d.v7Sym}/${d.n7} (V⁶₅) — เบสกระโดดขึ้นไปหา Leading Tone` }
        ],
        answer: 'i6',
        explain: `<strong>${d.v7Sym}/${d.n4} (V⁴₂ / 3rd Inversion)</strong> มีโน้ตขั้นที่ 7 (<strong>${d.n4}</strong>) อยู่ในแนวเบส ซึ่งต้องคลี่คลายลงไปหาขั้นที่ 3 (<strong>${d.n3}</strong>) จึง<strong>ตามด้วย ${d.iSym}/${d.n3} (I⁶) แทบจะเสมอ</strong>`,
        playPairs: [d.v42, d.i6]
      });

      // 9. vii° Relation to V7
      this.quizBank.push({
        id: `v7_vii_rel_${keyId}`,
        keyId,
        keyLabel: kLabel,
        prompt: `คอร์ด ${d.viiSym} (vii°: ${d.n7}–${d.n2}–${d.n4}) มีความสัมพันธ์อย่างไรกับคอร์ด ${d.v7Sym} (V⁷)?`,
        staffItems: [
          { label: `${d.v7Sym}`, sublabel: `${d.n5}-${d.n7}-${d.n2}-${d.n4}`, notes: d.v7Complete },
          { label: `❓ Triad เทียบเท่า`, sublabel: `${d.n7}-${d.n2}-${d.n4}`, notes: d.viiRoot }
        ],
        revealItems: [
          { label: `${d.v7Sym}`, sublabel: 'Dominant 7th', notes: d.v7Complete },
          { label: `${d.viiSym}`, sublabel: 'Upper 3 notes of V⁷', notes: d.viiRoot }
        ],
        choices: [
          { val: 'upper3', label: `คือโน้ต 3 ตัวบนของ ${d.v7Sym} มี Tendency Tones เหมือนกัน (${d.n7}→${d.n1} และ ${d.n4}→${d.n3})` },
          { val: 'subdom', label: `เป็นคอร์ดกลุ่ม Subdominant ใช้แทน ${d.ivSym} ได้เท่านั้น` },
          { val: 'stronger', label: `มีพลัง Dominant หนักแน่นกว่า Root Position ${d.v7Sym}` },
          { val: 'major', label: `เป็น Major Triad ที่ไม่มี Tritone` }
        ],
        answer: 'upper3',
        explain: `<strong>${d.viiSym} (vii°)</strong> คือ<strong>โน้ต 3 ตัวบนของ ${d.v7Sym}</strong> (${d.n7}–${d.n2}–${d.n4}) จึงทำหน้าที่เป็น Dominant Family แทน ${d.v7Sym} ได้ (น้ำหนักเบากว่าเล็กน้อย) และมี Tendency Tones คู่เดียวกันคือ <strong>${d.n7}→${d.n1}</strong> และ <strong>${d.n4}→${d.n3}</strong>`,
        playPairs: [d.viiRoot, d.iComplete]
      });

      // 10. vii°6 Inversion & Doubling Rule
      this.quizBank.push({
        id: `v7_vii_rule_${keyId}`,
        keyId,
        keyLabel: kLabel,
        prompt: `การเขียนคอร์ด ${d.viiSym} (vii° ในคีย์ ${d.iSym}) ใน 4 แนวเสียง (SATB) นิยมใช้การพลิกกลับรูปใดและต้องเบิ้ลโน้ตตัวใด?`,
        staffItems: [
          { label: `❓ รูปมาตรฐานของ ${d.viiSym}`, sublabel: `Double ?`, notes: d.vii6 },
          { label: `${d.iSym}`, sublabel: 'Resolve', notes: d.iComplete }
        ],
        revealItems: [
          { label: `${d.viiSym}/${d.n2}`, sublabel: `vii°⁶ (Double ${d.n2})`, notes: d.vii6 },
          { label: `${d.iSym}`, sublabel: 'Tonic', notes: d.iComplete }
        ],
        choices: [
          { val: 'vii6_dbl3', label: `พลิกกลับขั้นที่ 1 (${d.viiSym}/${d.n2} หรือ vii°⁶) และเบิ้ล 3rd (${d.n2}) — ห้ามเบิ้ล Root (${d.n7})` },
          { val: 'root_dblR', label: `Root Position (${d.viiSym}) และเบิ้ล Root (${d.n7}) เพื่อย้ำ Leading Tone` },
          { val: 'vii64_dbl5', label: `พลิกกลับขั้นที่ 2 (${d.viiSym}/${d.n4}) และเบิ้ล 5th (${d.n4})` },
          { val: 'any_dbl7', label: `รูปใดก็ได้แต่ต้องเบิ้ล Leading Tone (${d.n7}) เสมอ` }
        ],
        answer: 'vii6_dbl3',
        explain: `กฎ 4 ข้อของ <strong>${d.viiSym} (vii°)</strong>: เป็น Diminished Triad, ไม่ค่อยใช้ Root Position และ<strong>ห้ามเบิ้ล Root (${d.n7})</strong> (เพราะเป็น Leading Tone จะเกิด Parallel 8ves) จึงนิยมใช้ <strong>1st Inversion (${d.viiSym}/${d.n2})</strong> และ <strong>Double 3rd (${d.n2})</strong>`,
        playPairs: [d.vii6, d.iComplete]
      });
    });
  },

  nextQuiz() {
    const filter = document.getElementById('v7-key-filter')?.value || 'ALL';
    const pool = filter === 'ALL' ? this.quizBank : this.quizBank.filter(q => q.keyId === filter);
    if (!pool.length) return;

    const prevId = this.currentQuiz ? this.currentQuiz.id : null;
    const candidates = pool.length > 1 ? pool.filter(q => q.id !== prevId) : pool;
    const q = candidates[Math.floor(Math.random() * candidates.length)];

    this.currentQuiz = q;
    this.answered = false;

    const badge = document.getElementById('v7-quiz-key-badge');
    const promptEl = document.getElementById('v7-quiz-prompt');
    const fb = document.getElementById('v7-quiz-feedback');
    if (badge) badge.textContent = q.keyLabel;
    if (promptEl) promptEl.textContent = q.prompt;
    if (fb) fb.innerHTML = '';

    if (typeof ChordLabRenderer !== 'undefined') {
      ChordLabRenderer.renderLessonExamples('v7-quiz-staff', q.staffItems, 'window.dom7Page.playQuizSingle', 'treble');
    }

    const shuffled = [...q.choices].sort(() => Math.random() - 0.5);
    const optEl = document.getElementById('v7-quiz-options');
    if (optEl) {
      optEl.innerHTML = shuffled.map(c => `
        <button type="button" class="btn btn-outline v7-choice-btn" data-val="${c.val}"
          style="justify-content:flex-start; text-align:left; padding:12px 14px; font-size:0.9rem; line-height:1.45; white-space:normal;"
          onclick="window.dom7Page.submitQuiz('${c.val}')">${c.label}</button>
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
      TheoryPages.playChordList(this.currentQuiz.playPairs, 650);
    }
  },

  submitQuiz(val) {
    if (!this.currentQuiz || this.answered) return;
    this.answered = true;
    this.stats.total += 1;
    const ok = val === this.currentQuiz.answer;
    if (ok) this.stats.correct += 1;

    // Reveal full staff labels after answering
    if (typeof ChordLabRenderer !== 'undefined' && this.currentQuiz.revealItems) {
      ChordLabRenderer.renderLessonExamples('v7-quiz-staff', this.currentQuiz.revealItems, 'window.dom7Page.playQuizSingle', 'treble');
    }

    document.querySelectorAll('.v7-choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.val === this.currentQuiz.answer) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-success');
      } else if (btn.dataset.val === val && !ok) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-danger');
      }
    });

    const fb = document.getElementById('v7-quiz-feedback');
    if (fb) {
      fb.innerHTML = ok
        ? `<div class="issue-card" style="border-left:4px solid #16a34a; background:#f0fdf4;"><div class="issue-title" style="color:#15803d;">✅ ถูกต้อง!</div><div class="issue-detail">${this.currentQuiz.explain}</div></div>`
        : `<div class="issue-card error"><div class="issue-title">❌ ยังไม่ถูกต้อง</div><div class="issue-detail">${this.currentQuiz.explain}</div></div>`;
    }

    if (!ok) {
      TheoryPages.showQuizErrorPopup(
        '.v7-choice-btn',
        val,
        this.currentQuiz.answer,
        `แบบฝึกหัด Dominant 7th (V⁷) & vii° (${this.currentQuiz.keyLabel})`,
        this.currentQuiz.explain
      );
    }

    this.playCurrentQuiz();
    TheoryPages.updateBadge('v7-stats-badge', this.stats);
  }
};

window.Dom7Page = Dom7Page;
