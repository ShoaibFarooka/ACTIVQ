const { v4: uuidv4 } = require('uuid');
const { Storage } = require('@google-cloud/storage');

// Google Cloud Storage Setup
const GoogleStorage = new Storage({
  projectId: process.env.GC_PROJECT_ID,
  keyFilename: process.env.GC_KEY_FILE_NAME,
});

const uploadQmsReport = async (req, res) => {
  const { category } = req.body;
  const report = req.files.file[0];
  try {
    const filename = `${uuidv4()}???${report.originalname.replace(/\s+/g, '-')}`;
    const fileHandler = GoogleStorage.bucket(process.env.QMS_BUCKET).file(filename);

    await fileHandler.save(report.buffer, {
      metadata: {
        contentType: report.mimetype,
        metadata: {
          category: category,
        }
      },
    });
    
    if (category === 'manual') {
      res.status(200).send('Manual Report Uploaded Successfully!');
    } else if (category === 'procedure') {
      res.status(200).send('Procedure Report Uploaded Successfully!');
    }
  } catch (error) {
    res.status(502).send(`${error}`);
    console.log(error);
  }
};

const fetchQmsReports = async (req, res) => {
  try {
    const [files] = await GoogleStorage.bucket(process.env.QMS_BUCKET).getFiles();
    const manualFiles = [];
    const procedureFiles = [];
    let metaDataFetched;
    await Promise.all(files.map(async (file) => {
      metaDataFetched = await file.getMetadata();
      if (metaDataFetched[0].metadata?.category === 'manual') {
        manualFiles.push({
          fileId: file.name,
          fileName: file.name.split('???')?.[1] ? file.name.split('???')?.[1] : file.name,
          size: file.metadata.size,
          date: new Date(file.metadata.timeCreated).toLocaleDateString(),
          contentType: file.metadata.contentType,
          category: metaDataFetched[0].metadata?.category
        });
      } else if (metaDataFetched[0].metadata?.category === 'procedure') {
        procedureFiles.push({
          fileId: file.name,
          fileName: file.name.split('???')?.[1] ? file.name.split('???')?.[1] : file.name,
          size: file.metadata.size,
          date: new Date(file.metadata.timeCreated).toLocaleDateString(),
          contentType: file.metadata.contentType,
          category: metaDataFetched[0].metadata?.category
        });
      }
    }));
    return res.status(200).json({
      procedureFiles,
      manualFiles 
    });
  } catch (err) {
    console.error('Error fetching files:', err);
    return res.status(502).send(err);
  }
};

const deleteQmsReport = async (req, res) => {
  const { fileId } = req.body;
  
  try {
    await GoogleStorage.bucket(process.env.QMS_BUCKET).file(fileId).delete();
    res.status(200).send('Report deleted successfully!');
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(502).send('Error deleting file:', err);
  }
};

const downloadQmsReport = async (req, res) => {
  try {
    const { fileId } = req.body;
    const file = GoogleStorage.bucket(process.env.QMS_BUCKET).file(fileId);
    const [fileExists] = await file.exists();
    if (fileExists) {
      const [fileBuffer] = await file.download();
      res.send(fileBuffer);
    }
    else {
      console.log('QMS: ~ File not found');
      return res.status(404);
    }
  } catch (error) {
    return res.status(502).send(error);
  }
}

module.exports = {
  fetchQmsReports,
  uploadQmsReport,
  downloadQmsReport,
  deleteQmsReport
};
