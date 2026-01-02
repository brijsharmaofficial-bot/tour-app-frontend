declare module 'html2pdf.js' {
    export type ImageType = 'jpeg' | 'png' | 'webp';
  
    export interface Html2PdfOptions {
      margin?: number | [number, number] | [number, number, number, number];
      filename?: string;
      image?: {
        type?: ImageType;
        quality?: number;
      };
      html2canvas?: any;
      jsPDF?: {
        unit?: string;
        format?: string | [number, number];   // ✔ FIXED (no number[])
        orientation?: 'portrait' | 'landscape'; // ✔ FIXED strict types
      };
      pagebreak?: any;
    }
  
    export interface Html2PdfInstance {
      set(options: Html2PdfOptions): Html2PdfInstance;
      from(element: HTMLElement | string): Html2PdfInstance;
      save(): Promise<any>;
    }
  
    function html2pdf(): Html2PdfInstance;
  
    namespace html2pdf {
      function set(options: Html2PdfOptions): Html2PdfInstance;
      function from(element: HTMLElement | string): Html2PdfInstance;
    }
  
    export default html2pdf;
  }
  