import React, { useState, useEffect } from 'react';
import './index.css';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import { message } from 'antd';
import Modal from 'react-modal';
import { IoPlayForward } from "react-icons/io5";
import { FiFileText } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import EquipmentReportModal from '../../components/EquipmentReportModal';
import CalibrateEquipmentModal from '../../components/CalibrateEquipmentModal';
import userService from '../../services/userService';
import equipmentService from '../../services/equipmentService';
import Equipments from '../Equipments';

// Set the app element for react-modal
Modal.setAppElement('#root');

const Calibrations = () => {
    const [equipments, setEquipments] = useState([]);
    const [UpdateEquipment, setUpdateEquipment] = useState('');
    const [prevCounter, setPrevCounter] = useState(0);
    const [report, setReport] = useState('');
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [isOpenPopup2, setIsOpenPopup2] = useState(false);
    const dispatch = useDispatch();

    const fetchEquipments = async () => {
        dispatch(ShowLoading());
        try {
            const response = await equipmentService.getEquipments();
            if (response.equipments) {
                const filteredEquipments = await response.equipments.map((equipment) => {
                    const { __v, ...filteredEquipment } = equipment;
                    return filteredEquipment;
                });
                const sortedEquipments = filteredEquipments.sort((a, b) => a.type.localeCompare(b.type));
                setEquipments(sortedEquipments);
            }
        } catch (error) {
            if (error.response.data === 'Equipments not found') {
                return setEquipments([]);
            }
            message.error(error.response.data);
        }
        finally {
            dispatch(HideLoading());
        }
    };

    useEffect(() => {
        fetchEquipments();
    }, []);

    const handleModalClose2 = () => {
        setReport('');
        setIsOpenPopup2(false);
    };

    const handleModalClose = () => {
        setIsOpenPopup(false);
    };

    const handleCalibrate = (equipment) => {
        setPrevCounter(equipment.claibrationDetails.length)
        setUpdateEquipment(equipment);
        setIsOpenPopup(true);
    }

    const handleViewReport = (claibrationDetails) => {
        setReport(claibrationDetails);
        setIsOpenPopup2(true);
    }

    return (
        <>
            {UpdateEquipment &&
                <CalibrateEquipmentModal isOpen={isOpenPopup} onRequestClose={handleModalClose} equipment={UpdateEquipment} counter={prevCounter} fetchEquipments={fetchEquipments} />
            }
            {report &&
                <EquipmentReportModal isOpen={isOpenPopup2} onRequestClose={handleModalClose2} report={report} />
            }
            <div className='Equipments'>
                <div className='flex'>
                    <h2 className='title'>Issue Calibration Report</h2>
                </div>
                <table className='equipment-table'>
                    <thead>
                        <tr>
                            <th>Owner</th>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Manufacturer</th>
                            <th>Model</th>
                            <th>Serial No</th>
                            <th>Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipments.map((equipment) => (
                            <tr key={equipment._id}>
                                <td>{equipment.owner?.name}</td>
                                <td>{equipment.code}</td>
                                <td>{equipment.description}</td>
                                <td>{equipment.manufacturer}</td>
                                <td>{equipment.model}</td>
                                <td>{equipment.serialNo}</td>
                                <td>{equipment.type}</td>
                                <td>
                                    <div className='action-icons-container'>
                                        <IoPlayForward size={20} className='action-icon' color='black' onClick={() => handleCalibrate(equipment)} />
                                        {equipment.claibrationDetails.length > 0 && <FiFileText size={22} className='action-icon' color='#C93616' onClick={() => handleViewReport(equipment.claibrationDetails)} />}
                                        {equipment.claibrationDetails.length > 0 && <FaFilePdf size={22} className='action-icon' color='red' />}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
};

export default Calibrations;