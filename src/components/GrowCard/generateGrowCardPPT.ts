import PptxGenJS from 'pptxgenjs';
import { UserProfile, SkillItem, IndividualDevelopmentPlan } from '../../types';
import { CardSections } from './GrowCardPrintView';

const DARK = '0f172a';
const INDIGO = '312e81';
const INDIGO_MID = '4338ca';
const INDIGO_LIGHT = 'c7d2fe';
const WHITE = 'ffffff';
const SLATE = '64748b';
const SLATE_LIGHT = 'f1f5f9';
const EMERALD = '059669';
const EMERALD_BG = 'd1fae5';
const AMBER = 'd97706';
const AMBER_BG = 'fef3c7';

// Slide dimensions: A4 landscape in inches (11.69 × 8.27)
const W = 11.69;
const H = 8.27;

const typeLabels: Record<string, string> = {
  '70_EXPERIENCE': '70% Exp',
  '20_EXPOSURE': '20% Exp',
  '10_LEARNING': '10% Learning',
};

export async function generateGrowCardPPT(
  user: UserProfile,
  skills: SkillItem[],
  idpHistory: IndividualDevelopmentPlan[],
  activeIdp: IndividualDevelopmentPlan | undefined,
  visibleSections: CardSections,
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33 × 7.5 inches (16:9 widescreen – better for screens)

  // Override to A4 landscape
  pptx.defineLayout({ name: 'A4_LAND', width: W, height: H });
  pptx.layout = 'A4_LAND';

  const slide = pptx.addSlide();

  // Derived data
  const totalXP = skills.reduce((acc, s) => acc + s.xpEarned, 0);
  const totalHours = idpHistory.reduce(
    (acc, idp) => acc + idp.activities.reduce((a, act) => a + (act.learningHours || 0), 0),
    0,
  );
  const achievedSkills = skills.filter((s) => s.gap <= 0).length;
  const criticalGaps = skills.filter((s) => s.gap > 0.8).length;
  const strengthSkills = skills.filter((s) => s.gap <= 0).slice(0, 4);
  const gapSkills = skills.filter((s) => s.gap > 0).slice(0, 4);
  const currentIdp = activeIdp || idpHistory[0];
  const activities = (currentIdp?.activities || []).slice(0, 5);
  const period = currentIdp?.period || '2026 H1';
  const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  // ── HEADER BACKGROUND ─────────────────────────────────────────────────────
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 1.3,
    fill: { type: 'gradient', stops: [{ position: 0, color: DARK }, { position: 100, color: INDIGO }] },
    line: { color: INDIGO, width: 0 },
  });

  // ── HEADER: Name & Position ────────────────────────────────────────────────
  const nameX = 1.35;
  slide.addText(user.name, {
    x: nameX, y: 0.12, w: 6.5, h: 0.4,
    fontSize: 22, bold: true, color: WHITE, fontFace: 'Segoe UI',
  });
  slide.addText(user.position, {
    x: nameX, y: 0.52, w: 6.5, h: 0.22,
    fontSize: 11, color: INDIGO_LIGHT, fontFace: 'Segoe UI',
  });
  slide.addText(`${user.businessUnit}  •  ${user.division}  •  ${user.department}`, {
    x: nameX, y: 0.72, w: 6.5, h: 0.2,
    fontSize: 9, color: '8b9ec7', fontFace: 'Segoe UI',
  });

  // Level badge text
  slide.addText(user.level, {
    x: nameX, y: 0.94, w: 1.1, h: 0.2,
    fontSize: 8, bold: true, color: INDIGO_LIGHT,
    fill: { color: '1e1b4b' }, line: { color: '6366f1', width: 1 },
    align: 'center', valign: 'middle',
    shape: pptx.ShapeType.roundRect, rectRadius: 0.05,
  });

  if (visibleSections.talentBox) {
    slide.addText('9-Box: High Potential', {
      x: nameX + 1.2, y: 0.94, w: 1.6, h: 0.2,
      fontSize: 8, bold: true, color: '6ee7b7',
      fill: { color: '064e3b' }, line: { color: '059669', width: 1 },
      align: 'center', valign: 'middle',
      shape: pptx.ShapeType.roundRect, rectRadius: 0.05,
    });
  }

  // ── HEADER: Right side — IDs ───────────────────────────────────────────────
  const idX = W - 2.3;
  slide.addText('Employee ID', { x: idX, y: 0.12, w: 2.1, h: 0.15, fontSize: 8, color: INDIGO_LIGHT, fontFace: 'Segoe UI', align: 'right' });
  slide.addText(user.employeeId, { x: idX, y: 0.27, w: 2.1, h: 0.22, fontSize: 12, bold: true, color: WHITE, fontFace: 'Courier New', align: 'right' });
  slide.addText('Bergabung', { x: idX, y: 0.5, w: 2.1, h: 0.15, fontSize: 8, color: INDIGO_LIGHT, fontFace: 'Segoe UI', align: 'right' });
  slide.addText(user.joinDate, { x: idX, y: 0.65, w: 2.1, h: 0.18, fontSize: 10, bold: true, color: WHITE, align: 'right' });
  slide.addText(`Periode: ${period}`, { x: idX, y: 0.85, w: 2.1, h: 0.18, fontSize: 9, bold: true, color: 'fbbf24', align: 'right' });

  // ── BODY LAYOUT ────────────────────────────────────────────────────────────
  const bodyTop = 1.4;
  const bodyH = H - bodyTop - 0.45; // leave footer
  const leftW = 3.6;
  const rightW = W - leftW - 0.3;
  const leftX = 0.15;
  const rightX = leftX + leftW + 0.15;

  let leftY = bodyTop;
  let rightY = bodyTop;

  // ── LEFT: Org Structure ────────────────────────────────────────────────────
  if (visibleSections.orgStructure) {
    const rows = [
      ['Direct Line Manager', user.managerName],
      ['HRBP Partner', user.hrbpName],
      ['Email', user.email],
      ['Telepon', user.phone],
      ['Lokasi', user.location],
    ];
    _addSectionHeader(slide, pptx, 'STRUKTUR ORGANISASI', leftX, leftY, leftW, INDIGO_MID);
    leftY += 0.22;
    rows.forEach(([label, value]) => {
      slide.addText([
        { text: `${label}: `, options: { color: SLATE, fontSize: 8 } },
        { text: value, options: { color: DARK, bold: true, fontSize: 8 } },
      ], { x: leftX, y: leftY, w: leftW, h: 0.18, fontFace: 'Segoe UI' });
      leftY += 0.19;
    });
    leftY += 0.08;
  }

  // ── LEFT: Career Aspiration ────────────────────────────────────────────────
  if (visibleSections.careerAspiration) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: leftX, y: leftY, w: leftW, h: 0.9,
      fill: { type: 'gradient', stops: [{ position: 0, color: '1e1b4b' }, { position: 100, color: INDIGO }] },
      line: { color: '4338ca', width: 1 },
      rectRadius: 0.08,
    });
    _addSectionHeader(slide, pptx, 'ASPIRASI KARIR & TARGET PERAN', leftX + 0.1, leftY + 0.05, leftW - 0.2, INDIGO_LIGHT);
    slide.addText('Head of Enterprise Architecture', {
      x: leftX + 0.1, y: leftY + 0.25, w: leftW - 0.2, h: 0.28,
      fontSize: 12, bold: true, color: WHITE, fontFace: 'Segoe UI', wrap: true,
    });
    slide.addText('Kesiapan Suksesi: Ready in 6–12 Months  |  Kesesuaian: 84%', {
      x: leftX + 0.1, y: leftY + 0.66, w: leftW - 0.2, h: 0.16,
      fontSize: 8, color: '6ee7b7', fontFace: 'Segoe UI',
    });
    leftY += 1.0;
  }

  // ── LEFT: Certifications ────────────────────────────────────────────────────
  if (visibleSections.certifications && user.certifications.length > 0) {
    _addSectionHeader(slide, pptx, 'SERTIFIKASI & LISENSI', leftX, leftY, leftW, EMERALD);
    leftY += 0.22;
    user.certifications.slice(0, 4).forEach((cert) => {
      slide.addText([
        { text: `• ${cert.name}`, options: { bold: true, color: '064e3b', fontSize: 8 } },
        { text: `  ${cert.issuer} · ${cert.issueDate}`, options: { color: SLATE, fontSize: 7.5 } },
      ], { x: leftX, y: leftY, w: leftW, h: 0.19, fontFace: 'Segoe UI' });
      leftY += 0.2;
    });
  }

  // ── RIGHT: Metrics ─────────────────────────────────────────────────────────
  if (visibleSections.metrics) {
    _addSectionHeader(slide, pptx, 'KINERJA & PENGEMBANGAN', rightX, rightY, rightW, '7c3aed');
    rightY += 0.22;
    const metrics = [
      { label: 'Total XP', value: String(totalXP), color: AMBER },
      { label: 'Jam Belajar', value: `${totalHours}h`, color: INDIGO },
      { label: 'Skill Fit', value: `${achievedSkills}/${skills.length}`, color: EMERALD },
      { label: 'Gap Aktif', value: String(criticalGaps), color: AMBER },
    ];
    const mW = (rightW - 0.3) / 4;
    metrics.forEach((m, i) => {
      const mx = rightX + i * (mW + 0.1);
      slide.addShape(pptx.ShapeType.roundRect, {
        x: mx, y: rightY, w: mW, h: 0.55,
        fill: { color: SLATE_LIGHT }, line: { color: 'e2e8f0', width: 1 }, rectRadius: 0.06,
      });
      slide.addText(m.label, { x: mx, y: rightY + 0.04, w: mW, h: 0.14, fontSize: 7, color: SLATE, align: 'center', bold: true, fontFace: 'Segoe UI' });
      slide.addText(m.value, { x: mx, y: rightY + 0.18, w: mW, h: 0.28, fontSize: 16, color: m.color, align: 'center', bold: true, fontFace: 'Segoe UI' });
    });
    rightY += 0.65;
    slide.addText('Talent Readiness: Ready in 6–12 Months', {
      x: rightX, y: rightY, w: rightW, h: 0.22,
      fontSize: 9, bold: true, color: INDIGO, align: 'center',
      fill: { color: 'eef2ff' }, line: { color: 'c7d2fe', width: 1 },
      shape: pptx.ShapeType.roundRect, rectRadius: 0.05,
      fontFace: 'Segoe UI',
    });
    rightY += 0.3;
  }

  // ── RIGHT: Strengths & Dev Areas (side by side) ────────────────────────────
  if (visibleSections.strengths || visibleSections.devAreas) {
    const colW = visibleSections.strengths && visibleSections.devAreas ? (rightW - 0.1) / 2 : rightW;
    let colX = rightX;

    if (visibleSections.strengths) {
      _addSectionHeader(slide, pptx, 'KEKUATAN (STRENGTHS)', colX, rightY, colW, EMERALD);
      let sy = rightY + 0.22;
      strengthSkills.forEach((s) => {
        slide.addShape(pptx.ShapeType.roundRect, { x: colX, y: sy, w: colW, h: 0.19, fill: { color: 'f0fdf4' }, line: { color: 'bbf7d0', width: 1 }, rectRadius: 0.04 });
        slide.addText([
          { text: s.name, options: { bold: true, color: '064e3b', fontSize: 8 } },
          { text: `  Lv ${s.currentProficiency}`, options: { color: EMERALD, fontSize: 8, bold: true } },
        ], { x: colX + 0.05, y: sy, w: colW - 0.1, h: 0.19, fontFace: 'Segoe UI' });
        sy += 0.21;
      });
      if (strengthSkills.length === 0) {
        slide.addText('Terus kembangkan kompetensi.', { x: colX, y: rightY + 0.22, w: colW, h: 0.2, fontSize: 8, color: EMERALD });
      }
      colX += colW + 0.1;
    }

    if (visibleSections.devAreas) {
      _addSectionHeader(slide, pptx, 'AREA PENGEMBANGAN', colX, rightY, colW, AMBER);
      let dy = rightY + 0.22;
      gapSkills.forEach((s) => {
        slide.addShape(pptx.ShapeType.roundRect, { x: colX, y: dy, w: colW, h: 0.19, fill: { color: 'fffbeb' }, line: { color: 'fde68a', width: 1 }, rectRadius: 0.04 });
        slide.addText([
          { text: s.name, options: { bold: true, color: '78350f', fontSize: 8 } },
          { text: `  -${s.gap}`, options: { color: AMBER, fontSize: 8, bold: true } },
        ], { x: colX + 0.05, y: dy, w: colW - 0.1, h: 0.19, fontFace: 'Segoe UI' });
        dy += 0.21;
      });
      if (gapSkills.length === 0) {
        slide.addText('Semua kompetensi memenuhi standar.', { x: colX, y: rightY + 0.22, w: colW, h: 0.2, fontSize: 8, color: AMBER });
      }
    }

    const strengthsHeight = Math.max(strengthSkills.length, gapSkills.length) * 0.21 + 0.3;
    rightY += strengthsHeight;
  }

  // ── DEVELOPMENT PLAN TABLE (full width below both columns) ─────────────────
  if (visibleSections.devPlan && activities.length > 0) {
    const tableTop = Math.max(leftY, rightY) + 0.1;
    const tableW = W - 0.3;

    _addSectionHeader(slide, pptx, `RENCANA PENGEMBANGAN 70:20:10 — ${period}`, 0.15, tableTop, tableW, INDIGO);

    const headers = ['Tujuan / Goals', 'Tipe', 'Program', 'Provider', 'Timeline', 'Status'];
    const colWidths = [2.5, 1.1, 2.2, 1.5, 1.2, 0.95];
    const rowH = 0.22;
    let ty = tableTop + 0.22;

    // Header row
    let tx = 0.15;
    headers.forEach((h, i) => {
      slide.addShape(pptx.ShapeType.rect, { x: tx, y: ty, w: colWidths[i], h: rowH, fill: { color: 'e2e8f0' }, line: { color: 'cbd5e1', width: 1 } });
      slide.addText(h, { x: tx + 0.05, y: ty, w: colWidths[i] - 0.05, h: rowH, fontSize: 7.5, bold: true, color: '475569', valign: 'middle', fontFace: 'Segoe UI' });
      tx += colWidths[i];
    });
    ty += rowH;

    activities.forEach((act, rowIdx) => {
      tx = 0.15;
      const rowColor = rowIdx % 2 === 0 ? WHITE : 'f8fafc';
      const cells = [
        act.goal,
        typeLabels[act.frameworkType] || act.frameworkType,
        act.programName,
        act.provider,
        act.timelineStart && act.timelineEnd ? `${act.timelineStart.slice(0, 7)} – ${act.timelineEnd.slice(0, 7)}` : '—',
        act.status.replace(/_/g, ' '),
      ];
      cells.forEach((cell, i) => {
        slide.addShape(pptx.ShapeType.rect, { x: tx, y: ty, w: colWidths[i], h: rowH, fill: { color: rowColor }, line: { color: 'e2e8f0', width: 1 } });
        slide.addText(cell, { x: tx + 0.05, y: ty, w: colWidths[i] - 0.05, h: rowH, fontSize: 7.5, color: DARK, valign: 'middle', wrap: true, fontFace: 'Segoe UI' });
        tx += colWidths[i];
      });
      ty += rowH;
    });
  }

  // ── FOOTER ────────────────────────────────────────────────────────────────
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: H - 0.38, w: W, h: 0.38,
    fill: { color: '1e1b4b' }, line: { color: '1e1b4b', width: 0 },
  });
  slide.addText('Growth & Readiness for Opportunity & Work — My Development Journey (MDJ)', {
    x: 0.15, y: H - 0.35, w: W * 0.6, h: 0.3,
    fontSize: 8, color: INDIGO_LIGHT, fontFace: 'Segoe UI', valign: 'middle',
  });
  slide.addText(`Digenerate: ${today}`, {
    x: W * 0.7, y: H - 0.35, w: W * 0.28, h: 0.3,
    fontSize: 8, color: '8b9ec7', align: 'right', valign: 'middle', fontFace: 'Segoe UI',
  });

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const safeName = user.name.replace(/[^a-z0-9]/gi, '_');
  await pptx.writeFile({ fileName: `GROW-Card_${safeName}.pptx` });
}

/* ── Helper: small section header label ─────────────────────────────────── */
function _addSectionHeader(
  slide: PptxGenJS.Slide,
  _pptx: PptxGenJS,
  title: string,
  x: number,
  y: number,
  w: number,
  color: string,
) {
  slide.addText(title, {
    x, y, w, h: 0.18,
    fontSize: 7.5, bold: true, color,
    fontFace: 'Segoe UI',
    border: { type: 'none', pt: 0, color: 'transparent' },
  });
}
