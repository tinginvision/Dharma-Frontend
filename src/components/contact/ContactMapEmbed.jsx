"use client";

import {
  CONTACT_GOOGLE_MAPS_PLACE_URL,
  CONTACT_MAP_EMBED_SRC,
} from "@/lib/contactOfficeMap";

/** Google Maps iframe embed (same as legacy contact map share link). */
export function ContactMapEmbed() {
  return (
    <div className="contact-page__map-root contact-page__map-root--iframe">
      <iframe
        className="contact-page__map-canvas contact-page__map-iframe map"
        src={CONTACT_MAP_EMBED_SRC}
        title="Dharma Productions Pvt. Ltd. — Supreme Chambers, Andheri West, Mumbai"
        width="100%"
        height={450}
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="contact-page__map-iframe-open">
        <a
          href={CONTACT_GOOGLE_MAPS_PLACE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-page__map-iframe-link"
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  );
}
