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
import SearchBar from '../../components/SearchBar/Searchbar';
import SortBar from '../../components/SortBar/Sortbar';
import { sort } from 'fast-sort';


// Set the app element for react-modal
Modal.setAppElement('#root');

const Calibrations = () => {
    const EQUIPMENT_HEADERS = [
        { title: 'Owner', label: 'ownerName' },
        { title: 'Code', label: 'code' },
        { title: 'Description', label: 'description' },
        { title: 'Manufacturer', label: 'manufacturer' },
        { title: 'Model', label: 'model' },
        { title: 'Serial No', label: 'serialNo' },
    ]
    const [equipments, setEquipments] = useState([]);
    const [filteredEquipments, setFilteredEquipments] = useState([]);
    const [UpdateEquipment, setUpdateEquipment] = useState('');
    const [prevCounter, setPrevCounter] = useState(0);
    const [reportId, setReportId] = useState('');
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [isOpenPopup2, setIsOpenPopup2] = useState(false);
    const [selectedSort, setSelectedSort] = useState('');
    
    const dispatch = useDispatch();

    function handleSelectedSort(value) {
        setSelectedSort(value);
    }

    useEffect(() => {
        setFilteredEquipments(sort(filteredEquipments).by({
            asc: item => item[selectedSort],
            comparer: new Intl.Collator(undefined, { caseFirst: 'false' }).compare,
        }))
    }, [selectedSort])

    const fetchEquipments = async () => {
        dispatch(ShowLoading());
        try {
            const response = await equipmentService.getEquipments();
            if (response.equipments) {
                const filteredEquipments = await response.equipments.map((equipment) => {
                    const { __v, ...filteredEquipment } = equipment;
                    filteredEquipment.ownerName = filteredEquipment.owner?.name;
                    return filteredEquipment;
                });
                setEquipments(filteredEquipments);
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
        setReportId('');
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

    const handleViewReport = (id) => {
        setReportId(id);
        setIsOpenPopup2(true);
    }

    return (
        <>
            {(UpdateEquipment && isOpenPopup) &&
                <CalibrateEquipmentModal isOpen={isOpenPopup} onRequestClose={handleModalClose} equipment={UpdateEquipment} counter={prevCounter} fetchEquipments={fetchEquipments} referenceEquipments={equipments.filter(item => item.category === 'reference')} />
            }
            {reportId &&
                <EquipmentReportModal isOpen={isOpenPopup2} onRequestClose={handleModalClose2} equipments={equipments} onRefetch={fetchEquipments} selectedEquipmentId={reportId} />
            }
            <div className='Equipments'>
                <div className='flex'>
                    <h2 className='title'>Issue Calibration Report</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SearchBar
                        items={equipments}
                        onResults={(results) => setFilteredEquipments(sort(results).by({
                            asc: item => item[selectedSort],
                            comparer: new Intl.Collator(undefined, { caseFirst: 'false' }).compare,
                        }))}
                        excludedItems={['_id', 'category']}
                    />
                    <SortBar items={EQUIPMENT_HEADERS} onChange={handleSelectedSort}/>
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
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEquipments.map((equipment) => (
                            <tr key={equipment._id}>
                                <td>{equipment.owner?.name}</td>
                                <td>{equipment.code}</td>
                                <td>{equipment.description}</td>
                                <td>{equipment.manufacturer}</td>
                                <td>{equipment.model}</td>
                                <td>{equipment.serialNo}</td>
                                <td>{equipment.category}</td>
                                <td>
                                    <div className='action-icons-container'>
                                        <IoPlayForward size={20} className='action-icon' color='black' onClick={() => handleCalibrate(equipment)} />
                                        {equipment.claibrationDetails.length > 0 && <FiFileText size={22} className='action-icon' color='#C93616' onClick={() => handleViewReport(equipment._id)} />}
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