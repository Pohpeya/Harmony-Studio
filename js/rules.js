/**
 * Four-Part Harmony Grader - Rule Checker Engine
 * ตรวจสอบกฎการประสานเสียง 4 แนว (Voice Leading Rules):
 * 1. Parallel 5ths & 8ves (ขนาน 5 และ ขนาน 8)
 * 2. Voice Spacing (ระยะห่างระหว่างแนว S-A, A-T, T-B)
 * 3. Chord Tones & Inversion (โน้ตในคอร์ด และเสียงเบส)
 * 4. Doubling (การซ้ำโน้ต เช่น ห้ามซ้ำ Leading Tone, กฎ 6/4)
 * 5. Voice Crossing & Overlap (การข้ามแนว และการซ้อนทับเสียง)
 * 6. Vocal Ranges (ขอบเขตระยะเสียงร้อง SATB)
 * 7. Leading Tone Resolution (การคลี่คลายโน้ตขั้นที่ 7)
 */

const HarmonyRules = {
  VOICE_NAMES: ['soprano', 'alto', 'tenor', 'bass'],
  VOICE_LABELS_TH: {
    soprano: 'โซปราโน (Soprano)',
    alto: 'อัลโต (Alto)',
    tenor: 'เทเนอร์ (Tenor)',
    bass: 'เบส (Bass)'
  },
  VOICE_SHORT: {
    soprano: 'S',
    alto: 'A',
    tenor: 'T',
    bass: 'B'
  },

  /**
   * ตรวจสอบผลงานทั้งบทเพลง (List of chords)
   * @param {Array} chords - รายการคอร์ด [{ soprano, alto, tenor, bass, romanNumeral }]
   * @param {String} keyKey - คีย์เพลง เช่น 'C_maj'
   * @returns {Object} { isValid, errors, warnings, chordReports, totalScore }
   */
  checkProgression(chords, keyKey) {
    const issues = [];
    const chordReports = [];

    if (!chords || chords.length === 0) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
        chordReports: [],
        totalScore: 100,
        summary: 'ยังไม่มีคอร์ดสำหรับตรวจ'
      };
    }

    const scale = Theory.getScaleDegrees(keyKey);
    const keyInfo = Theory.KEYS[keyKey] || Theory.KEYS['C_maj'];
    // Leading tone ของคีย์ (องศาที่ 7)
    const leadingTone = scale[6];

    // ตรวจสอบแต่ละคอร์ดเดี่ยวๆ (Vertical Rules)
    for (let i = 0; i < chords.length; i++) {
      const chord = chords[i];
      const report = {
        index: i,
        chordName: chord.romanNumeral || `คอร์ดที่ ${i + 1}`,
        notes: {
          soprano: Theory.formatNoteName(chord.soprano),
          alto: Theory.formatNoteName(chord.alto),
          tenor: Theory.formatNoteName(chord.tenor),
          bass: Theory.formatNoteName(chord.bass)
        },
        issues: []
      };

      // 1. ตรวจสอบขอบเขตเสียงร้อง (Vocal Ranges)
      this.checkVocalRanges(chord, i, report.issues);

      // 2. ตรวจสอบการข้ามแนวเสียงในคอร์ดเดียวกัน (Voice Crossing)
      this.checkVoiceCrossing(chord, i, report.issues);

      // 3. ตรวจสอบระยะห่างระหว่างแนวเสียง (Spacing)
      this.checkSpacing(chord, i, report.issues);

      // 4. ตรวจสอบโน้ตในคอร์ดและการซ้ำเสียง (Chord Tones & Doubling)
      if (chord.romanNumeral) {
        this.checkChordTonesAndDoubling(chord, i, keyKey, leadingTone, report.issues);
      }

      chordReports.push(report);
      issues.push(...report.issues);
    }

    // ตรวจสอบความต่อเนื่องระหว่าง 2 คอร์ดที่ติดกัน (Horizontal / Voice Leading Rules)
    for (let i = 0; i < chords.length - 1; i++) {
      const c1 = chords[i];
      const c2 = chords[i + 1];

      // 5. ตรวจสอบขนาน 5 และ ขนาน 8 (Parallel 5ths & 8ves) - หัวใจหลักของโจทย์!
      this.checkConsecutiveFifthsAndOctaves(c1, c2, i, i + 1, issues);

      // 6. ตรวจสอบ Voice Overlapping
      this.checkVoiceOverlapping(c1, c2, i, i + 1, issues);

      // 7. ตรวจสอบการคลี่คลาย Leading Tone
      this.checkLeadingToneResolution(c1, c2, i, i + 1, keyKey, leadingTone, issues);
    }

    const errors = issues.filter(item => item.severity === 'error');
    const warnings = issues.filter(item => item.severity === 'warning');

    // คำนวณคะแนนประเมิน (เต็ม 100 หักตามข้อผิดพลาด)
    let score = 100 - (errors.length * 15) - (warnings.length * 5);
    if (score < 0) score = 0;

    return {
      isValid: errors.length === 0,
      totalScore: score,
      errors,
      warnings,
      allIssues: issues,
      chordReports,
      summary: errors.length === 0 
        ? (warnings.length === 0 ? 'สมบูรณ์แบบ! ถูกต้องตามหลักทฤษฎี Four-Part Harmony ทุกประการ' : 'ผ่านเกณฑ์ แต่มีข้อพึงระวังเล็กน้อย') 
        : `พบข้อผิดพลาดที่ต้องแก้ไข ${errors.length} จุด`
    };
  },

  /**
   * 1. ตรวจสอบ Parallel 5ths & Parallel 8ves และ Consecutive Unisons
   */
  checkConsecutiveFifthsAndOctaves(c1, c2, idx1, idx2, issues) {
    const voices = ['soprano', 'alto', 'tenor', 'bass'];
    const chordNum1 = idx1 + 1;
    const chordNum2 = idx2 + 1;

    // ตรวจสอบทุกคู่แนวเสียง (S-A, S-T, S-B, A-T, A-B, T-B)
    for (let a = 0; a < voices.length; a++) {
      for (let b = a + 1; b < voices.length; b++) {
        const vHigh = voices[a];
        const vLow = voices[b];

        const n1High = c1[vHigh];
        const n1Low = c1[vLow];
        const n2High = c2[vHigh];
        const n2Low = c2[vLow];

        if (!n1High || !n1Low || !n2High || !n2Low) continue;

        const midi1High = Theory.noteToMidi(n1High);
        const midi1Low = Theory.noteToMidi(n1Low);
        const midi2High = Theory.noteToMidi(n2High);
        const midi2Low = Theory.noteToMidi(n2Low);

        const diffHigh = midi2High - midi1High;
        const diffLow = midi2Low - midi1Low;

        // คำนวณ interval คอร์ด 1 และ คอร์ด 2
        const int1 = Theory.getInterval(n1Low, n1High);
        const int2 = Theory.getInterval(n2Low, n2High);

        const vNameHigh = this.VOICE_LABELS_TH[vHigh];
        const vNameLow = this.VOICE_LABELS_TH[vLow];
        const vShortPair = `${this.VOICE_SHORT[vLow]}-${this.VOICE_SHORT[vHigh]}`;

        // ทิศทางการเคลื่อนที่
        const isParallelMotion = (diffHigh > 0 && diffLow > 0) || (diffHigh < 0 && diffLow < 0);
        const isContraryMotion = (diffHigh > 0 && diffLow < 0) || (diffHigh < 0 && diffLow > 0);
        const isObliqueMotion = (diffHigh === 0 || diffLow === 0);

        // 1.1 Parallel Fifths (ขนาน 5)
        if (int1.isPerfectFifth && int2.isPerfectFifth) {
          if (isParallelMotion) {
            issues.push({
              severity: 'error',
              type: 'parallel-5th',
              chordIndex1: idx1,
              chordIndex2: idx2,
              voices: [vLow, vHigh],
              title: `❌ ขนาน 5 (Parallel 5th) ระหว่างแนว ${vShortPair}`,
              detail: `คอร์ดที่ ${chordNum1} (${Theory.formatNoteName(n1Low)}-${Theory.formatNoteName(n1High)}) ไปยังคอร์ดที่ ${chordNum2} (${Theory.formatNoteName(n2Low)}-${Theory.formatNoteName(n2High)}) เคลื่อนที่ไปในทิศทางเดียวกันในระยะคู่ 5 บริสุทธิ์`,
              advice: `ปรับแนวเสียงใดแนวเสียงหนึ่งให้เคลื่อนที่สวนทาง (Contrary Motion) หรือคงเสียงไว้ (Oblique Motion)`
            });
          } else if (isContraryMotion) {
            // Contrary 5ths (คู่ 5 เคลื่อนที่สวนทาง แต่ตกคู่ 5 เหมือนเดิม) - ทฤษฎีคลาสสิกถือเป็นข้อพึงระวัง
            issues.push({
              severity: 'warning',
              type: 'contrary-5th',
              chordIndex1: idx1,
              chordIndex2: idx2,
              voices: [vLow, vHigh],
              title: `⚠️ คู่ 5 สวนทาง (Consecutive 5th by Contrary Motion) ระหว่างแนว ${vShortPair}`,
              detail: `คอร์ดที่ ${chordNum1} ไปยังคอร์ดที่ ${chordNum2} เริ่มจากคู่ 5 และสวนทางไปจบที่คู่ 5 ควรระวังการสูญเสียอิสรภาพของแนวเสียง`,
              advice: `พิจารณาเปลี่ยนการกระจายเสียงในคอร์ดที่ ${chordNum2}`
            });
          }
        }

        // 1.2 Parallel Octaves / Unisons (ขนาน 8 / ขนาน 1)
        if (int1.isPerfectOctaveOrUnison && int2.isPerfectOctaveOrUnison) {
          if (isParallelMotion) {
            const isUnison = int1.simpleSteps === 1 && int2.simpleSteps === 1;
            const term = isUnison ? 'ขนาน 1 (Parallel Unison)' : 'ขนาน 8 (Parallel Octave)';
            issues.push({
              severity: 'error',
              type: isUnison ? 'parallel-unison' : 'parallel-8ve',
              chordIndex1: idx1,
              chordIndex2: idx2,
              voices: [vLow, vHigh],
              title: `❌ ${term} ระหว่างแนว ${vShortPair}`,
              detail: `คอร์ดที่ ${chordNum1} (${Theory.formatNoteName(n1Low)}-${Theory.formatNoteName(n1High)}) ไปยังคอร์ดที่ ${chordNum2} (${Theory.formatNoteName(n2Low)}-${Theory.formatNoteName(n2High)}) เคลื่อนที่คู่ 8 / ยูนิสันขนานกัน`,
              advice: `เปลี่ยนแนวเสียงหนึ่งให้ก้าวไปหาโน้ตตัวอื่นในคอร์ดเพื่อรักษาความเป็นเอกเทศของทั้งสองแนวเสียง`
            });
          } else if (isContraryMotion) {
            // Contrary Octaves
            issues.push({
              severity: 'warning',
              type: 'contrary-8ve',
              chordIndex1: idx1,
              chordIndex2: idx2,
              voices: [vLow, vHigh],
              title: `⚠️ คู่ 8 สวนทาง (Consecutive Octave by Contrary Motion) ระหว่างแนว ${vShortPair}`,
              detail: `คอร์ดที่ ${chordNum1} ไปคอร์ดที่ ${chordNum2} จบที่คู่ 8 ด้วยการเคลื่อนที่สวนทาง`,
              advice: `ในดนตรียุค Common Practice แนะนำให้หลีกเลี่ยง consecutive octaves ทุกรูปแบบ`
            });
          }
        }

        // 1.3 Direct / Hidden 5ths & 8ves ในแนวริมนอก (Outer voices: Soprano & Bass)
        if (vLow === 'bass' && vHigh === 'soprano' && isParallelMotion) {
          const sopranoLeap = Math.abs(diffHigh) > 2; // Soprano เคลื่อนที่แบบกระโดด (มากกว่า 1 ขั้น)
          if (int2.isPerfectFifth && sopranoLeap) {
            issues.push({
              severity: 'warning',
              type: 'direct-5th',
              chordIndex1: idx1,
              chordIndex2: idx2,
              voices: ['bass', 'soprano'],
              title: `⚠️ Direct 5th / Hidden 5th ระหว่าง Bass และ Soprano`,
              detail: `คอร์ดที่ ${chordNum1} ไป ${chordNum2} แนวริมเคลื่อนที่ไปในทิศทางเดียวกันสู่คู่ 5 บริสุทธิ์ โดย Soprano เคลื่อนที่แบบก้าวกระโดด`,
              advice: `ให้แนว Soprano เคลื่อนที่แบบเป็นขั้น (Stepwise) เข้าหาคู่ 5`
            });
          } else if (int2.isPerfectOctaveOrUnison && sopranoLeap) {
            issues.push({
              severity: 'warning',
              type: 'direct-8ve',
              chordIndex1: idx1,
              chordIndex2: idx2,
              voices: ['bass', 'soprano'],
              title: `⚠️ Direct 8ve / Hidden 8ve ระหว่าง Bass และ Soprano`,
              detail: `คอร์ดที่ ${chordNum1} ไป ${chordNum2} แนวริมเคลื่อนที่ไปในทิศทางเดียวกันสู่คู่ 8 บริสุทธิ์ โดย Soprano เคลื่อนที่แบบก้าวกระโดด`,
              advice: `ให้แนว Soprano เคลื่อนที่แบบเป็นขั้น (Stepwise) เข้าหาคู่ 8`
            });
          }
        }
      }
    }
  },

  /**
   * 2. ตรวจสอบระยะห่างระหว่างแนวเสียง (Voice Spacing)
   * กฎ: S-A <= 1 octave (12 semitones)
   *      A-T <= 1 octave (12 semitones)
   *      T-B can exceed 1 octave, but normally <= 2 octaves (24 semitones)
   */
  checkSpacing(chord, idx, issues) {
    const chordNum = idx + 1;
    const s = chord.soprano;
    const a = chord.alto;
    const t = chord.tenor;
    const b = chord.bass;

    if (!s || !a || !t || !b) return;

    const midiS = Theory.noteToMidi(s);
    const midiA = Theory.noteToMidi(a);
    const midiT = Theory.noteToMidi(t);
    const midiB = Theory.noteToMidi(b);

    // Spacing Soprano - Alto
    const distSA = midiS - midiA;
    if (distSA > 12) {
      issues.push({
        severity: 'error',
        type: 'spacing-sa',
        chordIndex: idx,
        voices: ['alto', 'soprano'],
        title: `❌ ระยะห่าง S-A เกิน 1 คู่แปด (${distSA} ครึ่งเสียง)`,
        detail: `คอร์ดที่ ${chordNum}: แนว Soprano (${Theory.formatNoteName(s)}) กับ Alto (${Theory.formatNoteName(a)}) ห่างกันเกิน 1 อ็อกเทฟ`,
        advice: `ปรับแนว Alto ให้สูงขึ้น หรือ Soprano ให้ต่ำลงให้อยู่ภายในระยะไม่เกิน 1 คู่แปด`
      });
    }

    // Spacing Alto - Tenor
    const distAT = midiA - midiT;
    if (distAT > 12) {
      issues.push({
        severity: 'error',
        type: 'spacing-at',
        chordIndex: idx,
        voices: ['tenor', 'alto'],
        title: `❌ ระยะห่าง A-T เกิน 1 คู่แปด (${distAT} ครึ่งเสียง)`,
        detail: `คอร์ดที่ ${chordNum}: แนว Alto (${Theory.formatNoteName(a)}) กับ Tenor (${Theory.formatNoteName(t)}) ห่างกันเกิน 1 อ็อกเทฟ`,
        advice: `ปรับให้ 3 แนวบน (S-A-T) อยู่ในระยะไม่เกิน 1 คู่แปดต่อคู่เพื่อความกลมกลืนของเสียงประสาน`
      });
    }

    // Spacing Tenor - Bass (อนุญาตให้เกิน 1 octave ได้ แต่ไม่ควรเกินคู่ 12 = 19 ครึ่งเสียง)
    const distTB = midiT - midiB;
    if (distTB > 19) {
      issues.push({
        severity: 'error',
        type: 'spacing-tb',
        chordIndex: idx,
        voices: ['bass', 'tenor'],
        title: `❌ ระยะห่าง T-B เกินคู่ 12 (${distTB} ครึ่งเสียง)`,
        detail: `คอร์ดที่ ${chordNum}: แนว Tenor (${Theory.formatNoteName(t)}) กับ Bass (${Theory.formatNoteName(b)}) ห่างกันเกินคู่ 12 (19 ครึ่งเสียง)`,
        advice: `แม้ระยะระหว่าง Tenor และ Bass จะกว้างเกิน 1 คู่แปดได้ แต่ต้องไม่เกินคู่ 12 เพื่อไม่ให้เกิดช่องว่างของเสียงประสานช่วงกลาง`
      });
    }
  },

  /**
   * 3. ตรวจสอบ Voice Crossing ภายในคอร์ดเดียวกัน
   * กฎ: S >= A >= T >= B
   */
  checkVoiceCrossing(chord, idx, issues) {
    const chordNum = idx + 1;
    const s = chord.soprano;
    const a = chord.alto;
    const t = chord.tenor;
    const b = chord.bass;

    if (!s || !a || !t || !b) return;

    const midiS = Theory.noteToMidi(s);
    const midiA = Theory.noteToMidi(a);
    const midiT = Theory.noteToMidi(t);
    const midiB = Theory.noteToMidi(b);

    if (midiA > midiS) {
      issues.push({
        severity: 'error',
        type: 'voice-crossing',
        chordIndex: idx,
        voices: ['alto', 'soprano'],
        title: `❌ การข้ามแนวเสียง (Voice Crossing): Alto สูงกว่า Soprano`,
        detail: `คอร์ดที่ ${chordNum}: Alto (${Theory.formatNoteName(a)}) สูงกว่า Soprano (${Theory.formatNoteName(s)})`,
        advice: `แนวเสียง Soprano ต้องอยู่สูงที่สุดเสมอในคอร์ดเดียวกัน`
      });
    }

    if (midiT > midiA) {
      issues.push({
        severity: 'error',
        type: 'voice-crossing',
        chordIndex: idx,
        voices: ['tenor', 'alto'],
        title: `❌ การข้ามแนวเสียง (Voice Crossing): Tenor สูงกว่า Alto`,
        detail: `คอร์ดที่ ${chordNum}: Tenor (${Theory.formatNoteName(t)}) สูงกว่า Alto (${Theory.formatNoteName(a)})`,
        advice: `แนวเสียง Alto ต้องอยู่สูงกว่าหรือเท่ากับ Tenor เสมอ`
      });
    }

    if (midiB > midiT) {
      issues.push({
        severity: 'error',
        type: 'voice-crossing',
        chordIndex: idx,
        voices: ['bass', 'tenor'],
        title: `❌ การข้ามแนวเสียง (Voice Crossing): Bass สูงกว่า Tenor`,
        detail: `คอร์ดที่ ${chordNum}: Bass (${Theory.formatNoteName(b)}) สูงกว่า Tenor (${Theory.formatNoteName(t)})`,
        advice: `แนวเสียง Bass ต้องอยู่ต่ำที่สุดเสมอ`
      });
    }
  },

  /**
   * 4. ตรวจสอบ Voice Overlapping ระหว่าง 2 คอร์ดที่ต่อเนื่องกัน
   */
  checkVoiceOverlapping(c1, c2, idx1, idx2, issues) {
    const chordNum1 = idx1 + 1;
    const chordNum2 = idx2 + 1;

    const midi1 = {
      s: Theory.noteToMidi(c1.soprano),
      a: Theory.noteToMidi(c1.alto),
      t: Theory.noteToMidi(c1.tenor),
      b: Theory.noteToMidi(c1.bass)
    };
    const midi2 = {
      s: Theory.noteToMidi(c2.soprano),
      a: Theory.noteToMidi(c2.alto),
      t: Theory.noteToMidi(c2.tenor),
      b: Theory.noteToMidi(c2.bass)
    };

    // Alto ในคอร์ดใหม่ สูงกว่า Soprano ในคอร์ดเดิม
    if (midi2.a > midi1.s) {
      issues.push({
        severity: 'warning',
        type: 'voice-overlap',
        chordIndex1: idx1,
        chordIndex2: idx2,
        title: `⚠️ การซ้อนทับแนวเสียง (Voice Overlap): Alto ไปสูงกว่า Soprano คอร์ดก่อนหน้า`,
        detail: `จากคอร์ด ${chordNum1} ไป ${chordNum2}: Alto ขยับขึ้นไปสูงกว่าโน้ตเดิมของ Soprano`,
        advice: `ปรับแนวเสียงไม่ให้ข้ามทับตำแหน่งเดิมของแนวเสียงที่สูงกว่า`
      });
    }

    // Soprano ในคอร์ดใหม่ ต่ำกว่า Alto ในคอร์ดเดิม
    if (midi2.s < midi1.a) {
      issues.push({
        severity: 'warning',
        type: 'voice-overlap',
        chordIndex1: idx1,
        chordIndex2: idx2,
        title: `⚠️ การซ้อนทับแนวเสียง (Voice Overlap): Soprano ตกต่ำกว่า Alto คอร์ดก่อนหน้า`,
        detail: `จากคอร์ด ${chordNum1} ไป ${chordNum2}: Soprano ขยับลงมาต่ำกว่าโน้ตเดิมของ Alto`,
        advice: `รักษาความต่อเนื่องของทำนองหลักไม่ให้เหลื่อมล้ำกับแนวรอง`
      });
    }

    // Tenor ขยับสูงกว่า Alto เดิม
    if (midi2.t > midi1.a) {
      issues.push({
        severity: 'warning',
        type: 'voice-overlap',
        chordIndex1: idx1,
        chordIndex2: idx2,
        title: `⚠️ การซ้อนทับแนวเสียง (Voice Overlap): Tenor ขยับสูงกว่า Alto คอร์ดก่อนหน้า`,
        detail: `จากคอร์ด ${chordNum1} ไป ${chordNum2}: Tenor ไปสูงกว่าตำแหน่งเดิมของ Alto`,
        advice: `ปรับให้ Tenor อยู่ต่ำกว่าแนวของ Alto เดิม`
      });
    }
  },

  /**
   * 5. ตรวจสอบขอบเขตเสียงร้อง (Vocal Ranges)
   */
  checkVocalRanges(chord, idx, issues) {
    const chordNum = idx + 1;
    for (const v of this.VOICE_NAMES) {
      const note = chord[v];
      if (!note) continue;
      const midi = Theory.noteToMidi(note);
      const range = Theory.VOICE_RANGES[v];

      if (midi < range.min || midi > range.max) {
        issues.push({
          severity: 'warning',
          type: 'vocal-range',
          chordIndex: idx,
          voice: v,
          title: `⚠️ โน้ตนอกขอบเขตเสียงร้อง: ${this.VOICE_LABELS_TH[v]}`,
          detail: `คอร์ดที่ ${chordNum}: โน้ต ${Theory.formatNoteName(note)} อยู่นอกช่วงมาตรฐาน (${range.minName} - ${range.maxName})`,
          advice: `ปรับโน้ตให้อยู่ในช่วงเสียงที่นักร้องสามารถเปล่งเสียงได้อย่างสบายและเป็นธรรมชาติ`
        });
      }
    }
  },

  /**
   * 6. ตรวจสอบโน้ตในคอร์ด, เสียงเบสตาม Inversion, และการซ้ำเสียง (Doubling)
   */
  checkChordTonesAndDoubling(chord, idx, keyKey, leadingTone, issues) {
    const chordNum = idx + 1;
    const def = Theory.getChordDefinition(keyKey, chord.romanNumeral);
    if (!def) return;

    const voices = [
      { name: 'soprano', note: chord.soprano },
      { name: 'alto', note: chord.alto },
      { name: 'tenor', note: chord.tenor },
      { name: 'bass', note: chord.bass }
    ];

    // 6.1 ตรวจสอบว่าโน้ตแต่ละแนวเป็น Chord Tone หรือไม่
    const nonChordVoices = [];
    const toneCounts = { root: 0, third: 0, fifth: 0, seventh: 0, unknown: 0 };
    let leadingToneCount = 0;

    for (const item of voices) {
      if (!item.note) continue;

      let found = false;
      if (Theory.isSamePitchClass(item.note, def.root)) {
        toneCounts.root++;
        found = true;
      } else if (Theory.isSamePitchClass(item.note, def.third)) {
        toneCounts.third++;
        found = true;
      } else if (Theory.isSamePitchClass(item.note, def.fifth)) {
        toneCounts.fifth++;
        found = true;
      } else if (def.seventh && Theory.isSamePitchClass(item.note, def.seventh)) {
        toneCounts.seventh++;
        found = true;
      }

      if (!found) {
        nonChordVoices.push({
          voice: item.name,
          note: item.note
        });
      }

      // ตรวจสอบว่าเป็น Leading Tone หรือไม่
      if (Theory.isSamePitchClass(item.note, leadingTone)) {
        leadingToneCount++;
      }
    }

    // รายงานโน้ตนอกคอร์ด
    if (nonChordVoices.length > 0) {
      for (const ncv of nonChordVoices) {
        issues.push({
          severity: 'error',
          type: 'wrong-chord-tone',
          chordIndex: idx,
          voice: ncv.voice,
          title: `❌ โน้ตผิดคอร์ดในแนว ${this.VOICE_LABELS_TH[ncv.voice]}`,
          detail: `คอร์ดที่ ${chordNum} (${def.label}): โน้ต ${Theory.formatNoteName(ncv.note)} ไม่ใช่ตัวโน้ตในคอร์ดนี้ (โน้ตในคอร์ดคือ: ${def.chordTones.map(t => Theory.formatPitchClass(t)).join(', ')})`,
          advice: `เปลี่ยนโน้ตให้เป็น Root, 3rd, 5th หรือ 7th ของคอร์ด ${def.label}`
        });
      }
    }

    // 6.2 ตรวจสอบเสียง Bass ว่าตรงกับ Inversion หรือไม่
    if (chord.bass && !Theory.isSamePitchClass(chord.bass, def.expectedBassNote)) {
      issues.push({
        severity: 'error',
        type: 'wrong-inversion-bass',
        chordIndex: idx,
        voice: 'bass',
        title: `❌ เสียง Bass ไม่ตรงกับ Inversion ของคอร์ด ${def.label}`,
        detail: `คอร์ดที่ ${chordNum} (${def.label}): เบสคือ ${Theory.formatNoteName(chord.bass)} แต่ควรเป็น ${Theory.formatPitchClass(def.expectedBassNote)} ตามสัญลักษณ์คอร์ด`,
        advice: `เปลี่ยนโน้ตในแนวเบสให้ตรงกับ Inversion หรือเปลี่ยนสัญลักษณ์คอร์ด`
      });
    }

    // 6.3 ตรวจสอบโน้ตขั้นที่ 3 ของคอร์ด (Third is mandatory for triads!)
    if (toneCounts.third === 0 && def.type === 'triad') {
      issues.push({
        severity: 'error',
        type: 'missing-third',
        chordIndex: idx,
        title: `❌ ขาดโน้ตขั้นที่ 3 ของคอร์ด (${Theory.formatPitchClass(def.third)})`,
        detail: `คอร์ดที่ ${chordNum} (${def.label}): ไม่มีแนวเสียงใดร้องโน้ตตัวที่ 3 ทำให้ไม่สามารถระบุได้ว่าเป็นคอร์ด Major หรือ Minor`,
        advice: `ต้องมีโน้ตขั้นที่ 3 (${Theory.formatPitchClass(def.third)}) อย่างน้อย 1 แนวเสียง`
      });
    }

    // 6.4 กฎการซ้ำเสียง (Doubling Rules)
    // ห้ามซ้ำ Leading Tone (โน้ตขั้นที่ 7 ของบันไดเสียง) โดยเด็ดขาด
    if (leadingToneCount > 1) {
      issues.push({
        severity: 'error',
        type: 'doubled-leading-tone',
        chordIndex: idx,
        title: `❌ ซ้ำโน้ตขั้นที่ 7 (Doubled Leading Tone: ${Theory.formatPitchClass(leadingTone)})`,
        detail: `คอร์ดที่ ${chordNum}: มีการซ้ำโน้ต Leading Tone (${leadingToneCount} แนวเสียง) ซึ่งตามกฎห้ามซ้ำเสียงนี้เพราะมีแรงดึงดูดเข้าหา Tonic สูงมาก จะนำไปสู่ Parallel Octave`,
        advice: `ให้ซ้ำ Root หรือ 5th แทน ห้ามซ้ำ Leading Tone`
      });
    }

    // คอร์ด 6/4 (Second Inversion) ต้อง double 5th (ซึ่งคือ Bass note)
    if (def.inversion === 2) {
      if (toneCounts.fifth < 2) {
        issues.push({
          severity: 'warning',
          type: 'doubling-64',
          chordIndex: idx,
          title: `⚠️ กฎคอร์ด 6/4 (Second Inversion): ควรซ้ำเสียงเบส (Fifth of chord)`,
          detail: `คอร์ดที่ ${chordNum} (${def.label}): ในคอร์ด 6/4 ควรซ้ำเสียงตัวที่ 5 (โน้ตเบส) เพื่อความมั่นคงทางอะคูสติก`,
          advice: `ให้แนวเสียงด้านบนอีก 1 แนวซ้ำโน้ตตัวเดียวกับเบส (${Theory.formatPitchClass(def.fifth)})`
        });
      }
    }
  },

  /**
   * 7. ตรวจสอบการคลี่คลายของ Leading Tone ใน Cadence หรือ V -> I
   */
  checkLeadingToneResolution(c1, c2, idx1, idx2, keyKey, leadingTone, issues) {
    const chordNum1 = idx1 + 1;
    const chordNum2 = idx2 + 1;

    // ตรวจสอบว่าคอร์ดแรกเป็น V, V7 หรือ vii° และคอร์ดสองเป็น I หรือ vi หรือไม่
    const r1 = c1.romanNumeral || '';
    const r2 = c2.romanNumeral || '';

    const isDominant = r1.startsWith('V') || r1.startsWith('vii');
    const isTonicResolution = r2.startsWith('I') || r2.startsWith('i') || r2.startsWith('vi');

    if (!isDominant || !isTonicResolution) return;

    const chordDef1 = Theory.getChordDefinition(keyKey, r1);
    const chordDef2 = Theory.getChordDefinition(keyKey, r2);
    const seventhNote = chordDef1 ? chordDef1.seventh : null;
    const targetThird = chordDef2 ? chordDef2.third : null;
    const isDirectToI = r2.startsWith('I') || r2.startsWith('i');

    for (const v of this.VOICE_NAMES) {
      const n1 = c1[v];
      const n2 = c2[v];
      if (!n1 || !n2) continue;

      if (Theory.isSamePitchClass(n1, leadingTone)) {
        // หาว่าขยับไป Tonic หรือไม่ (ขึ้น 1-2 ครึ่งเสียง)
        const diff = Theory.noteToMidi(n2) - Theory.noteToMidi(n1);
        if (diff !== 1 && diff !== 2) {
          // ถ้าอยู่ใน Soprano ถือเป็นข้อผิดพลาดชัดเจน ถ้าอยู่ในแนวใน (Alto/Tenor) อาจเตือน
          const isSoprano = v === 'soprano';
          issues.push({
            severity: isSoprano ? 'error' : 'warning',
            type: 'unresolved-leading-tone',
            chordIndex1: idx1,
            chordIndex2: idx2,
            voice: v,
            title: `${isSoprano ? '❌' : '⚠️'} Leading Tone ไม่คลี่คลายขึ้นหา Tonic ในแนว ${this.VOICE_LABELS_TH[v]}`,
            detail: `จากคอร์ด ${chordNum1} ไป ${chordNum2}: โน้ต ${Theory.formatNoteName(n1)} (Leading Tone) ไม่ได้ก้าวขึ้นไปยัง Tonic (${Theory.formatNoteName(n2)})`,
            advice: `ควรให้โน้ตขั้นที่ 7 ขยับก้าวขึ้น 1 ขั้น (Stepwise) เข้าหาโน้ต Tonic ในคอร์ดถัดไป`
          });
        }
      }

      // ตรวจสอบการคลี่คลายโน้ตที่ 7 ของคอร์ด V7 (ต้องก้าวลงเข้าหาตัวที่ 3 ของคอร์ด I)
      if (seventhNote && targetThird && isDirectToI && Theory.isSamePitchClass(n1, seventhNote)) {
        const diff = Theory.noteToMidi(n2) - Theory.noteToMidi(n1);
        const resolvedToThird = (diff === -1 || diff === -2) && Theory.isSamePitchClass(n2, targetThird);
        if (!resolvedToThird) {
          issues.push({
            severity: 'error',
            type: 'unresolved-chordal-seventh',
            chordIndex1: idx1,
            chordIndex2: idx2,
            voice: v,
            title: `❌ โน้ตที่ 7 ของคอร์ด ${r1} ไม่คลี่คลายลงในแนว ${this.VOICE_LABELS_TH[v]}`,
            detail: `จากคอร์ด ${chordNum1} ไป ${chordNum2}: โน้ตที่ 7 (${Theory.formatNoteName(n1)}) ควรเคลื่อนที่ลง 1 ขั้นเข้าหาโน้ตตัวที่ 3 (${Theory.formatNoteName(targetThird)}) ของคอร์ด ${r2}`,
            advice: `ให้โน้ตที่ 7 ของคอร์ด ${r1} ก้าวลง (Stepwise down) เข้าหาโน้ตตัวที่ 3 ของคอร์ด ${r2}`
          });
        }
      }
    }
  }
};

// Export global
if (typeof window !== 'undefined') {
  window.HarmonyRules = HarmonyRules;
}
