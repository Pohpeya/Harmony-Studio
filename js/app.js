/**
 * Four-Part Harmony Grader - Main Application Controller
 * เชื่อมโยงส่วนติดต่อผู้ใช้, เครื่องมือเขียนโน้ต, การตรวจข้อผิดพลาด และการสังเคราะห์เสียง
 */

class HarmonyApp {
  constructor() {
    this.currentKey = 'C_maj';
    this.chords = [];
    this.selectedChordIndex = 0;
    this.selectedVoice = 'soprano'; // 'soprano' | 'alto' | 'tenor' | 'bass'
    this.autoCheck = true;
    this.analysisResult = null;

    // ระบบเสียงและระบบวาดโน้ต
    this.audio = new HarmonyAudio();
    this.renderer = new StaffRenderer('staff-container', {
      colorCoded: true,
      showErrors: true,
      showSpacingBadges: true,
      showParallelLines: true,
      showCommonToneTies: true
    });

    this.init();
  }

  init() {
    // 1. โหลด Preset แรกเป็นค่าเริ่มต้น
    if (window.HarmonyPresets && window.HarmonyPresets.length > 0) {
      this.loadPreset(window.HarmonyPresets[0].id);
    }

    // 2. ผูก Event Listeners กับปุ่มต่างๆ
    this.bindEvents();

    // 3. วาดเปียโนคีย์บอร์ด (Interactive Piano Widget)
    this.renderPianoKeyboard();

    // 4. สั่งตรวจและเรนเดอร์ครั้งแรก
    this.checkHarmony();
  }

  /**
   * โหลดแบบฝึกหัด Preset
   */
  loadPreset(presetId) {
    const preset = window.HarmonyPresets.find(p => p.id === presetId);
    if (!preset) return;

    this.currentKey = preset.key;
    // Deep clone คอร์ด
    this.chords = JSON.parse(JSON.stringify(preset.chords));
    this.selectedChordIndex = 0;
    this.selectedVoice = 'soprano';

    // อัปเดต Dropdown คีย์เพลง
    const keySelect = document.getElementById('key-select');
    if (keySelect) keySelect.value = this.currentKey;

    // อัปเดตคำอธิบายแบบฝึกหัด
    const descText = document.getElementById('preset-desc-text');
    if (descText) {
      descText.innerHTML = `<strong>${preset.title}:</strong> ${preset.description || ''}`;
    }

    this.updateRomanNumeralDropdown();
    this.updateEditorUI();
    this.checkHarmony();
  }

