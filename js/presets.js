/**
 * Four-Part Harmony Grader - Educational Presets
 * แบบฝึกหัดและตัวอย่างกรณีศึกษาสำหรับการเรียนการสอนวิชา Four-Part Harmony
 * อ้างอิงตามหลักทฤษฎีดนตรี Root Position Part Writing
 */

const HarmonyPresets = [
  // =========================================================================
  // หมวดที่ 1: เบสกระโดดคู่ 4 หรือ 5 (Roots a 4th or 5th Apart)
  // หลักการ: เก็บ Common Tone ไว้ในแนวเดิม แล้วอีก 2 แนวเดินเป็นขั้นคู่ 2
  // =========================================================================
  {
    id: 'jump_45_1',
    category: '1. เบสกระโดด 4 หรือ 5',
    title: '1.1 I - IV (เบสกระโดดคู่ 4 - เก็บ Common Tone)',
    description: 'เบสกระโดดคู่ 4 ขึ้น (C ไป F) แนว Soprano เก็บ Common Tone (C5) ไว้และมีเครื่องหมาย Tie',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3
      },
      {
        romanNumeral: 'IV',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (Common Tone Tied)
        alto:    { step: 'F', alter: 0, octave: 4 }, // F4
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3
        bass:    { step: 'F', alter: 0, octave: 2 }  // F2 (กระโดดลงคู่ 5 / ขึ้นคู่ 4)
      }
    ]
  },
  {
    id: 'jump_45_2',
    category: '1. เบสกระโดด 4 หรือ 5',
    title: '1.2 I - V - I (Cadential 4th & 5th - เก็บ Common Tone)',
    description: 'การเคลื่อนที่คู่ 4 และ 5 ใน Cadence: แนว Tenor เก็บ Common Tone (G3) ต่อเนื่องพร้อมเครื่องหมาย Tie',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 }, // B4 (Leading tone)
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3 (Common Tone Tied)
        bass:    { step: 'G', alter: 0, octave: 2 }  // G2 (กระโดดลงคู่ 4)
      },
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (Leading tone resolved!)
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3 (Common Tone Tied)
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3 (กระโดดขึ้นคู่ 4)
      }
    ]
  },
  {
    id: 'jump_45_3',
    category: '1. เบสกระโดด 4 หรือ 5',
    title: '1.3 ii - V - I (Circle of 5ths Cadence)',
    description: 'การเคลื่อนที่คู่ 4 ขึ้นต่อเนื่อง: ii ไป V (D ไป G) เก็บ D4 (Tie) และ V ไป I (G ไป C) เก็บ G3 (Tie)',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'ii',
        soprano: { step: 'A', alter: 0, octave: 4 }, // A4
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4
        tenor:   { step: 'F', alter: 0, octave: 3 }, // F3
        bass:    { step: 'D', alter: 0, octave: 3 }  // D3
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 }, // B4
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4 (Common Tone Tied)
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'G', alter: 0, octave: 2 }  // G2 (กระโดดลงคู่ 5)
      },
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3 (Common Tone Tied)
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3 (กระโดดขึ้นคู่ 4)
      }
    ]
  },
  {
    id: 'jump_45_4',
    category: '1. เบสกระโดด 4 หรือ 5',
    title: '1.4 vi - ii - V - I (Falling 5ths Progression)',
    description: 'วงจรคู่ 5 สมบูรณ์ 4 คอร์ด: vi -> ii -> V -> I ทุกช่วงเป็นเบสกระโดดคู่ 4/5 และมี Common tone tied ทุกช่วง',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'vi',
        soprano: { step: 'A', alter: 0, octave: 4 }, // A4
        alto:    { step: 'C', alter: 0, octave: 4 }, // C4
        tenor:   { step: 'E', alter: 0, octave: 3 }, // E3
        bass:    { step: 'A', alter: 0, octave: 2 }  // A2
      },
      {
        romanNumeral: 'ii',
        soprano: { step: 'A', alter: 0, octave: 4 }, // A4 (Common Tone Tied)
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4
        tenor:   { step: 'F', alter: 0, octave: 3 }, // F3
        bass:    { step: 'D', alter: 0, octave: 3 }  // D3 (ขึ้นคู่ 4)
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 }, // B4
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4 (Common Tone Tied)
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'G', alter: 0, octave: 2 }  // G2 (ลงคู่ 5)
      },
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3 (Common Tone Tied)
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3 (ขึ้นคู่ 4)
      }
    ]
  },

  // =========================================================================
  // หมวดที่ 2: เบสกระโดดคู่ 3 หรือ 6 (Roots a 3rd or 6th Apart)
  // หลักการ: คอร์ดมี 2 Common Tones! เก็บ Common Tones ทั้งสองไว้ในแนวเดิม (Tie)
  // =========================================================================
  {
    id: 'jump_36_1',
    category: '2. เบสกระโดด 3 หรือ 6',
    title: '2.1 I - vi (เบสลงคู่ 3 - เก็บ 2 Common Tones)',
    description: 'I ไป vi มีโน้ตซ้ำกัน 2 ตัวคือ C และ E -> ทั้งแนว Soprano (C5) และ Alto (E4) ถูก Tie ไว้ในแนวเดิม',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3
      },
      {
        romanNumeral: 'vi',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (Common Tone Tied)
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4 (Common Tone Tied)
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3 (G3 เดินขึ้น 1 ขั้น)
        bass:    { step: 'A', alter: 0, octave: 2 }  // A2 (เบสกระโดดลงคู่ 3)
      }
    ]
  },
  {
    id: 'jump_36_2',
    category: '2. เบสกระโดด 3 หรือ 6',
    title: '2.2 vi - IV (เบสลงคู่ 3 - เก็บ 2 Common Tones)',
    description: 'vi (A-C-E) ไป IV (F-A-C) มีโน้ต A และ C ซ้ำกัน -> Soprano (C5) และ Tenor (A3) ถูก Tie ไว้ในแนวเดิม',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'vi',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3
        bass:    { step: 'A', alter: 0, octave: 2 }  // A2
      },
      {
        romanNumeral: 'IV',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (Common Tone Tied)
        alto:    { step: 'F', alter: 0, octave: 4 }, // F4 (E4 เดินขึ้น 1 ขั้น)
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3 (Common Tone Tied)
        bass:    { step: 'F', alter: 0, octave: 2 }  // F2 (เบสกระโดดลงคู่ 3)
      }
    ]
  },
  {
    id: 'jump_36_3',
    category: '2. เบสกระโดด 3 หรือ 6',
    title: '2.3 I - iii (เบสขึ้นคู่ 3 - เก็บ 2 Common Tones)',
    description: 'I (C-E-G) ไป iii (E-G-B) มีโน้ต E และ G ซ้ำกัน -> Alto (E4) และ Tenor (G3) ถูก Tie ไว้ในแนวเดิม',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3
      },
      {
        romanNumeral: 'iii',
        soprano: { step: 'B', alter: 0, octave: 4 }, // B4 (C5 เดินลง 1 ขั้น)
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4 (Common Tone Tied)
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3 (Common Tone Tied)
        bass:    { step: 'E', alter: 0, octave: 3 }  // E3 (เบสกระโดดขึ้นคู่ 3)
      }
    ]
  },
  {
    id: 'jump_36_4',
    category: '2. เบสกระโดด 3 หรือ 6',
    title: '2.4 I - vi - IV - ii (เบสลงคู่ 3 ต่อเนื่องทุกคอร์ด)',
    description: 'การลงคู่ 3 ต่อเนื่อง: I -> vi -> IV -> ii แต่ละคอร์ดเปลี่ยนจะมี 2 Common Tones พร้อม Tie อย่างชัดเจน',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3
      },
      {
        romanNumeral: 'vi',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (Common Tone Tied)
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4 (Common Tone Tied)
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3
        bass:    { step: 'A', alter: 0, octave: 2 }  // A2 (ลงคู่ 3)
      },
      {
        romanNumeral: 'IV',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (Common Tone Tied)
        alto:    { step: 'F', alter: 0, octave: 4 }, // F4
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3 (Common Tone Tied)
        bass:    { step: 'F', alter: 0, octave: 2 }  // F2 (ลงคู่ 3)
      },
      {
        romanNumeral: 'ii',
        soprano: { step: 'D', alter: 0, octave: 5 }, // D5
        alto:    { step: 'F', alter: 0, octave: 4 }, // F4 (Common Tone Tied)
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3 (Common Tone Tied)
        bass:    { step: 'D', alter: 0, octave: 3 }  // D3 (ลงคู่ 3)
      }
    ]
  },

  // =========================================================================
  // หมวดที่ 3: เบสกระโดดคู่ 2 หรือ 7 (Roots a 2nd or 7th Apart)
  // หลักการ: ไม่มี Common Tone! 3 แนวบนต้องเคลื่อนที่สวนทาง (Contrary) กับเบส
  // =========================================================================
  {
    id: 'jump_27_1',
    category: '3. เบสกระโดด 2 หรือ 7',
    title: '3.1 IV - V (เบสขึ้นคู่ 2 - 3 แนวบนสวนทางลง)',
    description: 'IV ไป V ไม่มีโน้ตร่วม: เบสขึ้น (F ไป G) ทั้ง 3 แนวบน (S, A, T) ต้องเดินลงสวนทางเพื่อเลี่ยงคู่ขนาน 5 และ 8',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'IV',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'F', alter: 0, octave: 4 }, // F4
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3
        bass:    { step: 'F', alter: 0, octave: 3 }  // F3
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 }, // B4 (เดินลง)
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4 (เดินลง)
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3 (เดินลง)
        bass:    { step: 'G', alter: 0, octave: 3 }  // G3 (เบสเดินขึ้นคู่ 2)
      }
    ]
  },
  {
    id: 'jump_27_2',
    category: '3. เบสกระโดด 2 หรือ 7',
    title: '3.2 V - vi (Deceptive Cadence - ซ้ำเสียงที่ 3 ใน vi)',
    description: 'ข้อยกเว้นคู่ 2: เบสขึ้น (G ไป A) Leading Tone ใน Soprano ต้องขึ้นหา Tonic (B ไป C) ทำให้คอร์ด vi ต้องเบิ้ลเสียง 3',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 }, // B4 (Leading tone)
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'G', alter: 0, octave: 2 }  // G2
      },
      {
        romanNumeral: 'vi',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (ขึ้นหา Tonic)
        alto:    { step: 'C', alter: 0, octave: 4 }, // C4 (ลงหาเสียงที่ 3 Doubled)
        tenor:   { step: 'E', alter: 0, octave: 3 }, // E3 (ลงสวนทาง)
        bass:    { step: 'A', alter: 0, octave: 2 }  // A2 (เบสขึ้นคู่ 2)
      }
    ]
  },
  {
    id: 'jump_27_3',
    category: '3. เบสกระโดด 2 หรือ 7',
    title: '3.3 I - ii (เบสขึ้นคู่ 2 - 3 แนวบนสวนทางลง)',
    description: 'I ไป ii: เบสเดินขึ้นคู่ 2 (C ไป D) ทั้ง 3 แนวบน (C5->A4, E4->D4, G3->F3) เดินสวนทางลงอย่างถูกต้อง',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3
      },
      {
        romanNumeral: 'ii',
        soprano: { step: 'A', alter: 0, octave: 4 }, // A4 (เดินลง)
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4 (เดินลง)
        tenor:   { step: 'F', alter: 0, octave: 3 }, // F3 (เดินลง)
        bass:    { step: 'D', alter: 0, octave: 3 }  // D3 (เบสเดินขึ้นคู่ 2)
      }
    ]
  },
  {
    id: 'jump_27_4',
    category: '3. เบสกระโดด 2 หรือ 7',
    title: '3.4 vi - V - IV (เบสลงคู่ 2 ต่อเนื่อง - 3 แนวบนสวนทางขึ้น)',
    description: 'การลงคู่ 2 ต่อเนื่อง: vi -> V -> IV เมื่อเบสเดินลง 3 แนวบนต้องสวนทางขึ้นทั้งหมดเพื่อไม่ให้เกิดคู่ขนาน',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'vi',
        soprano: { step: 'A', alter: 0, octave: 4 }, // A4
        alto:    { step: 'C', alter: 0, octave: 4 }, // C4
        tenor:   { step: 'E', alter: 0, octave: 3 }, // E3
        bass:    { step: 'A', alter: 0, octave: 2 }  // A2
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 }, // B4 (เดินขึ้น)
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4 (เดินขึ้น)
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3 (เดินขึ้น)
        bass:    { step: 'G', alter: 0, octave: 2 }  // G2 (เบสลงคู่ 2)
      },
      {
        romanNumeral: 'IV',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (เดินขึ้น)
        alto:    { step: 'F', alter: 0, octave: 4 }, // F4 (เดินขึ้น)
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3 (เดินขึ้น)
        bass:    { step: 'F', alter: 0, octave: 2 }  // F2 (เบสลงคู่ 2)
      }
    ]
  },

  // =========================================================================
  // หมวดที่ 4: รวมการกระโดดทุกระดับอยู่ในข้อเดียวกัน (Combined Bass Motions)
  // รวมคู่ 3/6, คู่ 4/5 และคู่ 2/7 ในข้อเดียว (ไม่เกิน 4 คอร์ด)
  // =========================================================================
  {
    id: 'combined_1',
    category: '4. รวมการกระโดดทุกระดับ',
    title: '4.1 I - vi - IV - V (คู่ 3 + คู่ 3 + คู่ 2)',
    description: 'ครบทั้งเบสลงคู่ 3 (I->vi มี 2 Ties, vi->IV มี 2 Ties) และจบด้วยเบสขึ้นคู่ 2 (IV->V Contrary Motion)',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3
      },
      {
        romanNumeral: 'vi',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (Tied)
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4 (Tied)
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3
        bass:    { step: 'A', alter: 0, octave: 2 }  // A2 (ลงคู่ 3)
      },
      {
        romanNumeral: 'IV',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (Tied)
        alto:    { step: 'F', alter: 0, octave: 4 }, // F4
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3 (Tied)
        bass:    { step: 'F', alter: 0, octave: 2 }  // F2 (ลงคู่ 3)
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 }, // B4
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'G', alter: 0, octave: 2 }  // G2 (ขึ้นคู่ 2)
      }
    ]
  },
  {
    id: 'combined_2',
    category: '4. รวมการกระโดดทุกระดับ',
    title: '4.2 I - IV - V - I (คู่ 4 + คู่ 2 + คู่ 5)',
    description: 'Classical Cadence: I->IV (คู่ 4 เก็บ Tie C5), IV->V (คู่ 2 สวนทาง), V->I (คู่ 4 จบ Cadence สมบูรณ์)',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3
      },
      {
        romanNumeral: 'IV',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (Tied)
        alto:    { step: 'F', alter: 0, octave: 4 }, // F4
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3
        bass:    { step: 'F', alter: 0, octave: 2 }  // F2 (ขึ้นคู่ 4)
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 }, // B4
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'G', alter: 0, octave: 2 }  // G2 (ขึ้นคู่ 2 สวนทาง)
      },
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3 (Tied)
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3 (ขึ้นคู่ 4)
      }
    ]
  },
  {
    id: 'combined_3',
    category: '4. รวมการกระโดดทุกระดับ',
    title: '4.3 I - ii - V - I (คู่ 2 + คู่ 4 + คู่ 5)',
    description: 'I->ii (คู่ 2 สวนทางลง), ii->V (คู่ 4 เก็บ Tie D4), V->I (คู่ 4 เก็บ Tie G3 และ Leading Tone ขึ้นหา Tonic)',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3
      },
      {
        romanNumeral: 'ii',
        soprano: { step: 'A', alter: 0, octave: 4 }, // A4
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4
        tenor:   { step: 'F', alter: 0, octave: 3 }, // F3
        bass:    { step: 'D', alter: 0, octave: 3 }  // D3 (ขึ้นคู่ 2)
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 }, // B4
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4 (Tied)
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'G', alter: 0, octave: 2 }  // G2 (ลงคู่ 5)
      },
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3 (Tied)
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3 (ขึ้นคู่ 4)
      }
    ]
  },
  {
    id: 'combined_4',
    category: '4. รวมการกระโดดทุกระดับ',
    title: '4.4 I - vi - ii - V (คู่ 3 + คู่ 4 + คู่ 4)',
    description: 'I->vi (คู่ 3 เก็บ 2 Ties: C5, E4), vi->ii (คู่ 4 เก็บ Tie A4), ii->V (คู่ 4 เก็บ Tie D4)',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'C', alter: 0, octave: 3 }  // C3
      },
      {
        romanNumeral: 'vi',
        soprano: { step: 'C', alter: 0, octave: 5 }, // C5 (Tied)
        alto:    { step: 'E', alter: 0, octave: 4 }, // E4 (Tied)
        tenor:   { step: 'A', alter: 0, octave: 3 }, // A3
        bass:    { step: 'A', alter: 0, octave: 2 }  // A2 (ลงคู่ 3)
      },
      {
        romanNumeral: 'ii',
        soprano: { step: 'A', alter: 0, octave: 4 }, // A4 (Tied)
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4
        tenor:   { step: 'F', alter: 0, octave: 3 }, // F3
        bass:    { step: 'D', alter: 0, octave: 3 }  // D3 (ขึ้นคู่ 4)
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 }, // B4
        alto:    { step: 'D', alter: 0, octave: 4 }, // D4 (Tied)
        tenor:   { step: 'G', alter: 0, octave: 3 }, // G3
        bass:    { step: 'G', alter: 0, octave: 2 }  // G2 (ลงคู่ 5)
      }
    ]
  },

  // =========================================================================
  // หมวดเสริม: แบบฝึกหัดทดสอบการตรวจจับข้อผิดพลาด (Diagnostics)
  // =========================================================================
  {
    id: 'parallel_errors',
    category: '🔍 ตัวอย่างวิเคราะห์ข้อผิดพลาด',
    title: '❌ ตัวอย่าง: พบขนาน 5 และ ขนาน 8 (Parallel 5ths & 8ves)',
    description: 'คอร์ด I ไป ii และ V มีการเคลื่อนที่แบบก้อนขนาน เกิด Parallel 5th และ Parallel 8ve อย่างชัดเจน',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 },
        alto:    { step: 'G', alter: 0, octave: 4 },
        tenor:   { step: 'E', alter: 0, octave: 4 },
        bass:    { step: 'C', alter: 0, octave: 3 }
      },
      {
        romanNumeral: 'ii',
        soprano: { step: 'D', alter: 0, octave: 5 },
        alto:    { step: 'A', alter: 0, octave: 4 },
        tenor:   { step: 'F', alter: 0, octave: 4 },
        bass:    { step: 'D', alter: 0, octave: 3 }
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'G', alter: 0, octave: 4 },
        alto:    { step: 'D', alter: 0, octave: 4 },
        tenor:   { step: 'B', alter: 0, octave: 3 },
        bass:    { step: 'G', alter: 0, octave: 2 }
      },
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 },
        alto:    { step: 'E', alter: 0, octave: 4 },
        tenor:   { step: 'G', alter: 0, octave: 3 },
        bass:    { step: 'C', alter: 0, octave: 3 }
      }
    ]
  },
  {
    id: 'spacing_error',
    category: '🔍 ตัวอย่างวิเคราะห์ข้อผิดพลาด',
    title: '❌ ตัวอย่าง: Spacing กว้างเกิน 1 คู่แปด (S-A และ A-T)',
    description: 'แนวเสียงบนกระโดดห่างกันเกิน 1 อ็อกเทฟ ทำให้ขาดความกลมกลืนของการประสานเสียง',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'G', alter: 0, octave: 5 },
        alto:    { step: 'E', alter: 0, octave: 4 },
        tenor:   { step: 'G', alter: 0, octave: 3 },
        bass:    { step: 'C', alter: 0, octave: 3 }
      },
      {
        romanNumeral: 'IV',
        soprano: { step: 'F', alter: 0, octave: 5 },
        alto:    { step: 'A', alter: 0, octave: 4 },
        tenor:   { step: 'F', alter: 0, octave: 3 },
        bass:    { step: 'F', alter: 0, octave: 2 }
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'D', alter: 0, octave: 5 },
        alto:    { step: 'G', alter: 0, octave: 4 },
        tenor:   { step: 'B', alter: 0, octave: 3 },
        bass:    { step: 'G', alter: 0, octave: 2 }
      },
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 },
        alto:    { step: 'E', alter: 0, octave: 4 },
        tenor:   { step: 'G', alter: 0, octave: 3 },
        bass:    { step: 'C', alter: 0, octave: 3 }
      }
    ]
  },
  {
    id: 'crossing_and_doubling',
    category: '🔍 ตัวอย่างวิเคราะห์ข้อผิดพลาด',
    title: '❌ ตัวอย่าง: Voice Crossing & ซ้ำ Leading Tone',
    description: 'แนว Alto ข้ามสูงกว่า Soprano และคอร์ด V มีการซ้ำโน้ตขั้นที่ 7 (B ในคีย์ C)',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'E', alter: 0, octave: 4 },
        alto:    { step: 'G', alter: 0, octave: 4 },
        tenor:   { step: 'C', alter: 0, octave: 4 },
        bass:    { step: 'C', alter: 0, octave: 3 }
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 },
        alto:    { step: 'B', alter: 0, octave: 3 },
        tenor:   { step: 'D', alter: 0, octave: 4 },
        bass:    { step: 'G', alter: 0, octave: 2 }
      },
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 },
        alto:    { step: 'E', alter: 0, octave: 4 },
        tenor:   { step: 'G', alter: 0, octave: 3 },
        bass:    { step: 'C', alter: 0, octave: 3 }
      }
    ]
  },
  {
    id: 'blank_4chords',
    category: '📝 สร้างการบ้านใหม่',
    title: '📝 สร้างการบ้านใหม่ (เริ่มจากหน้าว่าง 4 คอร์ด)',
    description: 'ตั้งต้นคอร์ด I - IV - V - I ให้นักศึกษาฝึกวางโน้ตและตรวจสอบ Voice Leading ด้วยตนเอง',
    key: 'C_maj',
    chords: [
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 },
        alto:    { step: 'E', alter: 0, octave: 4 },
        tenor:   { step: 'G', alter: 0, octave: 3 },
        bass:    { step: 'C', alter: 0, octave: 3 }
      },
      {
        romanNumeral: 'IV',
        soprano: { step: 'C', alter: 0, octave: 5 },
        alto:    { step: 'F', alter: 0, octave: 4 },
        tenor:   { step: 'A', alter: 0, octave: 3 },
        bass:    { step: 'F', alter: 0, octave: 2 }
      },
      {
        romanNumeral: 'V',
        soprano: { step: 'B', alter: 0, octave: 4 },
        alto:    { step: 'D', alter: 0, octave: 4 },
        tenor:   { step: 'G', alter: 0, octave: 3 },
        bass:    { step: 'G', alter: 0, octave: 2 }
      },
      {
        romanNumeral: 'I',
        soprano: { step: 'C', alter: 0, octave: 5 },
        alto:    { step: 'E', alter: 0, octave: 4 },
        tenor:   { step: 'G', alter: 0, octave: 3 },
        bass:    { step: 'C', alter: 0, octave: 3 }
      }
    ]
  }
];

// Export global
if (typeof window !== 'undefined') {
  window.HarmonyPresets = HarmonyPresets;
}
