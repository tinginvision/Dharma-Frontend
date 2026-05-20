import { SocialPageContent } from "@/components/social/SocialPageContent";
import { buildPageMetadata } from "@/lib/siteMetadata";

export const metadata = buildPageMetadata({
  title: "Social",
  path: "/social",
});

/** Legacy Angular `dharma-world` state at `/social`. */
export default function SocialPage() {
  return (
    <div className="social-page">
      <SocialPageContent />
    </div>
  );
}
