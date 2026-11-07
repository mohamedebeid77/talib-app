import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2, ZoomIn, ZoomOut, AlertCircle, RefreshCw } from 'lucide-react';

// Configure the worker offline
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

interface PdfCanvasViewerProps {
  url: string;
  pageNumber: number;
  onTotalPagesLoaded?: (total: number) => void;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  url,
  pageNumber,
  onTotalPagesLoaded,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const renderTaskRef = useRef<any>(null);

  // Load Document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise
      .then((doc) => {
        if (isCancelled) return;
        setPdfDoc(doc);
        if (onTotalPagesLoaded) {
          onTotalPagesLoaded(doc.numPages);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('Error loading PDF document:', err);
        setError('تعذر فتح ملف الـ PDF. يرجى التأكد من مسار الملف أو استخدام القراءة النصية.');
        setLoading(false);
      });

    return () => {
      isCancelled = true;
      loadingTask.destroy();
    };
  }, [url]);

  // Render Page to Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    let isCancelled = false;
    setLoading(true);

    // Cancel ongoing render if any
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    const targetPage = Math.max(1, Math.min(pageNumber, pdfDoc.numPages));

    pdfDoc
      .getPage(targetPage)
      .then((page) => {
        if (isCancelled || !canvasRef.current || !containerRef.current) return;

        const containerWidth = containerRef.current.clientWidth - 16;
        const unscaledViewport = page.getViewport({ scale: 1.0 });

        // Calculate fit-to-width scale for mobile devices
        const baseScale = containerWidth > 0 ? containerWidth / unscaledViewport.width : 1.0;
        const finalScale = baseScale * zoomScale;

        const viewport = page.getViewport({ scale: finalScale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Support high DPI screens (Retina / AMOLED mobile displays)
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

        const renderContext = {
          canvasContext: context,
          transform: transform,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        renderTask.promise
          .then(() => {
            if (!isCancelled) {
              setLoading(false);
              renderTaskRef.current = null;
            }
          })
          .catch((renderErr: any) => {
            if (renderErr?.name !== 'RenderingCancelledException') {
              console.error('Page render error:', renderErr);
              if (!isCancelled) setLoading(false);
            }
          });
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Error getting page:', err);
          setError('تعذر عرض الصفحة المحددة.');
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNumber, zoomScale]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full h-full overflow-y-auto overflow-x-auto flex flex-col items-center bg-neutral-900 select-none p-2"
    >
      {/* Zoom Toolbar for Mobile */}
      <div className="sticky top-2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800/90 border border-neutral-700 shadow-md backdrop-blur-md text-white text-xs mb-2">
        <button
          onClick={() => setZoomScale((z) => Math.max(0.7, z - 0.2))}
          className="p-1 hover:bg-white/10 rounded-md transition-colors"
          title="تصغير"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="font-cairo font-bold text-[11px] text-amber-400 min-w-[40px] text-center">
          {Math.round(zoomScale * 100)}%
        </span>
        <button
          onClick={() => setZoomScale((z) => Math.min(2.5, z + 0.2))}
          className="p-1 hover:bg-white/10 rounded-md transition-colors"
          title="تكبير"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        {zoomScale !== 1.0 && (
          <button
            onClick={() => setZoomScale(1.0)}
            className="text-[10px] text-neutral-400 hover:text-white mr-1 border-r border-neutral-700 pr-1.5 font-cairo"
          >
            إعادة ضبط
          </button>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-900/60 backdrop-blur-sm text-amber-400 text-xs font-cairo gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          <span>جاري تجهيز صفحة المخطوط...</span>
        </div>
      )}

      {/* Error state */}
      {error ? (
        <div className="m-auto max-w-xs text-center p-5 rounded-2xl bg-neutral-800 border border-red-500/30 text-white space-y-2">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-xs text-neutral-300 font-cairo leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-amber-400 font-bold font-cairo"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-start justify-center w-full">
          <canvas
            ref={canvasRef}
            className="shadow-2xl rounded-sm transition-transform duration-150 mx-auto max-w-full"
            style={{ display: loading && !canvasRef.current ? 'none' : 'block' }}
          />
        </div>
      )}
    </div>
  );
};