  /**
   * ผูก Event Listeners
   */
  bindEvents() {
    // Key selector
    const keySelect = document.getElementById('key-select');
    if (keySelect) {
      keySelect.addEventListener('change', (e) => {
        this.currentKey = e.target.value;
        this.updateRomanNumeralDropdown();
        this.checkHarmony();
      });
    }

    // Preset selector
    const presetSelect = document.getElementById('preset-select');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        this.loadPreset(e.target.value);
      });
    }

    // Chord Roman Numeral selector
    const chordSelect = document.getElementById('chord-numeral-select');
    if (chordSelect) {
      chordSelect.addEventListener('change', (e) => {
        if (this.chords[this.selectedChordIndex]) {
          this.chords[this.selectedChordIndex].romanNumeral = e.target.value;
          this.checkHarmony();
        }
      });
    }

    // Voice tabs
    document.querySelectorAll('.voice-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const voice = e.currentTarget.dataset.voice;
        this.selectVoice(voice);
      });
    });

    // Pitch Step Buttons (C, D, E, F, G, A, B)
    document.querySelectorAll('.pitch-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const step = e.currentTarget.dataset.step;
        this.setNoteStep(step);
      });
    });

    // Octave Buttons (2, 3, 4, 5)
    document.querySelectorAll('.octave-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const oct = parseInt(e.currentTarget.dataset.octave, 10);
        this.setNoteOctave(oct);
      });
    });

    // Accidental Buttons (b, nat, #)
    document.querySelectorAll('.accidental-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const alter = parseInt(e.currentTarget.dataset.alter, 10);
        this.setNoteAlter(alter);
      });
    });

    // Transpose Buttons
    document.getElementById('btn-transpose-up')?.addEventListener('click', () => this.transposeSelectedNote(1));
    document.getElementById('btn-transpose-down')?.addEventListener('click', () => this.transposeSelectedNote(-1));

    // Chord Management Buttons
    document.getElementById('btn-add-chord')?.addEventListener('click', () => this.addChord());
    document.getElementById('btn-delete-chord')?.addEventListener('click', () => this.deleteChord());
    document.getElementById('btn-duplicate-chord')?.addEventListener('click', () => this.duplicateChord());

    // Playback Buttons & Instrument Selector
    document.getElementById('sound-preset-select')?.addEventListener('change', (e) => {
      this.audio.setInstrument(e.target.value);
      this.playCurrentChord();
    });
    document.getElementById('btn-play-all')?.addEventListener('click', () => this.playAll());
    document.getElementById('btn-play-chord')?.addEventListener('click', () => this.playCurrentChord());
    document.getElementById('btn-stop-audio')?.addEventListener('click', () => this.stopAudio());

    // Check button
    document.getElementById('btn-check-harmony')?.addEventListener('click', () => this.checkHarmony(true));

    // Display toggles
    document.getElementById('toggle-color-coded')?.addEventListener('change', (e) => {
      this.renderer.options.colorCoded = e.target.checked;
      this.renderer.render(this.chords, this.currentKey, this.analysisResult);
    });

    document.getElementById('toggle-parallel-lines')?.addEventListener('change', (e) => {
      this.renderer.options.showParallelLines = e.target.checked;
      this.renderer.render(this.chords, this.currentKey, this.analysisResult);
    });

    document.getElementById('toggle-spacing-badges')?.addEventListener('change', (e) => {
      this.renderer.options.showSpacingBadges = e.target.checked;
      this.renderer.render(this.chords, this.currentKey, this.analysisResult);
    });

    document.getElementById('toggle-common-ties')?.addEventListener('change', (e) => {
      this.renderer.options.showCommonToneTies = e.target.checked;
      this.renderer.render(this.chords, this.currentKey, this.analysisResult);
    });

    // Toggle Piano Keyboard Visibility
    document.getElementById('btn-toggle-piano')?.addEventListener('click', () => {
      const pianoWrap = document.getElementById('piano-wrapper');
      if (pianoWrap) {
        const isHidden = window.getComputedStyle(pianoWrap).display === 'none';
        pianoWrap.style.display = isHidden ? 'block' : 'none';
        document.getElementById('btn-toggle-piano')?.classList.toggle('active', isHidden);
      }
    });

    // Print Button
    document.getElementById('btn-print-report')?.addEventListener('click', () => window.print());
  }

  /**
   * อัปเดตตัวเลือก Roman Numerals ตามคีย์ปัจจุบัน
   */
  updateRomanNumeralDropdown() {
    const chordSelect = document.getElementById('chord-numeral-select');
    if (!chordSelect) return;

    const numerals = Theory.getAvailableNumerals(this.currentKey);
    chordSelect.innerHTML = numerals.map(num => {
      const def = Theory.getChordDefinition(this.currentKey, num);
      const label = def ? def.label : num;
      return `<option value="${num}">${label}</option>`;
    }).join('');

    const currentChord = this.chords[this.selectedChordIndex];
    if (currentChord && currentChord.romanNumeral) {
      chordSelect.value = currentChord.romanNumeral;
    }
  }

  /**
   * เลือกคอร์ด
   */
  selectChord(idx) {
    if (idx >= 0 && idx < this.chords.length) {
      this.selectedChordIndex = idx;
      this.updateEditorUI();
      this.renderer.setSelected(this.selectedChordIndex, this.selectedVoice);
      this.playCurrentChord();
    }
  }

  /**
   * เลือกแนวเสียง (S, A, T, B)
   */
  selectVoice(voice) {
    this.selectedVoice = voice;
    this.updateEditorUI();
    this.renderer.setSelected(this.selectedChordIndex, this.selectedVoice);
    
    // เล่นเสียงโน้ตของแนวที่เลือกทันที
    const currentNote = this.getCurrentNote();
    if (currentNote) {
      this.audio.playNote(currentNote);
    }
  }

  /**
   * เลือกโน้ตจากบนบรรทัด 5 เส้นโดยตรง
   */
  selectNote(chordIdx, voice) {
    this.selectedChordIndex = chordIdx;
    this.selectedVoice = voice;
    this.updateEditorUI();
    this.renderer.setSelected(this.selectedChordIndex, this.selectedVoice);

    const currentNote = this.getCurrentNote();
    if (currentNote) {
      this.audio.playNote(currentNote);
    }
  }

  /**
   * ดึง Note Object ปัจจุบัน
   */
  getCurrentNote() {
    const chord = this.chords[this.selectedChordIndex];
    if (!chord) return null;
    return chord[this.selectedVoice];
  }

  /**
   * ตั้งค่า Step (C, D, E, ...)
   */
  setNoteStep(step) {
    const chord = this.chords[this.selectedChordIndex];
    if (!chord) return;
    if (!chord[this.selectedVoice]) {
      chord[this.selectedVoice] = { step: 'C', alter: 0, octave: 4 };
    }
    chord[this.selectedVoice].step = step;
    this.onNoteModified();
  }

  /**
   * ตั้งค่า Octave (2, 3, 4, 5)
   */
  setNoteOctave(octave) {
    const chord = this.chords[this.selectedChordIndex];
    if (!chord || !chord[this.selectedVoice]) return;
    chord[this.selectedVoice].octave = octave;
    this.onNoteModified();
  }

  /**
   * ตั้งค่า Accidental (-1: flat, 0: natural, 1: sharp)
   */
  setNoteAlter(alter) {
    const chord = this.chords[this.selectedChordIndex];
    if (!chord || !chord[this.selectedVoice]) return;
    chord[this.selectedVoice].alter = alter;
    this.onNoteModified();
  }

  /**
   * เลื่อนระดับเสียงขึ้น-ลงทีละ semitone
   */
  transposeSelectedNote(semitones) {
    const note = this.getCurrentNote();
    if (!note) return;

    let midi = Theory.noteToMidi(note) + semitones;
    // แปลงกลับเป็น Note representation
    const stepNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const oct = Math.floor(midi / 12) - 1;
    const pitchClass = (midi % 12 + 12) % 12;

    const baseSteps = { 0: 'C', 1: 'C', 2: 'D', 3: 'D', 4: 'E', 5: 'F', 6: 'F', 7: 'G', 8: 'G', 9: 'A', 10: 'A', 11: 'B' };
    const alters =    { 0: 0,   1: 1,   2: 0,   3: 1,   4: 0,   5: 0,   6: 1,   7: 0,   8: 1,   9: 0,  10: 1,   11: 0 };

    note.step = baseSteps[pitchClass];
    note.alter = alters[pitchClass];
    note.octave = oct;

    this.onNoteModified();
  }

  /**
   * ตั้งค่าโน้ตโดยตรงจาก MIDI Number (เช่นคลิกที่คีย์เปียโน)
   */
  setNoteFromMidi(midi) {
    const note = this.getCurrentNote();
    if (!note) return;

    const oct = Math.floor(midi / 12) - 1;
    const pitchClass = (midi % 12 + 12) % 12;

    const baseSteps = { 0: 'C', 1: 'C', 2: 'D', 3: 'D', 4: 'E', 5: 'F', 6: 'F', 7: 'G', 8: 'G', 9: 'A', 10: 'A', 11: 'B' };
    const alters =    { 0: 0,   1: 1,   2: 0,   3: 1,   4: 0,   5: 0,   6: 1,   7: 0,   8: 1,   9: 0,  10: 1,   11: 0 };

    note.step = baseSteps[pitchClass];
    note.alter = alters[pitchClass];
    note.octave = oct;

    this.onNoteModified();
  }

  /**
   * เมื่อโน้ตถูกแก้ไข
   */
  onNoteModified() {
    this.updateEditorUI();
    const currentNote = this.getCurrentNote();
    if (currentNote) {
      this.audio.playNote(currentNote, 0.4);
    }
    if (this.autoCheck) {
      this.checkHarmony();
    } else {
      this.renderer.render(this.chords, this.currentKey, this.analysisResult);
    }
  }

  /**
   * อัปเดต UI ของแถบควบคุมการแก้ไขโน้ต (Active states)
   */
  updateEditorUI() {
    const currentChord = this.chords[this.selectedChordIndex];
    if (!currentChord) return;

    // อัปเดต Voice Tabs
    document.querySelectorAll('.voice-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.voice === this.selectedVoice);
    });

    // อัปเดต Badge แนวเสียง
    const badge = document.getElementById('active-voice-label');
    if (badge) {
      const labels = HarmonyRules.VOICE_LABELS_TH;
      badge.textContent = `กำลังแก้ไข: ${labels[this.selectedVoice]} (คอร์ดที่ ${this.selectedChordIndex + 1})`;
      badge.style.backgroundColor = this.renderer.VOICE_COLORS[this.selectedVoice];
    }

    // อัปเดต Dropdown คอร์ด
    const chordSelect = document.getElementById('chord-numeral-select');
    if (chordSelect && currentChord.romanNumeral) {
      chordSelect.value = currentChord.romanNumeral;
    }

    // อัปเดตสถานะปุ่มโน้ต (Step, Octave, Alter)
    const note = currentChord[this.selectedVoice];
    if (note) {
      // Step buttons
      document.querySelectorAll('.pitch-step-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.step === note.step);
      });
      // Octave buttons
      document.querySelectorAll('.octave-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.octave, 10) === note.octave);
      });
      // Accidental buttons
      document.querySelectorAll('.accidental-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.alter, 10) === (note.alter || 0));
      });

      // ไฮไลต์บนเปียโน
      const currentMidi = Theory.noteToMidi(note);
      document.querySelectorAll('.piano-key').forEach(k => {
        const kMidi = parseInt(k.dataset.midi, 10);
        k.classList.toggle('active-pitch', kMidi === currentMidi);
      });
    }
  }

  /**
   * วาด Interactive Piano Keyboard Widget
   */
  renderPianoKeyboard() {
    const wrap = document.getElementById('piano-container');
    if (!wrap) return;

    // ช่วงคีย์ C2 (MIDI 36) ถึง G5 (MIDI 79)
    const startMidi = 36;
    const endMidi = 79;
    const whiteKeys = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B

    let html = `<div class="piano-keyboard">`;
    let whiteIndex = 0;

    for (let midi = startMidi; midi <= endMidi; midi++) {
      const pc = midi % 12;
      const isWhite = whiteKeys.includes(pc);
      const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const oct = Math.floor(midi / 12) - 1;
      const label = `${noteNames[pc]}${oct}`;

      if (isWhite) {
        html += `<div class="piano-key white-key" data-midi="${midi}" title="${label}" style="flex-shrink: 0;" onclick="window.harmonyApp.setNoteFromMidi(${midi})">${pc === 0 ? label : ''}</div>`;
        whiteIndex++;
      } else {
        // Black key คำนวณ offset จาก white key ก่อนหน้า (ความกว้างคีย์ขาว = 25px, คีย์ดำ = 16px)
        const leftOffset = (whiteIndex * 25) - 8;
        html += `<div class="piano-key black-key" data-midi="${midi}" title="${label}" style="left: ${leftOffset}px;" onclick="window.harmonyApp.setNoteFromMidi(${midi})"></div>`;
      }
    }

    html += `</div>`;
    wrap.innerHTML = html;
  }

  /**
   * เพิ่มคอร์ดใหม่
   */
  addChord() {
    if (this.chords.length >= 8) {
      alert('จำนวนคอร์ดสูงสุดคือ 8 คอร์ดสำหรับการฝึกฝนในหน้านี้');
      return;
    }
    // คัดลอกคอร์ดสุดท้าย หรือสร้างคอร์ด Tonic
    const lastChord = this.chords[this.chords.length - 1];
    const newChord = lastChord 
      ? JSON.parse(JSON.stringify(lastChord))
      : {
          romanNumeral: 'I',
          soprano: { step: 'C', alter: 0, octave: 5 },
          alto: { step: 'E', alter: 0, octave: 4 },
          tenor: { step: 'G', alter: 0, octave: 3 },
          bass: { step: 'C', alter: 0, octave: 3 }
        };
    this.chords.push(newChord);
    this.selectedChordIndex = this.chords.length - 1;
    this.updateEditorUI();
    this.checkHarmony();
  }

  /**
   * ลบคอร์ดปัจจุบัน
   */
  deleteChord() {
    if (this.chords.length <= 2) {
      alert('บทเพลงต้องมีอย่างน้อย 2 คอร์ดเพื่อตรวจการเคลื่อนที่ของเสียงประสาน');
      return;
    }
    this.chords.splice(this.selectedChordIndex, 1);
    if (this.selectedChordIndex >= this.chords.length) {
      this.selectedChordIndex = this.chords.length - 1;
    }
    this.updateEditorUI();
    this.checkHarmony();
  }

  /**
   * ทำซ้ำคอร์ดปัจจุบัน (Duplicate)
   */
  duplicateChord() {
    if (this.chords.length >= 8) return;
    const cur = this.chords[this.selectedChordIndex];
    if (!cur) return;
    const clone = JSON.parse(JSON.stringify(cur));
    this.chords.splice(this.selectedChordIndex + 1, 0, clone);
    this.selectedChordIndex++;
    this.updateEditorUI();
    this.checkHarmony();
  }

  /**
   * ตรวจสอบความถูกต้องตามกฎ Four-Part Harmony และแสดงผล
   */
  checkHarmony(showPopup = false) {
    this.analysisResult = HarmonyRules.checkProgression(this.chords, this.currentKey);
    this.renderer.render(this.chords, this.currentKey, this.analysisResult);
    this.renderReport(this.analysisResult);

    if (showPopup && this.analysisResult) {
      const isMobile = window.innerWidth <= 768;
      if (isMobile || this.analysisResult.allIssues.length > 0) {
        this.showAssessmentPopup();
      }
    }
  }

  /**
   * แสดง Pop-up ผลการประเมินแบบละเอียด (ใช้บนมือถือ หรือเมื่อกดตรวจแล้วพบข้อผิดพลาด)
   */
  showAssessmentPopup() {
    if (!this.analysisResult || typeof window.showErrorPopup !== 'function') return;
    const result = this.analysisResult;
    const isPass = result.isValid && result.allIssues.length === 0;
    const score = result.totalScore;
    let grade = 'A';
    if (score < 60) grade = 'F';
    else if (score < 70) grade = 'D';
    else if (score < 80) grade = 'C';
    else if (score < 90) grade = 'B';

    if (isPass) {
      window.showErrorPopup({
        isPass: true,
        title: `ผ่านเกณฑ์! คะแนน ${score}/100 (เกรด ${grade})`,
        subtitle: 'Root Position Part Writing • ถูกต้องตามหลักประสานเสียงครบถ้วน',
        reasons: [
          `<strong>สรุปผล:</strong> ${result.summary}`,
          'ไม่มีคู่ขนาน 5/8, ระยะห่างแนวเสียง (Spacing) ถูกต้อง, ไม่มี Voice Crossing และคลี่คลายคอร์ดเรียบร้อย'
        ],
        tip: 'สามารถกดปุ่ม <strong>▶ เล่นทั้งหมด</strong> เพื่อฟังเสียงประสาน 4 แนว หรือลองเลือกข้อถัดไปเพื่อฝึกต่อได้เลยครับ'
      });
      return;
    }

    const reasons = result.allIssues.map(issue => {
      const badge = issue.severity === 'error' ? '❌ Error' : '⚠️ Warning';
      return `<strong>[${badge}] ${issue.title}</strong><br>${issue.detail}<br><span style="color:#1d4ed8;">💡 วิธีแก้: ${issue.advice}</span>`;
    });

    window.showErrorPopup({
      isPass: false,
      title: `ผลการประเมิน: ${score}/100 (เกรด ${grade}) • พบ ${result.errors.length} จุดผิด`,
      subtitle: `Root Position Part Writing (ข้อพึงระวัง ${result.warnings.length} จุด)`,
      reasons,
      tip: '<strong>วิธีแก้ไข:</strong> แตะที่ตัวโน้ตบนบรรทัด 5 เส้น แล้วปรับระดับเสียงตามคำแนะนำด้านบน จากนั้นกดตรวจอีกครั้งครับ'
    });
  }

  /**
   * เรนเดอร์แดชบอร์ดสรุปผลการตรวจและรายการข้อผิดพลาด
   */
  renderReport(result) {
    const bannerContainer = document.getElementById('score-banner-container');
    const issuesContainer = document.getElementById('issues-list-container');
    const summaryBadge = document.getElementById('summary-badge');

    if (!bannerContainer || !issuesContainer) return;

    const isPass = result.isValid;
    const score = result.totalScore;

    // 1. Score Banner
    let grade = 'A';
    if (score < 60) grade = 'F';
    else if (score < 70) grade = 'D';
    else if (score < 80) grade = 'C';
    else if (score < 90) grade = 'B';

    bannerContainer.innerHTML = `
      <div class="score-banner ${isPass ? 'pass' : 'fail'}">
        <div class="score-circle ${isPass ? 'pass' : 'fail'}">
          <span>${score}</span>
          <span style="font-size: 0.65rem; font-weight: normal; margin-top: -4px;">เกรด ${grade}</span>
        </div>
        <div class="score-text">
          <h3 style="color: ${isPass ? '#059669' : '#dc2626'};">${isPass ? 'ผ่านเกณฑ์ (Passed)' : 'พบจุดที่ต้องแก้ไข (Needs Revision)'}</h3>
          <p>${result.summary}</p>
          <div style="font-size: 0.8rem; margin-top: 4px; color: #475569;">
            ❌ ข้อผิดพลาด: <strong>${result.errors.length}</strong> จุด &nbsp;|&nbsp; 
            ⚠️ ข้อพึงระวัง: <strong>${result.warnings.length}</strong> จุด
          </div>
        </div>
      </div>
    `;

    if (summaryBadge) {
      summaryBadge.textContent = isPass ? '✅ ถูกต้อง' : `❌ ผิด ${result.errors.length} จุด`;
      summaryBadge.style.backgroundColor = isPass ? '#10b981' : '#ef4444';
      summaryBadge.style.color = '#ffffff';
    }

    const mobileAssessBtn = document.getElementById('btn-mobile-assessment');
    if (mobileAssessBtn) {
      mobileAssessBtn.innerHTML = isPass
        ? `📊 ผลการประเมิน (${score}/100 ✅)`
        : `📊 ผลการประเมิน (${score}/100 • ผิด ${result.errors.length})`;
      mobileAssessBtn.style.borderColor = isPass ? '#10b981' : '#ef4444';
      mobileAssessBtn.style.color = isPass ? '#047857' : '#b91c1c';
      mobileAssessBtn.style.backgroundColor = isPass ? '#ecfdf5' : '#fef2f2';
    }

    // 2. รายการข้อผิดพลาดและคำแนะนำ (Issues List)
    if (result.allIssues.length === 0) {
      issuesContainer.innerHTML = `
        <div style="text-align: center; padding: 24px 12px; color: #059669;">
          <div style="font-size: 2.2rem; margin-bottom: 6px;">🎉</div>
          <strong>ยอดเยี่ยมมาก! ไม่มีข้อผิดพลาดใดๆ</strong>
          <p style="font-size: 0.84rem; color: #64748b; margin-top: 4px;">การเชื่อมโยงแนวเสียง (Voice Leading), ระยะห่าง (Spacing) และตัวโน้ตในคอร์ดถูกต้องตามหลักทฤษฎีครบถ้วน</p>
        </div>
      `;
      return;
    }

    let issuesHtml = '';
    result.allIssues.forEach((issue, idx) => {
      const isErr = issue.severity === 'error';
      const targetChord = issue.chordIndex !== undefined ? issue.chordIndex : issue.chordIndex1;

      issuesHtml += `
        <div class="issue-card ${issue.severity}" onclick="window.harmonyApp.selectChord(${targetChord})">
          <div class="issue-title ${issue.severity}">
            <span>${issue.title}</span>
            <span style="font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; background: ${isErr ? '#fee2e2' : '#fef3c7'}; color: ${isErr ? '#b91c1c' : '#b45309'};">
              ${isErr ? 'Error' : 'Warning'}
            </span>
          </div>
          <div class="issue-detail">${issue.detail}</div>
          <div class="issue-advice">💡 <strong>คำแนะนำ:</strong> ${issue.advice}</div>
        </div>
      `;
    });

    issuesContainer.innerHTML = issuesHtml;
  }

  /**
   * เล่นเสียงคอร์ดปัจจุบัน
   */
  playCurrentChord() {
    const cur = this.chords[this.selectedChordIndex];
    if (cur) {
      this.audio.playChord(cur, 1.2);
    }
  }

  /**
   * เล่นเพลงทั้งหมดทีละคอร์ด
   */
  playAll() {
    const btnPlay = document.getElementById('btn-play-all');
    if (btnPlay) {
      btnPlay.innerHTML = '🔊 กำลังเล่น...';
      btnPlay.disabled = true;
    }

    this.audio.playProgression(this.chords, 54, (currentIdx) => {
      this.selectedChordIndex = currentIdx;
      this.renderer.setSelected(currentIdx, this.selectedVoice);
      this.updateEditorUI();
    }, () => {
      if (btnPlay) {
        btnPlay.innerHTML = '▶ เล่นทั้งหมด (Play All)';
        btnPlay.disabled = false;
      }
    });
  }

  /**
   * หยุดเสียง
   */
  stopAudio() {
    this.audio.stop();
    const btnPlay = document.getElementById('btn-play-all');
    if (btnPlay) {
      btnPlay.innerHTML = '▶ เล่นทั้งหมด (Play All)';
      btnPlay.disabled = false;
    }
  }
}

