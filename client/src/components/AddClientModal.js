import React, { useState } from 'react';
import '../styles/UserModal.css'
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { message } from 'antd';
import clientService from '../services/clientService';

const AddClientModal = ({ isOpen, onRequestClose, fetchClients }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        address: '',
        generalInfo: '',
    });

    const clearFormData = () => {
        setFormData({
            name: '',
            code: '',
            address: '',
            generalInfo: '',
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddClient = async () => {
        if (!formData.name || !formData.code || !formData.address) {
            return message.error('Please fill all fields!');
        }
        try {
            const response = await clientService.addClient(formData);
            message.success(response);
            onRequestClose();
            clearFormData();
            fetchClients();
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
                <h2 className="title">Add Client</h2>
                <form>
                    <div>
                        <label htmlFor='name'> Name: </label>
                        <input
                            type="text"
                            id='name'
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
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
                        <label htmlFor='address'>Address: </label>
                        <input
                            type="text"
                            id='address'
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='generalInfo'>General information: </label>
                        <textarea
                            id='generalInfo'
                            name="generalInfo"
                            value={formData.generalInfo}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="btn-div">
                        <button
                            id="btn-1"
                            className="btn"
                            type="button"
                            onClick={handleAddClient}
                        >
                            Add Client
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddClientModal;
