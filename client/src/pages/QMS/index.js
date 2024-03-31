import React, { useState, useEffect, useRef } from "react";
import { message } from "antd";
import "./index.css";
import Modal from "react-modal";
import { IoArrowDown, IoCloudUpload, IoTrashBin } from "react-icons/io5";
import qmsService from "../../services/qmsService";
import { useDispatch, useSelector } from "react-redux";
import { getAllQmsReports } from "../../redux/qmsSlice";
import SortBar from "../../components/SortBar/Sortbar";
import { sort } from "fast-sort";

// Set the app element for react-modal
Modal.setAppElement("#root");

const QMS = () => {
  const QMS_HEADERS = [
    {title: 'Filename', label: 'fileName'},
    {title: 'Date', label: 'date'}
  ];
  const procedureInputRef = useRef();
  const manualInputRef = useRef();
  const qmsReports = useSelector((state) => state.qms.reports);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllQmsReports());
  }, []);

  useEffect(() => {
    const reports = { manual: [], procedure: [] }
    qmsReports?.forEach(item => {
      if (item.type === 'manual') reports.manual.push(item)
      else if (item.type === 'procedure') reports.procedure.push(item)
    })
    setManualReports(reports.manual);
    setProcedureReports(reports.procedure);
  }, [qmsReports]);

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
    if (manualSelectSort === 'date')
      setManualReports(sort(manualReports).desc(item => new Date(item[manualSelectSort]).setHours(0,0,0,0)));
    else 
      setManualReports(sort(manualReports).asc(item => item[manualSelectSort]));
  }, [manualSelectSort]);

  useEffect(() => {
    if (procedureSelectSort === 'date')
      setProcedureReports(sort(procedureReports).desc(item => new Date(item[procedureSelectSort]).setHours(0,0,0,0)));
    else
      setProcedureReports(sort(procedureReports).asc(item => item[procedureSelectSort]));
  }, [procedureSelectSort]);

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
                      type: "manual",
                      file,
                    });
                    setManualUpload(null);
                    manualInputRef.current.value = null;
                    message.success(response);
                    dispatch(getAllQmsReports());
                  } catch (error) {
                    setManualUpload(null);
                    manualInputRef.current.value = null;
                    message.success(error.response.data);
                    dispatch(getAllQmsReports());
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
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {manualReports &&
              manualReports
                .map((manualItem) => (
                  <tr key={manualItem._id}>
                    <td>{manualItem.fileName}</td>
                    <td>{convertDateFormat(manualItem.date)}</td>
                    <td>
                      <div className="action-icons-container">
                        <a href={manualItem.downloadUrl} download target="_blank" rel="noreferrer">
                          <IoArrowDown
                            size={20}
                            className="action-icon"
                            color="black"
                          />
                        </a>
                        <IoTrashBin
                          size={20}
                          className="action-icon"
                          color="#C93616"
                          onClick={async () => {
                            try {
                              message.success(
                                await qmsService.deleteReport({
                                  id: manualItem._id,
                                })
                              );
                              dispatch(getAllQmsReports());
                            } catch (error) {
                              message.error(
                                await qmsService.deleteReport({
                                  id: manualItem._id,
                                })
                              );
                              dispatch(getAllQmsReports());
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
                      type: "procedure",
                      file,
                    });
                    setProcedureUpload(null);
                    procedureInputRef.current.value = null;
                    message.success(response);
                    dispatch(getAllQmsReports());
                  } catch (error) {
                    setProcedureUpload(null);
                    procedureInputRef.current.value = null;
                    message.error(error.response.data);
                    dispatch(getAllQmsReports());
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
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {procedureReports &&
              procedureReports
                .map((procedureItem) => (
                  <tr key={procedureItem._id}>
                    <td>{procedureItem.fileName}</td>
                    <td>{convertDateFormat(procedureItem.date)}</td>
                    <td>
                      <div className="action-icons-container">
                        <a href={procedureItem.downloadUrl} download target="_blank" rel="noreferrer">
                          <IoArrowDown
                            size={20}
                            className="action-icon"
                            color="black"
                          />
                        </a>
                        <IoTrashBin
                          size={20}
                          className="action-icon"
                          color="#C93616"
                          onClick={async () => {
                            try {
                              message.success(
                                await qmsService.deleteReport({
                                  id: procedureItem._id,
                                })
                              );
                              dispatch(getAllQmsReports());
                            } catch (error) {
                              message.error(
                                await qmsService.deleteReport({
                                  id: procedureItem._id,
                                })
                              );
                              dispatch(getAllQmsReports());
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

function convertDateFormat(inputDate) {
  // Split the input date into month, day, and year
  var parts = inputDate.split("/");
  var month = parts[0];
  var day = parts[1];
  var year = parts[2];

  // Reformat the date into DD/MM/YYYY format
  var formattedDate = day + "/" + month + "/" + year;

  return formattedDate;
}

export default QMS;
