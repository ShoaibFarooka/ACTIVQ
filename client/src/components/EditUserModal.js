import React, { useState } from 'react';
import '../styles/UserModal.css'
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { message } from 'antd';
import userService from '../services/userService';

const EditUserModal = ({ isOpen, onRequestClose, fetchUsers, User, operatorRole }) => {
    console.log("user", User);
    const [formData, setFormData] = useState({
        name: User.name,
        username: User.username,
        code: User.code,
        password: '',
        role: User.role,
        permissions: {
            'Use of equipment': User.permissions.includes('Use of equipment'),
            'Execution of laboratory calibration': User.permissions.includes('Execution of laboratory calibration'),
            'Supply': User.permissions.includes('Supply'),
            'Development, editing or validation of methods': User.permissions.includes('Development, editing or validation of methods'),
            'Photo signature': User.permissions.includes('Photo signature'),
        },
        photoSignature: User.photoSignature?.trim() === "" ? null : User.photoSignature 
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? { ...prevData[name], [value]: checked } : value,
        }));
    };

    const handleUpdateUser = async () => {
        if (!formData.name || !formData.username || !formData.code) {
            return message.error('Please fill all fields!');
        }
        const permissionsArray = Object.keys(formData.permissions).filter(
            (permission) => formData.permissions[permission]
        );
        const data = {
            name: formData.name,
            username: formData.username,
            code: formData.code,
            role: formData.role,
            permissions: formData.role === 'employee' ? permissionsArray : []
        }
        if (formData.password) {
            data.password = formData.password;
        }
        if ((formData.role === 'manager' || (formData.role === 'employee' && formData.permissions['Photo signature'] === true)) && formData.photoSignature != null) {
            data.photoSignature = formData.photoSignature;
        }
        try {
            const response = await userService.updateUser(data, User._id);
            message.success(response);
            onRequestClose();
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
                <h2 className="title">Edit User</h2>
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
                            placeholder="leave empty to keep same password"
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
                            {operatorRole === 'admin' && <option value="manager">Manager</option>}
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
                    {(formData.role === 'manager' || (formData.role === 'employee' && formData.permissions['Photo signature'] === true)) &&
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
                            onClick={handleUpdateUser}
                        >
                            Update User
                        </button>
                    </div>
                </form>
            </div >
        </Modal >
    );
};

export default EditUserModal;
