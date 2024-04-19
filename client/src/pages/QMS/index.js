import React, { useState, useEffect, useRef } from "react";
import { message } from "antd";
import "./index.css";
import Modal from "react-modal";
import { IoArrowDown, IoCloudUpload, IoTrashBin } from "react-icons/io5";
import qmsService from "../../services/qmsService";
import { useDispatch, useSelector } from "react-redux";
import SortBar from "../../components/SortBar/Sortbar";
import { sort } from "fast-sort";
import FileSaver from 'file-saver';
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";

// Set the app element for react-modal
Modal.setAppElement("#root");

const QMS = () => {
  const QMS_HEADERS = [
    {title: 'Filename', label: 'fileName'},
    {title: 'Date', label: 'date'},
    {title: 'Size', label: 'size'}
  ];
  const procedureInputRef = useRef();
  const manualInputRef = useRef();
  const dispatch = useDispatch();

  // State to inform for resorting.
  const [reSortTable, setResortTable] = useState(0);

  // reports.
  const [manualReports, setManualReports] = useState([]);
  const [procedureReports, setProcedureReports] = useState([]);

  // file upload states.
  const [manualUpload, setManualUpload] = useState(null);
  const [procedureUpload, setProcedureUpload] = useState(null);

  // sorting selection state.
  const [manualSelectSort, setManualSelectSort] = useState('');
  const [procedureSelectSort, setProcedureSelectSort] = useState('');

  const handleManualReportUpload = async () => {
    dispatch(ShowLoading());
    try {
      const response = await qmsService.uploadReport({
        category: "manual",
        file: manualUpload,
      });
      message.success(response);
    } catch (error) {
      message.success(error.response.data);
    }
    setManualUpload(null);
    manualInputRef.current.value = null;
    getAllQmsReports();
  }

  const handleProcedureReportUpload = async () => {
    dispatch(ShowLoading());
    try {
      const response = await qmsService.uploadReport({
        category: "procedure",
        file: procedureUpload,
      });
      message.success(response);
    } catch (error) {
      message.success(error.response.data);
    }
    setProcedureUpload(null);
    procedureInputRef.current.value = null;
    getAllQmsReports();
  }

  const handleDownloadReport = async (item) => {
    dispatch(ShowLoading());
    try {
      const buffer = await qmsService.downloadReport({
        fileId: item.fileId,
        contentType: item.contentType
      })
      FileSaver.saveAs(new Blob([buffer], { type: item.contentType }), item.fileName);
      message.success('File downloaded!');
    } catch (error) {
      message.error(`${error}`);
    }
    getAllQmsReports();
  }

  const handleDeleteReport = async (item) => {
    dispatch(ShowLoading());
    try {
      message.success(
        await qmsService.deleteReport({
          fileId: item.fileId,
        })
      );
    } catch (error) {
      console.log('Error occured.', error);
      message.error(`${error}`);
    }
    getAllQmsReports();
  }

  useEffect(() => {
    dispatch(ShowLoading());
    getAllQmsReports();
  }, []);

  const getAllQmsReports = async () => {
    try {
      const response = await qmsService.getReports({ type: '*' });
      if (response) {
        setManualReports(response.manualFiles);
        setProcedureReports(response.procedureFiles);
        setResortTable(reSortTable + 1);
      }
    } catch (error) {
      // Handle error if needed
      console.error("Error fetching QMS information:", error);
    }
    dispatch(HideLoading());
  };

  const sortReports = (reports, sortKey, sortBy) => {
    const sortOrder = sortBy === 'date' ? 'desc' : 'asc';
    const sortingFunction = sortBy === 'date'
      ? item => new Date(item[sortKey]).setHours(0, 0, 0, 0)
      : item => item[sortKey];
    
    const collatorOptions = { caseFirst: 'false' };
    if (sortKey === 'size') collatorOptions.numeric = true;
  
    const comparer = new Intl.Collator(undefined, collatorOptions).compare;
  
    return sort(reports).by({
      [sortOrder]: sortingFunction,
      comparer: comparer,
    });
  };
  
  useEffect(() => {
    setManualReports(sortReports(manualReports, manualSelectSort, manualSelectSort));
  }, [manualSelectSort, reSortTable]);
  
  useEffect(() => {
    setProcedureReports(sortReports(procedureReports, procedureSelectSort, procedureSelectSort));
  }, [procedureSelectSort, reSortTable]);

  return (
    <>
      <div className="Equipments">
        <div className="flex">
        <div style={{ display: "flex", justifyContent: 'space-between', width: '100%' }}>
          <h2 className="title">Manual Report</h2>
          <SortBar items={QMS_HEADERS} onChange={(selection) => setManualSelectSort(selection)} />
        </div>
          {!manualUpload ? (
            <label htmlFor="manual-upload" className="btn btn-select">
              Upload File
            </label>
          ) : (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <label
                htmlFor="manual-upload"
                className="btn btn-danger"
                style={{ marginRight: 8 }}
              >
                Choose another
              </label>
              <div
                className="btn btn-confirm"
                onClick={handleManualReportUpload}
              >
                Upload
              </div>
            </div>
          )}
          <i style={{ display: manualUpload?.name ? "block" : "none" }}>
            {manualUpload?.name} selected.
          </i>
          <input
            multiple={false}
            ref={manualInputRef}
            onChange={(ev) => setManualUpload(ev.target.files[0])}
            type="file"
            id="manual-upload"
            style={{ display: "none" }}
          />
        </div>
        <table className="equipment-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Size</th>
              <th>Content Type</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {manualReports &&
              manualReports
                .map((manualItem) => (
                  <tr key={manualItem.fileId}>
                    <td>{manualItem.fileName}</td>
                    <td>{(Number(manualItem.size) / 1024).toFixed(2) + ' KB'}</td>
                    <td>{manualItem.contentType}</td>
                    <td>{new Date(manualItem.date).toDateString()}</td>
                    <td>
                      <div className="action-icons-container">
                        <IoArrowDown
                          size={20}
                          className="action-icon"
                          color="black"
                          onClick={() => handleDownloadReport(manualItem)}
                        />
                        <IoTrashBin
                          size={20}
                          className="action-icon"
                          color="#C93616"
                          onClick={() => handleDeleteReport(manualItem)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="Equipments">
        <div className="flex">
          <div style={{ display: "flex", justifyContent: 'space-between', width: '100%' }}>
            <h2 className="title">Procedure Report</h2>
            <SortBar items={QMS_HEADERS} onChange={(selection) => setProcedureSelectSort(selection)} />
          </div>
          {!procedureUpload ? (
            <label htmlFor="procedure-upload" className="btn btn-select">
              Upload File
            </label>
          ) : (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <label
                htmlFor="procedure-upload"
                className="btn btn-danger"
                style={{ marginRight: 8 }}
              >
                Choose another
              </label>
              <div
                className="btn btn-confirm"
                onClick={handleProcedureReportUpload}
              >
                Upload
              </div>
            </div>
          )}
          <i style={{ display: procedureUpload?.name ? "block" : "none" }}>
            {procedureUpload?.name} selected.
          </i>
          <input
            multiple={false}
            ref={procedureInputRef}
            onChange={(ev) => setProcedureUpload(ev.target.files[0])}
            type="file"
            id="procedure-upload"
            style={{ display: "none" }}
          />
        </div>
        <table className="equipment-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Size</th>
              <th>Content Type</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {procedureReports &&
              procedureReports
                .map((procedureItem) => (
                  <tr key={procedureItem.fileId}>
                    <td>{procedureItem.fileName}</td>
                    <td>{(Number(procedureItem.size) / 1024).toFixed(2) + ' KB'}</td>
                    <td>{procedureItem.contentType}</td>
                    <td>{new Date(procedureItem.date).toDateString()}</td>
                    <td>
                      <div className="action-icons-container">
                        <IoArrowDown
                          size={20}
                          className="action-icon"
                          color="black"
                          onClick={() => handleDownloadReport(procedureItem)}
                        />
                        <IoTrashBin
                          size={20}
                          className="action-icon"
                          color="#C93616"
                          onClick={() => handleDeleteReport(procedureItem)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default QMS;
