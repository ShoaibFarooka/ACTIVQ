import React, { useState } from 'react';
import '../styles/UserModal.css'
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { message } from 'antd';
import equipmentService from '../services/equipmentService';

const CalibrateEquipmentModal = ({ isOpen, onRequestClose, equipment, counter, fetchEquipments }) => {
    const [formData, setFormData] = useState({
        dateOfReceipt: '',
        dateOfCalibration: '',
        dateOfIssue: '',
        workOrderNo: '',
        placeOfCalibration: '',
        // calibratedBy: '',
        nextProposedCalibrationDuration: '',
    });

    const clearFormData = () => {
        setFormData({
            dateOfReceipt: '',
            dateOfCalibration: '',
            dateOfIssue: '',
            workOrderNo: '',
            placeOfCalibration: '',
            // calibratedBy: '',
            nextProposedCalibrationDuration: '',
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCalibrateEquipment = async () => {
        // if (!formData.dateOfReceipt || !formData.dateOfCalibration || !formData.dateOfIssue || !formData.workOrderNo || !formData.placeOfCalibration || !formData.calibratedBy || !formData.nextProposedCalibrationDuration) {
        if (!formData.dateOfReceipt || !formData.dateOfCalibration || !formData.dateOfIssue || !formData.workOrderNo || !formData.placeOfCalibration || !formData.nextProposedCalibrationDuration) {

            return message.error('Please fill all fields!');
        }
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because month index starts from 0
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}${month}${day}`;
        const payload = {
            ...formData,
            certificateNo: equipment.code + '-' + formattedDate + '-' + (counter + 1)
        }
        try {
            const response = await equipmentService.addCalibrationDetails(payload, equipment._id);
            message.success(response);
            fetchEquipments();
            onRequestClose();
            clearFormData();
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
                <h2 className="title">Calibrate Equipment</h2>
                <form>
                    <div>
                        <label htmlFor='dateOfReceipt'>Date of Receipt: </label>
                        <input
                            type="date"
                            id='dateOfReceipt'
                            name="dateOfReceipt"
                            value={formData.dateOfReceipt}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='dateOfCalibration'> Date of Calibration: </label>
                        <input
                            type="date"
                            id='dateOfCalibration'
                            name="dateOfCalibration"
                            value={formData.dateOfCalibration}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='dateOfIssue'> Date of Issue: </label>
                        <input
                            type="date"
                            id='dateOfIssue'
                            name="dateOfIssue"
                            value={formData.dateOfIssue}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label htmlFor='workOrderNo'>Work Order No: </label>
                        <input
                            type="text"
                            id='workOrderNo'
                            name="workOrderNo"
                            value={formData.workOrderNo}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='placeOfCalibration'>Place of Calibration: </label>
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
                    <div>
                        <label htmlFor='value-1'>Value 1: </label>
                        <input
                            type="text"
                            id='value-1'
                            name="value-1"
                        // value={formData.calibratedBy}
                        // onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='calibratedBy'>Value 2: </label>
                        <input
                            type="text"
                            id='value-2'
                            name="value-2"
                        // value={formData.calibratedBy}
                        // onChange={handleInputChange}
                        />
                    </div>

                    <div className="btn-div">
                        <button
                            id="btn-1"
                            className="btn"
                            type="button"
                            onClick={handleCalibrateEquipment}
                        >
                            Calibrate Equipment
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CalibrateEquipmentModal;
