import { useSearch } from "@tanstack/react-router";
export function probeIndex() {
  const s = useSearch({ from: "/ratings/" });
  const x: 1 = s;
  return x;
}
export function probeParent() {
  const s = useSearch({ from: "/ratings" });
  const y: 2 = s;
  return y;
}
