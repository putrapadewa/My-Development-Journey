import React from 'react';
import { UserProfile, SkillItem, IndividualDevelopmentPlan } from '../../types';

export interface CardSections {
  orgStructure: boolean;
  metrics: boolean;
  strengths: boolean;
  devAreas: boolean;
  careerAspiration: boolean;
  certifications: boolean;
  devPlan: boolean;
  talentBox: boolean;
}

interface GrowCardPrintViewProps {
  user: UserProfile;
  skills: SkillItem[];
  idpHistory: IndividualDevelopmentPlan[];
  activeIdp?: IndividualDevelopmentPlan;
  visibleSections: CardSections;
}

const typeLabels: Record<string, string> = {
  '70_EXPERIENCE': '70% Experience',
  '20_EXPOSURE': '20% Exposure',
  '10_LEARNING': '10% Learning',
};

const typeColors: Record<string, string> = {
  '70_EXPERIENCE': '#7c3aed',
  '20_EXPOSURE': '#2563eb',
  '10_LEARNING': '#4f46e5',
};

export const GrowCardPrintView: React.FC<GrowCardPrintViewProps> = ({
  user,
  skills,
  idpHistory,
  activeIdp,
  visibleSections,
}) => {
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
  const activities = (currentIdp?.activities || []).slice(0, 6);
  const period = currentIdp?.period || '2026 H1';

  const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  // Determine which columns have content (for layout)
  const hasLeft = visibleSections.orgStructure || visibleSections.careerAspiration || visibleSections.certifications;
  const hasRight = visibleSections.metrics || visibleSections.strengths || visibleSections.devAreas;

  return (
    <div
      id="grow-card-print"
      style={{
        width: '297mm',
        minHeight: '210mm',
        background: '#fff',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
        }}
      >
        {/* Avatar */}
        <img
          src={user.avatar}
          alt={user.name}
          style={{
            width: 72,
            height: 72,
            borderRadius: 14,
            objectFit: 'cover',
            border: '3px solid rgba(255,255,255,0.25)',
            flexShrink: 0,
          }}
        />

        {/* Name & position */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
              {user.name}
            </h1>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#a5b4fc', background: 'rgba(165,180,252,0.15)', border: '1px solid rgba(165,180,252,0.3)', padding: '2px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: 1 }}>
              {user.level}
            </span>
            {visibleSections.talentBox && (
              <span style={{ fontSize: 10, fontWeight: 700, color: '#6ee7b7', background: 'rgba(110,231,183,0.15)', border: '1px solid rgba(110,231,183,0.3)', padding: '2px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: 1 }}>
                9-Box: High Potential
              </span>
            )}
          </div>
          <p style={{ margin: '4px 0 0', color: '#c7d2fe', fontSize: 12, fontWeight: 500 }}>
            {user.position} &bull; <strong style={{ color: '#fff' }}>{user.businessUnit}</strong>
          </p>
          <p style={{ margin: '2px 0 0', color: 'rgba(199,210,254,0.7)', fontSize: 10, fontWeight: 500 }}>
            {user.division} &bull; {user.department} &bull; {user.location}
          </p>
        </div>

        {/* Right: IDs + GROW badge */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Employee ID</div>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 800, fontFamily: 'monospace' }}>{user.employeeId}</div>
          <div style={{ fontSize: 9, color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>Bergabung</div>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{user.joinDate}</div>
          <div style={{ marginTop: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '4px 12px' }}>
            <div style={{ fontSize: 8, color: '#c7d2fe', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Periode</div>
            <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 800 }}>{period}</div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: '14px 18px', display: 'flex', gap: 14, flex: 1 }}>

        {/* LEFT COLUMN */}
        {hasLeft && (
          <div style={{ width: hasRight ? '38%' : '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Org Structure */}
            {visibleSections.orgStructure && (
              <Section title="Struktur Organisasi" accent="#312e81">
                <InfoRow label="Direct Line Manager" value={user.managerName} />
                <InfoRow label="HRBP Partner" value={user.hrbpName} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Telepon" value={user.phone} />
              </Section>
            )}

            {/* Career Aspiration */}
            {visibleSections.careerAspiration && (
              <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 9, color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Aspirasi Karir & Target Peran</div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 800, lineHeight: 1.3 }}>Head of Enterprise Architecture</div>
                <div style={{ fontSize: 10, color: '#c7d2fe', marginTop: 4, lineHeight: 1.5 }}>
                  Kesiapan Suksesi: <strong style={{ color: '#6ee7b7' }}>Ready in 6–12 Months</strong>
                </div>
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 4 }}>
                    <div style={{ width: '84%', height: '100%', background: '#6ee7b7', borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 10, color: '#6ee7b7', fontWeight: 800 }}>84%</span>
                </div>
                <div style={{ fontSize: 9, color: '#a5b4fc', marginTop: 2 }}>Kesesuaian Kompetensi Suksesi</div>
              </div>
            )}

            {/* Certifications */}
            {visibleSections.certifications && user.certifications.length > 0 && (
              <Section title="Sertifikasi & Lisensi" accent="#059669">
                {user.certifications.slice(0, 4).map((cert, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '4px 0', borderBottom: i < user.certifications.slice(0,4).length - 1 ? '1px solid #f0fdf4' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#064e3b' }}>{cert.name}</div>
                      <div style={{ fontSize: 9, color: '#6b7280' }}>{cert.issuer} · {cert.issueDate}</div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#059669', background: '#d1fae5', border: '1px solid #a7f3d0', padding: '1px 7px', borderRadius: 999, whiteSpace: 'nowrap', marginLeft: 6 }}>Verified</span>
                  </div>
                ))}
              </Section>
            )}
          </div>
        )}

        {/* RIGHT COLUMN */}
        {hasRight && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Metrics */}
            {visibleSections.metrics && (
              <Section title="Kinerja & Pengembangan" accent="#7c3aed">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {[
                    { label: 'Total XP', value: String(totalXP), color: '#d97706' },
                    { label: 'Jam Belajar', value: `${totalHours}h`, color: '#1e1b4b' },
                    { label: 'Skill Fit', value: `${achievedSkills}/${skills.length}`, color: '#059669' },
                    { label: 'Gap Aktif', value: String(criticalGaps), color: '#d97706' },
                  ].map((m) => (
                    <div key={m.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: m.color, marginTop: 2 }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 6, background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 8, padding: '5px 10px', textAlign: 'center' }}>
                  <span style={{ fontSize: 9, color: '#4338ca', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Talent Readiness: </span>
                  <span style={{ fontSize: 10, color: '#1e1b4b', fontWeight: 800 }}>Ready in 6–12 Months</span>
                </div>
              </Section>
            )}

            {/* Strengths & Dev Areas — side by side */}
            {(visibleSections.strengths || visibleSections.devAreas) && (
              <div style={{ display: 'flex', gap: 10, flex: visibleSections.devPlan ? 'none' : 1 }}>
                {visibleSections.strengths && (
                  <div style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 9, color: '#065f46', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Kekuatan (Strengths)</div>
                    {strengthSkills.length > 0 ? strengthSkills.map((s) => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '1px solid #d1fae5' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#064e3b' }}>{s.name}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#059669', background: '#d1fae5', padding: '1px 7px', borderRadius: 999 }}>Lv {s.currentProficiency}</span>
                      </div>
                    )) : (
                      <p style={{ fontSize: 10, color: '#059669', margin: 0 }}>Terus kembangkan kompetensi untuk mencapai proficiency target.</p>
                    )}
                  </div>
                )}
                {visibleSections.devAreas && (
                  <div style={{ flex: 1, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 9, color: '#78350f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Area Pengembangan</div>
                    {gapSkills.length > 0 ? gapSkills.map((s) => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '1px solid #fef3c7' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#78350f' }}>{s.name}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '1px 7px', borderRadius: 999 }}>-{s.gap}</span>
                      </div>
                    )) : (
                      <p style={{ fontSize: 10, color: '#d97706', margin: 0 }}>Semua kompetensi telah memenuhi standar.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── DEVELOPMENT PLAN TABLE ── */}
      {visibleSections.devPlan && activities.length > 0 && (
        <div style={{ padding: '0 18px 14px' }}>
          <div style={{ fontSize: 9, color: '#1e1b4b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Rencana Pengembangan 70:20:10 — {period}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9 }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                {['Tujuan / Goals', 'Tipe', 'Program', 'Provider', 'Timeline', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '5px 8px', textAlign: 'left', fontWeight: 700, color: '#475569', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.map((act, i) => (
                <tr key={act.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: '4px 8px', color: '#0f172a', fontWeight: 600, maxWidth: 160 }}>{act.goal}</td>
                  <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 8, fontWeight: 700, color: typeColors[act.frameworkType] || '#475569', background: `${typeColors[act.frameworkType] || '#94a3b8'}15`, padding: '1px 7px', borderRadius: 999, border: `1px solid ${typeColors[act.frameworkType] || '#94a3b8'}40` }}>
                      {typeLabels[act.frameworkType] || act.frameworkType}
                    </span>
                  </td>
                  <td style={{ padding: '4px 8px', color: '#334155', fontWeight: 500 }}>{act.programName}</td>
                  <td style={{ padding: '4px 8px', color: '#64748b' }}>{act.provider}</td>
                  <td style={{ padding: '4px 8px', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {act.timelineStart && act.timelineEnd
                      ? `${act.timelineStart.slice(0, 7)} – ${act.timelineEnd.slice(0, 7)}`
                      : '—'}
                  </td>
                  <td style={{ padding: '4px 8px' }}>
                    <span style={{ fontSize: 8, fontWeight: 700, color: act.status === 'COMPLETED' || act.status === 'VALIDATED' ? '#059669' : act.status === 'IN_PROGRESS' ? '#2563eb' : '#94a3b8', background: act.status === 'COMPLETED' || act.status === 'VALIDATED' ? '#d1fae5' : act.status === 'IN_PROGRESS' ? '#dbeafe' : '#f1f5f9', padding: '1px 7px', borderRadius: 999 }}>
                      {act.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{ background: '#1e1b4b', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 9, color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            Growth &amp; Readiness for Opportunity &amp; Work
          </span>
          {visibleSections.talentBox && (
            <span style={{ fontSize: 9, fontWeight: 700, color: '#6ee7b7', background: 'rgba(110,231,183,0.15)', border: '1px solid rgba(110,231,183,0.3)', padding: '2px 10px', borderRadius: 999 }}>
              9-Box: High Potential
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 9, color: 'rgba(165,180,252,0.6)' }}>Digenerate: {today}</span>
          <span style={{ fontSize: 9, color: '#a5b4fc', fontWeight: 700 }}>My Development Journey — MDJ</span>
        </div>
      </div>
    </div>
  );
};

/* ── Helper sub-components ── */
function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', overflow: 'hidden' }}>
      <div style={{ fontSize: 9, color: accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingBottom: 5, borderBottom: `2px solid ${accent}20` }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 9, color: '#0f172a', fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}
