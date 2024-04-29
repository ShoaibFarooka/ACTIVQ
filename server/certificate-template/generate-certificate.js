const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const templateSource = fs.readFileSync(
  path.join(__dirname, "./certificate-template.hbs"),
  "utf8"
);
const template = handlebars.compile(templateSource);

function convertImageToBase64(imagePath) {
  const relativeImagePath = new URL(imagePath).pathname.replace(
    "/uploads/",
    "../Photos/"
  );
  try {
    const imageData = fs.readFileSync(path.join(__dirname, relativeImagePath));
    const base64Image = `data:image/${path.extname(imagePath).substring(1)};base64,` + Buffer.from(imageData).toString("base64");
    return base64Image;
  } catch (error) {
    console.error("Error reading image file:", error);
    return null;
  }
}

async function generateCertificate(props) {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Render the Handlebars template with the data
  const html = template(props);

  // Set the HTML content of the page
  await page.setContent(html);

  // Generate PDF
  const reportName = `report-${Date.now()}.pdf`;
  await page.pdf({
    path: path.join(__dirname, "./reports/", reportName),
    format: "A4",
  });

  // Close the browser
  await browser.close();
  return reportName;
}

module.exports = {
  generateCertificate,
  convertImageToBase64,
};
