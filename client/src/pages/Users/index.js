import React, { useState, useEffect } from 'react';
import './index.css';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import { message } from 'antd';
import Modal from 'react-modal';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import AddUserModal from '../../components/AddUserModal';
import EditUserModal from '../../components/EditUserModal';
import userService from '../../services/userService';
import SortBar from '../../components/SortBar/Sortbar';
import { sort } from 'fast-sort';

// Set the app element for react-modal
Modal.setAppElement('#root');

const Users = ({ userRole }) => {
    const [users, setUsers] = useState([]);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [isOpenPopup2, setIsOpenPopup2] = useState(false);
    const [editUser, setEditUser] = useState('');
    const dispatch = useDispatch();
    const [selectedSort, setSelectedSort] = useState('');
    const USER_HEADERS = [
        {title: 'Name', label: 'name'},
        {title: 'Code', label: 'code'},
        {title: 'Role', label: 'role'},
        {title: 'Permissions', label: 'permissions'},
    ];

    function handleSelectedSort(value) {
        setSelectedSort(value);
    }

    useEffect(() => {
        setUsers(sort(users).by({
            asc: item => item[selectedSort],
            comparer: new Intl.Collator(undefined, { caseFirst: 'false' }).compare,
        }))
    }, [selectedSort])


    const fetchUsers = async () => {
        dispatch(ShowLoading());
        try {
            const response = await userService.getUsers();
            if (response.users) {
                const filteredUsers = await response.users.map((user) => {
                    const { __v, ...filteredUser } = user;
                    return filteredUser;
                });
                setUsers(sort(filteredUsers).by({
                    asc: item => item[selectedSort],
                    comparer: new Intl.Collator(undefined, { caseFirst: 'false' }).compare,
                }))
            }
        } catch (error) {
            if (error.response.data === 'Users not found') {
                return setUsers([]);
            }
            message.error(error.response.data);
        }
        finally {
            dispatch(HideLoading());
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await userService.deleteUser(userId);
            message.success(response);
            fetchUsers();
        } catch (error) {
            message.error(error.response.data);
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setIsOpenPopup2(true);
    };

    const handleModalClose2 = () => {
        setEditUser('');
        setIsOpenPopup2(false);
    };

    const handleModalClose = () => {
        setIsOpenPopup(false);
    };

    const handleModalOpen = (e) => {
        setIsOpenPopup(true);
    };
    return (
        <>

            <AddUserModal isOpen={isOpenPopup} onRequestClose={handleModalClose} fetchUsers={fetchUsers} />
            {editUser &&
                <EditUserModal isOpen={isOpenPopup2} onRequestClose={handleModalClose2} fetchUsers={fetchUsers} User={editUser} operatorRole={userRole} />
            }
            <div className='Users'>
                <div className='flex'>
                    <h2>User List</h2>
                    {userRole === 'admin' && <button onClick={handleModalOpen} className='btn'>Add User</button>}
                </div>
                <SortBar items={USER_HEADERS} onChange={handleSelectedSort} />
                <table className='user-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Role</th>
                            <th>Permissions</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.code}</td>
                                <td>{user.role}</td>
                                <td>{user.permissions && user.permissions.join(', ')}</td>
                                <td>
                                    <div className='action-icons-container'>
                                        <FaEdit size={20} className='action-icon' color='#c68642' onClick={() => handleEdit(user)} />
                                        <MdDelete size={22} className='action-icon' color='#C93616' onClick={() => handleDelete(user._id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Users;
