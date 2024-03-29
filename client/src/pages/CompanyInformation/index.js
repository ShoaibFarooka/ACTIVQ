import React, { useState, useEffect } from 'react';
import './index.css';
import { message } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import infoService from '../../services/infoService';
import { getCompanyInformation } from '../../redux/companySlice';
import userService from '../../services/userService';

const CompanyInfo = () => {
    const companyInformation = useSelector(state => state.company);
    const [formData, setFormData] = useState(companyInformation);
    // Adding admin in name to explicity metion
    // admin [logged in] user-only change.
    const [adminPhotoSignature, setAdminPhotoSignature] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        setFormData(companyInformation);
    }, [companyInformation]);

    const fetchInfo = async () => {
        dispatch(ShowLoading());
        dispatch(getCompanyInformation());
        dispatch(HideLoading());
        const { photoSignature } = await userService.getUserPhotoSignature();
        setAdminPhotoSignature(photoSignature);
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'telephone' && !/^\d*$/.test(value)) {
            return;
        }

        if (name === 'logo' || name === 'seal1' || name === 'seal2') {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSave = async () => {
        const Data = new FormData();
        Data.append('name', formData.name);
        Data.append('address', formData.address);
        Data.append('telephone', formData.telephone);
        Data.append('code', formData.code);
        Data.append('logo', formData.logo);
        Data.append('seal1', formData.seal1);
        Data.append('seal2', formData.seal2);
        try {
            const response = await infoService.updateCompanyInfo(Data);
            message.success(response);
            fetchInfo();
        } catch (error) {
            message.error(error.response.data);
        }
    };

    const updateAdminPhotoSignature = async () => {
        try {
            const { id } = await userService.getUserId();
            const { role } = await userService.getUserRole();
            const response = await userService.updateUser({
                photoSignature: adminPhotoSignature,
                role
            }, id);
            message.success(response.message);
            setAdminPhotoSignature(response.photoSignature)
        } catch (error) {
            message.error('Something went wrong');            
        }
    };

    return (
        <div className="company-info">
            <h2>Company Information</h2>
            <form>
                <label htmlFor="name">Name</label>
                <input
                    type='text'
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <label htmlFor="address">Address</label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                />

                <label htmlFor="telephone">Telephone</label>
                <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    pattern="[0-9]*"
                />

                <label htmlFor="logo">Logo</label>
                <input
                    type="file"
                    id="logo"
                    name="logo"
                    onChange={handleInputChange}
                />
                {formData.logo && (
                    <img
                        src={formData.logo instanceof File ? URL.createObjectURL(formData.logo) : formData.logo}
                        alt="Logo Preview"
                        className="image-preview"
                    />
                )}

                <label htmlFor="seal1">Seal 1</label>
                <input
                    type="file"
                    id="seal1"
                    name="seal1"
                    onChange={handleInputChange}
                />
                {formData.seal1 && (
                    <img
                        src={formData.seal1 instanceof File ? URL.createObjectURL(formData.seal1) : formData.seal1}
                        alt="Seal 1 Preview"
                        className="image-preview"
                    />
                )}

                <label htmlFor="seal2">Seal 2</label>
                <input
                    type="file"
                    id="seal2"
                    name="seal2"
                    onChange={handleInputChange}
                />
                {formData.seal2 && (
                    <img
                        src={formData.seal2 instanceof File ? URL.createObjectURL(formData.seal2) : formData.seal2}
                        alt="Seal 2 Preview"
                        className="image-preview"
                    />
                )}

                <div>
                    {adminPhotoSignature != null && 
                        <img width={160} src={adminPhotoSignature instanceof File
                            ? URL.createObjectURL(adminPhotoSignature) 
                            : adminPhotoSignature}
                            alt='Photo_Signature.' 
                        />
                    }
                    <br />
                    Add Photo Signature:
                    <br />
                    <div>
                        <input type="file" multiple={false} onChange={(ev) => {
                            setAdminPhotoSignature(ev.target.files[0])
                        }} />
                        {(adminPhotoSignature && adminPhotoSignature instanceof File) &&
                            <div className='save-signature' onClick={updateAdminPhotoSignature}>
                                Save
                            </div>
                        }
                    </div>
                </div>

                <label htmlFor="uniqueCode">Unique Code (Max 4 characters)</label>
                <input
                    type="text"
                    id="uniqueCode"
                    name="code"
                    maxLength={4}
                    value={formData.code}
                    onChange={handleInputChange}
                />
                <button type="button" onClick={handleSave}>
                    Save
                </button>
            </form>
        </div>
    );
};

export default CompanyInfo;
