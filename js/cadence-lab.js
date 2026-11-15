/**
 * Harmony Studio - Cadence Lesson & Interactive Practice Controller
 * เนื้อหาบทเรียน + ตัวอย่าง Grand Staff 4 แนว (SATB) + แบบฝึกหัดเรื่อง Cadence:
 * 1. Authentic / Perfect Cadence (PAC & IAC)
 * 2. Plagal Cadence (Amen Cadence)
 * 3. Half Cadence / Imperfect Cadence
 * 4. Deceptive Cadence / Interrupted Cadence
 */

class CadenceLabController {
  constructor() {
    this.examples = {};
    this.quizBank = [];
    this.currentQuiz = null;
    this.answered = false;
    this.stats = { correct: 0, total: 0 };
  }

  init() {
    this.buildExamples();
    this.renderExampleStaves();
    this.populateKeyFilter();
    this.buildQuizBank();
    this.nextQuiz();
  }

  populateKeyFilter() {
    const sel = document.getElementById('cad-key-filter');
    if (!sel || typeof Theory === 'undefined') return;
    let html = `<option value="random">🎲 สุ่มทั้ง 12 คีย์ (72 ข้อ)</option>`;
    Theory.TWELVE_MAJOR_KEYS.forEach(kId => {
      const info = Theory.KEYS[kId];
      html += `<option value="${kId}">${info.name} (${Theory.formatKeySignatureInfo(kId)})</option>`;
    });
    sel.innerHTML = html;
  }

  buildExamples() {
    // ปรับทุกตัวอย่างให้อยู่ในช่วงเสียงเดียวกัน (C3 - E5) เพื่อความใส ชัดเจน และไพเราะสม่ำเสมอทั้งหน้า
    // 1. Authentic Cadence: PAC, IAC (พลิกกลับ), IAC (Soprano จบที่ 3rd)
    this.examples.authentic = {
      key: 'C_maj',
      chords: [
        {
          romanNumeral: 'V7',
          bass:    { step: 'G', alter: 0, octave: 3 },
          tenor:   { step: 'D', alter: 0, octave: 4 },
          alto:    { step: 'F', alter: 0, octave: 4 },
          soprano: { step: 'B', alter: 0, octave: 4 }
        },
        {
          romanNumeral: 'I',
          bass:    { step: 'C', alter: 0, octave: 3 },
          tenor:   { step: 'C', alter: 0, octave: 4 },
          alto:    { step: 'E', alter: 0, octave: 4 },
          soprano: { step: 'C', alter: 0, octave: 5 }
        }
      ],
      iacInversion: [
        {
          romanNumeral: 'V65',
          bass:    { step: 'B', alter: 0, octave: 2 },
          tenor:   { step: 'G', alter: 0, octave: 3 },
          alto:    { step: 'F', alter: 0, octave: 4 },
          soprano: { step: 'D', alter: 0, octave: 5 }
        },
        {
          romanNumeral: 'I',
          bass:    { step: 'C', alter: 0, octave: 3 },
          tenor:   { step: 'G', alter: 0, octave: 3 },
          alto:    { step: 'E', alter: 0, octave: 4 },
          soprano: { step: 'C', alter: 0, octave: 5 }
        }
      ],
      iacMelody: [
        {
          romanNumeral: 'V',
          bass:    { step: 'G', alter: 0, octave: 3 },
          tenor:   { step: 'B', alter: 0, octave: 3 },
          alto:    { step: 'G', alter: 0, octave: 4 },
          soprano: { step: 'D', alter: 0, octave: 5 }
        },
        {
          romanNumeral: 'I',
          bass:    { step: 'C', alter: 0, octave: 3 },
          tenor:   { step: 'C', alter: 0, octave: 4 },
          alto:    { step: 'G', alter: 0, octave: 4 },
          soprano: { step: 'E', alter: 0, octave: 5 }
        }
      ]
    };

    // 2. Plagal Cadence (IV -> I) ช่วง C3 - C5
    this.examples.plagal = {
      key: 'C_maj',
      chords: [
        {
          romanNumeral: 'IV',
          bass:    { step: 'F', alter: 0, octave: 3 },
          tenor:   { step: 'A', alter: 0, octave: 3 },
          alto:    { step: 'F', alter: 0, octave: 4 },
          soprano: { step: 'C', alter: 0, octave: 5 }
        },
        {
          romanNumeral: 'I',
          bass:    { step: 'C', alter: 0, octave: 3 },
          tenor:   { step: 'G', alter: 0, octave: 3 },
          alto:    { step: 'E', alter: 0, octave: 4 },
          soprano: { step: 'C', alter: 0, octave: 5 }
        }
      ]
    };

    // 3. Half Cadence (IV -> V) ช่วง F3 - C5
    this.examples.half = {
      key: 'C_maj',
      chords: [
        {
          romanNumeral: 'IV',
          bass:    { step: 'F', alter: 0, octave: 3 },
          tenor:   { step: 'A', alter: 0, octave: 3 },
          alto:    { step: 'F', alter: 0, octave: 4 },
          soprano: { step: 'C', alter: 0, octave: 5 }
        },
        {
          romanNumeral: 'V',
          bass:    { step: 'G', alter: 0, octave: 3 },
          tenor:   { step: 'G', alter: 0, octave: 3 },
          alto:    { step: 'D', alter: 0, octave: 4 },
          soprano: { step: 'B', alter: 0, octave: 4 }
        }
      ]
    };

    // 4. Deceptive Cadence (V7 -> vi) ช่วง G3 - D5
    this.examples.deceptive = {
      key: 'C_maj',
      chords: [
        {
          romanNumeral: 'V7',
          bass:    { step: 'G', alter: 0, octave: 3 },
          tenor:   { step: 'B', alter: 0, octave: 3 },
          alto:    { step: 'F', alter: 0, octave: 4 },
          soprano: { step: 'D', alter: 0, octave: 5 }
        },
        {
          romanNumeral: 'vi',
          bass:    { step: 'A', alter: 0, octave: 3 },
          tenor:   { step: 'C', alter: 0, octave: 4 },
          alto:    { step: 'E', alter: 0, octave: 4 },
          soprano: { step: 'C', alter: 0, octave: 5 }
        }
      ]
    };
  }

