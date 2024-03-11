import React, { useState, useEffect } from 'react';
import './index.css';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import { message } from 'antd';
import Modal from 'react-modal';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import AddEquipmentModal from '../../components/AddEquipmentModal';
import EditEquipmentModal from '../../components/EditEquipmentModal';
import clientService from '../../services/clientService';
import equipmentService from '../../services/equipmentService';

// Set the app element for react-modal
Modal.setAppElement('#root');

const Equipments = () => {
    const [equipments, setEquipments] = useState([]);
    const [clients, setClients] = useState([]);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [isOpenPopup2, setIsOpenPopup2] = useState(false);
    const [editEquipment, setEditEquipment] = useState('');
    const dispatch = useDispatch();

    const fetchClients = async () => {
        try {
            const response = await clientService.getClients();
            if (response.clients) {
                const filteredClients = await response.clients.map((client) => {
                    const { __v, ...filteredClient } = client;
                    return filteredClient;
                });
                setClients(filteredClients);
            }
        } catch (error) {
            if (error.response.data === 'Clients not found') {
                return setClients([]);
            }
            message.error(error.response.data);
        }
        finally {
            dispatch(HideLoading());
        }
    };

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
            fetchClients();
        }
    };

    useEffect(() => {
        fetchEquipments();
    }, []);

    const handleDelete = async (EquipmentId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this equipment?');
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await equipmentService.deleteEquipment(EquipmentId);
            message.success(response);
            fetchEquipments();
        } catch (error) {
            message.error(error.response.data);
        }
    };
    const handleEdit = (equipment) => {
        setEditEquipment(equipment);
        setIsOpenPopup2(true);
    };

    const handleModalClose2 = () => {
        setEditEquipment('');
        setIsOpenPopup2(false);
    };

    const handleModalClose = () => {
        setIsOpenPopup(false);
    };

    const handleModalOpen = (e) => {
        setIsOpenPopup(true);
    };

    const isNextCalibrationDueSoon = (equipment) => {
        const nextCalibrationDate = getNextCalibrationDate(equipment, true);
        if (!nextCalibrationDate) {
            return 'no-highlight';
        }
        const timeDifference = nextCalibrationDate.getTime() - Date.now();
        const daysUntilCalibration = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        if (daysUntilCalibration <= 30) {
            return 'highlight';
        }
        else {
            return 'no-highlight';
        }
    }

    const getNextCalibrationDate = (equipment, onlyDate) => {
        if (equipment.claibrationDetails?.length > 0) {
            const nextCalibrationDate = new Date(equipment.claibrationDetails[equipment.claibrationDetails.length - 1].dateOfCalibration);
            const duration = equipment.claibrationDetails[equipment.claibrationDetails.length - 1].nextProposedCalibrationDuration;
            let years = 0;
            let months = 0;
            if (duration.includes('.')) {
                [years, months] = duration.split('.').map(parseFloat);
            } else {
                years = parseFloat(duration);
            }
            const actualMonths = months * 12 / 10;
            nextCalibrationDate.setFullYear(nextCalibrationDate.getFullYear() + years);
            nextCalibrationDate.setMonth(nextCalibrationDate.getMonth() + actualMonths);
            if (onlyDate) {
                return nextCalibrationDate;
            }
            else {
                return nextCalibrationDate.toLocaleDateString();
            }
        }
        else {
            return '';
        }
    };

    return (
        <>
            <AddEquipmentModal isOpen={isOpenPopup} onRequestClose={handleModalClose} fetchEquipments={fetchEquipments} Clients={clients} />
            {editEquipment &&
                <EditEquipmentModal isOpen={isOpenPopup2} onRequestClose={handleModalClose2} fetchEquipments={fetchEquipments} Equipment={editEquipment} Clients={clients} />
            }
            <div className='Equipments'>
                <div className='flex'>
                    <h2 className='title'>Equipment List</h2>
                    <button onClick={handleModalOpen} className='btn btn-1'>Add Equipment</button>
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
                            <th>Next Calibration Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipments.map((equipment) => (
                            <tr key={equipment._id} className={isNextCalibrationDueSoon(equipment)}>
                                <td>{equipment.owner?.name}</td>
                                <td>{equipment.code}</td>
                                <td>{equipment.description}</td>
                                <td>{equipment.manufacturer}</td>
                                <td>{equipment.model}</td>
                                <td>{equipment.serialNo}</td>
                                <td>{equipment.type}</td>
                                <td>{getNextCalibrationDate(equipment)}</td>
                                <td>
                                    <div className='action-icons-container'>
                                        <FaEdit size={20} className='action-icon' color='#c68642' onClick={() => handleEdit(equipment)} />
                                        <MdDelete size={22} className='action-icon' color='#C93616' onClick={() => handleDelete(equipment._id)} />
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

export default Equipments;