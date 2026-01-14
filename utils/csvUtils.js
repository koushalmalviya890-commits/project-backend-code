const csv = require('csv-parser');
const fs = require('fs');

// Simplified: Parse CSV file and extract emails only
function parseCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const emails = [];
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Get the first value that looks like an email from any column
        const possibleEmails = Object.values(row).filter(value => 
          value && typeof value === 'string' && validEmailRegex.test(value.trim())
        );
        
        if (possibleEmails.length > 0) {
          const email = possibleEmails[0].trim().toLowerCase();
          
          // Avoid duplicates
          if (!emails.includes(email)) {
            emails.push(email);
          }
        }
      })
      .on('end', () => {
        console.log(`Parsed ${emails.length} valid emails from CSV`);
        resolve(emails);
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      });
  });
}

// Super simple validation - just check if file has valid emails
function validateCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    let validEmailCount = 0;
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Check if any value in the row is a valid email
        const hasValidEmail = Object.values(row).some(value => 
          value && typeof value === 'string' && validEmailRegex.test(value.trim())
        );
        
        if (hasValidEmail) {
          validEmailCount++;
        }
        
        // Stop early if we found some emails
        if (validEmailCount > 5) {
          resolve({ valid: true, emailCount: validEmailCount });
        }
      })
      .on('end', () => {
        resolve({ valid: validEmailCount > 0, emailCount: validEmailCount });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = {
  parseCSVFile,
  validateCSVFile
};
