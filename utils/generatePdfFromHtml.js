const axios = require('axios');

async function generatePdfFromHtml(html) {
  const accessKey = 'ed1d01b7e7626fc1cdf1cc04f0f61075'; // prefer env

  const response = await axios.post(
    `http://api.pdflayer.com/api/convert?access_key=${accessKey}`,
    new URLSearchParams({
      document_html: html,
      document_name: 'document.pdf',
      test: '0', // use '1' for free plan with watermark
    }),
    {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return Buffer.from(response.data);
}

module.exports = { generatePdfFromHtml };
