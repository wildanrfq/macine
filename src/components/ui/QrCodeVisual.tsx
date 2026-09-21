"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!value) {
      return;
    }

    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setHasError(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("QR Code generation error:", err);
          setHasError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [value, size, darkColor, lightColor]);

  const currentDataUrl = value ? dataUrl : null;

  if (hasError) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center border border-line bg-paper/50 ${className}`}
      >
        <span className="font-mono text-[10px] text-red-500">QR Gagal Dibuat</span>
      </div>
    );
  }

  if (!currentDataUrl) {
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
    <Image
      src={currentDataUrl}
      alt="QR Code"
      width={size}
      height={size}
      unoptimized
      className={`block select-none ${className}`}
    />
  );
}
