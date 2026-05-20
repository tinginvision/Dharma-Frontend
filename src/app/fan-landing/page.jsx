import { FanLandingContent } from "@/components/fan/FanLandingContent";
import { buildPageMetadata } from "@/lib/siteMetadata";

export const metadata = buildPageMetadata({
  title: "Fan Landing",
  path: "/fan-landing",
});

/** Legacy Angular `fan-landing` state. */
export default function FanLandingPage() {
  return (
    <div className="min-vh-content">
      <FanLandingContent />
    </div>
  );
}
