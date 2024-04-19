import React, { useState, useEffect, useRef } from "react";
import "../styles/UserModal.css";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { message } from "antd";
import equipmentService from "../services/equipmentService";
import { NUMBER_REGEX } from "../utils/constants";

const CalibarationTables = ({
  formData, handleInputChange
}) => {
  const tables = formData.calibrationTables;

  return tables.map((table, tableIndex) => {
    const refTempInitCol = table.referenceTemperatureInitial;
    const refTempFinalCol = table.referenceTemperatureFinal;
    const calibTempCol = table.calibratedTemperature;

    return (
      <>
        <table>
          <thead>
            <tr>
              <th>α/α</th>
              <th>Reference Temperature °C (Initial)</th>
              <th>Calibrated Temperature °C reading</th>
              <th>Reference Temperature °C (Final)</th>
            </tr>
          </thead>
          <tbody>
            {new Array(10).fill(1).map((item, index) => (
              <tr>
                <th style={{ width: "10%" }}>
                  <div>{index + 1}</div>
                </th>
                <th>
                  <input
                    name="calibrationTables.referenceTemperatureInitial" 
                    value={refTempInitCol[index] ?? ''} onChange={(e) => 
                    handleInputChange(e, [
                      "calibrationTables",
                      tableIndex,
                      'referenceTemperatureInitial',
                      index
                    ])
                  } />
                </th>
                <th>
                  <input
                   name="calibrationTables.calibratedTemperature"
                   value={calibTempCol[index] ?? ''} onChange={(e) => 
                    handleInputChange(e, [
                      "calibrationTables",
                      tableIndex,
                      'calibratedTemperature',
                      index
                    ])
                  } />
                </th>
                <th>
                  <input
                   name="calibrationTables.referenceTemperatureFinal"
                   value={refTempFinalCol[index] ?? ''} onChange={(e) => {
                    e.preventDefault();
                    handleInputChange(e, [
                      "calibrationTables",
                      tableIndex,
                      'referenceTemperatureFinal',
                      index
                    ])
                  }} />
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
      </>
    );
  });
};

const FirstStep = ({
  formData, handleInputChange, setCurrentScreen
}) => {
  return (
    <>
      <div className="modal-main">
        <form>
          <div>
            <label htmlFor="dateOfReceipt">Date of Receipt: </label>
            <input
              type="date"
              id="dateOfReceipt"
              name="dateOfReceipt"
              value={formData.dateOfReceipt}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="dateOfCalibration"> Date of Calibration: </label>
            <input
              type="date"
              id="dateOfCalibration"
              name="dateOfCalibration"
              value={formData.dateOfCalibration}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="dateOfIssue"> Date of Issue: </label>
            <input
              type="date"
              id="dateOfIssue"
              name="dateOfIssue"
              value={formData.dateOfIssue}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="workOrderNo">Work Order No: </label>
            <input
              type="text"
              id="workOrderNo"
              name="workOrderNo"
              value={formData.workOrderNo}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="placeOfCalibration">Place of Calibration: </label>
            <input
              type="text"
              id="placeOfCalibration"
              name="placeOfCalibration"
              value={formData.placeOfCalibration}
              onChange={handleInputChange}
            />
          </div>
          {/* <div>
                  <label htmlFor='calibratedBy'>Calibrated By: </label>
                  <input
                      type="text"
                      id='calibratedBy'
                      name="calibratedBy"
                      value={formData.calibratedBy}
                      onChange={handleInputChange}
                  />
              </div> */}
          <div>
            <label htmlFor="nextProposedCalibrationDuration">
              Next Proposed Calibration Duration:{" "}
            </label>
            <select
              name="nextProposedCalibrationDuration"
              id="nextProposedCalibrationDuration"
              value={formData.nextProposedCalibrationDuration}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Please Select Duration
              </option>
              <option value="0.5">6 Months</option>
              <option value="1">1 Year</option>
              <option value="1.5">1.5 Year</option>
              <option value="2">2 Year</option>
              <option value="2.5">2.5 Year</option>
              <option value="3">3 Year</option>
            </select>
          </div>
          <div className="btn-div">
            <button
              id="btn-1"
              className="btn"
              type="button"
              onClick={() => setCurrentScreen(2)}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const SecondStep = ({
  formData, handleInputChange, setCurrentScreen
}) => {
  return (
    <>
      <div
        style={{
          padding: 13,
          display: "flex",
          width: "100%",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "column",
          }}
        >
          <h3>Enviromental Conditions</h3>
          <table>
            <thead>
              <tr>
                <th>Equipment reading</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ fontWeight: "normal" }}>Temperature °C:</th>
                <th>
                  <input
                    name="enviromentalConditions.temperature"
                    value={formData.enviromentalConditions.temperature[0] ?? ''}
                    onChange={(e) =>
                      handleInputChange(e, [
                        "enviromentalConditions",
                        "temperature",
                        0,
                      ])
                    }
                  />
                </th>
                <th>
                  <input
                    name="enviromentalConditions.temperature"
                    value={formData.enviromentalConditions.temperature[1] ?? ''}
                    onChange={(e) =>
                      handleInputChange(e, [
                        "enviromentalConditions",
                        "temperature",
                        1,
                      ])
                    }
                  />
                </th>
              </tr>
              <tr>
                <th style={{ fontWeight: "normal" }}>
                  Relative Humidity %RH:
                </th>
                <th>
                  <input
                    name="enviromentalConditions.relativeHumidity"
                    value={formData.enviromentalConditions.relativeHumidity[0] ?? ''}
                    onChange={(e) =>
                      handleInputChange(e, [
                        "enviromentalConditions",
                        "relativeHumidity",
                        0,
                      ])
                    }
                  />
                </th>
                <th>
                  <input
                    name="enviromentalConditions.relativeHumidity"
                    value={formData.enviromentalConditions.relativeHumidity[1] ?? ''}
                    onChange={(e) =>
                      handleInputChange(e, [
                        "enviromentalConditions",
                        "relativeHumidity",
                        1,
                      ])
                    }
                  />
                </th>
              </tr>
              <tr>
                <th style={{ fontWeight: "normal" }}>
                  Atmospheric pressure hPa:{" "}
                </th>
                <th>
                  <input
                    name="enviromentalConditions.atmosphericPressure"
                    value={formData.enviromentalConditions.atmosphericPressure[0] ?? ''}
                    onChange={(e) => {
                      handleInputChange(e, [
                        "enviromentalConditions",
                        "atmosphericPressure",
                        0,
                      ]);
                    }}
                  />
                </th>
                <th>
                  <input
                    name="enviromentalConditions.atmosphericPressure"
                    value={formData.enviromentalConditions.atmosphericPressure[1] ?? ''}
                    onChange={(e) =>
                      handleInputChange(e, [
                        "enviromentalConditions",
                        "atmosphericPressure",
                        1,
                      ])
                    }
                  />
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "column",
          }}
        >
          <h3>Bath Parameters</h3>
          <table>
            <thead>
              <tr>
                <th>Parameters</th>
                <th>°C</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ fontWeight: "normal" }}>
                  {"Bath stability (< 0 °C):"}
                </th>
                <th>
                  <input
                    name="bathParameters.bathStability"
                    value={formData.bathParameters.bathStability[0] ?? ''}
                    onChange={(e) =>
                      handleInputChange(e, [
                        "bathParameters",
                        "bathStability",
                        0,
                      ])
                    }
                  />
                </th>
              </tr>
              <tr>
                <th style={{ fontWeight: "normal" }}>
                  {"Bath homogeneousness (< 0 °C):"}
                </th>
                <th>
                  <input
                    name="bathParameters.bathHomogeneousness"
                    value={formData.bathParameters.bathHomogeneousness[0] ?? ''}
                    onChange={(e) =>
                      handleInputChange(e, [
                        "bathParameters",
                        "bathHomogeneousness",
                        0,
                      ])
                    }
                  />
                </th>
              </tr>
              <tr>
                <th style={{ fontWeight: "normal" }}>
                  {"Bath stability (0 < x < 80 °C):"}
                </th>
                <th>
                  <input
                    name="bathParameters.bathStability"
                    value={formData.bathParameters.bathStability[1] ?? ''}
                    onChange={(e) =>
                      handleInputChange(e, [
                        "bathParameters",
                        "bathStability",
                        1,
                      ])
                    }
                  />
                </th>
              </tr>
              <tr>
                <th style={{ fontWeight: "normal" }}>
                  {"Bath homogeneousness (0 < x < 80 °C):"}
                </th>
                <th>
                  <input
                    name="bathParameters.bathHomogeneousness"
                    value={formData.bathParameters.bathHomogeneousness[1] ?? ''}
                    onChange={(e) =>
                      handleInputChange(e, [
                        "bathParameters",
                        "bathHomogeneousness",
                        1,
                      ])
                    }
                  />
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="btn-div">
        <button
          id="btn-1"
          className="btn"
          type="button"
          onClick={() => setCurrentScreen(1)}
          style={{marginRight: '12px'}}
        >
          Previous
        </button>
        <button
          id="btn-1"
          className="btn"
          type="button"
          onClick={() => setCurrentScreen(3)}
        >
          Next
        </button>
      </div>
    </>
  );
};