  renderSingleStaffWidget(containerId, chords, keyKey) {
    const el = document.getElementById(containerId);
    if (!el || typeof StaffRenderer === 'undefined') return;
    const renderer = new StaffRenderer(containerId, {
      chordWidth: 92,
      colorCoded: true,
      showErrors: false,
      showSpacingBadges: false,
      showParallelLines: false,
      showCommonToneTies: true
    });
    renderer.selectedChordIndex = -1;
    renderer.render(chords, keyKey, null);
  }

  renderExampleStaves() {
    this.renderSingleStaffWidget('cad-staff-pac', this.examples.authentic.chords, this.examples.authentic.key);
    this.renderSingleStaffWidget('cad-staff-iac-inv', this.examples.authentic.iacInversion, this.examples.authentic.key);
    this.renderSingleStaffWidget('cad-staff-iac-mel', this.examples.authentic.iacMelody, this.examples.authentic.key);
    this.renderSingleStaffWidget('cad-staff-plagal', this.examples.plagal.chords, this.examples.plagal.key);
    this.renderSingleStaffWidget('cad-staff-half', this.examples.half.chords, this.examples.half.key);
    this.renderSingleStaffWidget('cad-staff-deceptive', this.examples.deceptive.chords, this.examples.deceptive.key);
  }

  playExample(type) {
    let chords = null;
    if (type === 'pac') chords = this.examples.authentic.chords;
    else if (type === 'iac-inv') chords = this.examples.authentic.iacInversion;
    else if (type === 'iac-mel') chords = this.examples.authentic.iacMelody;
    else if (type === 'plagal') chords = this.examples.plagal.chords;
    else if (type === 'half') chords = this.examples.half.chords;
    else if (type === 'deceptive') chords = this.examples.deceptive.chords;

    if (chords) this.playTwoChordCadence(chords);
  }

  playTwoChordCadence(chords) {
    const audio = window.harmonyApp && window.harmonyApp.audio;
    if (!audio || !chords || chords.length === 0) return;
    audio.stop();
    audio.playProgression(chords, 60, null, null);
  }

