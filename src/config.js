/* =====================================================================
   WEDDING INVITATION — single configuration file.
   Edit names, dates, venues, links and asset paths here only.
   ===================================================================== */

const config = {
  assets: {
    openingVideo: "/assets/opening.mp4",
    poster: "/assets/opening-poster.jpg",
    heroFinalFrame: "/assets/hero-final-frame.jpg",
    music: "/assets/music.mp3", // optional — if missing, the music toggle hides itself
  },

  couple: {
    bride: { name: "Amina", family: "Daughter of [Bride's parents' names]" },
    groom: { name: "Fahad", family: "Son of [Groom's parents' names]" },
    monogram: "A&F",
  },

  hero: {
    calligraphy: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    introLine: "Together with our families",
    inviteLine: "Invite you to celebrate their wedding",
    scrollHint: "Scroll to Explore",
  },

  welcome: {
    eyebrow: "WELCOME",
    heading: "A Blessed Beginning",
    text: "With hearts full of gratitude, we warmly invite you to join us as we celebrate this beautiful beginning with the love, prayers, and blessings of our families.",
    signature: "Amina & Fahad",
  },

  dateSection: {
    eyebrow: "A DATE TO HOLD CLOSE",
    heading: "Scratch to Reveal",
    revealTitle: "YOU'RE INVITED!",
    revealDate: "15 November 2026",
    revealDay: "Sunday • 10:30 AM",
    countdownEyebrow: "UNTIL WE SAY QUBOOL HAI",
    countdownHeading: "Counting every heartbeat",
    // ISO date with timezone for the live countdown
    iso: "2026-11-15T10:30:00+05:30",
  },

  events: {
    eyebrow: "THE CELEBRATION",
    heading: "Events of Joy",
    list: [
      {
        name: "Nikah Ceremony",
        date: "Sunday, 15 November 2026",
        time: "11:30 AM onwards",
        venue: "The Grand Palace, Kozhikode",
        mapsUrl: "https://maps.google.com/?q=The+Grand+Palace+Kozhikode+Kerala+India",
        highlight: true,
      },
      {
        name: "Mehendi",
        date: "Friday, 13 November 2026",
        time: "4:00 PM",
        venue: "Bride's Residence",
        mapsUrl: "https://maps.google.com/?q=Kozhikode+Kerala+India",
      },
      {
        name: "Qawwali Evening",
        date: "Saturday, 14 November 2026",
        time: "7:00 PM",
        venue: "Groom's Residence",
        mapsUrl: "https://maps.google.com/?q=Kozhikode+Kerala+India",
      },
      {
        name: "Walima",
        date: "Monday, 16 November 2026",
        time: "7:30 PM",
        venue: "The Grand Palace, Kozhikode",
        mapsUrl: "https://maps.google.com/?q=The+Grand+Palace+Kozhikode+Kerala+India",
      },
    ],
    note: "Event details are examples — share the real ones to update.",
  },

  gallery: {
    eyebrow: "OUR STORY",
    heading: "Moments, softly held",
    // Add real photo URLs here — e.g. ["/assets/photo1.jpg", ...].
    // Empty array shows elegant placeholder frames.
    photos: [],
  },

  venue: {
    eyebrow: "THE VENUE",
    name: "The Grand Palace",
    address: "Kozhikode, Kerala, India",
    mapsUrl: "https://maps.google.com/?q=The+Grand+Palace+Kozhikode+Kerala+India",
    embedSrc:
      "https://maps.google.com/maps?q=Kozhikode,%20Kerala,%20India&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },

  dressCode: {
    eyebrow: "DRESS CODE",
    heading: "Festive Formal",
    text: "Traditional or formal attire is encouraged. Sarees, lehengas, anarkalis, sherwanis, kurtas, suits, and formal dresses are all welcome. We kindly ask guests to avoid overly casual attire and white or ivory.",
    palette: ["#3a0812", "#6b1020", "#a31621", "#c9a24a", "#f4ead3"],
  },

  rsvp: {
    eyebrow: "RSVP",
    heading: "Will you join us?",
    text: "Kindly reply by 01 November — tap below to confirm on WhatsApp. Your presence would mean the world to us.",
    buttonLabel: "RSVP on WhatsApp",
    // Replace with the couple's/family's real WhatsApp number:
    whatsapp: "https://wa.me/910000000000?text=Assalamu%20Alaikum!%20I%20would%20love%20to%20attend%20the%20wedding.",
  },

  closing: {
    eyebrow: "WITH ALL OUR HEARTS",
    heading: "Your presence is our present",
    text: "Your love, blessings, and presence are the greatest gifts we could ever ask for.",
  },

  footer: {
    heading: "We can't wait to celebrate with you.",
    meta: "15 NOVEMBER 2026 • THE GRAND PALACE",
  },
};

export default config;
