import React, { useState, useEffect } from "react";
import "../styles/UserModal.css";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { message } from "antd";
import equipmentService from "../services/equipmentService";
const DEFAULT_REFERENCE_TABLE = [
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
];

const AddEquipmentModal = ({
  isOpen,
  onRequestClose,
  fetchEquipments,
  Clients,
}) => {
  const [showParametersTable, setShowParametersTable] = useState(false);

  const [formData, setFormData] = useState({
    owner: "",
    code: "",
    description: "",
    manufacturer: "",
    model: "",
    serialNo: "",
    category: "",
    referenceTable: {
      degreeC: [...DEFAULT_REFERENCE_TABLE],
      correction: [...DEFAULT_REFERENCE_TABLE],
      u2k: [...DEFAULT_REFERENCE_TABLE],
    },
    type: "",
    accurayOfMeasurement: ""
  });

  const resetParametersTable = () => {
    setFormData({...formData, 
      referenceTable: {
        degreeC: [...DEFAULT_REFERENCE_TABLE],
        correction: [...DEFAULT_REFERENCE_TABLE],
        u2k: [...DEFAULT_REFERENCE_TABLE],
      }
    })
  }

  const clearFormData = () => {
    setFormData({
      owner: "",
      code: "",
      description: "",
      manufacturer: "",
      model: "",
      serialNo: "",
      category: "",
      referenceTable: {
        degreeC: [...DEFAULT_REFERENCE_TABLE],
        correction: [...DEFAULT_REFERENCE_TABLE],
        u2k: [...DEFAULT_REFERENCE_TABLE],
      },
      type: "",
      accurayOfMeasurement: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReferenceTableValueUpdate = (updatedValue, index, column) => {
    const selectedColumn = [...formData.referenceTable[column]];
    selectedColumn[index] = { ...selectedColumn[index], value: updatedValue }
    setFormData({
      ...formData,
      referenceTable: {
        ...formData.referenceTable,
        [column]: selectedColumn
      }
    })
  }

  const handleAddEquipment = async () => {
    if (
      !formData.code ||
      !formData.description ||
      !formData.manufacturer ||
      !formData.model ||
      !formData.serialNo ||
      !formData.category
    ) {
      return message.error("Please fill all fields!");
    }
    try {
      const response = await equipmentService.addEquipment(formData);
      message.success(response);
      onRequestClose();
      clearFormData();
      fetchEquipments();
    } catch (error) {
      message.error(error.response.data);
    }
  };

  return (
    <Modal className="modal-1" isOpen={isOpen} onRequestClose={onRequestClose}>
      <FaTimes size={25} onClick={onRequestClose} className="cross-icon" />
      <div className="modal-main">
        <h2 className="title">Add Equipment</h2>
        <form>
          <div>
            <label htmlFor="owner">Owner: </label>
            <select
              name="owner"
              id="owner"
              value={formData.owner}
              onChange={handleInputChange}
            >
              <option value="">Please Select an Owner</option>
              {Clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="code">Code: </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="description"> Description: </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="manufacturer">Manufacturer: </label>
            <input
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="model">Model: </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="serialNo">Serial Number: </label>
            <input
              type="text"
              id="serialNo"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='type'>Type: </label>
            <select
              name="type"
              id='type'
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="" disabled selected>Please Select Equipment Type</option>
              <option value="thermometer">Thermometer</option>
            </select>
          </div>
          {formData.type === 'thermometer' && (
            <input
              type="number"
              name='accurayOfMeasurement' 
              placeholder='Accuracy of measurement in °C' 
              onChange={handleInputChange}
            />
          )}
          <div>
            <label htmlFor="category">Category: </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={(e) => {
                if (e.target.value !== 'reference') {
                  resetParametersTable();
                  setShowParametersTable(false);
                }
                handleInputChange(e)
              }}
            >
              <option value="" disabled selected>
                Please Select Equipment Category
              </option>
              <option value="reference">Reference</option>
              <option value="client">Client</option>
            </select>
          </div>
          {formData.category === "reference" && !showParametersTable ? (
            <div className="btn-div" style={{ justifyContent: "start" }}>
              <button
                id="btn-1"
                className="btn"
                type="button"
                onClick={() => setShowParametersTable(true)}
              >
                Parameters
              </button>
            </div>
          ) : (
            <></>
          )}
          {formData.category === "reference" && showParametersTable && (
            <div>
              <table border="1">
                <thead>
                  <tr>
                    <th style={{ padding: 6 }}>°C</th>
                    <th style={{ padding: 6 }}>Correction</th>
                    <th style={{ padding: 6 }}>U (2K)</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.referenceTable.degreeC.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: 6 }}>
                        <input
                          className={"yellow"}
                          onChange={(e) => {
                            handleReferenceTableValueUpdate(e.target.value, index, 'degreeC')
                          }}
                          defaultValue={item.value}
                        />
                      </td>
                      <td style={{ padding: 6 }}>
                        <input
                          className={"yellow"}
                          onChange={(e) => {
                            handleReferenceTableValueUpdate(e.target.value, index, 'correction')
                          }}
                          defaultValue={formData.referenceTable.correction[index].value}
                        />
                      </td>
                      <td style={{ padding: 6 }}>
                        <input
                          className={"yellow"}
                          onChange={(e) => {
                            handleReferenceTableValueUpdate(e.target.value, index, 'u2k')
                          }}
                          defaultValue={formData.referenceTable.u2k[index].value}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="btn-div">
            <button
              id="btn-1"
              className="btn"
              type="button"
              onClick={handleAddEquipment}
            >
              Add Equipment
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEquipmentModal;
