const uploadFilesToGoogleCloud = (req, res) => {
  // TODO:
  // add code to upload files to
  // google drive / cloud..
  const date = new Date().toISOString();
  const { type } = req.body;
  
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
      date: '8/22/2020',
    },
    {
      _id: 2,
      fileName: "rwadw.pdf",
      type: "manual",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '8/21/2020',
    },
    {
      _id: 3,
      fileName: "eawdawdawd.pdf",
      type: "manual",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '8/20/2020',
    },
    {
      _id: 4,
      fileName: "eawdawdawd.pdf",
      type: "manual",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '8/19/2020',
    },
    {
      _id: 5,
      fileName: "eawdawdawd.pdf",
      type: "manual",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '8/18/2020',
    },
    {
      _id: 6,
      fileName: "eawdawdawd.pdf",
      type: "manual",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '8/17/2020',
    },
    {
      _id: 7,
      fileName: "file-v-manual.pdf",
      type: "procedure",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '1/22/2001',
    },
    {
      _id: 8,
      fileName: "file-x-manual.pdf",
      type: "procedure",
      downloadUrl: 'http://localhost:5005/uploads/1711398590146-banner.png',
      date: '1/12/2001',
    },
    {
      "_id": 9,
      "fileName": "eawdawdawd.pdf",
      "type": "manual",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": '8/16/2020'
  },
  {
      "_id": 10,
      "fileName": "eawdawdawd.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/26/2001"
  },
  {
      "_id": 11,
      "fileName": "eawdawdawd.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/3/2001"
  },
  {
      "_id": 12,
      "fileName": "file-v-manual.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/28/2001"
  },
  {
      "_id": 13,
      "fileName": "file-x-manual.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/31/2001"
  },
  {
      "_id": 14,
      "fileName": "eawdawdawd.pdf",
      "type": "manual",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": '8/15/2020'
  },
  {
      "_id": 15,
      "fileName": "eawdawdawd.pdf",
      "type": "manual",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": '8/14/2020'
  },
  {
      "_id": 16,
      "fileName": "eawdawdawd.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/6/2001"
  },
  {
      "_id": 17,
      "fileName": "abc.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/18/2001"
  },
  {
      "_id": 18,
      "fileName": "rwadw.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/22/2001"
  },
  {
      "_id": 19,
      "fileName": "eawdawdawd.pdf",
      "type": "manual",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": '8/13/2020'
  },
  {
      "_id": 20,
      "fileName": "eawdawdawd.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/8/2001"
  },
  {
      "_id": 21,
      "fileName": "eawdawdawd.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/10/2001"
  },
  {
      "_id": 22,
      "fileName": "eawdawdawd.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/23/2001"
  },
  {
      "_id": 23,
      "fileName": "file-v-manual.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/9/2001"
  },
  {
      "_id": 24,
      "fileName": "file-x-manual.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/11/2001"
  },
  {
      "_id": 25,
      "fileName": "eawdawdawd.pdf",
      "type": "procedure",
      "downloadUrl": "http://localhost:5005/uploads/1711398590146-banner.png",
      "date": "1/4/2001"
  }
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