// ระบบสลับหน้า (Multi-View Router: home | chords | inversions | modes | figuredbass | diatonicsub | cadence | partwriting)
window.TOPIC_PAGES = [
  // Semester 1
  { id: 'modes', label: '🎭 Major mode' },
  { id: 'chords', label: '🎹 Chordtone โน้ตในคอร์ด' },
  { id: 'inversions', label: '🔄 inversion การพลิกกลับของคอร์ด' },
  { id: 'diatonicsub', label: '🔁 Diatonic substitution' },
  { id: 'figuredbass', label: '🔢 Figured bass' },
  { id: 'cadence', label: '🎯 Cadence' },
  { id: 'basic4part', label: '📝 Basic four part writing' },
  { id: 'partwriting', label: '🎼 Rootposition Part Writing' },
  // Semester 2
  { id: 'minorscale', label: '🌙 Minor Scale' },
  { id: 'melodicmodes', label: '🎼 Mode in Melodic minor' },
  { id: 'secdom', label: '⚡ Secondary Dominant' },
  { id: 'modulation', label: '🔀 Modulation' },
  { id: 'dom7', label: '👑 Dominant 7th (V⁷ & vii°)' }
];

window.renderTopicBottomNav = function(viewName) {
  const nav = document.getElementById('topic-bottom-nav');
  if (!nav) return;
  if (viewName === 'home') {
    nav.innerHTML = '';
    return;
  }

  const topics = window.TOPIC_PAGES;
  const idx = topics.findIndex(t => t.id === viewName);
  const prevTopic = idx > 0 ? topics[idx - 1] : null;
  const nextTopic = (idx >= 0 && idx < topics.length - 1) ? topics[idx + 1] : null;

  const prevBtn = prevTopic
    ? `<button type="button" class="btn btn-outline tbn-prev" onclick="window.switchAppView('${prevTopic.id}')">← ${prevTopic.label}</button>`
    : `<span></span>`;
  const nextBtn = nextTopic
    ? `<button type="button" class="btn btn-outline tbn-next" onclick="window.switchAppView('${nextTopic.id}')">${nextTopic.label} →</button>`
    : `<span></span>`;
  const homeBtn = `<button type="button" class="btn btn-primary tbn-home" onclick="window.switchAppView('home')">🏠 กลับหน้าแรก</button>`;

  const pillsHtml = topics.map(t => `
    <button type="button" class="tbn-pill ${t.id === viewName ? 'active' : ''}" onclick="window.switchAppView('${t.id}')">${t.label}</button>
  `).join('');

  nav.innerHTML = `
    <div class="topic-bottom-card">
      <div class="topic-bottom-actions">
        ${prevBtn}
        ${homeBtn}
        ${nextBtn}
      </div>
      <div class="topic-bottom-pills">
        <span class="topic-bottom-label">เลือกบทเรียนอื่น:</span>
        ${pillsHtml}
      </div>
    </div>
  `;
};

