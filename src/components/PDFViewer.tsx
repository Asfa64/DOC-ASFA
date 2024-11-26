import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ArrowLeft } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure le worker PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  onClose: () => void;
  title: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, onClose, title }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Erreur de chargement du PDF:', error);
    setError('Impossible de charger le PDF. Veuillez réessayer plus tard.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-accent1 hover:text-accent2 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour au tableau de bord</span>
            </button>
            <h2 className="text-xl font-semibold text-accent1">{title}</h2>
          </div>

          {!error && (
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                className="px-3 py-1 bg-accent1 text-white rounded hover:bg-opacity-90"
              >
                Zoom -
              </button>
              <button
                onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                className="px-3 py-1 bg-accent1 text-white rounded hover:bg-opacity-90"
              >
                Zoom +
              </button>
              {numPages && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                    disabled={pageNumber <= 1}
                    className="px-3 py-1 bg-accent1 text-white rounded hover:bg-opacity-90 disabled:opacity-50"
                  >
                    Page précédente
                  </button>
                  <span className="text-sm">
                    Page {pageNumber} sur {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                    disabled={pageNumber >= numPages}
                    className="px-3 py-1 bg-accent1 text-white rounded hover:bg-opacity-90 disabled:opacity-50"
                  >
                    Page suivante
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center">
            {loading && <div className="text-center py-8">Chargement du PDF...</div>}
            {error && (
              <div className="text-red-600 text-center py-8">
                {error}
              </div>
            )}
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="text-center py-8">Chargement du PDF...</div>}
              className="border rounded-lg shadow-lg"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                loading={<div className="text-center py-8">Chargement de la page...</div>}
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};