  // =========================================================================
  // แบบฝึกหัดวิเคราะห์ Cadence (คลังโจทย์ 12 คีย์ × 6 รูปแบบ = 72 ข้อ)
  // =========================================================================
  buildQuizBank() {
    const templates = [
      {
        suffix: 'pac',
        answer: 'PAC',
        typeLabel: 'Authentic Cadence (PAC) / Perfect Cadence',
        chords: this.examples.authentic.chords,
        makeExplain: (kLabel, scale) => {
          const dom = Theory.formatPitchClass(scale[4]);
          const ton = Theory.formatPitchClass(scale[0]);
          return `ในคีย์ <strong>${kLabel}</strong> คอร์ด <strong>V7 (${dom}7) → I (${ton})</strong> อยู่ใน Root Position ทั้งคู่ และแนว Soprano จบที่โน้ต Tonic (${ton}) จึงเป็น <strong>Perfect Authentic Cadence (PAC)</strong>`;
        }
      },
      {
        suffix: 'iac_inv',
        answer: 'IAC',
        typeLabel: 'Imperfect Authentic Cadence (IAC)',
        chords: this.examples.authentic.iacInversion,
        makeExplain: (kLabel, scale) => {
          const ton = Theory.formatPitchClass(scale[0]);
          const lt = Theory.formatPitchClass(scale[6]);
          return `ในคีย์ <strong>${kLabel}</strong> คอร์ดแรกอยู่ในรูปพลิกกลับ <strong>V⁶₅</strong> (เบสเป็น Leading Tone ${lt} วิ่งขึ้น ${ton}) แม้ Soprano จบที่ Tonic ก็ยังถือเป็น <strong>Imperfect Authentic Cadence (IAC)</strong>`;
        }
      },
      {
        suffix: 'iac_mel',
        answer: 'IAC',
        typeLabel: 'Imperfect Authentic Cadence (IAC)',
        chords: this.examples.authentic.iacMelody,
        makeExplain: (kLabel, scale) => {
          const third = Theory.formatPitchClass(scale[2]);
          const ton = Theory.formatPitchClass(scale[0]);
          return `ในคีย์ <strong>${kLabel}</strong> คอร์ด V → I อยู่ใน Root Position แต่แนว Soprano จบที่ขั้นที่ 3 (<strong>${third}</strong> ไม่ใช่ Tonic ${ton}) จึงเป็น <strong>Imperfect Authentic Cadence (IAC)</strong>`;
        }
      },
      {
        suffix: 'plagal',
        answer: 'PLAGAL',
        typeLabel: 'Plagal Cadence ("Amen Cadence")',
        chords: this.examples.plagal.chords,
        makeExplain: (kLabel, scale) => {
          const sub = Theory.formatPitchClass(scale[3]);
          const ton = Theory.formatPitchClass(scale[0]);
          return `ในคีย์ <strong>${kLabel}</strong> เป็นการดำเนินคอร์ด <strong>IV (${sub}) → I (${ton})</strong> ให้ความรู้สึกสงบ นุ่มนวล เรียกว่า <strong>Plagal Cadence ("Amen")</strong>`;
        }
      },
      {
        suffix: 'half',
        answer: 'HALF',
        typeLabel: 'Half Cadence / Imperfect Cadence (British)',
        chords: this.examples.half.chords,
        makeExplain: (kLabel, scale) => {
          const sub = Theory.formatPitchClass(scale[3]);
          const dom = Theory.formatPitchClass(scale[4]);
          return `ในคีย์ <strong>${kLabel}</strong> เคลื่อนจาก <strong>IV (${sub}) → V (${dom})</strong> แล้วหยุดพักค้างคาที่คอร์ด Dominant (V) จึงเป็น <strong>Half Cadence / Imperfect Cadence</strong>`;
        }
      },
      {
        suffix: 'deceptive',
        answer: 'DECEPTIVE',
        typeLabel: 'Deceptive Cadence / Interrupted Cadence (British)',
        chords: this.examples.deceptive.chords,
        makeExplain: (kLabel, scale) => {
          const dom = Theory.formatPitchClass(scale[4]);
          const subMed = Theory.formatPitchClass(scale[5]);
          return `ในคีย์ <strong>${kLabel}</strong> คอร์ด <strong>V7 (${dom}7) → vi (${subMed}m)</strong> หักมุมไม่ลง I ไปยังคอร์ด vi แทน เรียกว่า <strong>Deceptive / Interrupted Cadence</strong>`;
        }
      }
    ];

    this.quizBank = [];
    Theory.TWELVE_MAJOR_KEYS.forEach(keyId => {
      const keyInfo = Theory.KEYS[keyId];
      const scale = Theory.getScaleDegrees(keyId);
      templates.forEach(tpl => {
        this.quizBank.push({
          id: `${tpl.suffix}_${keyId}`,
          answer: tpl.answer,
          typeLabel: tpl.typeLabel,
          key: keyId,
          keyLabel: keyInfo.name,
          chords: Theory.transposeProgressionToKey(tpl.chords, keyId),
          explain: tpl.makeExplain(keyInfo.name, scale)
        });
      });
    });
  }

