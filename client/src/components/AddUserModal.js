import React, { useState } from 'react';
import '../styles/UserModal.css'
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { message } from 'antd';
import userService from '../services/userService';

const AddUserModal = ({ isOpen, onRequestClose, fetchUsers }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        code: '',
        password: '',
        role: 'employee',
        permissions: {
            'Use of equipment': false,
            'Execution of laboratory calibration': false,
            'Supply': false,
            'Development, editing or validation of methods': false,
            'Photo signature': false,
        },
        photoSignature: null
    });

    const clearFormData = () => {
        setFormData({
            name: '',
            username: '',
            password: '',
            code: '',
            role: 'employee',
            permissions: {
                'Use of equipment': false,
                'Execution of laboratory calibration': false,
                'Supply': false,
                'Development, editing or validation of methods': false,
                'Photo signature': false,
            },
            photoSignature: null
        });
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? { ...prevData[name], [value]: checked } : value,
        }));
    };

    const handleAddUser = async () => {
        if (!formData.name || !formData.username || !formData.password || !formData.code) {
            return message.error('Please fill all fields!');
        }
        const permissionsArray = Object.keys(formData.permissions).filter(
            (permission) => formData.permissions[permission]
        );
        const data = {
            name: formData.name,
            username: formData.username,
            code: formData.code,
            password: formData.password,
            role: formData.role,
            permissions: permissionsArray,
            photoSignature: formData.photoSignature
        }
        try {
            const response = await userService.addUser(data);
            message.success(response);
            onRequestClose();
            clearFormData();
            fetchUsers();
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
                <h2 className="title">Add User</h2>
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
                        <label htmlFor='username'>Username: </label>
                        <input
                            type="text"
                            id='username'
                            name="username"
                            value={formData.username}
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
                        <label htmlFor='password'>Password: </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='role'>Role: </label>
                        <select
                            name="role"
                            id='role'
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    {formData.role === 'employee' &&
                        <div>
                            <label className='permissions-title'>Permissions: </label>
                            <div>
                                {Object.entries(formData.permissions).map(([key, isChecked], index) => (
                                    <div key={index} className='checkbox-container'>
                                        <label htmlFor={`permission${index}`} className='checkbox-label'>{key}</label>
                                        <input
                                            type="checkbox"
                                            id={`permission${index}`}
                                            name="permissions"
                                            value={key}
                                            checked={isChecked}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    {formData.role === 'manager' &&
                        <div>
                            {formData.photoSignature != null && 
                                <img width={160} src={formData.photoSignature instanceof File ?
                                    URL.createObjectURL(formData.photoSignature) 
                                    : formData.photoSignature} 
                                    alt='Photo_Signature.' 
                                />
                            }
                            <br />
                            Add Photo Signature:
                            <input type="file" multiple={false} onChange={(ev) => {
                                setFormData({...formData, photoSignature: ev.target.files[0] })
                            }} />
                        </div>
                    }
                    <div className="btn-div">
                        <button
                            id="btn-1"
                            className="btn"
                            type="button"
                            onClick={handleAddUser}
                        >
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddUserModal;
