const fs = require('fs');
const path = require('path');

// Ensure temp directory exists
function ensureTempDir() {
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('Created temp directory:', tempDir);
  }
  return tempDir;
}

// Clean up old temp files (run this periodically)
function cleanupTempFiles(maxAgeHours = 2) {
  const tempDir = path.join(process.cwd(), 'temp');
  
  if (!fs.existsSync(tempDir)) {
    return;
  }

  const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert to milliseconds
  const cutoffTime = Date.now() - maxAge;
  
  try {
    const files = fs.readdirSync(tempDir);
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime.getTime() < cutoffTime) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });
    
    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old temp files`);
    }
  } catch (error) {
    console.error('Error cleaning temp files:', error);
  }
}

// Safe file deletion with error handling
function safeDeleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Deleted temp file:', filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', filePath, error.message);
  }
}

// Get file size in MB
function getFileSizeMB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024); // Convert to MB
  } catch (error) {
    return 0;
  }
}

module.exports = {
  ensureTempDir,
  cleanupTempFiles,
  safeDeleteFile,
  getFileSizeMB
};
