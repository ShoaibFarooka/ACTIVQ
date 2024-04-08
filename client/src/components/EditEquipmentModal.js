import React, { useState } from 'react';
import '../styles/UserModal.css'
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { message } from 'antd';
import equipmentService from '../services/equipmentService';

const EditEquipmentModal = ({ isOpen, onRequestClose, fetchEquipments, Equipment, Clients }) => {
    const [formData, setFormData] = useState({
        owner: Equipment.owner ? Equipment.owner?._id : '',
        code: Equipment.code,
        description: Equipment.description,
        manufacturer: Equipment.manufacturer,
        model: Equipment.model,
        serialNo: Equipment.serialNo,
        category: Equipment.category,
        nextProposedCalibrationDuration: Equipment.claibrationDetails[Equipment.claibrationDetails.length - 1]?.nextProposedCalibrationDuration || '',
        referenceTable: Equipment.referenceTable,
        type: Equipment.type,
        accurayOfMeasurement: Equipment.accurayOfMeasurement
    });
    const [showParametersTable, setShowParametersTable] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleReferenceTableValueUpdate = (updatedValue, index, column) => {
      const selectedColumn = [...formData.referenceTable[column]];
      selectedColumn[index] = { ...selectedColumn[index], value: updatedValue };
      setFormData({
        ...formData,
        referenceTable: {
          ...formData.referenceTable,
          [column]: selectedColumn,
        },
      });
    };

    const handleUpdateEquipment = async () => {
        if (!formData.code || !formData.description || !formData.manufacturer || !formData.model || !formData.serialNo || !formData.category) {
            return message.error('Please fill all fields!');
        }
        try {
            const response = await equipmentService.updateEquipment(formData, Equipment._id);
            message.success(response);
            onRequestClose();
            fetchEquipments();
        } catch (error) {
            message.error(error.response.data);
        }
    };

    return (
        <Modal
            className="modal-1"
            isOpen={isOpen}
            onRequestClose={onRequestClose}
        >
            <FaTimes size={25} onClick={onRequestClose} className='cross-icon' />
            <div className="modal-main">
                <h2 className="title">Edit Equipment</h2>
                <form>
                    <div>
                        <label htmlFor='owner'>Owner: </label>
                        <select
                            name="owner"
                            id='owner'
                            value={formData.owner}
                            onChange={handleInputChange}
                        >
                            <option value="">Please Select an Owner</option>
                            {Clients.map((client) => (
                                <option key={client._id} value={client._id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='code'>Code: </label>
                        <input
                            type="text"
                            id='code'
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>Description: </label>
                        <textarea
                            id='description'
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='manufacturer'>Manufacturer: </label>
                        <input
                            type="text"
                            id='manufacturer'
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='model'>Model: </label>
                        <input
                            type="text"
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='serialNo'>Serial Number: </label>
                        <input
                            type="text"
                            id='serialNo'
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
                            <option value="placeholder_1">placeholder 1</option>
                            <option value="placeholder_2">placeholder 2</option>
                            <option value="placeholder_3">placeholder 3</option>
                            <option value="placeholder_4">placeholder 4</option>
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
                        <label htmlFor='category'>Category: </label>
                        <select
                            name="category"
                            id='category'
                            value={formData.category}
                            onChange={(e) => {
                                if (e.target.value !== 'reference') {
                                    setShowParametersTable(false);
                                }
                                handleInputChange(e);
                            }}
                        >
                            <option value="" disabled>Please Select Equipment Category</option>
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
                                <th style={{ padding: 6 }}>U(2K)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {formData.referenceTable.degreeC.map((item, index) => (
                                <tr key={index}>
                                <td style={{ padding: 6 }}>
                                    <input
                                        className={Equipment.referenceTable.degreeC[index].value.trim() !== "" ? "green" : "red"}
                                        onChange={(e) => {
                                            handleReferenceTableValueUpdate(e.target.value, index, 'degreeC')
                                        }}
                                        defaultValue={item.value}
                                    />
                                </td>
                                <td style={{ padding: 6 }}>
                                    <input
                                        className={Equipment.referenceTable.correction[index].value.trim() !== "" ? "green" : "red"}
                                        onChange={(e) => {
                                            handleReferenceTableValueUpdate(e.target.value, index, 'correction')
                                        }}
                                        defaultValue={formData.referenceTable.correction[index].value}
                                    />
                                </td>
                                <td style={{ padding: 6 }}>
                                    <input
                                        className={Equipment.referenceTable.u2k[index].value.trim() !== "" ? "green" : "red"}
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
                    {formData.nextProposedCalibrationDuration &&
                        <div>
                            <label htmlFor='nextProposedCalibrationDuration'>Next Proposed Calibration Duration: </label>
                            <select
                                name="nextProposedCalibrationDuration"
                                id='nextProposedCalibrationDuration'
                                value={formData.nextProposedCalibrationDuration}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>Please Select Duration</option>
                                <option value="0.5">6 Months</option>
                                <option value="1">1 Year</option>
                                <option value="1.5">1.5 Year</option>
                                <option value="2">2 Year</option>
                                <option value="2.5">2.5 Year</option>
                                <option value="3">3 Year</option>
                            </select>
                        </div>
                    }
                    <div className="btn-div">
                        <button
                            id="btn-1"
                            className="btn"
                            type="button"
                            onClick={handleUpdateEquipment}
                        >
                            Update Equipment
                        </button>
                    </div>
                </form>
            </div >
        </Modal >
    );
};

export default EditEquipmentModal;
