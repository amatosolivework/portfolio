import { ImageResponse } from "next/og";

export const alt = "Alex Matos Olive — iOS Developer & Co-founder / CTO at WRDB";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Editorial OG card — mirrors the monograph cover. System fonts keep it robust.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fafaf8",
          color: "#111013",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#6f6e74",
            borderTop: "2px solid #111013",
            paddingTop: 20,
          }}
        >
          <span>A working monograph</span>
          <span>Vol. 1</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.9 }}>
          <span style={{ fontSize: 150, fontWeight: 800, letterSpacing: -4 }}>
            Alex Matos
          </span>
          <span style={{ fontSize: 150, fontWeight: 800, letterSpacing: -4, color: "#6e2a35" }}>
            Olive
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#111013",
            borderTop: "2px solid #111013",
            paddingTop: 20,
          }}
        >
          <span>iOS Developer · CTO at WRDB</span>
          <span style={{ color: "#6f6e74" }}>Barcelona</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
