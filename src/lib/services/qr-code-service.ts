import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  height?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H';
}

export class QRCodeService {
  /**
   * Generates a QR code as a Data URL (base64)
   * @param data - The data to encode in the QR code (string or object)
   * @param options - Optional configuration for the QR code
   * @returns A promise that resolves to the QR code as a Data URL string
   */
  static async generateDataURL(data: string | object, options?: QRCodeOptions): Promise<string> {
    try {
      const stringData = typeof data === 'string' ? data : JSON.stringify(data);
      
      const qrOptions = {
        width: options?.width || 300,
        margin: options?.margin || 1,
        errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
        color: {
          dark: options?.color?.dark || '#000000',
          light: options?.color?.light || '#ffffff',
        },
      };

      return await QRCode.toDataURL(stringData, qrOptions);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generates a QR code as an SVG string
   * @param data - The data to encode in the QR code (string or object)
   * @param options - Optional configuration for the QR code
   * @returns A promise that resolves to the QR code as an SVG string
   */
  static async generateSVG(data: string | object, options?: QRCodeOptions): Promise<string> {
    try {
      const stringData = typeof data === 'string' ? data : JSON.stringify(data);
      
      const qrOptions = {
        margin: options?.margin || 1,
        errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
        color: {
          dark: options?.color?.dark || '#000000',
          light: options?.color?.light || '#ffffff',
        },
      };

      return await QRCode.toString(stringData, { ...qrOptions, type: 'svg' });
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generates a QR code as a Buffer
   * @param data - The data to encode in the QR code (string or object)
   * @param options - Optional configuration for the QR code
   * @returns A promise that resolves to the QR code as a Buffer
   */
  static async generateBuffer(data: string | object, options?: QRCodeOptions): Promise<Buffer> {
    try {
      const stringData = typeof data === 'string' ? data : JSON.stringify(data);
      
      const qrOptions = {
        width: options?.width || 300,
        margin: options?.margin || 1,
        errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
        color: {
          dark: options?.color?.dark || '#000000',
          light: options?.color?.light || '#ffffff',
        },
      };

      return await QRCode.toBuffer(stringData, qrOptions);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Verifies and parses QR code data
   * @param qrDataString - The JSON string from the QR code
   * @returns The parsed data or null if invalid
   */
  static verifyQRCodeData<T>(qrDataString: string): T | null {
    try {
      return JSON.parse(qrDataString) as T;
    } catch (error) {
      console.error('Error verifying QR code data:', error);
      return null;
    }
  }
}