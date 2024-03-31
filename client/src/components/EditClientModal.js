import React, { useState } from 'react';
import '../styles/UserModal.css'
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { message } from 'antd';
import clientService from '../services/clientService';

const EditClientModal = ({ isOpen, onRequestClose, fetchClients, Client }) => {
    const [formData, setFormData] = useState({
        name: Client.name,
        code: Client.code,
        email: Client.email,
        address: Client.address,
        generalInfo: Client.generalInfo,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateClient = async () => {
        if (!formData.name || !formData.code || !formData.address || !formData.email) {
            return message.error('Please fill all fields!');
        }
        const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/;
        if(!emailRegex.test(formData.email)){
            return message.error('Invalid Email, Please retry!');
        }
        try {
            const response = await clientService.updateClient(formData, Client._id);
            message.success(response);
            onRequestClose();
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
                <h2 className="title">Edit Client</h2>
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
                        <label htmlFor='email'>Email: </label>
                        <input
                            type="email"
                            id='email'
                            name="email"
                            value={formData.email}
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
                        <label htmlFor='generalInfo'>General Information: </label>
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
                            onClick={handleUpdateClient}
                        >
                            Update Client
                        </button>
                    </div>
                </form>
            </div >
        </Modal >
    );
};

export default EditClientModal;
