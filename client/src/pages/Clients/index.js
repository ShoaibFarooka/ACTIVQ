import React, { useState, useEffect } from 'react';
import './index.css';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import { message } from 'antd';
import Modal from 'react-modal';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import AddClientModal from '../../components/AddClientModal';
import EditClientModal from '../../components/EditClientModal';
import equipmentService from '../../services/equipmentService';
import clientService from '../../services/clientService';
import SearchBar from '../../components/SearchBar/Searchbar';
import { sort } from 'fast-sort';
import SortBar from '../../components/SortBar/Sortbar';

// Set the app element for react-modal
Modal.setAppElement('#root');

const Clients = () => {
    const CLIENT_HEADERS = [
        { title: 'Name', label: 'name' },
        { title: 'Code', label: 'code' },
        { title: 'Address', label: 'address' },
        { title: 'Equipment List', label: 'equipments' },
        { title: 'General Info', label: 'generalInfo' },
    ]
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [isOpenPopup2, setIsOpenPopup2] = useState(false);
    const [editClient, setEditClient] = useState('');
    const [selectedSort, setSelectedSort] = useState('');
    const dispatch = useDispatch();

    function handleSelectedSort(value) {
        setSelectedSort(value);
    }

    useEffect(() => {
        setFilteredClients(sort(filteredClients).by({
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
    };

    const fetchClients = async () => {
        try {
            const response = await clientService.getClients();
            if (response.clients) {
                const filteredClients = await response.clients.map((client) => {
                    const { __v, ...filteredClient } = client;
                    filteredClient.equipments = getClientEquipments(filteredClient);
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

    useEffect(() => {
        fetchEquipments();
    }, []);

    useEffect(() => {
        fetchClients();
    }, [equipments])

    const handleDelete = async (clientId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this client?');
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await clientService.deleteClient(clientId);
            message.success(response);
            fetchClients();
        } catch (error) {
            message.error(error.response.data);
        }
    };
    const handleEdit = (client) => {
        setEditClient(client);
        setIsOpenPopup2(true);
    };

    const handleModalClose2 = () => {
        setEditClient('');
        setIsOpenPopup2(false);
    };

    const handleModalClose = () => {
        setIsOpenPopup(false);
    };

    const handleModalOpen = (e) => {
        setIsOpenPopup(true);
    };

    const getClientEquipments = (client) => {
        const clientEquipments = equipments.filter(equipment => equipment.owner?._id === client._id);
        return clientEquipments.map(equipment => equipment.code).join(', ');
    };
    return (
        <>
            <AddClientModal isOpen={isOpenPopup} onRequestClose={handleModalClose} fetchClients={fetchClients} />
            {editClient &&
                <EditClientModal isOpen={isOpenPopup2} onRequestClose={handleModalClose2} fetchClients={fetchClients} Client={editClient} />
            }
            <div className='Clients'>
                <div className='flex'>
                    <h2>Client List</h2>
                    <button onClick={handleModalOpen} className='btn'>Add Client</button>
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SearchBar
                            items={clients}
                            onResults={(results) => setFilteredClients(sort(results).by({
                                asc: item => item[selectedSort],
                                comparer: new Intl.Collator(undefined, { caseFirst: 'false' }).compare,
                            }))}
                            excludedItems={['_id', 'type', 'email']}
                        />
                        <SortBar items={CLIENT_HEADERS} onChange={handleSelectedSort}/>
                    </div>
                </div>
                <table className='client-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Address</th>
                            <th>Equipment List</th>
                            <th>General Info</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map((client) => {
                            return (
                            <tr key={client._id}>
                                <td>{client.name}</td>
                                <td>{client.code}</td>
                                <td>{client.address}</td>
                                <td>{client.equipments}</td>
                                <td>{client.generalInfo}</td>
                                <td>
                                    <div className='action-icons-container'>
                                        <FaEdit size={20} className='action-icon' color='#c68642' onClick={() => handleEdit(client)} />
                                        <MdDelete size={22} className='action-icon' color='#C93616' onClick={() => handleDelete(client._id)} />
                                    </div>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
};

export default Clients;