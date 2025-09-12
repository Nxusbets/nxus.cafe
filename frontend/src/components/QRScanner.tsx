import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './QRScanner.css';

interface QRScannerProps {
  onScanSuccess: (productData: any) => void;
  onScanError?: (error: string) => void;
  className?: string;
}

export default function QRScanner({ onScanSuccess, onScanError, className = '' }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    return () => {
      // Limpiar scanner al desmontar
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const startScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        handleScanSuccess(decodedText);
      },
      (errorMessage) => {
        handleScanError(errorMessage);
      }
    );

    setIsScanning(true);
    setError('');
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanSuccess = (decodedText: string) => {
    try {
      const productData = JSON.parse(decodedText);

      if (productData.type === 'product' && productData.productId) {
        onScanSuccess(productData);
        stopScanning();
      } else {
        handleScanError('Código QR no válido');
      }
    } catch (error) {
      handleScanError('Error al procesar el código QR');
    }
  };

  const handleScanError = (errorMessage: string) => {
    console.warn('QR Scan error:', errorMessage);
    setError(errorMessage);

    if (onScanError) {
      onScanError(errorMessage);
    }
  };

  return (
    <div className={`qr-scanner-container ${className}`}>
      <div className="scanner-header">
        <h3>📱 Escáner QR</h3>
        <div className="scanner-controls">
          {!isScanning ? (
            <button
              className="scan-btn start"
              onClick={startScanning}
            >
              🔄 Iniciar Escaneo
            </button>
          ) : (
            <button
              className="scan-btn stop"
              onClick={stopScanning}
            >
              ⏹️ Detener Escaneo
            </button>
          )}
        </div>
      </div>

      <div className="scanner-area">
        <div
          id="qr-reader"
          className={`qr-reader ${isScanning ? 'active' : ''}`}
        ></div>

        {!isScanning && (
          <div className="scanner-placeholder">
            <div className="placeholder-icon">📱</div>
            <p>Haz clic en "Iniciar Escaneo" para usar la cámara</p>
          </div>
        )}
      </div>

      {error && (
        <div className="scanner-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      <div className="scanner-info">
        <small>
          Apunta la cámara hacia el código QR del producto que deseas agregar
        </small>
      </div>
    </div>
  );
}