window.switchAppView = function(viewName) {
  document.body.classList.toggle('is-home', viewName === 'home');

  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `view-${viewName}`);
  });
  document.querySelectorAll('.nav-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  window.renderTopicBottomNav(viewName);

  if (viewName === 'partwriting' && window.harmonyApp) {
    window.harmonyApp.checkHarmony(false);
  } else if (viewName === 'chords' && window.chordLabChords) {
    window.chordLabChords.renderAll();
  } else if (viewName === 'inversions' && window.chordLabInversions) {
    window.chordLabInversions.renderAll();
  } else if (viewName === 'cadence' && window.cadenceLab) {
    window.cadenceLab.renderExampleStaves();
  } else if (viewName === 'modes' && window.theoryPages) {
    window.theoryPages.renderModePage();
  } else if (viewName === 'figuredbass' && window.theoryPages) {
    window.theoryPages.renderFiguredBassPage();
  } else if (viewName === 'diatonicsub' && window.theoryPages) {
    window.theoryPages.renderDiatonicSubPage();
  } else if (viewName === 'minorscale' && window.advancedTheoryPages) {
    window.advancedTheoryPages.renderMinorScalePage();
  } else if (viewName === 'melodicmodes' && window.advancedTheoryPages) {
    window.advancedTheoryPages.renderMelodicModesPage();
  } else if (viewName === 'dom7' && window.dom7Page) {
    window.dom7Page.renderLesson();
  } else if (viewName === 'basic4part' && window.basic4PartPage) {
    window.basic4PartPage.renderAll();
  } else if (viewName === 'secdom' && window.advancedTheoryPages) {
    window.advancedTheoryPages.renderSecDomPage();
  } else if (viewName === 'modulation' && window.advancedTheoryPages) {
    window.advancedTheoryPages.renderModulationPage();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Pop-up อธิบายข้อผิดพลาด / ผลการประเมิน (ใช้ร่วมกันทุกหน้า)
window.showErrorPopup = function({ title, subtitle, reasons, tip, isPass = false }) {
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const modalBox = backdrop ? backdrop.querySelector('.feedback-modal') : null;
  const titleEl = document.getElementById('feedback-modal-title');
  const subEl = document.getElementById('feedback-modal-subtitle');
  const listEl = document.getElementById('feedback-modal-list');
  const tipEl = document.getElementById('feedback-modal-tip');
  if (!backdrop) return;

  if (modalBox) {
    modalBox.classList.toggle('is-pass', !!isPass);
  }
  if (titleEl) titleEl.innerHTML = `${isPass ? '✅' : '❌'} ${title || 'คำตอบยังไม่ถูกต้อง'}`;
  if (subEl) subEl.textContent = subtitle || '';
  if (listEl) {
    const items = Array.isArray(reasons) ? reasons : (reasons ? [reasons] : []);
    listEl.innerHTML = items.map(r => `<div class="feedback-modal-item${isPass ? ' is-pass' : ''}">${r}</div>`).join('');
  }
  if (tipEl) {
    if (tip) {
      tipEl.style.display = 'block';
      tipEl.innerHTML = tip;
    } else {
      tipEl.style.display = 'none';
      tipEl.innerHTML = '';
    }
  }

  backdrop.classList.add('open');
};

window.closeErrorPopup = function() {
  const backdrop = document.getElementById('feedback-modal-backdrop');
  if (backdrop) backdrop.classList.remove('open');
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') window.closeErrorPopup();
});

// เริ่มต้นระบบเมื่อโหลดหน้าเว็บเสร็จสมบูรณ์
window.addEventListener('DOMContentLoaded', () => {
  window.harmonyApp = new HarmonyApp();

  if (typeof ChordLabController !== 'undefined') {
    window.chordLabChords = new ChordLabController('chords');
    window.chordLabChords.init();

    window.chordLabInversions = new ChordLabController('inversions');
    window.chordLabInversions.init();
  }

  if (typeof CadenceLabController !== 'undefined') {
    window.cadenceLab = new CadenceLabController();
    window.cadenceLab.init();
  }

  if (typeof TheoryPages !== 'undefined') {
    window.theoryPages = window.TheoryPages;
    window.theoryPages.init();
  }

  if (typeof AdvancedTheoryPages !== 'undefined') {
    window.advancedTheoryPages = window.AdvancedTheoryPages;
    window.advancedTheoryPages.init();
  }

  if (typeof Basic4PartPage !== 'undefined') {
    window.basic4PartPage = window.Basic4PartPage;
    window.basic4PartPage.init();
  }

  if (typeof Dom7Page !== 'undefined') {
    window.dom7Page = window.Dom7Page;
    window.dom7Page.init();
  }

  window.switchAppView('home');
});
