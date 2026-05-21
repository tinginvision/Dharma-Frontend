"use client";

import { ContactMapSection } from "@/components/contact/ContactMapSection";
import {
  CONTACT_GOOGLE_MAPS_PLACE_URL,
  CONTACT_OFFICE_PHONE,
  CONTACT_OFFICE_WEBSITE,
} from "@/lib/contactOfficeMap";

/** Same map strip + overlay address panel as `/contact-us` (`contact-us/page.jsx`). */
export function ContactMapWithAddressPanel() {
  return (
    <div className="dh-relative">
      <div className="w-100">
        <ContactMapSection />
      </div>
      <div className="dh-absulate add-show maps min-add">
        <h4 className="margin0 font-karla">Dharma Productions</h4>
        <p className="margin0 mt-1 font-karla" style={{ fontSize: "0.9rem", opacity: 0.95 }}>
          Film production company
        </p>
        <div className="mt15 font-karla">
          <p className="margin0">Unit 201 &amp; 202, 2nd Floor, Supreme Chambers,</p>
          <p className="margin0">17/18 Shah Industrial Estate, Off Veera Desai Road,</p>
          <p className="margin0">Andheri (W), Mumbai 400053, India</p>
          <p className="margin0 mt-2">
            <a href={`tel:${CONTACT_OFFICE_PHONE.replace(/\s/g, "")}`} className="text-white text-decoration-none">
              {CONTACT_OFFICE_PHONE}
            </a>
          </p>
          <p className="margin0">
            <a
              href={CONTACT_OFFICE_WEBSITE}
              className="text-white text-decoration-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              dharma-production.com
            </a>
          </p>
          <p className="margin0 mt-3">
            <a
              href={CONTACT_GOOGLE_MAPS_PLACE_URL}
              className="text-white text-decoration-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Google Maps
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
