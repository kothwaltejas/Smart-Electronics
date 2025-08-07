const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smart-electronics/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{
    width: 800,
    crop: 'limit',          // Ensures the dimensions are always filled
         // Focuses on important part of image
    quality: 'auto',       // Compress smartly
    fetch_format: 'auto'   // Use best image format
  }]
    
  }
});

// Configure Cloudinary storage for PDFs/documents
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smart-electronics/documents',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw'
  }
});

// Create multer instances
const imageUpload = multer({ 
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const documentUpload = multer({ 
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    console.log('📁 File filter - mimetype:', file.mimetype);
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// @route   POST /api/upload/image
// @desc    Upload product image
router.post('/image', imageUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// @route   POST /api/upload/document
// @desc    Upload product document/PDF
router.post('/document', documentUpload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document file provided' });
    }
    
    // Create a proper download URL with attachment flag
    const downloadUrl = req.file.path.includes('?') 
      ? `${req.file.path}&fl_attachment:${encodeURIComponent(req.file.originalname)}`
      : `${req.file.path}?fl_attachment:${encodeURIComponent(req.file.originalname)}`;
    
    res.status(200).json({
      message: 'Document uploaded successfully',
      documentUrl: req.file.path,
      downloadUrl: downloadUrl,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      format: req.file.format || 'pdf'
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Error uploading document', error: error.message });
  }
});

// @route   POST /api/upload/upload-pdf
// @desc    Upload PDF document (Alternative endpoint for AdminDashboard)
router.post('/upload-pdf', (req, res) => {
  console.log('📁 PDF Upload endpoint hit!');
  
  // Use the documentUpload middleware
  documentUpload.single('pdf')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
        error: err.message
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({
        success: false,
        message: 'No PDF file provided',
        debug: {
          body: req.body,
          file: req.file,
          contentType: req.headers['content-type']
        }
      });
    }
    
    console.log('✅ File uploaded successfully:', req.file);
    
    try {
      // Create multiple download URLs for different scenarios
      const baseUrl = req.file.path;
      const directDownloadUrl = baseUrl.includes('?') 
        ? `${baseUrl}&fl_attachment:${encodeURIComponent(req.file.originalname)}`
        : `${baseUrl}?fl_attachment:${encodeURIComponent(req.file.originalname)}`;
      
      // Calculate file size in a readable format
      const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      
      const responseData = {
        url: baseUrl, // Regular Cloudinary URL
        directDownloadUrl: directDownloadUrl, // URL with download attachment
        backendDownloadUrl: `/api/upload/download/${req.file.filename}`, // Backend proxy endpoint
        publicId: req.file.filename,
        originalName: req.file.originalname,
        fileSize: formatFileSize(req.file.size || 0),
        uploadedAt: new Date().toISOString()
      };
      
      res.status(200).json({
        success: true,
        message: 'PDF uploaded successfully',
        data: responseData
      });
      
    } catch (error) {
      console.error('❌ Error processing upload:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error processing upload', 
        error: error.message 
      });
    }
  });
});

// @route   POST /api/upload/upload-pdf-real
// @desc    Real PDF upload with multer (once we confirm the basic route works)
router.post('/upload-pdf-real', documentUpload.single('pdf'), (req, res) => {
  try {
    console.log('📁 Real PDF Upload with multer!');
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No PDF file provided',
        received: {
          body: req.body,
          files: req.files
        }
      });
    }
    
    // Create multiple download URLs for different scenarios
    const baseUrl = req.file.path;
    const directDownloadUrl = baseUrl.includes('?') 
      ? `${baseUrl}&fl_attachment:${encodeURIComponent(req.file.originalname)}`
      : `${baseUrl}?fl_attachment:${encodeURIComponent(req.file.originalname)}`;
    
    // Calculate file size in a readable format
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    res.status(200).json({
      success: true,
      message: 'PDF uploaded successfully',
      data: {
        url: baseUrl, // Regular Cloudinary URL
        directDownloadUrl: directDownloadUrl, // URL with download attachment
        backendDownloadUrl: `/api/download/${req.file.filename}`, // Backend proxy endpoint
        publicId: req.file.filename,
        originalName: req.file.originalname,
        fileSize: formatFileSize(req.file.size || 0),
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading PDF', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete uploaded file from Cloudinary
router.delete('/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resource_type } = req.query; // 'image' or 'raw' for documents
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource_type || 'image'
    });
    
    if (result.result === 'ok') {
      res.status(200).json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});

// @route   GET /api/download/:publicId
// @desc    Proxy download for PDF files to handle CORS
router.get('/download/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const { filename } = req.query;
    
    // Construct the Cloudinary URL for raw resource download
    const downloadUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      flags: 'attachment'
    });
    
    // Set proper headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'document.pdf'}"`);
    res.setHeader('Content-Type', 'application/pdf');
    
    // Redirect to the Cloudinary download URL
    res.redirect(downloadUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Error downloading file', error: error.message });
  }
});

// Simple test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Upload routes working!',
    cloudinaryConfig: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
      api_key: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'
    },
    availableRoutes: [
      'GET /api/upload/test',
      'POST /api/upload/image',
      'POST /api/upload/document', 
      'POST /api/upload/upload-pdf',
      'GET /api/upload/download/:publicId',
      'DELETE /api/upload/:publicId'
    ]
  });
});

// Simple test for PDF upload (no file processing)
router.post('/test-pdf', (req, res) => {
  res.json({ 
    message: 'PDF test endpoint working!',
    body: req.body,
    files: req.files || 'No files'
  });
});

module.exports = router;
