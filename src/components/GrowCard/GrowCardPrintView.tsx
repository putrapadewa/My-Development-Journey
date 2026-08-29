import React from 'react';
import { UserProfile, SkillItem, IndividualDevelopmentPlan } from '../../types';

export interface CardSections {
  strengths: boolean;
  devAreas: boolean;
  devPlan: boolean;
  education: boolean;
  certifications: boolean;
  orgStructure: boolean;
  careerAspiration: boolean;
  metrics: boolean;
  talentBox: boolean;
}

interface GrowCardPrintViewProps {
  user: UserProfile;
  skills: SkillItem[];
  idpHistory: IndividualDevelopmentPlan[];
  activeIdp?: IndividualDevelopmentPlan;
  visibleSections: CardSections;
}

const TYPE_LABELS: Record<string, string> = {
  '70_EXPERIENCE': '70% Experience',
  '20_EXPOSURE': '20% Exposure',
  '10_LEARNING': '10% Learning',
};

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '70_EXPERIENCE': { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
  '20_EXPOSURE':   { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
  '10_LEARNING':   { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc' },
};

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  COMPLETED:           { color: '#059669', bg: '#d1fae5' },
  VALIDATED:           { color: '#059669', bg: '#d1fae5' },
  IN_PROGRESS:         { color: '#2563eb', bg: '#dbeafe' },
  WAITING_FOR_APPROVAL:{ color: '#d97706', bg: '#fef3c7' },
  DRAFT:               { color: '#64748b', bg: '#f1f5f9' },
  NOT_STARTED:         { color: '#64748b', bg: '#f1f5f9' },
};

const FONT = "'Poppins', 'Segoe UI', system-ui, sans-serif";

export const GrowCardPrintView: React.FC<GrowCardPrintViewProps> = ({
  user,
  skills,
  idpHistory,
  activeIdp,
  visibleSections,
}) => {
  const totalXP      = skills.reduce((acc, s) => acc + s.xpEarned, 0);
  const totalHours   = idpHistory.reduce((acc, idp) => acc + idp.activities.reduce((a, act) => a + (act.learningHours || 0), 0), 0);
  const achievedSkills = skills.filter((s) => s.gap <= 0).length;
  const criticalGaps   = skills.filter((s) => s.gap > 0.8).length;

  const strengthSkills = skills.filter((s) => s.gap <= 0).slice(0, 5);
  const gapSkills      = skills.filter((s) => s.gap > 0).sort((a, b) => b.gap - a.gap).slice(0, 5);

  const currentIdp  = activeIdp || idpHistory[0];
  const activities  = (currentIdp?.activities || []).slice(0, 8);
  const period      = currentIdp?.period || '2026 H1';

  const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  const hasLeft  = visibleSections.education || visibleSections.certifications
                || visibleSections.orgStructure || visibleSections.careerAspiration;
  const hasRight = visibleSections.strengths || visibleSections.devAreas;
  const hasBody  = hasLeft || hasRight;

  return (
    <div
      id="grow-card-print"
      style={{
        width: '100%',
        background: '#ffffff',
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)',
        padding: '18px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        flexShrink: 0,
      }}>
        {/* Avatar */}
        <img
          src={user.avatar}
          alt={user.name}
          style={{
            width: 84,
            height: 84,
            borderRadius: 16,
            objectFit: 'cover',
            border: '3px solid rgba(255,255,255,0.25)',
            flexShrink: 0,
          }}
        />

        {/* Identity */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
            <h1 style={{ margin: 0, color: '#ffffff', fontSize: 22, fontWeight: 800, letterSpacing: -0.3, fontFamily: FONT, lineHeight: 1.2 }}>
              {user.name}
            </h1>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', background: 'rgba(165,180,252,0.15)', border: '1px solid rgba(165,180,252,0.35)', padding: '3px 12px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: 0.8, whiteSpace: 'nowrap' }}>
              {user.level}
            </span>
            {visibleSections.talentBox && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6ee7b7', background: 'rgba(110,231,183,0.15)', border: '1px solid rgba(110,231,183,0.35)', padding: '3px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                9-Box: High Potential
              </span>
            )}
          </div>
          <div style={{ color: '#c7d2fe', fontSize: 14, fontWeight: 600, marginBottom: 3, fontFamily: FONT }}>
            {user.position}
          </div>
          <div style={{ color: 'rgba(199,210,254,0.8)', fontSize: 12, fontWeight: 500, fontFamily: FONT }}>
            <strong style={{ color: '#e0e7ff' }}>{user.businessUnit}</strong>
            {user.division ? <span> &bull; {user.division}</span> : null}
            {user.department ? <span> &bull; {user.department}</span> : null}
            {user.location ? <span> &bull; {user.location}</span> : null}
          </div>
        </div>

        {/* Right meta */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 10, color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontFamily: FONT }}>Employee ID</div>
            <div style={{ fontSize: 16, color: '#ffffff', fontWeight: 800, fontFamily: 'monospace' }}>{user.employeeId}</div>
          </div>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 10, color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontFamily: FONT }}>Bergabung</div>
            <div style={{ fontSize: 12, color: '#e0e7ff', fontWeight: 600, fontFamily: FONT }}>{user.joinDate}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '5px 14px' }}>
            <div style={{ fontSize: 10, color: '#c7d2fe', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontFamily: FONT }}>Periode IDP</div>
            <div style={{ fontSize: 13, color: '#fbbf24', fontWeight: 800, fontFamily: FONT }}>{period}</div>
          </div>
        </div>
      </div>

      {/* ── METRICS BAR ─────────────────────────────────────────────────────── */}
      {visibleSections.metrics && (
        <div style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', display: 'flex', flexShrink: 0 }}>
          {[
            { label: 'Total XP',    value: String(totalXP),              color: '#d97706', border: '#fde68a' },
            { label: 'Jam Belajar', value: `${totalHours}h`,             color: '#1d4ed8', border: '#93c5fd' },
            { label: 'Skill Fit',   value: `${achievedSkills}/${skills.length}`, color: '#059669', border: '#6ee7b7' },
            { label: 'Critical Gap',value: String(criticalGaps),         color: '#dc2626', border: '#fca5a5' },
          ].map((m, i) => (
            <div key={m.label} style={{ flex: 1, textAlign: 'center', padding: '10px 8px', borderRight: i < 3 ? '1px solid #e2e8f0' : 'none', borderBottom: `3px solid ${m.border}` }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: FONT }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontFamily: FONT, lineHeight: 1.2 }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── BODY ─────────────────────────────────────────────────────────────── */}
      {hasBody && (
        <div style={{ padding: '16px 24px', display: 'flex', gap: 16, flexShrink: 0 }}>

          {/* LEFT COLUMN */}
          {hasLeft && (
            <div style={{ width: hasRight ? '40%' : '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Education */}
              {visibleSections.education && user.education.length > 0 && (
                <Section title="Riwayat Pendidikan" accent="#1d4ed8">
                  {user.education.map((edu, i) => (
                    <div key={i} style={{ padding: '6px 0', borderBottom: i < user.education.length - 1 ? '1px solid #eff6ff' : 'none' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1e3a8a', fontFamily: FONT }}>{edu.degree}{edu.major ? ` — ${edu.major}` : ''}</div>
                      <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600, fontFamily: FONT }}>{edu.institution}</div>
                      {(edu.year || edu.faculty) && (
                        <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: FONT }}>{edu.year}{edu.faculty ? ` · ${edu.faculty}` : ''}</div>
                      )}
                    </div>
                  ))}
                </Section>
              )}

              {/* Certifications */}
              {visibleSections.certifications && user.certifications.length > 0 && (
                <Section title="Sertifikasi & Pelatihan" accent="#059669">
                  {user.certifications.slice(0, 6).map((cert, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '5px 0', borderBottom: i < Math.min(user.certifications.length, 6) - 1 ? '1px solid #f0fdf4' : 'none' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#064e3b', fontFamily: FONT }}>{cert.name}</div>
                        <div style={{ fontSize: 10, color: '#6b7280', fontFamily: FONT }}>{cert.issuer} · {cert.issueDate}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', background: '#d1fae5', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap', marginLeft: 10, flexShrink: 0 }}>✓ Verified</span>
                    </div>
                  ))}
                </Section>
              )}

              {/* Org Structure */}
              {visibleSections.orgStructure && (
                <Section title="Struktur Organisasi" accent="#312e81">
                  <InfoRow label="Direct Manager" value={user.managerName} />
                  <InfoRow label="HRBP Partner" value={user.hrbpName} />
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Telepon" value={user.phone} />
                </Section>
              )}

              {/* Career Aspiration */}
              {visibleSections.careerAspiration && (
                <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ fontSize: 10, color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontFamily: FONT }}>Aspirasi Karir</div>
                  <div style={{ fontSize: 14, color: '#ffffff', fontWeight: 800, lineHeight: 1.3, fontFamily: FONT }}>Head of Enterprise Architecture</div>
                  <div style={{ fontSize: 11, color: '#c7d2fe', marginTop: 6, fontFamily: FONT }}>
                    Kesiapan: <strong style={{ color: '#6ee7b7' }}>Ready in 6–12 Months</strong>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.15)', borderRadius: 4 }}>
                      <div style={{ width: '84%', height: '100%', background: '#6ee7b7', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 800, fontFamily: FONT }}>84%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RIGHT COLUMN */}
          {hasRight && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Strengths */}
              {visibleSections.strengths && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ fontSize: 10, color: '#065f46', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontFamily: FONT }}>Kekuatan (Strengths)</div>
                  {strengthSkills.length > 0 ? strengthSkills.map((s, i) => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: i < strengthSkills.length - 1 ? '1px solid #d1fae5' : 'none' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#064e3b', fontFamily: FONT, flex: 1, minWidth: 0 }}>{s.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#d1fae5', padding: '2px 10px', borderRadius: 999, whiteSpace: 'nowrap', marginLeft: 8, fontFamily: FONT }}>Lv {s.currentProficiency}</span>
                    </div>
                  )) : (
                    <p style={{ fontSize: 12, color: '#059669', margin: 0, fontFamily: FONT }}>Terus kembangkan kompetensi untuk mencapai proficiency target.</p>
                  )}
                </div>
              )}

              {/* Development Areas */}
              {visibleSections.devAreas && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ fontSize: 10, color: '#78350f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontFamily: FONT }}>Area Pengembangan</div>
                  {gapSkills.length > 0 ? gapSkills.map((s, i) => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: i < gapSkills.length - 1 ? '1px solid #fef3c7' : 'none' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#78350f', fontFamily: FONT, flex: 1, minWidth: 0 }}>{s.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '2px 10px', borderRadius: 999, whiteSpace: 'nowrap', marginLeft: 8, fontFamily: FONT }}>Gap {s.gap > 0 ? `+${Number(s.gap).toFixed(1)}` : s.gap}</span>
                    </div>
                  )) : (
                    <p style={{ fontSize: 12, color: '#d97706', margin: 0, fontFamily: FONT }}>Semua kompetensi telah memenuhi standar.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── DEVELOPMENT PLAN TABLE (70:20:10) ─────────────────────────────── */}
      {visibleSections.devPlan && activities.length > 0 && (
        <div style={{ padding: '0 24px 16px', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: '#1e1b4b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontFamily: FONT }}>
            Strategic Development Plan (70:20:10) — {period}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT }}>
            <thead>
              <tr style={{ background: '#1e1b4b' }}>
                {['Tujuan / Goals', 'Tipe', 'Program / Intervensi', 'Provider', 'Timeline', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#e0e7ff', fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.map((act, i) => {
                const tc = TYPE_COLORS[act.frameworkType] || { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
                const sc = STATUS_STYLE[act.status] || { color: '#64748b', bg: '#f1f5f9' };
                return (
                  <tr key={act.id} style={{ background: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '7px 10px', color: '#0f172a', fontWeight: 600, fontSize: 11 }}>{act.goal}</td>
                    <td style={{ padding: '7px 10px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: tc.text, background: tc.bg, padding: '2px 9px', borderRadius: 999, border: `1px solid ${tc.border}` }}>
                        {TYPE_LABELS[act.frameworkType] || act.frameworkType}
                      </span>
                    </td>
                    <td style={{ padding: '7px 10px', color: '#334155', fontWeight: 500, fontSize: 11 }}>{act.programName}</td>
                    <td style={{ padding: '7px 10px', color: '#64748b', fontSize: 11 }}>{act.provider}</td>
                    <td style={{ padding: '7px 10px', color: '#64748b', whiteSpace: 'nowrap', fontSize: 11 }}>
                      {act.timelineStart && act.timelineEnd
                        ? `${act.timelineStart.slice(0, 7)} – ${act.timelineEnd.slice(0, 7)}`
                        : '—'}
                    </td>
                    <td style={{ padding: '7px 10px' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: sc.color, background: sc.bg, padding: '2px 9px', borderRadius: 999 }}>
                        {act.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <div style={{
        background: '#0f172a',
        padding: '10px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        marginTop: 'auto',
      }}>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, fontFamily: FONT }}>
          Copyright 2026 TechConnect - People Capability Development
        </span>
        <span style={{ fontSize: 11, color: '#64748b', fontFamily: FONT }}>
          Digenerate: {today}
        </span>
      </div>
    </div>
  );
};

/* ── Sub-components ──────────────────────────────────────────────────────── */
function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px' }}>
      <div style={{
        fontSize: 10,
        color: accent,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        paddingBottom: 6,
        borderBottom: `2px solid ${accent}30`,
        fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const font = "'Poppins', 'Segoe UI', system-ui, sans-serif";
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '5px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, fontFamily: font, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 11, color: '#0f172a', fontWeight: 700, textAlign: 'right', maxWidth: '62%', fontFamily: font, wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}
