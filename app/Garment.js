// Placeholder garment art. Swap for <img src=...> when real photos exist.
const S = { top:"M35 8L50 17 65 8 90 24 82 46 72 39V112H28V39L18 46 10 24Z", bottom:"M30 6H70L74 112H54L50 40 46 112H26Z", long:"M36 8L50 15 64 8 84 22 78 44 72 38 80 118H20L28 38 22 44 16 22Z", wrap:"M20 10C45 40 55 -5 80 14L86 110C60 90 40 130 14 108Z" };
export default function Garment({ shape, c, c2, img }) {
  if (img) return <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />;
  return (
    <svg viewBox="0 0 100 120" aria-hidden="true">
      {shape === "set" ? (<><path d="M33 6L50 14 67 6 88 20 82 40 72 34V60H28V34L18 40 12 20Z" fill={c} /><path d="M30 62H70L72 114H54L50 78 46 114H28Z" fill={c2 || c} /></>) : <path d={S[shape]} fill={c} />}
    </svg>
  );
}
