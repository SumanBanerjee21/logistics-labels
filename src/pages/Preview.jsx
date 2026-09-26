import React, { useContext, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Printer,
  Monitor,
  Download,
  X,
  Save
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { AuthContext } from '../context/AuthContext';

export default function Preview() {
  const locationState = useLocation().state;
  const navigate = useNavigate();

  const {
    currentUser,
    incrementPagesPrinted
  } = useContext(AuthContext);

  const [paperSize, setPaperSize] = useState(
    locationState?.paperSize || '3x4'
  );

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!locationState) {
    return <Navigate to="/" />;
  }

  const THIRTY_DAYS =
    30 * 24 * 60 * 60 * 1000;

  const isExpired =
    currentUser.subscriptionDate &&
    (
      Date.now() -
      new Date(
        currentUser.subscriptionDate
      ).getTime()
    ) > THIRTY_DAYS;

  if (isExpired) {
    return <Navigate to="/plans" />;
  }

  const isFreePlan =
    currentUser.plan === 'free';

  const isStandardPlan =
    currentUser.plan === '299';

  const limitReached =
    (isFreePlan &&
      currentUser.pagesPrinted >= 10) ||
    (isStandardPlan &&
      currentUser.pagesPrinted >= 10000);

  if (limitReached) {
    return <Navigate to="/plans" />;
  }

  const {
    docket,
    location,
    totalBoxes
  } = locationState;

  const boxCount = Number(totalBoxes);

  /*
   * All PDF dimensions are stored in millimetres.
   *
   * 1 inch = 25.4 mm
   */
  const PAPER_SIZES = {
    '2x3': {
      width: 50.8,
      height: 76.2,
      label: '2" × 3"',
      aspect: 'aspect-[2/3]'
    },

    '3x4': {
      width: 76.2,
      height: 101.6,
      label: '3" × 4"',
      aspect: 'aspect-[3/4]'
    },

    '4x4': {
      width: 101.6,
      height: 101.6,
      label: '4" × 4"',
      aspect: 'aspect-square'
    },

    '4x6': {
      width: 101.6,
      height: 152.4,
      label: '4" × 6"',
      aspect: 'aspect-[2/3]'
    },

    '100x150': {
      width: 100,
      height: 150,
      label: '100 × 150 mm',
      aspect: 'aspect-[2/3]'
    },

    A6: {
      width: 105,
      height: 148,
      label: 'A6 (105×148mm)',
      aspect: 'aspect-[3/4]'
    }
  };

  const currentSize =
    PAPER_SIZES[paperSize] ||
    PAPER_SIZES['3x4'];

  /*
   * Convert logo to PNG so jsPDF can reliably
   * place it inside the PDF.
   */
  const convertLogoToPng = (
    dataUrl
  ) => {
    return new Promise(
      (resolve, reject) => {
        if (!dataUrl) {
          resolve(null);
          return;
        }

        const image =
          new Image();

        image.onload = () => {
          try {
            const canvas =
              document.createElement(
                'canvas'
              );

            canvas.width =
              image.naturalWidth ||
              image.width;

            canvas.height =
              image.naturalHeight ||
              image.height;

            const context =
              canvas.getContext(
                '2d'
              );

            if (!context) {
              reject(
                new Error(
                  'Could not create image canvas.'
                )
              );
              return;
            }

            context.drawImage(
              image,
              0,
              0,
              canvas.width,
              canvas.height
            );

            resolve(
              canvas.toDataURL(
                'image/png'
              )
            );
          } catch (error) {
            reject(error);
          }
        };

        image.onerror = () => {
          reject(
            new Error(
              'Could not load company logo.'
            )
          );
        };

        image.src = dataUrl;
      }
    );
  };

  /*
   * Calculate logo dimensions while
   * preserving aspect ratio.
   */
  const getLogoDimensions = (
    imageData,
    maxWidth,
    maxHeight
  ) => {
    return new Promise(
      (resolve, reject) => {
        const image =
          new Image();

        image.onload = () => {
          const originalWidth =
            image.naturalWidth ||
            image.width;

          const originalHeight =
            image.naturalHeight ||
            image.height;

          if (
            !originalWidth ||
            !originalHeight
          ) {
            reject(
              new Error(
                'Invalid logo dimensions.'
              )
            );
            return;
          }

          const ratio =
            Math.min(
              maxWidth /
                originalWidth,
              maxHeight /
                originalHeight
            );

          resolve({
            width:
              originalWidth *
              ratio,

            height:
              originalHeight *
              ratio
          });
        };

        image.onerror = () => {
          reject(
            new Error(
              'Could not read logo dimensions.'
            )
          );
        };

        image.src = imageData;
      }
    );
  };

  /*
   * Create the actual PDF.
   *
   * Every page uses the selected physical
   * dimensions.
   */
  const createPdf = async () => {
    if (!boxCount || boxCount < 1) {
      throw new Error(
        'Please enter at least 1 box.'
      );
    }

    const pdf =
      new jsPDF({
        orientation:
          'portrait',

        unit: 'mm',

        format: [
          currentSize.width,
          currentSize.height
        ],

        compress: true
      });

    let logoData = null;
    let logoDimensions = null;

    if (currentUser.logo) {
      logoData =
        await convertLogoToPng(
          currentUser.logo
        );

      logoDimensions =
        await getLogoDimensions(
          logoData,
          22,
          16
        );
    }

    /*
     * Create exactly one page
     * for every box.
     */
    for (
      let pageIndex = 0;
      pageIndex < boxCount;
      pageIndex++
    ) {
      if (pageIndex > 0) {
        pdf.addPage([
          currentSize.width,
          currentSize.height
        ]);
      }

      const pageWidth =
        currentSize.width;

      const pageHeight =
        currentSize.height;

      const margin =
        Math.max(
          5,
          Math.min(
            10,
            pageWidth * 0.08
          )
        );

      /*
       * Header
       */
      const headerY =
        margin;

      if (
        logoData &&
        logoDimensions
      ) {
        pdf.addImage(
          logoData,
          'PNG',
          margin,
          headerY,
          logoDimensions.width,
          logoDimensions.height
        );
      }

      const logoRight =
        logoData &&
        logoDimensions
          ? margin +
            logoDimensions.width +
            4
          : margin;

      /*
       * Company name
       */
      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(
        pageWidth <= 55
          ? 8
          : 10
      );

      pdf.setTextColor(
        15,
        23,
        42
      );

      const companyName =
        String(
          currentUser.companyName ||
            ''
        ).toUpperCase();

      const companyNameMaxWidth =
        pageWidth -
        logoRight -
        margin;

      pdf.text(
        companyName,
        logoRight,
        headerY + 7,
        {
          maxWidth:
            Math.max(
              20,
              companyNameMaxWidth
            )
        }
      );

      /*
       * Header separator
       */
      const headerBottom =
        margin +
        Math.max(
          16,
          logoDimensions
            ? logoDimensions.height
            : 10
        ) +
        5;

      pdf.setDrawColor(
        210,
        214,
        220
      );

      pdf.setLineWidth(
        0.3
      );

      pdf.line(
        margin,
        headerBottom,
        pageWidth - margin,
        headerBottom
      );

      /*
       * Docket number
       */
      const contentStart =
        headerBottom + 15;

      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(
        pageWidth <= 55
          ? 6
          : 7
      );

      pdf.setTextColor(
        100,
        116,
        139
      );

      pdf.text(
        'DOCKET NUMBER',
        margin,
        contentStart
      );

      pdf.setTextColor(
        15,
        23,
        42
      );

      pdf.setFontSize(
        pageWidth <= 55
          ? 15
          : pageWidth <= 80
            ? 19
            : 24
      );

      pdf.text(
        String(docket || ''),
        margin,
        contentStart + 9,
        {
          maxWidth:
            pageWidth -
            margin * 2
        }
      );

      /*
       * Location
       */
      const locationLabelY =
        contentStart + 27;

      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(
        pageWidth <= 55
          ? 6
          : 7
      );

      pdf.setTextColor(
        100,
        116,
        139
      );

      pdf.text(
        'LOCATION',
        margin,
        locationLabelY
      );

      pdf.setTextColor(
        51,
        65,
        85
      );

      pdf.setFontSize(
        pageWidth <= 55
          ? 9
          : pageWidth <= 80
            ? 12
            : 15
      );

      pdf.text(
        String(location || ''),
        margin,
        locationLabelY + 8,
        {
          maxWidth:
            pageWidth -
            margin * 2
        }
      );

      /*
       * Footer separator.
       *
       * No BOX number is printed.
       */
      const footerY =
        pageHeight - margin;

      pdf.setDrawColor(
        210,
        214,
        220
      );

      pdf.line(
        margin,
        footerY - 5,
        pageWidth - margin,
        footerY - 5
      );

      pdf.setFont(
        'helvetica',
        'normal'
      );

      pdf.setFontSize(
        pageWidth <= 55
          ? 5
          : 6
      );

      pdf.setTextColor(
        148,
        163,
        184
      );

      pdf.text(
        companyName,
        margin,
        footerY
      );
    }

    return pdf;
  };

  /*
   * Generate PDF and show it
   * inside our own application preview.
   */
  const handleGeneratePDF =
    async () => {
      if (generating) {
        return;
      }

      setPdfError('');
      setGenerating(true);

      try {
        /*
         * Remove previous PDF URL.
         */
        if (pdfUrl) {
          URL.revokeObjectURL(
            pdfUrl
          );
        }

        const pdf =
          await createPdf();

        const blob =
          pdf.output('blob');

        const url =
          URL.createObjectURL(
            blob
          );

        setPdfBlob(blob);
        setPdfUrl(url);
        setShowPdfPreview(true);

        /*
         * Count generated labels
         * exactly once for this action.
         */
        await incrementPagesPrinted(
          boxCount
        );
      } catch (error) {
        console.error(
          'PDF generation error:',
          error
        );

        setPdfError(
          error?.message ||
            'Could not generate the PDF. Please try again.'
        );
      } finally {
        setGenerating(false);
      }
    };

  /*
   * Save PDF using the Windows/browser
   * file picker when supported.
   */
  const handleSavePDF =
    async () => {
      if (
        !pdfBlob ||
        saving
      ) {
        return;
      }

      setSaving(true);
      setPdfError('');

      try {
        /*
         * Default filename.
         */
        const safeCompanyName =
          String(
            currentUser.companyName ||
              'Company'
          )
            .replace(
              /[<>:"/\\|?*]+/g,
              '_'
            )
            .trim() ||
            'Company';

        const safeDocket =
          String(
            docket || 'Label'
          )
            .replace(
              /[<>:"/\\|?*]+/g,
              '_'
            )
            .trim() ||
            'Label';

        const filename =
          `${safeCompanyName}_${safeDocket}.pdf`;

        /*
         * Modern Chrome / Edge:
         * Show Windows-style Save dialog.
         */
        if (
          'showSaveFilePicker' in
          window
        ) {
          const fileHandle =
            await window.showSaveFilePicker(
              {
                suggestedName:
                  filename,

                types: [
                  {
                    description:
                      'PDF Document',

                    accept: {
                      'application/pdf':
                        ['.pdf']
                    }
                  }
                ]
              }
            );

          const writable =
            await fileHandle.createWritable();

          await writable.write(
            pdfBlob
          );

          await writable.close();
        } else {
          /*
           * Fallback for browsers that
           * don't support showSaveFilePicker.
           */
          const downloadUrl =
            URL.createObjectURL(
              pdfBlob
            );

          const link =
            document.createElement(
              'a'
            );

          link.href =
            downloadUrl;

          link.download =
            filename;

          document.body.appendChild(
            link
          );

          link.click();

          link.remove();

          setTimeout(() => {
            URL.revokeObjectURL(
              downloadUrl
            );
          }, 1000);
        }
      } catch (error) {
        /*
         * User cancelling the Save dialog
         * is not treated as an error.
         */
        if (
          error?.name !==
          'AbortError'
        ) {
          console.error(
            'PDF save error:',
            error
          );

          setPdfError(
            'Could not save the PDF. Please try again.'
          );
        }
      } finally {
        setSaving(false);
      }
    };

  /*
   * Print the generated PDF.
   *
   * The PDF itself already has the correct
   * physical page dimensions.
   */
  const handlePrintPDF =
    () => {
      if (!pdfUrl) {
        return;
      }

      const printWindow =
        window.open(
          pdfUrl,
          '_blank'
        );

      if (!printWindow) {
        setPdfError(
          'Please allow pop-ups for this site to print the PDF.'
        );
        return;
      }
    };

  /*
   * Close PDF preview.
   */
  const handleClosePdf =
    () => {
      if (pdfUrl) {
        URL.revokeObjectURL(
          pdfUrl
        );
      }

      setPdfUrl(null);
      setPdfBlob(null);
      setShowPdfPreview(false);
      setPdfError('');
    };

  /*
   * Screen preview labels.
   */
  const labels =
    Array.from(
      {
        length: boxCount
      },
      (_, index) =>
        index + 1
    );

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">

      {/* Top UI */}
      <div className="print:hidden">

        <div className="bg-brand-teal text-white p-4 shadow-md sticky top-0 z-10">

          <div className="max-w-md mx-auto flex items-center justify-between mb-4">

            <div className="flex items-center gap-2">

              <Monitor size={24} />

              <div className="text-sm font-medium">
                PDF Label Preview
              </div>

            </div>

          </div>

          <div className="max-w-md mx-auto flex items-center justify-between text-sm">

            <div className="flex gap-4 items-center">

              <span>
                Labels:{' '}
                <span className="font-bold">
                  {boxCount}
                </span>
              </span>

              <div className="flex items-center gap-1">

                <span>
                  Paper size:
                </span>

                <select
                  className="bg-transparent font-bold border-b border-white outline-none cursor-pointer text-white appearance-none pr-4 relative"
                  value={paperSize}
                  onChange={(e) =>
                    setPaperSize(
                      e.target.value
                    )
                  }
                >

                  <option
                    className="text-slate-800"
                    value="2x3"
                  >
                    2" × 3"
                  </option>

                  <option
                    className="text-slate-800"
                    value="3x4"
                  >
                    3" × 4"
                  </option>

                  <option
                    className="text-slate-800"
                    value="4x4"
                  >
                    4" × 4"
                  </option>

                  <option
                    className="text-slate-800"
                    value="4x6"
                  >
                    4" × 6"
                  </option>

                  <option
                    className="text-slate-800"
                    value="100x150"
                  >
                    100 × 150 mm
                  </option>

                  <option
                    className="text-slate-800"
                    value="A6"
                  >
                    A6 (105×148mm)
                  </option>

                </select>

              </div>

            </div>

          </div>

        </div>

        {/* Error */}
        {pdfError && (
          <div className="max-w-md mx-auto px-4 pt-4">

            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {pdfError}
            </div>

          </div>
        )}

        {/* Generate PDF button */}
        <button
          onClick={
            handleGeneratePDF
          }
          disabled={generating}
          className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 p-4 rounded-full shadow-lg z-20 transition ${
            generating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 cursor-pointer'
          } text-slate-800`}
          title={
            generating
              ? 'Generating PDF...'
              : 'Generate PDF'
          }
        >

          {generating ? (
            <div className="w-7 h-7 border-4 border-slate-800 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Printer size={28} />
          )}

        </button>

      </div>

      {/* Screen Preview */}
      <div className="max-w-md mx-auto p-4 space-y-6">

        {labels.map(
          (labelNumber) => (

            <div
              key={labelNumber}
              className={`bg-white shadow-sm border border-gray-200 relative flex flex-col p-6 ${currentSize.aspect}`}
            >

              {/* Header */}
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">

                <div className="flex items-center gap-2">

                  {currentUser.logo ? (
                    <img
                      src={
                        currentUser.logo
                      }
                      alt="Company Logo"
                      className="w-10 h-10 object-contain rounded border border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-sm" />
                    </div>
                  )}

                  <div className="text-[10px] font-bold text-slate-800 leading-tight uppercase">
                    {
                      currentUser.companyName
                    }
                  </div>

                </div>

                <div className="text-[10px] text-gray-400 font-medium">
                  {
                    currentSize.label
                  }
                </div>

              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">

                <div className="mb-6">

                  <div className="text-xs text-gray-500 font-bold tracking-widest mb-1">
                    DOCKET NUMBER
                  </div>

                  <div className="text-4xl font-extrabold text-slate-800 break-words">
                    {docket}
                  </div>

                </div>

                <div>

                  <div className="text-xs text-gray-500 font-bold tracking-widest mb-1">
                    LOCATION
                  </div>

                  <div className="text-xl font-bold text-slate-700 break-words">
                    {location}
                  </div>

                </div>

              </div>

              {/* Screen-only footer */}
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">

                <div className="text-xs font-bold text-gray-400 tracking-widest">
                  PDF PAGE
                </div>

                <div className="text-xs font-bold text-brand-orange">
                  {labelNumber} / {boxCount}
                </div>

              </div>

            </div>

          )
        )}

      </div>

      {/* PDF Preview Modal */}
      {showPdfPreview &&
        pdfUrl && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3">

            <div className="bg-white rounded-xl shadow-2xl w-full h-full max-w-6xl flex flex-col overflow-hidden">

              {/* Modal Header */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b bg-white">

                <div>

                  <h2 className="font-bold text-slate-800">
                    PDF Preview
                  </h2>

                  <div className="text-xs text-gray-500">
                    {
                      currentSize.label
                    } • {boxCount}{' '}
                    page
                    {boxCount !== 1
                      ? 's'
                      : ''}
                  </div>

                </div>

                <div className="flex items-center gap-2">

                  {/* Save */}
                  <button
                    onClick={
                      handleSavePDF
                    }
                    disabled={saving}
                    className="flex items-center gap-2 bg-brand-teal hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-60"
                  >

                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={17} />
                    )}

                    {saving
                      ? 'Saving...'
                      : 'Save PDF'}

                  </button>

                  {/* Print */}
                  <button
                    onClick={
                      handlePrintPDF
                    }
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-800 px-4 py-2 rounded-lg font-semibold text-sm transition"
                  >

                    <Printer size={17} />

                    Print

                  </button>

                  {/* Close */}
                  <button
                    onClick={
                      handleClosePdf
                    }
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                    title="Close preview"
                  >

                    <X size={20} />

                  </button>

                </div>

              </div>

              {/* PDF Viewer */}
              <div className="flex-1 bg-gray-700">

                <iframe
                  src={pdfUrl}
                  title="PDF Preview"
                  className="w-full h-full border-0"
                />

              </div>

            </div>

          </div>
        )}

    </div>
  );
}