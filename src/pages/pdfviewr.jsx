import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";

const PDFViewer = ({ pdfBlob }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Box>
      <Document
        file={{ data: pdfBlob }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {[...Array(numPages)].map((_, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
      <p>Page {pageNumber} of {numPages}</p>
    </Box>
  );
};

export default PDFViewer;
