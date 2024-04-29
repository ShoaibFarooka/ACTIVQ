import React, { useState, useEffect } from 'react';
import '../styles/UserModal.css';
import Modal from 'react-modal';
import { FaTimes, FaFilePdf } from 'react-icons/fa';
import { getUserRole } from '../utils/authUtils';
import equipmentService from '../services/equipmentService';
import { AUTHORITY } from '../utils/constants';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/loaderSlice';

const EquipmentReportModal = ({ isOpen, onRequestClose, onRefetch, equipments, selectedEquipmentId }) => {
    const dispatch = useDispatch();
    const [reversedReport, setReversedReport] = useState([]);

    async function downloadReport(itemId) {
        dispatch(ShowLoading());
        try {
            const fileURL = await equipmentService.generateReportCertificate({ equipmentId: itemId });
            const anchor = document.createElement('a');
            anchor.href = fileURL;
            anchor.download = '';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            message.success('Report has been download successfully!');
        } catch (error) {
            message.error(`${error}`)
        }
        dispatch(HideLoading());
    }

    useEffect(() => {
        const selectedEquipment = equipments.find(item => item._id === selectedEquipmentId);
        if (selectedEquipment) {
            const sortedCalibrationDetails = selectedEquipment.claibrationDetails.sort((a, b) => {
                return b.createdAt - a.createdAt;
            });
            setReversedReport(sortedCalibrationDetails);
        }
    }, [selectedEquipmentId, equipments]);
    // move to parent
    const [userRole, setUserRole] = useState("");
    useEffect(() => {
        getUserRole().then(results => setUserRole(results));
    }, [])

    async function handleVerifyReport(id, status) {
        try {
            await equipmentService.verifyEquipmentReport({
                equipmentId: id,
                reportVerification: {
                    status: status
                }
            });
            message.success('Report has been verified successfully');
        } catch (error) {
            message.error(`${error}`);
        }
        onRefetch();
    }

    const styles = {
        cell: {
          padding: '8px',
          textAlign: 'left',
          border: '1px solid #848484',
          width: '33.33%', // Equal width for all columns (100% divided by 3 columns)
        },
    };

    return (
        <Modal
            className="modal-1"
            isOpen={isOpen && reversedReport.length}
            onRequestClose={onRequestClose}
        >
            <FaTimes size={25} onClick={onRequestClose} className='cross-icon' />
            <div className="modal-main">
                <h2 className="title">Equipment Report</h2>
                <div className="report-list">
                    {reversedReport.map((item, index) => {
                        return (
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
                            <p><b>Environmental Conditions</b></p>
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                    <td style={styles.cell}>Equipment reading</td>
                                    <td style={styles.cell}>From</td>
                                    <td style={styles.cell}>To</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td style={styles.cell}>Temperature</td>
                                    <td style={styles.cell}>{item.enviromentalConditions.temperature[0]}</td>
                                    <td style={styles.cell}>{item.enviromentalConditions.temperature[1]}</td>
                                    </tr>
                                    <tr>
                                    <td style={styles.cell}>Relative Humidity %RH</td>
                                    <td style={styles.cell}>{item.enviromentalConditions.relativeHumidity[0]}</td>
                                    <td style={styles.cell}>{item.enviromentalConditions.relativeHumidity[1]}</td>
                                    </tr>
                                    <tr>
                                    <td style={styles.cell}>Atmospheric Pressure hPa</td>
                                    <td style={styles.cell}>{item.enviromentalConditions.atmosphericPressure[0]}</td>
                                    <td style={styles.cell}>{item.enviromentalConditions.atmosphericPressure[1]}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p><b>Bath Parameters:</b></p>
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                    <td style={styles.cell}>Bath Stability {"(< 0 °C):"}</td>
                                    <td style={styles.cell}>{item.bathParameters.bathStability[0]}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td style={styles.cell}>Bath Homogeneousness {"(< 0 °C):"}</td>
                                    <td style={styles.cell}>{item.bathParameters.bathHomogeneousness[0]}</td>
                                    </tr>
                                    <tr>
                                    <td style={styles.cell}>Bath Stability {"(0 < x < 80 °C):"}</td>
                                    <td style={styles.cell}>{item.bathParameters.bathStability[1]}</td>
                                    </tr>
                                    <tr>
                                    <td style={styles.cell}>Bath Homogeneousness {"(0 < x < 80 °C):"}</td>
                                    <td style={styles.cell}>{item.bathParameters.bathHomogeneousness[1]}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr />
                            {item.calibrationTables.map((tableItem) => (
                                <>
                                    <p><b>Calibration Temperature:</b> {tableItem.calibrationTemperature}</p>
                                    <table style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <td style={styles.cell}><b>Reference Temperature Initial</b></td>
                                                <td style={styles.cell}><b>Calibrated Temperature</b></td>
                                                <td style={styles.cell}><b>Reference Temperature Final</b></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {tableItem.calibratedTemperature.map((value, index) => (
                                            <tr>
                                                <td style={styles.cell}>{tableItem.referenceTemperatureInitial[index]}</td>
                                                <td style={styles.cell}>{value}</td>
                                                <td style={styles.cell}>{tableItem.referenceTemperatureFinal[index]}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </>
                            ))}
                            <p><b>Comments: </b>
                                <br />
                                <p style={{ 
                                    wordWrap: 'break-word', 
                                    maxHeight: 'calc(10 * 1.2em)',
                                    overflowY: 'scroll',
                                    overflowX: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 10,
                                    WebkitBoxOrient: 'vertical'
                                }}>{item.comments}</p>
                            </p>
                            <div style={{ backgroundColor: '#d4d4d4', borderRadius: 4, padding: 8 }}>
                                <p><h4>Reference Equipment Details:</h4></p>
                                <p><b>Name: </b>{item.referenceEquipment.code}</p>
                                <p><b>Parameters table:</b></p>
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <td style={styles.cell}><b>°C</b></td>
                                            <td style={styles.cell}><b>Correction</b></td>
                                            <td style={styles.cell}><b>u2k</b></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.referenceEquipment.parametersTable.degreeC.map((degreeCItem, paramsIndex) => (
                                            <tr>
                                                <td style={styles.cell}>{degreeCItem.trim() === "" ? 'N/A' : degreeCItem}</td>
                                                <td style={styles.cell}>{item.referenceEquipment.parametersTable.correction[paramsIndex].trim() === "" ? 'N/A' : item.referenceEquipment.parametersTable.correction[paramsIndex]}</td>
                                                <td style={styles.cell}>{item.referenceEquipment.parametersTable.u2k[paramsIndex].trim() === "" ? 'N/A' : item.referenceEquipment.parametersTable.u2k[paramsIndex]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {
                                (userRole.role === 'admin' || userRole.role === 'manager' || (userRole.role === 'employee' && userRole.permissions.includes(AUTHORITY.level_five))) && 
                                item.reportVerification.status === false && 
                                (<>
                                    <hr />
                                    <button className='verification-button' onClick={async () => { 
                                        handleVerifyReport(item._id, true);
                                    }}>
                                        Verify Report
                                    </button>
                                </>)
                            }
                            {
                                item.reportVerification.status === true && (
                                    <>
                                        <hr />
                                        <button className='pdf-download-button' onClick={async () => downloadReport(item._id)}>
                                            <FaFilePdf/>&nbsp;<span>Download PDF Report</span>
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    )})}
                </div>
            </div >
        </Modal >
    );
};

export default EquipmentReportModal;
