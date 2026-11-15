# Harmony Studio (Four-Part Harmony & Music Theory 101) 🎼

**ระบบเขียนโน้ตและตรวจการบ้านวิชาการประสานเสียง 4 แนว (SATB Voice Leading Analyzer)**  
พัฒนาขึ้นเป็นพิเศษสำหรับนักศึกษาและอาจารย์ในสาขาวิชาดนตรีสากล (Music Theory / Harmony)

---

## 🌟 คุณสมบัติเด่น (Features)

1. **เขียนโน้ต 4 แนว (SATB: Soprano, Alto, Tenor, Bass)**
   - แสดงผลบนบรรทัด 5 เส้นคู่มาตรฐาน (Grand Staff: Treble & Bass Clef พร้อมปีกกาเชื่อม)
   - ทิศทางหางโน้ตถูกต้องตามหลักดนตรีสากล (Soprano หางขึ้น, Alto หางลง, Tenor หางขึ้น, Bass หางลง)
   - ป้อนโน้ตได้หลากหลายวิธี:
     - คลิกเลือกตัวโน้ตบนบรรทัด 5 เส้นโดยตรง
     - คลิกแป้นบน Interactive Piano Keyboard (ช่วง C2 ถึง G5)
     - เลือก Pitch Step (C-B), Octave (2-5), เครื่องหมายแปลงเสียง (♯, ♭, ♮)
     - ปุ่ม Transpose +1/-1 ครึ่งเสียง

2. **ระบบตรวจข้อผิดพลาดอัตโนมัติแบบทันที (Instant Harmony Rules Checker)**
   - ❌ **ตรวจคู่ขนาน 5 และคู่ขนาน 8 (Parallel 5ths & 8ves)**:
     - ตรวจสอบทุกคู่แนวเสียงที่เป็นไปได้ (S-A, S-T, S-B, A-T, A-B, T-B)
     - ตรวจสอบทั้ง Parallel 5th, Parallel 8ve, Parallel Unison
     - ตรวจสอบ Consecutive by Contrary Motion
     - วาดเส้นอาร์กโค้งสีแดง (Red Connection Arcs) เชื่อมระหว่างสองคอร์ดที่มีข้อผิดพลาดขนาน 5 หรือ 8 บนแผ่นโน้ตโดยตรง
   - ❌ **ตรวจระยะห่างระหว่างแนวเสียง (Voice Spacing)**:
     - Soprano กับ Alto ต้องไม่เกิน 1 คู่แปด (≤ 12 semitones)
     - Alto กับ Tenor ต้องไม่เกิน 1 คู่แปด (≤ 12 semitones)
     - Tenor กับ Bass อนุญาตให้เกินคู่แปดได้ แต่เตือนหากกว้างเกิน 2 คู่แปด
   - ❌ **ตรวจการข้ามแนวเสียงและซ้อนทับ (Voice Crossing & Overlap)**:
     - Soprano ≥ Alto ≥ Tenor ≥ Bass ในคอร์ดเดียวกัน
     - ตรวจสอบการเคลื่อนที่ข้ามตำแหน่งเดิมระหว่าง 2 คอร์ดที่ติดกัน
   - ❌ **ตรวจตัวโน้ตในคอร์ดและการกระจายเสียง (Chord Tones & Doubling)**:
     - ตรวจว่าโน้ตตรงตามสัญลักษณ์ Roman Numeral หรือไม่
     - ตรวจว่ามีโน้ตขั้นที่ 3 (Third) ของ Triad หรือไม่ (ห้ามขาด 3rd)
     - ตรวจเสียงเบสว่าตรงตาม Inversion (Root position, 6, 6/4, 7th) หรือไม่
     - **ห้ามซ้ำเสียง Leading Tone (โน้ตขั้นที่ 7)** โดยเด็ดขาด
     - แนะนำการซ้ำเสียงในคอร์ด 6/4 (Second Inversion)
   - ⚠️ **ตรวจขอบเขตเสียงร้อง (Vocal Ranges)**:
     - Soprano (C4 - G5), Alto (G3 - D5), Tenor (C3 - G4), Bass (E2 - C4)
   - ⚠️ **ตรวจการคลี่คลายของเสียงชี้นำ (Leading Tone Resolution)** ใน Cadence

3. **ระบบสังเคราะห์เสียงสมจริง (Web Audio Polyphonic Synthesizer)**
   - สังเคราะห์เสียงประสาน 4 แนวพร้อมกันด้วยโทนเสียง Choral/Organ
   - ฟังเสียงคอร์ดเดี่ยว หรือกด **Play All** เพื่อฟังการดำเนินคอร์ดทั้งบทเพลง
   - ฟังเสียงโน้ตทันทีที่คลิกเลือกหรือปรับระดับเสียง

4. **ชุดแบบฝึกหัดในตัว (Built-in Educational Presets)**
   - แบบฝึกหัดที่ถูกต้องสมบูรณ์ (I - IV - V - I)
   - แบบฝึกหัดที่มีข้อผิดพลาด Parallel 5th & 8ve ให้นักศึกษาฝึกแก้
   - แบบฝึกหัดที่มี Spacing ผิด
   - แบบฝึกหัด Voice Crossing & ซ้ำ Leading Tone
   - ตัวอย่างในบันไดเสียง G Major (มี 1 ชาร์ป)
   - โหมดเริ่มต้นหน้าใหม่ (Blank Exercise)

5. **ระบบพิมพ์รายงานและบันทึกผลงาน (Print & PDF Export)**
   - สั่งพิมพ์รายงานผลการประเมิน พร้อมโน้ตเพลงและข้อแนะนำของระบบเป็น PDF ได้ทันที

---

## 🚀 วิธีการเปิดใช้งาน (How to Run)

ไม่ต้องติดตั้ง Node.js หรือโปรแกรมเพิ่มเติมใดๆ ทั้งสิ้น!

1. เปิดใช้งานออนไลน์ผ่าน GitHub Pages: `https://pohpeya.github.io/Harmony-Studio/` หรือเปิดไฟล์ `index.html` ในโฟลเดอร์ `fourpart-harmony` บน Google Chrome, Microsoft Edge, Safari หรือ Firefox ได้ทันที
