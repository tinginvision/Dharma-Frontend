import { FanCornerQuiz } from "@/components/fan/FanCornerQuiz";
import { buildPageMetadata } from "@/lib/siteMetadata";

export const metadata = buildPageMetadata({
  title: "Fan Corner",
  path: "/fan-corner",
});

/** Legacy Angular `fan-corner` — registration modal + timed quiz (`rapidAnswer.js`). */
export default function FanCornerPage() {
  return (
    <div className="min-vh-content">
      <FanCornerQuiz />
    </div>
  );
}