const ThirdStep = ({
  formData, handleInputChange,
  setFormData, handleCalibrateEquipment,
  setCurrentScreen
}) => {
  return (
    <>
      <div
        style={{
          padding: 13,
          display: "flex",
          width: "100%",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <b>Calibration Temperature °C:</b>
        <input
          style={{ flex: 1, margin: "0 20px 0 20px" }}
          value={formData.calibrationTemperature ?? ''}
          id="calibrationTemperature"
          name="calibrationTemperature"
          onChange={handleInputChange}
        />
        <div>°C</div>
      </div>
      <hr />
      <CalibarationTables formData={formData} handleInputChange={handleInputChange} />
      <div className="btn-div">
        <button
          id="btn-1"
          className="btn"
          type="button"
          style={{ marginLeft: "83%" }}
          onClick={() => {
            setFormData((prevData) => ({
              ...prevData,
              calibrationTables: [...prevData.calibrationTables, {
                referenceTemperatureInitial: new Array(10).fill(null),
                calibratedTemperature: new Array(10).fill(null),
                referenceTemperatureFinal: new Array(10).fill(null),
              }]
            }));
          }}
        >
          Add Table
        </button>
      </div>
      <div>
        <b>Comments:</b>
      </div>
      <textarea name="comments" id="comments" cols="30" rows="5" onChange={handleInputChange} value={formData.comments} ></textarea>
      <div className="btn-div">
        <button
          id="btn-1"
          className="btn"
          type="button"
          onClick={() => setCurrentScreen(2)}
          style={{marginRight: '12px'}}
        >
          Previous
        </button>
        <button
          id="btn-1"
          className="btn"
          type="button"
          onClick={handleCalibrateEquipment}
        >
          Calibrate
        </button>
      </div>
    </>
  );
};

const CalibrateEquipmentModal = ({
  isOpen,
  onRequestClose,
  equipment,
  counter,
  fetchEquipments,
}) => {
  const [formData, setFormData] = useState({
    dateOfReceipt: "",
    dateOfCalibration: "",
    dateOfIssue: "",
    workOrderNo: "",
    placeOfCalibration: "",
    // calibratedBy: '',
    nextProposedCalibrationDuration: "",
    enviromentalConditions: {
      temperature: [null, null],
      relativeHumidity: [null, null],
      atmosphericPressure: [null, null],
    },
    bathParameters: {
      bathStability: [null, null],
      bathHomogeneousness: [null, null],
    },
    calibrationTemperature: null,
    calibrationTables: [
      {
        referenceTemperatureInitial: new Array(10).fill(null),
        calibratedTemperature: new Array(10).fill(null),
        referenceTemperatureFinal: new Array(10).fill(null),
      },
    ],
    comments: "",
  });

  useEffect(() => {
    console.log("formData change hua", formData);
  }, [formData]);

  const clearFormData = () => {
    setFormData({
      dateOfReceipt: "",
      dateOfCalibration: "",
      dateOfIssue: "",
      workOrderNo: "",
      placeOfCalibration: "",
      // calibratedBy: '',
      nextProposedCalibrationDuration: "",
      enviromentalConditions: {
        temperature: [null, null],
        relativeHumidity: [null, null],
        atmosphericPressure: [null, null],
      },
      bathParameters: {
        bathStability: [null, null],
        bathHomogeneousness: [null, null],
      },
      calibrationTemperature: null,
      calibrationTables: [
        {
          referenceTemperatureInitial: new Array(10).fill(null),
          calibratedTemperature: new Array(10).fill(null),
          referenceTemperatureFinal: new Array(10).fill(null),
        },
      ],
      comments: "",
    });
  };

  const handleInputChange = (e, path) => {
    const { name, value } = e.target;
    const forceNumeric = [
      'enviromentalConditions.temperature',
      'enviromentalConditions.relativeHumidity',
      'enviromentalConditions.atmosphericPressure',
      'bathParameters.bathStability',
      'bathParameters.bathHomogeneousness',
      'calibrationTemperature',
      'calibrationTables.referenceTemperatureInitial',
      'calibrationTables.calibratedTemperature',
      'calibrationTables.referenceTemperatureFinal'
    ]

    console.log({ name, value });

    if (forceNumeric.includes(name)) {
      if (!NUMBER_REGEX.test(value)) {
        return;
      }
    }

    if (path) {
      setFormData((prevData) => {
        let newState = { ...prevData };
        let nestedObj = newState;
        path.forEach((key, index) => {
          if (index === path.length - 1) {
            nestedObj[key] = value;
          } else {
            nestedObj = nestedObj[key];
          }
        });
        return newState;
      });
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCalibrateEquipment = async () => {
    if (
      !formData.dateOfReceipt ||
      !formData.dateOfCalibration ||
      !formData.dateOfIssue ||
      !formData.workOrderNo ||
      !formData.placeOfCalibration ||
      !formData.nextProposedCalibrationDuration ||
      !formData.enviromentalConditions ||
      !formData.enviromentalConditions.temperature ||
      !formData.enviromentalConditions.relativeHumidity ||
      !formData.enviromentalConditions.atmosphericPressure ||
      !formData.bathParameters ||
      !formData.bathParameters.bathStability ||
      !formData.bathParameters.bathHomogeneousness ||
      !formData.calibrationTemperature ||
      (!formData.calibrationTables && !formData.calibrationTables[0])
    ) {
      return message.error("Please fill all fields!");
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because month index starts from 0
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}${month}${day}`;
    const payload = {
      ...formData,
      certificateNo: equipment.code + "-" + formattedDate + "-" + (counter + 1),
    };
    try {
      const response = await equipmentService.addCalibrationDetails(
        payload,
        equipment._id
      );
      message.success(response);
      fetchEquipments();
      onRequestClose();
      clearFormData();
    } catch (error) {
      message.error(error.response.data);
    }
  };

  const [currentScreen, setCurrentScreen] = useState(1);
  let Screen = null;
  switch (currentScreen) {
    case 1:
      Screen = 
      <FirstStep 
        onRequestClose={onRequestClose}
        formData={formData}
        handleInputChange={handleInputChange}
        setCurrentScreen={setCurrentScreen}
      />;
      break;
    case 2:
      Screen =
      <SecondStep 
        formData={formData}
        handleInputChange={handleInputChange}
        setCurrentScreen={setCurrentScreen}
      />;
      break;
    case 3:
      Screen = <ThirdStep 
        formData={formData}
        handleInputChange={handleInputChange}
        setFormData={setFormData}
        handleCalibrateEquipment={handleCalibrateEquipment}
        setCurrentScreen={setCurrentScreen}
      />;
      break;
    default:
      break;
  }
  const modalRef = useRef();

  useEffect(() => {
    const ModalItem = modalRef?.current?.node?.childNodes[0]?.childNodes[0];
    if (ModalItem) {
      ModalItem.scrollTo(0,0);
      ModalItem.childNodes[0].style.position = 'static'
    }
  }, [currentScreen]);

  return (
    <Modal ref={modalRef} className="modal-1" isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="title-holder" style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
        <h3 className="title">Calibrate Equipment</h3>
        <FaTimes size={25} onClick={onRequestClose} className="cross-icon" />
      </div>
      {Screen}
    </Modal>
  );
};

export default CalibrateEquipmentModal;
