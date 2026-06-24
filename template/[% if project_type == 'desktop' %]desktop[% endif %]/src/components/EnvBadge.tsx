"use client";

// Small ambient badge so it is always obvious which environment the running
// build points at. Reads the public env var baked in at build time. The same
// component shape is used across the web/mobile/desktop presets.
const ENV = process.env.NEXT_PUBLIC_APP_ENV ?? "develop";

const PALETTE: Record<string, { bg: string; fg: string }> = {
  develop: { bg: "#3b2f00", fg: "#ffd866" },
  prod: { bg: "#0a2a14", fg: "#5ee08a" },
  production: { bg: "#0a2a14", fg: "#5ee08a" },
};

export default function EnvBadge() {
  const colors = PALETTE[ENV] ?? PALETTE.develop;
  return (
    <span
      title={`Environment: ${ENV}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        background: colors.bg,
        color: colors.fg,
        borderRadius: 999,
        padding: "0.25rem 0.7rem",
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: 999, background: colors.fg }} />
      {ENV} / desktop
    </span>
  );
}