  nextQuiz() {
    if (this.quizBank.length === 0) return;
    const filterEl = document.getElementById('cad-key-filter');
    const selectedKey = filterEl ? filterEl.value : 'random';
    const pool = (selectedKey && selectedKey !== 'random')
      ? this.quizBank.filter(q => q.key === selectedKey)
      : this.quizBank;

    if (pool.length === 0) return;
    let next;
    do {
      next = pool[Math.floor(Math.random() * pool.length)];
    } while (this.currentQuiz && pool.length > 1 && next.id === this.currentQuiz.id);

    this.currentQuiz = next;
    this.answered = false;

    const keyEl = document.getElementById('cad-quiz-key');
    if (keyEl) keyEl.textContent = `คีย์: ${next.keyLabel} (${Theory.formatKeySignatureInfo(next.key)})`;

    const fb = document.getElementById('cad-quiz-feedback');
    if (fb) {
      fb.innerHTML = `<div style="color:#64748b; font-size:0.88rem;">สังเกตสัญลักษณ์คอร์ด แนวเบส และแนว Soprano (หรือกด <strong>🔊 ฟังเสียง</strong>) แล้วเลือกคำตอบครับ</div>`;
    }

    document.querySelectorAll('.cad-choice-btn').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('btn-primary', 'btn-success', 'btn-danger');
      btn.classList.add('btn-outline');
    });

    this.renderSingleStaffWidget('cad-quiz-staff', next.chords, next.key);
    this.updateQuizStats();
  }

  playQuiz() {
    if (this.currentQuiz) {
      this.playTwoChordCadence(this.currentQuiz.chords);
    }
  }

  submitQuizAnswer(choice) {
    if (!this.currentQuiz || this.answered) return;
    this.answered = true;
    this.stats.total += 1;

    const isCorrect = choice === this.currentQuiz.answer;
    if (isCorrect) this.stats.correct += 1;

    document.querySelectorAll('.cad-choice-btn').forEach(btn => {
      btn.disabled = true;
      const val = btn.dataset.choice;
      if (val === this.currentQuiz.answer) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-success');
      } else if (val === choice && !isCorrect) {
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-danger');
      }
    });

    const fb = document.getElementById('cad-quiz-feedback');
    if (fb) {
      if (isCorrect) {
        fb.innerHTML = `
          <div class="issue-card" style="border-left:4px solid #16a34a; background:#f0fdf4;">
            <div class="issue-title" style="color:#15803d;">✅ ถูกต้อง! — ${this.currentQuiz.typeLabel}</div>
            <div class="issue-detail">${this.currentQuiz.explain}</div>
          </div>
        `;
      } else {
        let chosenLabel = choice;
        const chosenBtn = document.querySelector(`.cad-choice-btn[data-choice="${choice}"]`);
        if (chosenBtn) chosenLabel = chosenBtn.textContent.trim();

        fb.innerHTML = `
          <div class="issue-card error">
            <div class="issue-title">❌ ยังไม่ถูกต้อง — คำตอบที่ถูกคือ ${this.currentQuiz.typeLabel}</div>
            <div class="issue-detail">${this.currentQuiz.explain}</div>
          </div>
        `;
        if (typeof window.showErrorPopup === 'function') {
          window.showErrorPopup({
            title: 'ยังไม่ถูกต้อง — ลองเช็กเหตุผลกัน!',
            subtitle: `แบบฝึกหัด Cadence (คีย์ ${this.currentQuiz.keyLabel})`,
            reasons: [
              `❌ <strong>คำตอบที่คุณเลือก:</strong> ${chosenLabel}`,
              `✅ <strong>คำตอบที่ถูกต้อง:</strong> ${this.currentQuiz.typeLabel}`
            ],
            tip: `💡 <strong>ผิดเพราะอะไร / เหตุผลที่ถูกต้อง:</strong> ${this.currentQuiz.explain}`
          });
        }
      }
    }

    this.playQuiz();
    this.updateQuizStats();
  }

  updateQuizStats() {
    const el = document.getElementById('cad-stats-badge');
    if (el) {
      el.textContent = `คะแนนสะสม: ${this.stats.correct} / ${this.stats.total} ข้อ`;
    }
  }
}

window.CadenceLabController = CadenceLabController;
