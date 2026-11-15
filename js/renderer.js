/**
 * Four-Part Harmony Grader - Grand Staff SVG Renderer
 * เรนเดอร์โน้ตสากล 4 แนว (SATB) บนบรรทัด 5 เส้นคู่ (Grand Staff: Treble & Bass Clef)
 * พร้อมแสดงไฮไลต์ข้อผิดพลาด (ขนาน 5, ขนาน 8, Spacing) และรองรับการคลิกเลือกโน้ต
 */

class StaffRenderer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = Object.assign({
      lineSpacing: 10,       // ระยะห่างระหว่างเส้น (px)
      chordWidth: 85,        // ความกว้างของแต่ละคอร์ด
      colorCoded: true,      // แยกสีตามแนวเสียง SATB หรือไม่
      showErrors: true,      // แสดงไฮไลต์ข้อผิดพลาดหรือไม่
      showSpacingBadges: true, // แสดงป้ายระยะ Spacing หรือไม่
      showParallelLines: true, // ลากเส้นโยงคู่ขนาน 5/8 หรือไม่
      showCommonToneTies: true // แสดงเครื่องหมาย Tie สำหรับ Common Tone
    }, options);

    this.selectedChordIndex = 0;
    this.selectedVoice = 'soprano';
    this.onSelectCallback = null;

    // สีประจำแนวเสียง (SATB Palette)
    this.VOICE_COLORS = {
      soprano: '#2563eb', // Royal Blue
      alto:    '#059669', // Emerald Green
      tenor:   '#d97706', // Amber / Warm Orange
      bass:    '#7c3aed'  // Purple
    };

    this.VOICE_COLORS_MONO = {
      soprano: '#1e293b',
      alto:    '#1e293b',
      tenor:   '#1e293b',
      bass:    '#1e293b'
    };
  }

  setOnSelect(callback) {
    this.onSelectCallback = callback;
  }

  setSelected(chordIndex, voice) {
    this.selectedChordIndex = chordIndex;
    if (voice) this.selectedVoice = voice;
    this.render();
  }

  /**
   * วาด Grand Staff ทั้งหมด
   * @param {Array} chords - ข้อมูลคอร์ดทั้งหมด
   * @param {String} keyKey - คีย์เพลง
   * @param {Object} analysis - ผลการตรวจจาก HarmonyRules
   */
  render(chords = this.lastChords, keyKey = this.lastKey, analysis = this.lastAnalysis) {
    this.lastChords = chords || [];
    this.lastKey = keyKey || 'C_maj';
    this.lastAnalysis = analysis;

    if (!this.container) return;

    const keyInfo = Theory.KEYS[this.lastKey] || Theory.KEYS['C_maj'];
    const accCount = Math.abs(keyInfo.accidentals || 0);

    const numChords = Math.max(chords.length, 1);
    const startX = 136 + accCount * 10; // ขยายพื้นที่อัตโนมัติตามจำนวน Key Signature
    const endX = startX + numChords * this.options.chordWidth - 10;
    const totalWidth = endX + 24;

    // คำนวณระยะเผื่อด้านบนและด้านล่างแบบไดนามิกตามโน้ตสูงสุด/ต่ำสุด เพื่อไม่ให้หางโน้ตหรือ Ledger line ทับเลขโรมัน
    const stepE4 = 30;
    const stepG2 = 18;
    const halfSp = this.options.lineSpacing / 2;
    let maxSopranoStep = 38;
    let minBassStep = stepG2;
    chords.forEach(ch => {
      if (ch.soprano) maxSopranoStep = Math.max(maxSopranoStep, Theory.noteToDiatonicStep(ch.soprano));
      if (ch.alto)    maxSopranoStep = Math.max(maxSopranoStep, Theory.noteToDiatonicStep(ch.alto));
      if (ch.bass)    minBassStep = Math.min(minBassStep, Theory.noteToDiatonicStep(ch.bass));
      if (ch.tenor)   minBassStep = Math.min(minBassStep, Theory.noteToDiatonicStep(ch.tenor));
    });

    const extraTop = Math.max(0, (maxSopranoStep - 40) * halfSp);
    const trebleTopY = 40 + extraTop;
    const trebleBottomY = trebleTopY + 4 * this.options.lineSpacing;
    const bassTopY = trebleBottomY + 70;
    const bassBottomY = bassTopY + 4 * this.options.lineSpacing;

    const lowestBassY = bassBottomY + Math.max(0, (stepG2 - minBassStep) * halfSp);
    const lowestStemOrNoteY = lowestBassY + 29; // รวมความยาวหางโน้ต Bass ชี้ลง (+27px)
    const romanLabelY = Math.max(bassBottomY + 38, lowestStemOrNoteY + 18);
    const romanSubY = romanLabelY + 18;
    const totalHeight = Math.max(270, romanSubY + 14);

    let svg = `<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg" class="grand-staff-svg" style="max-width:100%; width:100%; max-width:${totalWidth}px; height:auto; display:block; margin:0 auto;">`;

    // 1. Defs สำหรับ Filter, Arrowheads และ Gradients
    svg += `
      <defs>
        <filter id="glow-error" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ef4444" flood-opacity="0.8"/>
        </filter>
        <filter id="glow-select" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#3b82f6" flood-opacity="0.9"/>
        </filter>
        <marker id="arrow-error" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444"/>
        </marker>
      </defs>
    `;

    // 2. พื้นหลังกระดาษโน้ต
    svg += `<rect width="${totalWidth}" height="${totalHeight}" fill="#ffffff" rx="8" />`;

    // 3. ปีกกาเชื่อม Grand Staff (Brace & System Lines)
    svg += this.renderSystemBrace(20, trebleTopY, bassBottomY);

    // 4. เส้นบรรทัด 5 เส้น (Treble & Bass) — จบพอดีที่ Double Barline ไม่มีห้องว่างเกิน
    svg += this.renderStaffLines(30, endX, trebleTopY, this.options.lineSpacing);
    svg += this.renderStaffLines(30, endX, bassTopY, this.options.lineSpacing);

    // 5. กุญแจซอล (Treble Clef) และกุญแจฟา (Bass Clef)
    svg += this.renderTrebleClef(42, trebleTopY);
    svg += this.renderBassClef(42, bassTopY);

    // 6. เครื่องหมายประจำกุญแจเสียง (Key Signature)
    svg += this.renderKeySignature(keyInfo, 92, trebleTopY, bassTopY);

    // 7. ขีดกั้นห้อง (Bar lines)
    for (let i = 0; i < chords.length; i++) {
      const cx = startX + i * this.options.chordWidth;
      // เส้นห้องทุกๆ 2 คอร์ด
      if (i > 0 && i % 2 === 0) {
        svg += `<line x1="${cx - this.options.chordWidth / 2}" y1="${trebleTopY}" x2="${cx - this.options.chordWidth / 2}" y2="${bassBottomY}" stroke="#1e293b" stroke-width="1.2" />`;
      }
    }
    // เส้นปิดท้าย (Double bar line)
    const endX = startX + chords.length * this.options.chordWidth - 10;
    svg += `
      <line x1="${endX - 5}" y1="${trebleTopY}" x2="${endX - 5}" y2="${bassBottomY}" stroke="#111827" stroke-width="1.2" />
      <line x1="${endX}" y1="${trebleTopY}" x2="${endX}" y2="${bassBottomY}" stroke="#111827" stroke-width="3.5" />
    `;

    // 8. ไฮไลต์คอลัมน์คอร์ดที่เลือก (Selected Column Overlay)
    if (this.selectedChordIndex >= 0 && this.selectedChordIndex < chords.length) {
      const selX = startX + this.selectedChordIndex * this.options.chordWidth;
      svg += `<rect x="${selX - 28}" y="${trebleTopY - 15}" width="56" height="${bassBottomY - trebleTopY + 30}" rx="6" fill="#3b82f6" fill-opacity="0.08" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3" />`;
    }

    // แผนที่พิกัดโน้ต (Note coordinates cache เพื่อใช้วาดเส้นขนาน 5/8)
    const noteCoords = [];

    // 9. วาดตัวโน้ตแต่ละคอร์ด (Chords SATB)
    chords.forEach((chord, chordIdx) => {
      const chordX = startX + chordIdx * this.options.chordWidth;
      const coords = { chordX };

      // คำนวณพิกัด Y ของแต่ละแนวเสียง
      // Diatonic Steps: E4 = 30 (Treble line 1), G2 = 18 (Bass line 1)
      const stepE4 = 30;
      const stepG2 = 18;

      // Soprano (Stem UP)
      let sX = chordX;
      let aX = chordX;
      let tX = chordX;
      let bX = chordX;

      if (chord.soprano && chord.alto) {
        const sStep = Theory.noteToDiatonicStep(chord.soprano);
        const aStep = Theory.noteToDiatonicStep(chord.alto);
        if (Math.abs(sStep - aStep) <= 1) {
          aX = chordX + 10.2;
        }
      }

      if (chord.tenor && chord.bass) {
        const tStep = Theory.noteToDiatonicStep(chord.tenor);
        const bStep = Theory.noteToDiatonicStep(chord.bass);
        if (Math.abs(tStep - bStep) <= 1) {
          bX = chordX + 10.2;
        }
      }

      if (chord.soprano) {
        const sStep = Theory.noteToDiatonicStep(chord.soprano);
        const sY = trebleBottomY - (sStep - stepE4) * (this.options.lineSpacing / 2);
        coords.soprano = { x: sX, y: sY, note: chord.soprano };
      }

      // Alto (Stem DOWN)
      if (chord.alto) {
        const aStep = Theory.noteToDiatonicStep(chord.alto);
        const aY = trebleBottomY - (aStep - stepE4) * (this.options.lineSpacing / 2);
        coords.alto = { x: aX, y: aY, note: chord.alto };
      }

      // Tenor (Stem UP)
      if (chord.tenor) {
        const tStep = Theory.noteToDiatonicStep(chord.tenor);
        const tY = bassBottomY - (tStep - stepG2) * (this.options.lineSpacing / 2);
        coords.tenor = { x: tX, y: tY, note: chord.tenor };
      }

      // Bass (Stem DOWN)
      if (chord.bass) {
        const bStep = Theory.noteToDiatonicStep(chord.bass);
        const bY = bassBottomY - (bStep - stepG2) * (this.options.lineSpacing / 2);
        coords.bass = { x: bX, y: bY, note: chord.bass };
      }

      noteCoords.push(coords);

      // วาดโน้ต 4 แนว
      const isColSelected = this.selectedChordIndex === chordIdx;

      // Bass Note (Lower staff, stem down)
      if (coords.bass) {
        svg += this.renderNoteHead(coords.bass.x, coords.bass.y, chord.bass, 'bass', 'down', chordIdx, isColSelected && this.selectedVoice === 'bass', bassTopY, bassBottomY);
      }
      // Tenor Note (Lower staff, stem up)
      if (coords.tenor) {
        svg += this.renderNoteHead(coords.tenor.x, coords.tenor.y, chord.tenor, 'tenor', 'up', chordIdx, isColSelected && this.selectedVoice === 'tenor', bassTopY, bassBottomY);
      }
      // Alto Note (Upper staff, stem down)
      if (coords.alto) {
        svg += this.renderNoteHead(coords.alto.x, coords.alto.y, chord.alto, 'alto', 'down', chordIdx, isColSelected && this.selectedVoice === 'alto', trebleTopY, trebleBottomY);
      }
      // Soprano Note (Upper staff, stem up)
      if (coords.soprano) {
        svg += this.renderNoteHead(coords.soprano.x, coords.soprano.y, chord.soprano, 'soprano', 'up', chordIdx, isColSelected && this.selectedVoice === 'soprano', trebleTopY, trebleBottomY);
      }

      // 10. แสดง Roman Numeral ด้านล่าง
      const romanLabel = chord.romanNumeral || '-';
      const def = Theory.getChordDefinition(this.lastKey, chord.romanNumeral);
      const displayLabel = def ? def.label : romanLabel;
      
      svg += `
        <g class="roman-label-group" onclick="window.harmonyApp && window.harmonyApp.selectChord(${chordIdx})" style="cursor: pointer;">
          <text x="${chordX}" y="${romanLabelY}" text-anchor="middle" font-family="'Times New Roman', serif" font-size="19" font-weight="bold" fill="#0f172a">${displayLabel}</text>
          <text x="${chordX}" y="${romanSubY}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#64748b">(${chordIdx + 1})</text>
        </g>
      `;

      // 11. แสดง Spacing Badges หากเปิดใช้งาน
      if (this.options.showSpacingBadges && coords.soprano && coords.alto && coords.tenor) {
        const midiS = Theory.noteToMidi(chord.soprano);
        const midiA = Theory.noteToMidi(chord.alto);
        const midiT = Theory.noteToMidi(chord.tenor);
        const distSA = midiS - midiA;
        const distAT = midiA - midiT;

        if (distSA > 12) {
          svg += this.renderWarningBadge(chordX + 16, (coords.soprano.y + coords.alto.y) / 2, `S-A > 8ve`, '#ef4444');
        }
        if (distAT > 12) {
          svg += this.renderWarningBadge(chordX + 16, (coords.alto.y + coords.tenor.y) / 2, `A-T > 8ve`, '#ef4444');
        }
      }
    });

    // 11.5 แสดงเครื่องหมาย Tie สำหรับ Common Tones ระหว่างคอร์ดที่ติดกัน
    if (this.options.showCommonToneTies) {
      for (let i = 0; i < chords.length - 1; i++) {
        const c1 = chords[i];
        const c2 = chords[i + 1];
        const coord1 = noteCoords[i];
        const coord2 = noteCoords[i + 1];

        if (!coord1 || !coord2) continue;

        const voices = ['soprano', 'alto', 'tenor', 'bass'];
        voices.forEach(v => {
          const n1 = c1[v];
          const n2 = c2[v];
          if (!n1 || !n2) return;

          // ตรวจสอบว่าเป็น Common Tone หรือไม่ (ระดับเสียงเดียวกัน โน้ตเดียวกัน)
          const isSameTone = (n1.step === n2.step) &&
                             ((n1.alter || 0) === (n2.alter || 0)) &&
                             (n1.octave === n2.octave);

          if (isSameTone) {
            const pt1 = coord1[v];
            const pt2 = coord2[v];
            if (pt1 && pt2) {
              const curveDir = (v === 'soprano' || v === 'tenor') ? 'up' : 'down';
              svg += this.renderCommonToneTie(pt1.x, pt2.x, pt1.y, curveDir, v);
            }
          }
        });
      }
    }

    // 12. วาดเส้นขนาน 5 และขนาน 8 (Parallel 5ths & 8ves Connection Arcs)
    if (this.options.showParallelLines && analysis && analysis.errors) {
      analysis.errors.forEach(err => {
        if (err.type === 'parallel-5th' || err.type === 'parallel-8ve' || err.type === 'parallel-unison') {
          const idx1 = err.chordIndex1;
          const idx2 = err.chordIndex2;
          const v1Name = err.voices[0];
          const v2Name = err.voices[1];

          if (noteCoords[idx1] && noteCoords[idx2]) {
            const c1Low = noteCoords[idx1][v1Name];
            const c1High = noteCoords[idx1][v2Name];
            const c2Low = noteCoords[idx2][v1Name];
            const c2High = noteCoords[idx2][v2Name];

            if (c1Low && c1High && c2Low && c2High) {
              const label = err.type === 'parallel-5th' ? 'ขนาน 5' : 'ขนาน 8';
              svg += this.renderParallelArc(c1Low, c2Low, c1High, c2High, label);
            }
          }
        }
      });
    }

    svg += `</svg>`;
    this.container.innerHTML = svg;
  }

  // วาดตัวโน้ต หัวโน้ต หางโน้ต และ Ledger Lines (Engraved LilyPond/Bravura Style)
  renderNoteHead(x, y, note, voice, stemDir, chordIdx, isSelected, staffTopY, staffBottomY) {
    const palette = this.options.colorCoded ? this.VOICE_COLORS : this.VOICE_COLORS_MONO;
    const voiceColor = palette[voice] || '#111827';
    const rx = 5.6;
    const ry = 3.9;
    const rot = -22; // เอียงหัวโน้ตตามมาตรฐานการแกะสลักโน้ต

    let out = `<g class="note-element voice-${voice}" onclick="window.harmonyApp && window.harmonyApp.selectNote(${chordIdx}, '${voice}')" style="cursor: pointer;">`;

    // Ledger Lines
    const step = Theory.noteToDiatonicStep(note);
    const lineSpacing = this.options.lineSpacing;
    const half = lineSpacing / 2;

    // สำหรับ Upper Staff (Treble)
    if (voice === 'soprano' || voice === 'alto') {
      const stepE4 = 30;
      const stepF5 = 38;
      if (step <= 28) {
        for (let s = 28; s >= step; s -= 2) {
          const ly = staffBottomY + (stepE4 - s) * half;
          out += `<line x1="${x - 9.5}" y1="${ly}" x2="${x + 9.5}" y2="${ly}" stroke="#1e293b" stroke-width="1.15" />`;
        }
      }
      if (step >= 40) {
        for (let s = 40; s <= step; s += 2) {
          const ly = staffTopY - (s - stepF5) * half;
          out += `<line x1="${x - 9.5}" y1="${ly}" x2="${x + 9.5}" y2="${ly}" stroke="#1e293b" stroke-width="1.15" />`;
        }
      }
    }

    // สำหรับ Lower Staff (Bass)
    if (voice === 'tenor' || voice === 'bass') {
      const stepG2 = 18;
      const stepA3 = 26;
      if (step <= 16) {
        for (let s = 16; s >= step; s -= 2) {
          const ly = staffBottomY + (stepG2 - s) * half;
          out += `<line x1="${x - 9.5}" y1="${ly}" x2="${x + 9.5}" y2="${ly}" stroke="#1e293b" stroke-width="1.15" />`;
        }
      }
      if (step >= 28) {
        for (let s = 28; s <= step; s += 2) {
          const ly = staffTopY - (s - stepA3) * half;
          out += `<line x1="${x - 9.5}" y1="${ly}" x2="${x + 9.5}" y2="${ly}" stroke="#1e293b" stroke-width="1.15" />`;
        }
      }
    }

    // หัวโน้ต (Engraved Notehead)
    const selectFilter = isSelected ? `filter="url(#glow-select)"` : '';
    const strokeAttr = isSelected ? `stroke="#2563eb" stroke-width="1.8"` : `stroke="none"`;

    out += `
      <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="${voiceColor}" ${strokeAttr} ${selectFilter} />
    `;

    // หางโน้ต (Crisp Engraved Stem)
    const stemLength = 27;
    if (stemDir === 'up') {
      const stemX = x + 4.9;
      out += `<line x1="${stemX}" y1="${y - 0.8}" x2="${stemX}" y2="${y - stemLength}" stroke="${voiceColor}" stroke-width="1.35" stroke-linecap="butt" />`;
    } else {
      const stemX = x - 4.9;
      out += `<line x1="${stemX}" y1="${y + 0.8}" x2="${stemX}" y2="${y + stemLength}" stroke="${voiceColor}" stroke-width="1.35" stroke-linecap="butt" />`;
    }

    // เครื่องหมายแปลงเสียงแบบ Engraved Vector (Sharp, Flat, Natural, Double Sharp, Double Flat)
    if (note.alter === 1) {
      out += this.renderSharp(x - 13.5, y, voiceColor, 0.95);
    } else if (note.alter === -1) {
      out += this.renderFlat(x - 12.5, y, voiceColor, 0.95);
    } else if (note.alter === 2) {
      out += this.renderDoubleSharp(x - 14, y, voiceColor, 0.95);
    } else if (note.alter === -2) {
      out += this.renderDoubleFlat(x - 16, y, voiceColor, 0.95);
    } else if (note.alter === 0 && note.explicitNatural) {
      out += this.renderNatural(x - 13, y, voiceColor, 0.95);
    }

    out += `<title>${Theory.formatNoteName(note)} (${voice})</title>`;
    out += `</g>`;
    return out;
  }

  // วาดเส้นบรรทัด 5 เส้น
  renderStaffLines(startX, endX, topY, spacing) {
    let lines = '';
    for (let i = 0; i < 5; i++) {
      const y = topY + i * spacing;
      lines += `<line x1="${startX}" y1="${y}" x2="${endX}" y2="${y}" stroke="#1e293b" stroke-width="1.0" />`;
    }
    return lines;
  }

  // วาดปีกกาเชื่อม Grand Staff
  renderSystemBrace(x, topY, bottomY) {
    return `
      <!-- เส้นหลักเชื่อมสองบรรทัด -->
      <line x1="${x + 10}" y1="${topY}" x2="${x + 10}" y2="${bottomY}" stroke="#111827" stroke-width="1.8" />
      <!-- ปีกกาประดับ (Classic Engraved Brace) -->
      <path d="M ${x + 8} ${topY} Q ${x - 3} ${(topY + bottomY) / 2 - 20} ${x - 6} ${(topY + bottomY) / 2} Q ${x - 3} ${(topY + bottomY) / 2 + 20} ${x + 8} ${bottomY} Q ${x + 1} ${(topY + bottomY) / 2 + 20} ${x - 1} ${(topY + bottomY) / 2} Q ${x + 1} ${(topY + bottomY) / 2 - 20} ${x + 8} ${topY} Z" fill="#111827" />
    `;
  }

  // วาดกุญแจซอล (Classic Engraved G-Clef — เส้นโปร่ง คมชัด ไม่ทึบตัน)
  renderTrebleClef(x, topY) {
    return `
      <g transform="translate(${x}, ${topY - 16})" fill="#111827">
        <!-- วงคล้องด้านบน (Top Loop) -->
        <path d="M 19.5 25 C 16.5 15, 16.5 3.5, 21.5 1.5 C 25.5 3.5, 26.5 15, 19.5 25 Z M 20.2 21.5 C 23 14, 23.2 6.5, 21.3 4.5 C 19.4 6.5, 19.2 14, 20.2 21.5 Z" fill-rule="evenodd" />
        <!-- แกนกลางและหางม้วนล่างพร้อมลูกตุ้ม (Stem & Bottom Tail Ball) -->
        <path d="M 18.2 24 L 22 61.5 C 22.5 68, 17.5 72, 12.8 71 C 9 70, 7.5 66.5, 9.5 63.5 C 11 61.5, 14.5 62, 15 65 C 15.2 67, 13.5 68.5, 12 68 C 14 70, 20.2 68.5, 19.8 61.5 L 16.4 24 Z" />
        <!-- ม้วนก้นหอยรอบเส้น G4 (Open G-Curl Spiral) -->
        <path d="M 19.2 23.5 C 10.5 30.5, 5.5 38, 5.5 46 C 5.5 53, 11.5 57.5, 19.5 57.5 C 27.5 57.5, 32.5 51.5, 32.5 44.5 C 32.5 37.5, 26.8 33.5, 20.5 33.5 C 14.8 33.5, 11.8 38.5, 12.5 43.5 C 13 47, 16 49, 19 49 C 17 48, 15.5 45.5, 15.8 42.5 C 16 39, 18.5 37, 22 37 C 26 37, 29 40, 29 45 C 29 50.5, 24.5 55, 19 55 C 12.5 55, 9 50.5, 9 45 C 9 38.5, 13.5 32.5, 20.5 26.5 Z" />
      </g>
    `;
  }

  // วาดกุญแจฟา (Classic Engraved F-Clef — เส้นเรียวคม หัวกลมตรงเส้น F3)
  renderBassClef(x, topY) {
    return `
      <g transform="translate(${x + 2}, ${topY})" fill="#111827">
        <path d="M 6.5 11 C 6.5 4.5, 12 0, 18.5 0 C 26 0, 31 5.5, 31 13.5 C 31 24.5, 20 33.5, 6 38.5 L 5.2 37.2 C 16.5 31.5, 25.2 23, 25.2 13 C 25.2 6.5, 21.5 2.5, 17 2.5 C 13 2.5, 10.5 5, 10 8 C 12.2 7.5, 14 9, 14 11.2 C 14 13.5, 12.2 15, 10 15 C 7.8 15, 6.5 13.2, 6.5 11 Z" />
        <circle cx="36.5" cy="5" r="2.0" />
        <circle cx="36.5" cy="15" r="2.0" />
      </g>
    `;
  }

  // วาดเครื่องหมายชาร์ป (Classic Engraved Sharp)
  renderSharp(x, y, color = '#111827', scale = 1) {
    return `
      <g transform="translate(${x}, ${y}) scale(${scale})" fill="${color}">
        <rect x="-2.5" y="-8.5" width="1.15" height="17.5" rx="0.3" />
        <rect x="1.4" y="-9.5" width="1.15" height="17.5" rx="0.3" />
        <polygon points="-4.5,-1.6 4.5,-4.2 4.5,-1.8 -4.5,0.8" />
        <polygon points="-4.5,3.4 4.5,0.8 4.5,3.2 -4.5,5.8" />
      </g>
    `;
  }

  // วาดเครื่องหมายแฟลต (Classic Engraved Flat)
  renderFlat(x, y, color = '#111827', scale = 1) {
    return `
      <g transform="translate(${x}, ${y}) scale(${scale})">
        <rect x="-3.1" y="-14.5" width="1.2" height="19.5" rx="0.3" fill="${color}" />
        <path d="M -2.2 -1.2 C 0.8 -4.2, 4.4 -3.2, 4.2 0.2 C 4.0 3.0, 0.2 4.5, -2.2 5.2 L -2.2 -1.2 Z M -1.0 0.2 L -1.0 3.6 C 0.8 2.8, 2.2 1.6, 2.2 0.0 C 2.2 -1.6, 0.5 -1.8, -1.0 0.2 Z" fill="${color}" fill-rule="evenodd" />
      </g>
    `;
  }

  // วาดเครื่องหมายเนเจอรัล (Classic Engraved Natural)
  renderNatural(x, y, color = '#111827', scale = 1) {
    return `
      <g transform="translate(${x}, ${y}) scale(${scale})" fill="${color}">
        <rect x="-2.5" y="-10.5" width="1.1" height="14.5" rx="0.3" />
        <rect x="1.4" y="-4.0" width="1.1" height="14.5" rx="0.3" />
        <polygon points="-2.5,-2.2 2.5,-4.0 2.5,-1.6 -2.5,0.2" />
        <polygon points="-2.5,2.2 2.5,0.4 2.5,2.8 -2.5,4.6" />
      </g>
    `;
  }

  // วาดเครื่องหมายประจำกุญแจเสียง (Key Signature ด้วย Engraved Glyphs)
  renderKeySignature(keyInfo, startX, trebleTopY, bassTopY) {
    let out = '';
    const acc = keyInfo.accidentals || 0;
    if (acc === 0) return out;

    // ชาร์ป: F C G D A E B
    // แฟลต: B E A D G C F
    if (acc > 0) {
      const trebleSharpY = [0, 15, -5, 10, 25, 5, 20]; // F5, C5, G5, D5, A4, E5, B4
      const bassSharpY   = [10, 25, 5, 20, 35, 15, 30]; // F3, C3, G3, D3, A2, E3, B2
      for (let i = 0; i < Math.min(acc, 7); i++) {
        const ax = startX + i * 10;
        out += this.renderSharp(ax, trebleTopY + trebleSharpY[i], '#111827', 1);
        out += this.renderSharp(ax, bassTopY + bassSharpY[i], '#111827', 1);
      }
    } else {
      const count = Math.abs(acc);
      const trebleFlatY = [20, 5, 25, 10, 30, 15, 35]; // B4, E5, A4, D5, G4, C5, F4
      const bassFlatY   = [30, 15, 35, 20, 40, 25, 45]; // B2, E3, A2, D3, G2, C3, F2
      for (let i = 0; i < Math.min(count, 7); i++) {
        const ax = startX + i * 10;
        out += this.renderFlat(ax, trebleTopY + trebleFlatY[i], '#111827', 1);
        out += this.renderFlat(ax, bassTopY + bassFlatY[i], '#111827', 1);
      }
    }
    return out;
  }

  // วาดเส้นโค้งโยงคู่ขนาน 5/8 (Parallel Connection Arc)
  renderParallelArc(c1Low, c2Low, c1High, c2High, label) {
    const midX = (c1Low.x + c2Low.x) / 2;
    const midYLow = (c1Low.y + c2Low.y) / 2;
    const midYHigh = (c1High.y + c2High.y) / 2;

    return `
      <!-- เส้นเชื่อมแนวล่าง -->
      <path d="M ${c1Low.x} ${c1Low.y} Q ${midX} ${midYLow + 12} ${c2Low.x} ${c2Low.y}" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-dasharray="3,2" />
      <!-- เส้นเชื่อมแนวบน -->
      <path d="M ${c1High.x} ${c1High.y} Q ${midX} ${midYHigh - 12} ${c2High.x} ${c2High.y}" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-dasharray="3,2" />
      <!-- เส้นเชื่อมระหว่างคู่เสียงสองคอร์ด (ขนานกัน) -->
      <line x1="${midX}" y1="${midYHigh}" x2="${midX}" y2="${midYLow}" stroke="#ef4444" stroke-width="1.8" />
      <!-- ป้ายเตือน -->
      <rect x="${midX - 25}" y="${(midYHigh + midYLow) / 2 - 10}" width="50" height="20" rx="4" fill="#ef4444" />
      <text x="${midX}" y="${(midYHigh + midYLow) / 2 + 4}" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">${label}</text>
    `;
  }

  // ป้ายเตือนระยะ Spacing
  renderWarningBadge(x, y, text, color) {
    return `
      <rect x="${x - 4}" y="${y - 8}" width="54" height="16" rx="3" fill="${color}" fill-opacity="0.9" />
      <text x="${x + 23}" y="${y + 4}" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff">${text}</text>
    `;
  }

  // วาดเครื่องหมาย Tie สำหรับ Common Tone (โน้ตเสียงเดียวกันข้ามคอร์ด)
  renderCommonToneTie(x1, x2, y, direction, voice) {
    const palette = this.options.colorCoded ? this.VOICE_COLORS : this.VOICE_COLORS_MONO;
    const color = palette[voice] || '#334155';

    const startX = x1 + 6.5; // ขอบขวาของหัวโน้ตตัวแรก
    const endX = x2 - 6.5;   // ขอบซ้ายของหัวโน้ตตัวถัดไป
    const midX = (startX + endX) / 2;
    const span = endX - startX;

    const archHeight = Math.min(Math.max(span * 0.14, 8), 12);
    const thickness = 2.4;

    let pathD = '';

    if (direction === 'up') {
      const baseY = y - 4.5;
      const peakOuter = baseY - archHeight;
      const peakInner = peakOuter + thickness;
      pathD = `M ${startX} ${baseY} Q ${midX} ${peakOuter} ${endX} ${baseY} Q ${midX} ${peakInner} ${startX} ${baseY} Z`;
    } else {
      const baseY = y + 4.5;
      const peakOuter = baseY + archHeight;
      const peakInner = peakOuter - thickness;
      pathD = `M ${startX} ${baseY} Q ${midX} ${peakOuter} ${endX} ${baseY} Q ${midX} ${peakInner} ${startX} ${baseY} Z`;
    }

    return `
      <g class="common-tone-tie voice-${voice}">
        <path d="${pathD}" fill="${color}" opacity="0.88" />
        <title>Common Tone Tie (${voice})</title>
      </g>
    `;
  }

  // วาด Double Sharp (x)
  renderDoubleSharp(x, y, color = '#1e293b', scale = 1.0) {
    return `
      <g transform="translate(${x}, ${y}) scale(${scale})" fill="${color}">
        <path d="M -4.2 -4.2 L -1.2 -1.2 L 1.2 -1.2 L 4.2 -4.2 L 4.6 -3.8 L 1.6 -0.8 L 1.6 0.8 L 4.6 3.8 L 4.2 4.2 L 1.2 1.2 L -1.2 1.2 L -4.2 4.2 L -4.6 3.8 L -1.6 0.8 L -1.6 -0.8 L -4.6 -3.8 Z" />
        <rect x="-4.5" y="-4.5" width="2.2" height="2.2" />
        <rect x="2.3" y="-4.5" width="2.2" height="2.2" />
        <rect x="-4.5" y="2.3" width="2.2" height="2.2" />
        <rect x="2.3" y="2.3" width="2.2" height="2.2" />
      </g>
    `;
  }

  // วาด Double Flat (bb)
  renderDoubleFlat(x, y, color = '#1e293b', scale = 1.0) {
    return `
      <g>
        ${this.renderFlat(x - 3.5, y, color, scale)}
        ${this.renderFlat(x + 3.2, y, color, scale)}
      </g>
    `;
  }
}

