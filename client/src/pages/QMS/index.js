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
        dispatch(HideLoading());
        setResortTable(reSortTable + 1);
      }
    } catch (error) {
      // Handle error if needed
      console.error("Error fetching QMS information:", error);
    }
  };

  useEffect(() => {
    if (manualSelectSort === 'date')
      setManualReports(sort(manualReports).by({
        desc: item => new Date(item[manualSelectSort]).setHours(0,0,0,0),
        comparer: new Intl.Collator(undefined, { caseFirst: 'false' }).compare,
      }));
    else 
      setManualReports(sort(manualReports).by({
        asc: item => item[manualSelectSort],
        comparer: new Intl.Collator(undefined, { caseFirst: 'false', numeric: manualSelectSort === 'size' }).compare,
      }));
  }, [manualSelectSort, reSortTable]);

  useEffect(() => {
    if (procedureSelectSort === 'date')
      setProcedureReports(sort(procedureReports).by({
        desc: item => new Date(item[procedureSelectSort]).setHours(0,0,0,0),
        comparer: new Intl.Collator(undefined, { caseFirst: 'false' }).compare,
      }));
    else
      setProcedureReports(sort(procedureReports).by({
        asc: item => item[procedureSelectSort],
        comparer: new Intl.Collator(undefined, { caseFirst: 'false', numeric: procedureSelectSort === 'size' }).compare,
      }));
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
            <label for="manual-upload" className="btn btn-select">
              Upload File
            </label>
          ) : (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <label
                for="manual-upload"
                className="btn btn-danger"
                style={{ marginRight: 8 }}
              >
                Choose another
              </label>
              <div
                className="btn btn-confirm"
                onClick={async () => {
                  try {
                    const file = manualUpload;
                    const response = await qmsService.uploadReport({
                      category: "manual",
                      file,
                    });
                    setManualUpload(null);
                    manualInputRef.current.value = null;
                    message.success(response);
                    getAllQmsReports();
                  } catch (error) {
                    setManualUpload(null);
                    manualInputRef.current.value = null;
                    message.success(error.response.data);
                    getAllQmsReports();
                  }
                }}
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
            onChange={(ev) => {
              setManualUpload(ev.target.files[0]);
            }}
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
                          onClick={async () => {
                            try {
                              const buffer = await qmsService.downloadReport({
                                fileId: manualItem.fileId,
                                contentType: manualItem.contentType
                              })
                              console.log(buffer);
                              FileSaver.saveAs(new Blob([buffer], { type: manualItem.contentType }), manualItem.fileName);
                              message.success('File downloaded!');
                              getAllQmsReports();
                            } catch (error) {
                              message.error(`${error}`);
                              getAllQmsReports();
                            }
                          }}
                        />
                        <IoTrashBin
                          size={20}
                          className="action-icon"
                          color="#C93616"
                          onClick={async () => {
                            try {
                              message.success(
                                await qmsService.deleteReport({
                                  fileId: manualItem.fileId,
                                })
                              );
                              getAllQmsReports();
                            } catch (error) {
                              message.error(`${error}`);
                              getAllQmsReports();
                            }
                          }}
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
            <label for="procedure-upload" className="btn btn-select">
              Upload File
            </label>
          ) : (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <label
                for="procedure-upload"
                className="btn btn-danger"
                style={{ marginRight: 8 }}
              >
                Choose another
              </label>
              <div
                className="btn btn-confirm"
                onClick={async () => {
                  try {
                    const file = procedureUpload;
                    const response = await qmsService.uploadReport({
                      category: "procedure",
                      file,
                    });
                    setProcedureUpload(null);
                    procedureInputRef.current.value = null;
                    message.success(response);
                    getAllQmsReports();
                  } catch (error) {
                    setProcedureUpload(null);
                    procedureInputRef.current.value = null;
                    message.error(error.response.data);
                    getAllQmsReports();
                  }
                }}
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
            onChange={(ev) => {
              setProcedureUpload(ev.target.files[0]);
            }}
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
                          onClick={async () => {
                            try {
                              const buffer = await qmsService.downloadReport({
                                fileId: procedureItem.fileId,
                                contentType: procedureItem.contentType
                              })
                              FileSaver.saveAs(new Blob([buffer], { type: procedureItem.contentType }), procedureItem.fileName);
                              message.success('File downloaded!');
                              getAllQmsReports();
                            } catch (error) {
                              message.error(`${error}`);
                              getAllQmsReports();
                            }
                          }}
                        />
                        <IoTrashBin
                          size={20}
                          className="action-icon"
                          color="#C93616"
                          onClick={async () => {
                            try {
                              message.success(
                                await qmsService.deleteReport({
                                  fileId: procedureItem.fileId,
                                })
                              );
                              getAllQmsReports();
                            } catch (error) {
                              message.error(`${error}`);
                              getAllQmsReports();
                            }
                          }}
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

function bytesToKB(bytes) {
  return bytes / 1024; // 1 KB = 1024 bytes
}

export default QMS;
