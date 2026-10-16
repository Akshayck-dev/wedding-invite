/* =====================================================================
   WEDDING INVITATION — single configuration file.
   Edit names, dates, venues, links and asset paths here only.
   ===================================================================== */

const config = {
  assets: {
    openingVideo: "/assets/opening-sage.mp4",
    poster: "/assets/opening-sage-poster.jpg",
    heroFinalFrame: "/assets/hero-final-frame-sage.jpg",
    music: "/assets/music.mp3", // optional — if missing, the music toggle hides itself
  },

  couple: {
    bride: { name: "Amina", family: "Daughter of [Bride's parents' names]" },
    groom: { name: "Fahad", family: "Son of [Groom's parents' names]" },
    monogram: "A&F",
  },

  hero: {
    calligraphy: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    introLine: "WE REQUEST THE HONOUR OF YOUR PRESENCE AT THE NIKAH OF",
    inviteLine: "AS THEY BEGIN THEIR FOREVER IN FAITH AND LOVE.",
    bottomLine: "A NEW CHAPTER BEGINS",
    dateLine: "Sunday, 15 November 2026",
    scrollHint: "SCROLL",
  },

  welcome: {
    eyebrow: "WELCOME",
    heading: "A Blessed Beginning",
    text: "With the grace of Allah, we invite you to celebrate the beginning of our journey together.",
    signature: "Amina & Fahad",
  },

  dateSection: {
    eyebrow: "A DATE TO HOLD CLOSE",
    heading: "Scratch to Reveal",
    revealTitle: "YOU'RE INVITED!",
    revealDate: "15 November 2026",
    revealDay: "Sunday • 10:30 AM",
    countdownEyebrow: "UNTIL OUR BIG DAY",
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
        dayName: "SUN", dayNum: "15", month: "NOV",
        date: "Sunday, 15 November 2026",
        time: "11:30 AM onwards",
        venue: "The Grand Palace, Kozhikode",
        mapsUrl: "https://maps.google.com/?q=The+Grand+Palace+Kozhikode+Kerala+India",
        icon: "rings",
        highlight: true,
      },
      {
        name: "Mehendi",
        dayName: "FRI", dayNum: "13", month: "NOV",
        date: "Friday, 13 November 2026",
        time: "4:00 PM",
        venue: "Bride's Residence",
        mapsUrl: "https://maps.google.com/?q=Kozhikode+Kerala+India",
        icon: "flower",
      },
      {
        name: "Qawwali Evening",
        dayName: "SAT", dayNum: "14", month: "NOV",
        date: "Saturday, 14 November 2026",
        time: "7:00 PM",
        venue: "Groom's Residence",
        mapsUrl: "https://maps.google.com/?q=Kozhikode+Kerala+India",
        icon: "music",
      },
      {
        name: "Walima",
        dayName: "MON", dayNum: "16", month: "NOV",
        date: "Monday, 16 November 2026",
        time: "7:30 PM",
        venue: "The Grand Palace, Kozhikode",
        mapsUrl: "https://maps.google.com/?q=The+Grand+Palace+Kozhikode+Kerala+India",
        icon: "cloche",
      },
    ],
    note: "YOUR PRESENCE WILL MAKE OUR DAYS EVEN MORE SPECIAL.",
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
    text: "Traditional or formal attire is encouraged — sarees, lehengas, anarkalis, sherwanis, kurtas, suits and formal dresses are all welcome. We kindly ask guests to avoid overly casual attire and white or ivory.",
    palette: [
      { color: "#3a0812", label: "Burgundy" },
      { color: "#6b1020", label: "Maroon" },
      { color: "#a31621", label: "Crimson" },
      { color: "#c9a24a", label: "Antique Gold" },
      { color: "#f4ead3", label: "Ivory" },
    ],
  },

  rsvp: {
    eyebrow: "",
    heading: "Will you join us?",
    text: "Kindly confirm your presence so we can plan with love and care.",
    responseNote: "Your response means a lot to us",
    buttonLabel: "RSVP on WhatsApp",
    // Replace with the couple's/family's real WhatsApp number:
    whatsapp: "https://wa.me/910000000000?text=Assalamu%20Alaikum!%20I%20would%20love%20to%20attend%20the%20wedding.",
  },

  closing: {
    eyebrow: "WITH ALL OUR HEARTS",
    heading: "Your presence is our present",
    text: "Your love, prayers and presence are all we request as we begin this beautiful journey together. We can't wait to celebrate with you.",
  },

  footer: {
    heading: "We can't wait to celebrate with you.",
    meta: "IN SHA ALLAH • SEE YOU SOON",
  },
};

export default config;
