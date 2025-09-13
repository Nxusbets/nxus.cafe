import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import './QRCode.css';

interface QRCodeProps {
  productId: string;
  productName: string;
  size?: number;
  className?: string;
}

export default function QRCodeComponent({ productId, productName, size = 100, className = '' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

  // El QR debe llevar a la URL del producto para agregarlo al carrito
  // Por ejemplo: https://tudominio.com/product/{productId}
  const baseUrl = window.location.origin;
  const qrUrl = `${baseUrl}/product/${productId}`;

  QRCode.toCanvas(canvasRef.current, qrUrl, {
      width: size,
      color: {
        dark: '#8B4513', // Color café para el QR
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    }).catch(error => {
      console.error('Error generating QR code:', error);
    });
  }, [productId, productName, size]);

  return (
    <div className={`qr-code-container ${className}`}>
      <canvas
        ref={canvasRef}
        className="qr-code-canvas"
        style={{ width: size, height: size }}
      />
      <div className="qr-label">
        <small>Escanea para agregar</small>
      </div>
    </div>
  );
}
