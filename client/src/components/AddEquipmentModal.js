import React, { useState } from 'react';
import '../styles/UserModal.css'
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { message } from 'antd';
import equipmentService from '../services/equipmentService';

const AddEquipmentModal = ({ isOpen, onRequestClose, fetchEquipments, Clients }) => {
    const [formData, setFormData] = useState({
        owner: '',
        code: '',
        description: '',
        manufacturer: '',
        model: '',
        serialNo: '',
        type: ''
    });

    const clearFormData = () => {
        setFormData({
            owner: '',
            code: '',
            description: '',
            manufacturer: '',
            model: '',
            serialNo: '',
            type: ''
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddEquipment = async () => {
        if (!formData.code || !formData.description || !formData.manufacturer || !formData.model || !formData.serialNo || !formData.type) {
            return message.error('Please fill all fields!');
        }
        try {
            const response = await equipmentService.addEquipment(formData);
            message.success(response);
            onRequestClose();
            clearFormData();
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
                <h2 className="title">Add Equipment</h2>
                <form>
                    <div>
                        <label htmlFor='owner'>Owner: </label>
                        <select
                            name="owner"
                            id='owner'
                            value={formData.owner}
                            onChange={handleInputChange}
                        >
                            <option value=''>Please Select an Owner</option>
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
                        <label htmlFor='description'> Description: </label>
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
                            <option value="" disabled>Please Select Equipment Type</option>
                            <option value="reference">Reference</option>
                            <option value="client">Client</option>
                        </select>
                    </div>
                    <div className="btn-div">
                        <button
                            id="btn-1"
                            className="btn"
                            type="button"
                            onClick={handleAddEquipment}
                        >
                            Add Equipment
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddEquipmentModal;
