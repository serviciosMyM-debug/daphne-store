"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phone = "5493416230111";

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-105 hover:bg-green-600"
    >
      <MessageCircle size={28} />
    </a>
  );
}