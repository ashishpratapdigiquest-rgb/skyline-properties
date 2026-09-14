const WHATSAPP_NUMBER = "919876543210"; // country code + number, no + or spaces
const DEFAULT_MESSAGE = "Namaste! Mujhe Skyline Properties ke baare mein jaankari chahiye.";

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp par baat karo"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C22 6.45 17.5 2 12.04 2zm5.83 14.09c-.24.68-1.42 1.32-1.94 1.4-.53.08-1.11.11-1.79-.11-.41-.13-.94-.31-1.62-.6-2.86-1.24-4.72-4.13-4.86-4.32-.14-.19-1.16-1.55-1.16-2.96s.72-2.1 1-2.39c.24-.24.53-.3.71-.3.18 0 .35.001.5.008.16.007.38-.06.59.45.24.58.81 1.99.88 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.29-.13.57.17.28.75 1.24 1.61 2.01 1.11.99 2.04 1.29 2.32 1.44.28.14.44.12.61-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.63-.14.26.1 1.65.78 1.93.92.29.14.48.21.55.33.07.12.07.68-.16 1.36z"/>
      </svg>
      <span className="hidden sm:inline text-sm font-semibold">WhatsApp</span>
    </a>
  );
}
