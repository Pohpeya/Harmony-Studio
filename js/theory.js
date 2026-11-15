/**
 * Four-Part Harmony Grader - Music Theory Engine
 * จัดการเรื่องโครงสร้างสเกล, คีย์, คอร์ด, โน้ต และการคำนวณขั้นคู่ (Intervals)
 */

const Theory = {
  // ค่าครึ่งเสียงพื้นฐาน (Semitones from C)
  NOTE_SEMITONES: { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 },
  NOTE_STEPS: { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 },
  STEP_NAMES: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],

  // ข้อมูลคีย์ (Key Signatures - ครบทั้ง 12 คีย์เมเจอร์ + คีย์ไมเนอร์พื้นฐาน)
  KEYS: {
    'C_maj':  { name: 'C Major',  type: 'major', root: 'C', rootAlter: 0,  accidentals: 0,  sharps: [], flats: [] },
    'G_maj':  { name: 'G Major',  type: 'major', root: 'G', rootAlter: 0,  accidentals: 1,  sharps: ['F'], flats: [] },
    'D_maj':  { name: 'D Major',  type: 'major', root: 'D', rootAlter: 0,  accidentals: 2,  sharps: ['F', 'C'], flats: [] },
    'A_maj':  { name: 'A Major',  type: 'major', root: 'A', rootAlter: 0,  accidentals: 3,  sharps: ['F', 'C', 'G'], flats: [] },
    'E_maj':  { name: 'E Major',  type: 'major', root: 'E', rootAlter: 0,  accidentals: 4,  sharps: ['F', 'C', 'G', 'D'], flats: [] },
    'B_maj':  { name: 'B Major',  type: 'major', root: 'B', rootAlter: 0,  accidentals: 5,  sharps: ['F', 'C', 'G', 'D', 'A'], flats: [] },
    'Fs_maj': { name: 'F♯ Major', type: 'major', root: 'F', rootAlter: 1,  accidentals: 6,  sharps: ['F', 'C', 'G', 'D', 'A', 'E'], flats: [] },
    'Db_maj': { name: 'D♭ Major', type: 'major', root: 'D', rootAlter: -1, accidentals: -5, sharps: [], flats: ['B', 'E', 'A', 'D', 'G'] },
    'Ab_maj': { name: 'A♭ Major', type: 'major', root: 'A', rootAlter: -1, accidentals: -4, sharps: [], flats: ['B', 'E', 'A', 'D'] },
    'Eb_maj': { name: 'E♭ Major', type: 'major', root: 'E', rootAlter: -1, accidentals: -3, sharps: [], flats: ['B', 'E', 'A'] },
    'Bb_maj': { name: 'B♭ Major', type: 'major', root: 'B', rootAlter: -1, accidentals: -2, sharps: [], flats: ['B', 'E'] },
    'F_maj':  { name: 'F Major',  type: 'major', root: 'F', rootAlter: 0,  accidentals: -1, sharps: [], flats: ['B'] },
    'A_min':  { name: 'A Minor',  type: 'minor', root: 'A', accidentals: 0,  sharps: [], flats: [], leadingTone: { step: 'G', alter: 1 } },
    'E_min':  { name: 'E Minor',  type: 'minor', root: 'E', accidentals: 1,  sharps: ['F'], flats: [], leadingTone: { step: 'D', alter: 1 } },
    'D_min':  { name: 'D Minor',  type: 'minor', root: 'D', accidentals: -1, sharps: [], flats: ['B'], leadingTone: { step: 'C', alter: 1 } },
    'G_min':  { name: 'G Minor',  type: 'minor', root: 'G', accidentals: -2, sharps: [], flats: ['B', 'E'], leadingTone: { step: 'F', alter: 1 } }
  },

  // ลำดับคีย์เมเจอร์ทั้ง 12 คีย์ สำหรับสร้างคลังข้อสอบทุกหน้า
  TWELVE_MAJOR_KEYS: [
    'C_maj', 'Db_maj', 'D_maj', 'Eb_maj', 'E_maj', 'F_maj',
    'Fs_maj', 'G_maj', 'Ab_maj', 'A_maj', 'Bb_maj', 'B_maj'
  ],

  // ขอบเขตเสียงร้องมาตรฐาน SATB (Vocal Ranges)
  VOICE_RANGES: {
    soprano: { min: 60, max: 79, minName: 'C4', maxName: 'G5', label: 'โซปราโน (Soprano)' }, // C4 - G5
    alto:    { min: 55, max: 74, minName: 'G3', maxName: 'D5', label: 'อัลโต (Alto)' },       // G3 - D5
    tenor:   { min: 48, max: 67, minName: 'C3', maxName: 'G4', label: 'เทเนอร์ (Tenor)' },    // C3 - G4
    bass:    { min: 40, max: 60, minName: 'E2', maxName: 'C4', label: 'เบส (Bass)' }         // E2 - C4
  },

  // แปลง Note Object ให้เป็น MIDI Number
  noteToMidi(note) {
    if (!note || !note.step) return 0;
    const base = this.NOTE_SEMITONES[note.step];
    const alter = note.alter || 0;
    const octave = note.octave || 4;
    return (octave + 1) * 12 + base + alter;
  },

  // คำนวณ Diatonic Step (จำนวนขั้นบนบรรทัด 5 เส้น นับจาก C0 = 0)
  noteToDiatonicStep(note) {
    if (!note || !note.step) return 0;
    const stepIdx = this.NOTE_STEPS[note.step];
    const octave = note.octave || 4;
    return octave * 7 + stepIdx;
  },

  // แปลง Note Object เป็นข้อความอ่านง่าย เช่น "C4", "F#3", "B♭4"
  formatNoteName(note) {
    if (!note || !note.step) return '-';
    let acc = '';
    if (note.alter === 1) acc = '♯';
    else if (note.alter === -1) acc = '♭';
    else if (note.alter === 2) acc = '𝄪';
    else if (note.alter === -2) acc = '𝄫';
    return `${note.step}${acc}${note.octave}`;
  },

  // แปลง Pitch Class ให้เหลือเพียงตัวอักษรและเครื่องหมาย เช่น "C", "F#", "Bb"
  formatPitchClass(note) {
    if (!note || !note.step) return '-';
    let acc = '';
    if (note.alter === 1) acc = '♯';
    else if (note.alter === -1) acc = '♭';
    return `${note.step}${acc}`;
  },

  // ตรวจสอบว่าโน้ต 2 ตัวมี Pitch Class (Enharmonic / Same tone name) เดียวกันหรือไม่
  isSamePitchClass(n1, n2) {
    if (!n1 || !n2) return false;
    // ตรวจแบบ exact letter & alter
    if (n1.step === n2.step && (n1.alter || 0) === (n2.alter || 0)) return true;
    // ตรวจแบบ semitone modulo 12
    const m1 = this.noteToMidi(n1) % 12;
    const m2 = this.noteToMidi(n2) % 12;
    return (m1 + 12) % 12 === (m2 + 12) % 12;
  },

  // คำนวณ Interval ระหว่าง 2 โน้ต (note1 ต่ำกว่าหรือสูงกว่า note2)
  getInterval(lowerNote, higherNote) {
    const midi1 = this.noteToMidi(lowerNote);
    const midi2 = this.noteToMidi(higherNote);
    const step1 = this.noteToDiatonicStep(lowerNote);
    const step2 = this.noteToDiatonicStep(higherNote);

    const semitones = midi2 - midi1;
    const diatonicSteps = step2 - step1;
    const genericInterval = Math.abs(diatonicSteps) + 1;

    // คำนวณแบบ Simple Interval (ยุบเหลือภายใน 1 octave)
    const simpleSteps = (Math.abs(diatonicSteps) % 7) + 1;
    const simpleSemitones = ((semitones % 12) + 12) % 12;

    let quality = '';
    let isFifth = false;
    let isOctaveOrUnison = false;

    if (simpleSteps === 1) { // Unison
      isOctaveOrUnison = (simpleSemitones === 0);
      quality = simpleSemitones === 0 ? 'P1' : (simpleSemitones === 1 ? 'A1' : 'd1');
    } else if (simpleSteps === 5) { // 5th
      if (simpleSemitones === 7) {
        quality = 'P5';
        isFifth = true;
      } else if (simpleSemitones === 6) {
        quality = 'd5';
      } else if (simpleSemitones === 8) {
        quality = 'A5';
      }
    } else if (simpleSteps === 4) { // 4th
      quality = simpleSemitones === 5 ? 'P4' : (simpleSemitones === 6 ? 'A4' : 'd4');
    } else if (simpleSteps === 8 || simpleSteps === 1 && Math.abs(diatonicSteps) >= 7) {
      if (simpleSemitones === 0) {
        quality = 'P8';
        isOctaveOrUnison = true;
      }
    }

    // ตรวจคู่ 8 หรือ compound octave
    if (Math.abs(diatonicSteps) % 7 === 0 && Math.abs(semitones) % 12 === 0) {
      isOctaveOrUnison = true;
    }

    // ตรวจคู่ 5 หรือ compound fifth (เช่นคู่ 12)
    if (Math.abs(diatonicSteps) % 7 === 4 && ((Math.abs(semitones) % 12) === 7)) {
      isFifth = true;
    }

    return {
      semitones,
      diatonicSteps,
      genericInterval,
      simpleSteps,
      simpleSemitones,
      quality,
      isPerfectFifth: isFifth,
      isPerfectOctaveOrUnison: isOctaveOrUnison
    };
  },

  // ดึงสเกลของคีย์ (7 โน้ตในบันไดเสียง)
  getScaleDegrees(keyKey) {
    const keyInfo = this.KEYS[keyKey] || this.KEYS['C_maj'];
    const isMajor = keyInfo.type === 'major';
    const rootStep = keyInfo.root;
    const rootAlter = keyInfo.rootAlter || 0;

    // Pattern ครึ่งเสียง: Major = 2,2,1,2,2,2,1; Harmonic Minor = 2,1,2,2,1,3,1
    const majorSteps = [0, 2, 4, 5, 7, 9, 11];
    const minorHarmonicSteps = [0, 2, 3, 5, 7, 8, 11];
    const intervals = isMajor ? majorSteps : minorHarmonicSteps;

    const rootStepIdx = this.NOTE_STEPS[rootStep];
    const rootMidiBase = this.NOTE_SEMITONES[rootStep] + rootAlter;

    const scale = [];
    for (let i = 0; i < 7; i++) {
      const stepLetter = this.STEP_NAMES[(rootStepIdx + i) % 7];
      const targetMidiOffset = intervals[i];
      const naturalStepSemitone = this.NOTE_SEMITONES[stepLetter];
      
      // หาค่า alter ที่ทำให้ได้ target semitones
      let targetMidi = (rootMidiBase + targetMidiOffset) % 12;
      let diff = (targetMidi - naturalStepSemitone + 12) % 12;
      if (diff > 6) diff -= 12; // เช่น -1 สำหรับ flat, +1 สำหรับ sharp
      
      scale.push({
        degree: i + 1,
        step: stepLetter,
        alter: diff
      });
    }
    return scale;
  },

  // สเปกคอร์ดตาม Roman Numerals ในคีย์
  getChordDefinition(keyKey, romanNumeral) {
    const scale = this.getScaleDegrees(keyKey);
    const keyInfo = this.KEYS[keyKey] || this.KEYS['C_maj'];
    
    // นิยามคอร์ดพื้นฐานตามองศา (1-7)
    const romanMap = {
      'I':   { degree: 1, type: 'triad', inversion: 0, label: 'I' },
      'I6':  { degree: 1, type: 'triad', inversion: 1, label: 'I⁶' },
      'I64': { degree: 1, type: 'triad', inversion: 2, label: 'I⁶₄' },
      'i':   { degree: 1, type: 'triad', inversion: 0, label: 'i' },
      'i6':  { degree: 1, type: 'triad', inversion: 1, label: 'i⁶' },
      'i64': { degree: 1, type: 'triad', inversion: 2, label: 'i⁶₄' },
      
      'ii':   { degree: 2, type: 'triad', inversion: 0, label: 'ii' },
      'ii6':  { degree: 2, type: 'triad', inversion: 1, label: 'ii⁶' },
      'ii°':  { degree: 2, type: 'triad', inversion: 0, label: 'ii°' },
      'ii°6': { degree: 2, type: 'triad', inversion: 1, label: 'ii°⁶' },
      
      'iii':  { degree: 3, type: 'triad', inversion: 0, label: 'iii' },
      'III':  { degree: 3, type: 'triad', inversion: 0, label: 'III' },
      
      'IV':   { degree: 4, type: 'triad', inversion: 0, label: 'IV' },
      'IV6':  { degree: 4, type: 'triad', inversion: 1, label: 'IV⁶' },
      'iv':   { degree: 4, type: 'triad', inversion: 0, label: 'iv' },
      'iv6':  { degree: 4, type: 'triad', inversion: 1, label: 'iv⁶' },
      
      'V':    { degree: 5, type: 'triad', inversion: 0, label: 'V' },
      'V6':   { degree: 5, type: 'triad', inversion: 1, label: 'V⁶' },
      'V64':  { degree: 5, type: 'triad', inversion: 2, label: 'V⁶₄' },
      'V7':   { degree: 5, type: 'seventh', inversion: 0, label: 'V⁷' },
      'V65':  { degree: 5, type: 'seventh', inversion: 1, label: 'V⁶₅' },
      'V43':  { degree: 5, type: 'seventh', inversion: 2, label: 'V⁴₃' },
      'V42':  { degree: 5, type: 'seventh', inversion: 3, label: 'V⁴₂' },
      
      'vi':   { degree: 6, type: 'triad', inversion: 0, label: 'vi' },
      'VI':   { degree: 6, type: 'triad', inversion: 0, label: 'VI' },
      
      'vii°':  { degree: 7, type: 'triad', inversion: 0, label: 'vii°' },
      'vii°6': { degree: 7, type: 'triad', inversion: 1, label: 'vii°⁶' }
    };

    const def = romanMap[romanNumeral];
    if (!def) return null;

    const rootDeg = def.degree - 1; // 0-based
    const rootNote = scale[rootDeg];
    const thirdNote = scale[(rootDeg + 2) % 7];
    const fifthNote = scale[(rootDeg + 4) % 7];
    const seventhNote = def.type === 'seventh' ? scale[(rootDeg + 6) % 7] : null;

    // หาโน้ตที่เป็น Bass ตาม inversion
    let expectedBassNote = rootNote;
    if (def.inversion === 1) expectedBassNote = thirdNote;
    else if (def.inversion === 2) expectedBassNote = fifthNote;
    else if (def.inversion === 3) expectedBassNote = seventhNote;

    const chordTones = [rootNote, thirdNote, fifthNote];
    if (seventhNote) chordTones.push(seventhNote);

    return {
      romanNumeral,
      label: def.label,
      inversion: def.inversion,
      type: def.type,
      root: rootNote,
      third: thirdNote,
      fifth: fifthNote,
      seventh: seventhNote,
      expectedBassNote,
      chordTones,
      isLeadingToneChord: (def.degree === 5 || def.degree === 7)
    };
  },

  // ดึงรายการ Roman Numerals ที่แนะนำตามคีย์
  getAvailableNumerals(keyKey) {
    const keyInfo = this.KEYS[keyKey] || this.KEYS['C_maj'];
    if (keyInfo.type === 'major') {
      return ['I', 'I6', 'I64', 'ii', 'ii6', 'IV', 'IV6', 'V', 'V6', 'V64', 'V7', 'V65', 'vi', 'vii°6'];
    } else {
      return ['i', 'i6', 'i64', 'ii°', 'ii°6', 'iv', 'iv6', 'V', 'V6', 'V64', 'V7', 'V65', 'VI', 'vii°6'];
    }
  },

  // =========================================================================
  // โครงสร้างคอร์ด 12 คีย์, 4 ชนิด (Triad & 7th Chord) และการพลิกกลับ
  // =========================================================================
  TWELVE_ROOTS: [
    { id: 'C',  step: 'C', alter: 0,  label: 'C' },
    { id: 'Db', step: 'D', alter: -1, label: 'D♭', altLabel: 'C♯/D♭' },
    { id: 'D',  step: 'D', alter: 0,  label: 'D' },
    { id: 'Eb', step: 'E', alter: -1, label: 'E♭' },
    { id: 'E',  step: 'E', alter: 0,  label: 'E' },
    { id: 'F',  step: 'F', alter: 0,  label: 'F' },
    { id: 'Fs', step: 'F', alter: 1,  label: 'F♯', altLabel: 'F♯/G♭' },
    { id: 'G',  step: 'G', alter: 0,  label: 'G' },
    { id: 'Ab', step: 'A', alter: -1, label: 'A♭' },
    { id: 'A',  step: 'A', alter: 0,  label: 'A' },
    { id: 'Bb', step: 'B', alter: -1, label: 'B♭' },
    { id: 'B',  step: 'B', alter: 0,  label: 'B' }
  ],

  CHORD_QUALITIES: {
    // Triads (4 ชนิด)
    triad_maj: {
      key: 'triad_maj', category: 'triad', nameTh: 'Major Triad', symbolSuffix: '',
      formula: 'Root + M3 + P5 (M3 + m3)',
      steps: [0, 2, 4], semitones: [0, 4, 7],
      desc: 'ให้ความรู้สึกสดใส มั่นคง ประกอบด้วยขั้นคู่ Major 3rd (4 ครึ่งเสียง) และ Perfect 5th (7 ครึ่งเสียง)'
    },
    triad_min: {
      key: 'triad_min', category: 'triad', nameTh: 'Minor Triad', symbolSuffix: 'm',
      formula: 'Root + m3 + P5 (m3 + M3)',
      steps: [0, 2, 4], semitones: [0, 3, 7],
      desc: 'ให้ความรู้สึกเศร้า นุ่มนวล ประกอบด้วยขั้นคู่ Minor 3rd (3 ครึ่งเสียง) และ Perfect 5th (7 ครึ่งเสียง)'
    },
    triad_dim: {
      key: 'triad_dim', category: 'triad', nameTh: 'Diminished Triad', symbolSuffix: '°',
      formula: 'Root + m3 + d5 (m3 + m3)',
      steps: [0, 2, 4], semitones: [0, 3, 6],
      desc: 'ให้ความรู้สึกตึงเครียด ไม่มั่นคง ประกอบด้วย Minor 3rd ซ้อนกัน 2 ชั้น (คู่ 5 ลด = 6 ครึ่งเสียง)'
    },
    triad_aug: {
      key: 'triad_aug', category: 'triad', nameTh: 'Augmented Triad', symbolSuffix: '+',
      formula: 'Root + M3 + A5 (M3 + M3)',
      steps: [0, 2, 4], semitones: [0, 4, 8],
      desc: 'ให้ความรู้สึกก้อง ล่องลอย ประกอบด้วย Major 3rd ซ้อนกัน 2 ชั้น (คู่ 5 เกิน = 8 ครึ่งเสียง)'
    },

    // 7th Chords (4 ชนิดหลัก: Major, Minor, Diminished, Augmented)
    sev_maj: {
      key: 'sev_maj', category: 'seventh', nameTh: 'Major 7th', symbolSuffix: 'maj7',
      formula: 'Major Triad + M7 (R - M3 - P5 - M7)',
      steps: [0, 2, 4, 6], semitones: [0, 4, 7, 11],
      desc: 'คอร์ด Major Triad เติมโน้ตขั้นที่ 7 ใหญ่ (11 ครึ่งเสียง) ให้สีสันนุ่มนวล ละมุน'
    },
    sev_min: {
      key: 'sev_min', category: 'seventh', nameTh: 'Minor 7th', symbolSuffix: 'm7',
      formula: 'Minor Triad + m7 (R - m3 - P5 - m7)',
      steps: [0, 2, 4, 6], semitones: [0, 3, 7, 10],
      desc: 'คอร์ด Minor Triad เติมโน้ตขั้นที่ 7 เล็ก (10 ครึ่งเสียง) นิยมใช้ในคอร์ด ii7 และ vi7'
    },
    sev_dim: {
      key: 'sev_dim', category: 'seventh', nameTh: 'Diminished 7th', symbolSuffix: '°7',
      formula: 'Diminished Triad + d7 (R - m3 - d5 - d7)',
      steps: [0, 2, 4, 6], semitones: [0, 3, 6, 9],
      desc: 'คอร์ด Diminished Triad เติมโน้ตขั้นที่ 7 ลด (9 ครึ่งเสียง) หรือ m3 ซ้อนกัน 3 ชั้น'
    },
    sev_aug: {
      key: 'sev_aug', category: 'seventh', nameTh: 'Augmented 7th', symbolSuffix: '+7',
      formula: 'Augmented Triad + m7 (R - M3 - A5 - m7)',
      steps: [0, 2, 4, 6], semitones: [0, 4, 8, 10],
      desc: 'คอร์ด Augmented Triad เติมโน้ตขั้นที่ 7 เล็ก (10 ครึ่งเสียง) ให้แรงส่งกลับเข้าหาคอร์ดหลักสูง'
    }
  },

  INVERSIONS: {
    triad: [
      { index: 0, id: 'root', label: 'Root Position', figure: '', bassRole: 'Root (โน้ตที่ 1)' },
      { index: 1, id: '1st',  label: '1st Inversion (พลิกกลับครั้งที่ 1)', figure: '⁶', bassRole: '3rd (โน้ตที่ 3)' },
      { index: 2, id: '2nd',  label: '2nd Inversion (พลิกกลับครั้งที่ 2)', figure: '⁶₄', bassRole: '5th (โน้ตที่ 5)' }
    ],
    seventh: [
      { index: 0, id: 'root', label: 'Root Position', figure: '⁷', bassRole: 'Root (โน้ตที่ 1)' },
      { index: 1, id: '1st',  label: '1st Inversion (พลิกกลับครั้งที่ 1)', figure: '⁶₅', bassRole: '3rd (โน้ตที่ 3)' },
      { index: 2, id: '2nd',  label: '2nd Inversion (พลิกกลับครั้งที่ 2)', figure: '⁴₃', bassRole: '5th (โน้ตที่ 5)' },
      { index: 3, id: '3rd',  label: '3rd Inversion (พลิกกลับครั้งที่ 3)', figure: '⁴₂', bassRole: '7th (โน้ตที่ 7)' }
    ]
  },

  /**
   * สะกดโน้ตจาก Root ตามระยะ Diatonic Step และจำนวนครึ่งเสียง (ถูกต้องตามตัวอักษร)
   */
  spellIntervalNote(rootStep, rootAlter, rootOctave, stepOffset, semitoneOffset) {
    const baseStepIdx = this.NOTE_STEPS[rootStep];
    const targetTotalSteps = baseStepIdx + stepOffset;
    const targetStepIdx = targetTotalSteps % 7;
    const targetStep = this.STEP_NAMES[targetStepIdx];
    const octaveCarry = Math.floor(targetTotalSteps / 7);
    const targetOctave = rootOctave + octaveCarry;

    const rootMidi = (rootOctave + 1) * 12 + this.NOTE_SEMITONES[rootStep] + (rootAlter || 0);
    const targetMidi = rootMidi + semitoneOffset;
    const naturalTargetMidi = (targetOctave + 1) * 12 + this.NOTE_SEMITONES[targetStep];
    const alter = targetMidi - naturalTargetMidi;

    return { step: targetStep, alter, octave: targetOctave };
  },

  /**
   * สร้างชุดโน้ตของคอร์ดตามชนิดและการพลิกกลับ เรียงจากล่างขึ้นบน
   */
  buildChordNotes(rootObj, qualityKey, inversionIndex = 0, baseOctave = 4) {
    const q = this.CHORD_QUALITIES[qualityKey];
    if (!q) return [];

    // สร้างใน Root Position ก่อน
    const notes = q.steps.map((st, i) =>
      this.spellIntervalNote(rootObj.step, rootObj.alter || 0, baseOctave, st, q.semitones[i])
    );

    // พลิกกลับ: ย้ายโน้ตล่างขึ้นไป +1 octave ตามจำนวนครั้ง
    const inv = inversionIndex % notes.length;
    for (let i = 0; i < inv; i++) {
      const moved = notes.shift();
      moved.octave += 1;
      notes.push(moved);
    }
    return notes;
  },

  /**
   * หาช่วง semitone shift ที่เหมาะสมที่สุดในการย้ายต้นแบบจาก C Major ไปยังคีย์เป้าหมาย
   * เพื่อรักษาช่วงเสียงให้อยู่ใน Range เดียวกันที่ฟังไพเราะและอ่านง่าย (E2 - G#5)
   */
  getKeyShiftSemitones(targetKeyId) {
    const k = this.KEYS[targetKeyId] || this.KEYS['C_maj'];
    const pc = ((this.NOTE_SEMITONES[k.root] + (k.rootAlter || 0)) % 12 + 12) % 12;
    return pc <= 4 ? pc : pc - 12;
  },

  /**
   * แปลงโน้ต Diatonic (อ้างอิงจากต้นแบบคีย์ C Major) ไปยังคีย์ Major เป้าหมายใดๆ ใน 12 คีย์
   */
  transposeCMajorNoteToKey(note, targetKeyId) {
    if (!note || !note.step) return null;
    if (targetKeyId === 'C_maj') return { ...note };

    const scale = this.getScaleDegrees(targetKeyId);
    const degIdx = this.NOTE_STEPS[note.step];
    const targetDeg = scale[degIdx];
    const shift = this.getKeyShiftSemitones(targetKeyId);
    const targetMidi = this.noteToMidi(note) + shift;
    const alter = (targetDeg.alter || 0) + (note.alter || 0);
    const octave = Math.round((targetMidi - (this.NOTE_SEMITONES[targetDeg.step] + alter)) / 12) - 1;

    return { step: targetDeg.step, alter, octave };
  },

  /**
   * แปลง Progression 4 แนว (SATB) ทั้งชุดจากต้นแบบคีย์ C Major ไปยังคีย์เป้าหมาย
   */
  transposeProgressionToKey(chords, targetKeyId) {
    return chords.map(ch => ({
      romanNumeral: ch.romanNumeral,
      bass:    this.transposeCMajorNoteToKey(ch.bass, targetKeyId),
      tenor:   this.transposeCMajorNoteToKey(ch.tenor, targetKeyId),
      alto:    this.transposeCMajorNoteToKey(ch.alto, targetKeyId),
      soprano: this.transposeCMajorNoteToKey(ch.soprano, targetKeyId)
    }));
  },

  /**
   * แสดงข้อมูล Key Signature เป็นข้อความสั้น เช่น "3♯ (F♯, C♯, G♯)"
   */
  formatKeySignatureInfo(keyId) {
    const k = this.KEYS[keyId];
    if (!k) return '';
    if (k.accidentals === 0) return '0 เครื่องหมายแปลงเสียง';
    if (k.accidentals > 0) return `${k.accidentals}♯ (${k.sharps.map(s => s + '♯').join(', ')})`;
    return `${Math.abs(k.accidentals)}♭ (${k.flats.map(f => f + '♭').join(', ')})`;
  }
};

// Export global
if (typeof window !== 'undefined') {
  window.Theory = Theory;
}
