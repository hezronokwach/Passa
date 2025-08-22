import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  height?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export class QRCodeGenerator {
  /**
   * Generates a QR code as a Data URL (base64)
   * @param data - The data to encode in the QR code
   * @param options - Optional configuration for the QR code
   * @returns A promise that resolves to the QR code as a Data URL string
   */
  static async generateDataURL(data: string, options?: QRCodeOptions): Promise<string> {
    try {
      const qrOptions = {
        width: options?.width || 300,
        margin: options?.margin || 1,
        color: {
          dark: options?.color?.dark || '#000000',
          light: options?.color?.light || '#ffffff',
        },
      };

      return await QRCode.toDataURL(data, qrOptions);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generates a QR code as an SVG string
   * @param data - The data to encode in the QR code
   * @param options - Optional configuration for the QR code
   * @returns A promise that resolves to the QR code as an SVG string
   */
  static async generateSVG(data: string, options?: QRCodeOptions): Promise<string> {
    try {
      const qrOptions = {
        margin: options?.margin || 1,
        color: {
          dark: options?.color?.dark || '#000000',
          light: options?.color?.light || '#ffffff',
        },
      };

      return await QRCode.toString(data, { ...qrOptions, type: 'svg' });
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generates a QR code as a Buffer
   * @param data - The data to encode in the QR code
   * @param options - Optional configuration for the QR code
   * @returns A promise that resolves to the QR code as a Buffer
   */
  static async generateBuffer(data: string, options?: QRCodeOptions): Promise<Buffer> {
    try {
      const qrOptions = {
        width: options?.width || 300,
        margin: options?.margin || 1,
        color: {
          dark: options?.color?.dark || '#000000',
          light: options?.color?.light || '#ffffff',
        },
      };

      return await QRCode.toBuffer(data, qrOptions);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }
}