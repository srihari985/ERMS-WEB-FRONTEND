package com.erms.ERMS_Application.Demo.IntroPPT;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.WriterProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class PPTService {

    @Autowired
    private PPTRepo pptRepo;

    public String savePPT(String contentName, MultipartFile uploadFile) throws IOException {
        // Check if file is provided
        if (uploadFile == null || uploadFile.isEmpty()) {
            return "No file provided.";
        }

        // Get the file content type
        String fileType = uploadFile.getContentType();

        // Validate the file type (PPT, PDF, or Word)
        if (fileType.equals("application/vnd.ms-powerpoint") ||   // PPT
                fileType.equals("application/vnd.openxmlformats-officedocument.presentationml.presentation") ||  // PPTX
                fileType.equals("application/msword") ||               // DOC
                fileType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {    // DOCX

            // Save the entity for non-PDF files
            PPTEntity pptEntity = new PPTEntity(contentName, uploadFile.getBytes());
            pptRepo.save(pptEntity);
            return "File uploaded successfully.";

        } else if (fileType.equals("application/pdf")) { // Handle PDF separately

            // Compress the PDF before saving
            byte[] compressedPdf = compressPDF(uploadFile);
            PPTEntity pptEntity = new PPTEntity(contentName, compressedPdf);
            pptRepo.save(pptEntity);
            return "PDF uploaded and compressed successfully.";

        } else {
            return "Invalid file type. Please upload PPT, PDF, or Word files.";
        }
    }

    public List<PPTEntity> getAllPPTs() {
        return pptRepo.findAll();
    }

    public PPTEntity getPPTById(Long id) {
        return pptRepo.findById(id).orElse(null);
    }

    public void deletePPT(Long id) {
        pptRepo.deleteById(id);
    }


    // Method to compress a PDF document
    private byte[] compressPDF(MultipartFile pdfFile) throws IOException {
        ByteArrayOutputStream compressedPdfStream = new ByteArrayOutputStream();

        // Create a reader and writer for the PDF document
        PdfReader reader = new PdfReader(pdfFile.getInputStream());
        PdfWriter writer = new PdfWriter(compressedPdfStream, new WriterProperties().setCompressionLevel(9));

        // Create a new PDF document with the reader and writer
        PdfDocument pdfDocument = new PdfDocument(reader, writer);

        // Close the PDF document to finish the compression process
        pdfDocument.close();

        return compressedPdfStream.toByteArray();
    }


}



