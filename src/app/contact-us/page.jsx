import Image from "next/image";

import { ContactDepartmentEmails } from "@/components/contact/ContactDepartmentEmails";
import { ContactMapWithAddressPanel } from "@/components/contact/ContactMapWithAddressPanel";
import { buildPageMetadata } from "@/lib/siteMetadata";

export const metadata = buildPageMetadata({
  title: "Contact Us",
  path: "/contact-us",
});

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dharma Productions Pvt. Ltd.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "201 & 202, 2nd Floor, Supreme Chambers, Off Veera Desai Road, 17/18 Shah Industrial Estate",
    addressLocality: "Andheri (W)",
    addressRegion: "Mumbai",
    postalCode: "400053",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 19.13398,
    longitude: 72.8367,
  },
};

export default function ContactUsPage() {
  return (
    <div className="contact-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
      />

      <section>
        <div className="banner dh-relative">
          <Image
            src="/frontend/img/contact-new.jpg"
            alt="Contact Dharma Productions"
            width={1920}
            height={640}
            className="img-fluid w-100 d-block contact-page__hero-img"
            sizes="100vw"
            priority
          />
        </div>
      </section>

      <section>
        <ContactMapWithAddressPanel />
      </section>

      <section>
        <ContactDepartmentEmails />
      </section>
    </div>
  );
}
