import React from 'react';
import '../styles/UserModal.css';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

const EquipmentReportModal = ({ isOpen, onRequestClose, report }) => {
    const reversedReport = [...report].reverse();
    return (
        <Modal
            className="modal-1"
            isOpen={isOpen}
            onRequestClose={onRequestClose}
        >
            <FaTimes size={25} onClick={onRequestClose} className='cross-icon' />
            <div className="modal-main">
                <h2 className="title">Equipment Report</h2>
                <div className="report-list">
                    {reversedReport.map((item, index) => (
                        <div key={item._id} className="report-item">
                            <h3>Report {index + 1}</h3>
                            <p><strong>Certificate No:</strong> {item.certificateNo}</p>
                            <p><strong>Date of Receipt:</strong> {new Date(item.dateOfReceipt).toLocaleDateString()}</p>
                            <p><strong>Date of Calibration:</strong> {new Date(item.dateOfCalibration).toLocaleDateString()}</p>
                            <p><strong>Date of Issue:</strong> {new Date(item.dateOfIssue).toLocaleDateString()}</p>
                            <p><strong>Work Order No:</strong> {item.workOrderNo}</p>
                            <p><strong>Place of Calibration:</strong> {item.placeOfCalibration}</p>
                            <p><strong>Calibrated By:</strong> {item.calibratedBy.name}</p>
                            <p><strong>Next Proposed Calibration Duration:</strong> {item.nextProposedCalibrationDuration + ' year'}</p>
                        </div>
                    ))}
                </div>
            </div >
        </Modal >
    );
};

export default EquipmentReportModal;
