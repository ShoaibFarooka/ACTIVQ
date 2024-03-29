const uploadFilesToGoogleCloud = (req, res) => {
  // TODO:
  // add code to upload files to
  // google drive / cloud..
  const date = new Date().toISOString();
  const { type } = req.body;
  
  console.log(req.files);

  // TODO:
  // Make sure to handle null case..
  // how to stop the previous file middleware
  // from uploading if there's no type.
  if (type === 'manual') {
    res.status(200).send('Manual Report Uploaded Successfully!');
  } else if (type === 'procedure') {
    res.status(200).send('Procedure Report Uploaded Successfully!');
  }
};

const fetchQmsReports = (req, res) => {
  // TODO:
  // add code to retrieve files from
  // google drive / cloud..

  const dummyData = [
    {
      _id: 1,
      fileName: "abc.pdf",
      type: "manual",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '8/21/2020',
    },
    {
      _id: 2,
      fileName: "rwadw.pdf",
      type: "manual",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '10/21/2020',
    },
    {
      _id: 3,
      fileName: "eawdawdawd.pdf",
      type: "manual",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '12/6/2000',
    },
    {
      _id: 4,
      fileName: "eawdawdawd.pdf",
      type: "manual",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '12/6/1992',
    },
    {
      _id: 5,
      fileName: "eawdawdawd.pdf",
      type: "manual",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '12/6/1981',
    },
    {
      _id: 6,
      fileName: "eawdawdawd.pdf",
      type: "manual",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '12/6/1997',
    },
    {
      _id: 7,
      fileName: "file-v-manual.pdf",
      type: "procedure",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '8/22/2001',
    },
    {
      _id: 8,
      fileName: "file-x-manual.pdf",
      type: "procedure",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '11/12/2008',
    },
  ];
  res.json(dummyData);
};

const deleteQmsReport = (req, res) => {

  // TODO:
  // Add logic for deleting a report.

  res.status(200).send('Report with id ' + req.body.id + ' deleted successfully!');
};

module.exports = {
  uploadFilesToGoogleCloud,
  fetchQmsReports,
  deleteQmsReport
};
