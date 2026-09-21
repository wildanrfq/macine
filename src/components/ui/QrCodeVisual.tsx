"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrCodeVisualProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
}

export default function QrCodeVisual({
  value,
  size = 200,
  className = "",
  darkColor = "#121110",
  lightColor = "#FFFFFF",
}: QrCodeVisualProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => {
        console.error("Failed to generate QR code", err);
      });
  }, [value, size, darkColor, lightColor]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center border border-line bg-paper/50 ${className}`}
      >
        <span className="font-mono text-[10px] text-reel">Memuat QR...</span>
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt="QR Code"
      width={size}
      height={size}
      className={`block select-none ${className}`}
    />
  );
}