/**
 * ตัวช่วยวาดโน้ตคอร์ดบนบรรทัด 5 เส้นเดี่ยว (1 Clef: Treble หรือ Bass Clef)
 * สำหรับหน้า "โน้ตในคอร์ด 12 คีย์" และ "การพลิกกลับของคอร์ด"
 */
const ChordLabRenderer = {
  NOTE_COLORS: ['#7c3aed', '#d97706', '#059669', '#2563eb'],

  /**
   * วาดโน้ต 1 คอร์ดบนบรรทัด 5 เส้นเดียวตาม Clef ที่สุ่มได้ ('treble' | 'bass')
   */
  renderExerciseStaff(containerId, notes, selectedIndex = 0, clickHandlerName = '', clef = 'treble') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const proto = StaffRenderer.prototype;
    const lineSpacing = 11;
    const half = lineSpacing / 2;
    const staffTopY = 62;
    const staffBottomY = staffTopY + 4 * lineSpacing;
    const totalHeight = 168;
    const svgWidth = 260;
    const startX = 20;
    const endX = svgWidth - 20;
    const chordX = 148;

    const isBass = clef === 'bass';
    const bottomStep = isBass ? 18 : 30; // G2 (Bass) หรือ E4 (Treble)
    const topStep = bottomStep + 8;       // A3 (Bass) หรือ F5 (Treble)

    let svg = `<svg width="${svgWidth}" height="${totalHeight}" viewBox="0 0 ${svgWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg" class="grand-staff-svg" style="max-width:100%; height:auto; display:block; margin:0 auto;">`;
    svg += `
      <defs>
        <filter id="glow-select-lab" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    `;

    // เส้นปิดหัว-ท้ายบรรทัด 5 เส้นเดี่ยว
    svg += `<line x1="${startX}" y1="${staffTopY}" x2="${startX}" y2="${staffBottomY}" stroke="#1e293b" stroke-width="1.8" />`;
    svg += proto.renderStaffLines(startX, endX, staffTopY, lineSpacing);
    if (isBass) {
      svg += proto.renderBassClef(startX + 10, staffTopY + 2);
    } else {
      svg += proto.renderTrebleClef(startX + 10, staffTopY + 2);
    }

    // Double barline ท้ายห้อง
    svg += `<line x1="${endX - 4}" y1="${staffTopY}" x2="${endX - 4}" y2="${staffBottomY}" stroke="#1e293b" stroke-width="1.1" />`;
    svg += `<line x1="${endX}" y1="${staffTopY}" x2="${endX}" y2="${staffBottomY}" stroke="#1e293b" stroke-width="3.2" />`;

    const items = notes.map((n, idx) => {
      const step = Theory.noteToDiatonicStep(n);
      const y = staffBottomY - (step - bottomStep) * half;
      return { note: n, idx, step, y };
    });

    // เรียงตาม step เพื่อคำนวณการเยื้องขั้นคู่ 2 และเครื่องหมายแปลงเสียงไม่ให้ซ้อนทับ
    const sorted = [...items].sort((a, b) => a.step - b.step);
    let lastAccXOffset = 0;
    for (let i = 0; i < sorted.length; i++) {
      const cur = sorted[i];
      cur.xOffset = 0;
      if (i > 0 && Math.abs(cur.step - sorted[i - 1].step) <= 1 && sorted[i - 1].xOffset === 0) {
        cur.xOffset = 10.8;
      }
      if (cur.note.alter && cur.note.alter !== 0) {
        if (i > 0 && Math.abs(cur.step - sorted[i - 1].step) <= 3 && sorted[i - 1].note.alter !== 0) {
          lastAccXOffset = (lastAccXOffset === 0) ? -12.5 : 0;
        } else {
          lastAccXOffset = 0;
        }
        cur.accXOffset = lastAccXOffset;
      } else {
        cur.accXOffset = 0;
      }
    }

    // วาด Stem เชื่อมทั้งคอร์ดให้ดูเหมือนโน้ตสากลมาตรฐาน
    if (sorted.length > 0) {
      const minY = Math.min(...sorted.map(i => i.y));
      const maxY = Math.max(...sorted.map(i => i.y));
      const stemX = chordX + 5.1;
      svg += `<line x1="${stemX}" y1="${maxY}" x2="${stemX}" y2="${minY - 28}" stroke="#334155" stroke-width="1.35" />`;
    }

    // วาดโน้ตทีละตัว
    items.forEach(item => {
      const { note, idx, step, y, xOffset, accXOffset } = item;
      const x = chordX + xOffset;
      const color = this.NOTE_COLORS[idx % this.NOTE_COLORS.length];
      const isSelected = idx === selectedIndex;

      svg += `<g class="note-group" onclick="${clickHandlerName}(${idx})" style="cursor: pointer;">`;

      // Ledger lines
      if (step <= bottomStep - 2) {
        for (let s = bottomStep - 2; s >= step; s -= 2) {
          const ly = staffBottomY + (bottomStep - s) * half;
          svg += `<line x1="${x - 10}" y1="${ly}" x2="${x + 10}" y2="${ly}" stroke="#1e293b" stroke-width="1.15" />`;
        }
      }
      if (step >= topStep + 2) {
        for (let s = topStep + 2; s <= step; s += 2) {
          const ly = staffTopY - (s - topStep) * half;
          svg += `<line x1="${x - 10}" y1="${ly}" x2="${x + 10}" y2="${ly}" stroke="#1e293b" stroke-width="1.15" />`;
        }
      }

      const selectFilter = isSelected ? `filter="url(#glow-select-lab)"` : '';
      const strokeAttr = isSelected ? `stroke="#0f172a" stroke-width="2"` : `stroke="none"`;
      svg += `<ellipse cx="${x}" cy="${y}" rx="6.3" ry="4.3" transform="rotate(-18 ${x} ${y})" fill="${color}" ${strokeAttr} ${selectFilter} />`;

      const accX = chordX - 15 + accXOffset;
      if (note.alter === 1) {
        svg += proto.renderSharp(accX, y, color, 0.98);
      } else if (note.alter === -1) {
        svg += proto.renderFlat(accX + 1, y, color, 0.98);
      } else if (note.alter === 2) {
        svg += proto.renderDoubleSharp(accX - 1, y, color, 0.98);
      } else if (note.alter === -2) {
        svg += proto.renderDoubleFlat(accX - 3, y, color, 0.98);
      }

      svg += `<title>โน้ตที่ ${idx + 1}: ${Theory.formatNoteName(note)}</title></g>`;
    });

    svg += `</svg>`;
    container.innerHTML = svg;
  },

  /**
   * วาดแถวโน้ตตัวอย่างสำหรับบทเรียนบนบรรทัด 5 เส้นเดียว (1 Clef)
   */
  renderLessonExamples(containerId, examples, playFnName, clef = 'treble') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const proto = StaffRenderer.prototype;
    const lineSpacing = 10;
    const half = lineSpacing / 2;
    const colWidth = 114;
    const startX = 20;
    const firstChordX = 110;
    const svgWidth = firstChordX + Math.max(0, examples.length - 1) * colWidth + 72;
    const endX = svgWidth - 16;

    const isBass = clef === 'bass';
    const bottomStep = isBass ? 18 : 30;
    const topStep = bottomStep + 8;

    // คำนวณโน้ตต่ำสุดและสูงสุดจากทุกตัวอย่าง เพื่อขยับตำแหน่งข้อความให้ไม่ทับโน้ต/เส้นน้อย
    const allSteps = [];
    examples.forEach(ex => ex.notes.forEach(n => allSteps.push(Theory.noteToDiatonicStep(n))));
    const minStep = allSteps.length ? Math.min(...allSteps) : bottomStep;
    const maxStep = allSteps.length ? Math.max(...allSteps) : topStep;
    const extraTop = Math.max(0, (maxStep - topStep) * half);

    const staffTopY = Math.max(38, 16 + extraTop);
    const staffBottomY = staffTopY + 4 * lineSpacing;
    const lowestNoteY = staffBottomY + Math.max(0, (bottomStep - minStep) * half);
    const labelY = Math.max(staffBottomY + 26, lowestNoteY + 22);
    const sublabelY = labelY + 16;
    const totalHeight = sublabelY + 14;

    let svg = `<svg width="${svgWidth}" height="${totalHeight}" viewBox="0 0 ${svgWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg" class="grand-staff-svg" style="max-width:100%; height:auto; display:block; margin:0 auto;">`;
    svg += `<line x1="${startX}" y1="${staffTopY}" x2="${startX}" y2="${staffBottomY}" stroke="#1e293b" stroke-width="1.6" />`;
    svg += proto.renderStaffLines(startX, endX, staffTopY, lineSpacing);
    if (isBass) {
      svg += proto.renderBassClef(startX + 10, staffTopY);
    } else {
      svg += proto.renderTrebleClef(startX + 10, staffTopY);
    }
    svg += `<line x1="${endX}" y1="${staffTopY}" x2="${endX}" y2="${staffBottomY}" stroke="#1e293b" stroke-width="2.2" />`;

    examples.forEach((ex, exIdx) => {
      const chordX = firstChordX + exIdx * colWidth;
      if (exIdx > 0) {
        svg += `<line x1="${chordX - colWidth / 2}" y1="${staffTopY}" x2="${chordX - colWidth / 2}" y2="${staffBottomY}" stroke="#cbd5e1" stroke-width="1" />`;
      }

      svg += `<g onclick="${playFnName}(${exIdx})" style="cursor: pointer;">`;
      svg += `<rect x="${chordX - 44}" y="${staffTopY - 18}" width="88" height="${totalHeight - (staffTopY - 18)}" rx="8" fill="transparent" />`;

      const items = ex.notes.map((n, idx) => {
        const step = Theory.noteToDiatonicStep(n);
        const y = staffBottomY - (step - bottomStep) * half;
        return { note: n, idx, step, y };
      });

      const sorted = [...items].sort((a, b) => a.step - b.step);
      let lastAccOffset = 0;
      for (let i = 0; i < sorted.length; i++) {
        const cur = sorted[i];
        cur.xOffset = (i > 0 && Math.abs(cur.step - sorted[i - 1].step) <= 1 && sorted[i - 1].xOffset === 0) ? 9.8 : 0;
        if (cur.note.alter && cur.note.alter !== 0) {
          lastAccOffset = (i > 0 && Math.abs(cur.step - sorted[i - 1].step) <= 3 && sorted[i - 1].note.alter !== 0 && lastAccOffset === 0) ? -11 : 0;
          cur.accXOffset = lastAccOffset;
        } else {
          cur.accXOffset = 0;
        }
      }

      items.forEach(item => {
        const { note, idx, step, y, xOffset, accXOffset } = item;
        const x = chordX + xOffset;
        const color = this.NOTE_COLORS[idx % this.NOTE_COLORS.length];

        if (step <= bottomStep - 2) {
          for (let s = bottomStep - 2; s >= step; s -= 2) {
            const ly = staffBottomY + (bottomStep - s) * half;
            svg += `<line x1="${x - 8.5}" y1="${ly}" x2="${x + 8.5}" y2="${ly}" stroke="#1e293b" stroke-width="1.05" />`;
          }
        }
        if (step >= topStep + 2) {
          for (let s = topStep + 2; s <= step; s += 2) {
            const ly = staffTopY - (s - topStep) * half;
            svg += `<line x1="${x - 8.5}" y1="${ly}" x2="${x + 8.5}" y2="${ly}" stroke="#1e293b" stroke-width="1.05" />`;
          }
        }

        svg += `<ellipse cx="${x}" cy="${y}" rx="5.6" ry="3.9" transform="rotate(-18 ${x} ${y})" fill="${color}" />`;
        const accX = chordX - 13.5 + accXOffset;
        if (note.alter === 1) svg += proto.renderSharp(accX, y, color, 0.9);
        else if (note.alter === -1) svg += proto.renderFlat(accX + 1, y, color, 0.9);
        else if (note.alter === 2) svg += proto.renderDoubleSharp(accX - 1, y, color, 0.9);
        else if (note.alter === -2) svg += proto.renderDoubleFlat(accX - 3, y, color, 0.9);
      });

      svg += `<text x="${chordX}" y="${labelY}" text-anchor="middle" font-family="'Plus Jakarta Sans', 'Prompt', sans-serif" font-size="14" font-weight="700" fill="#0f172a">${ex.label}</text>`;
      svg += `<text x="${chordX}" y="${sublabelY}" text-anchor="middle" font-family="'Prompt', sans-serif" font-size="11" fill="#475569">${ex.sublabel}</text>`;
      svg += `<title>คลิกเพื่อฟังเสียง ${ex.label}</title></g>`;
    });

    svg += `</svg>`;
    container.innerHTML = svg;
  }
};

// Export global
if (typeof window !== 'undefined') {
  window.StaffRenderer = StaffRenderer;
  window.ChordLabRenderer = ChordLabRenderer;
}
