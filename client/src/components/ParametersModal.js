import { useState, useEffect } from "react";
import "../styles/UserModal.css";
import { message } from 'antd';
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import equipmentService from "../services/equipmentService";

const ParametersModal = ({ isOpen, onRequestClose, parametersTable, equipmentId }) => {
  const [parameters, setParameters] = useState([]);

  debugger;

  const handleUpdateParameters = async () => {
    // if (/* fetched data === updated data */false) {
    //   message.success('Already Up to date');
    //   return 1;
    // }
    try {
      const response = await equipmentService.updateEquipmentParameters({ parameters }, equipmentId);
      message.success(response);
    } catch (error) {
      message.error(error.response.data);
    }
  };
    
  useEffect(() => {
    setParameters(parametersTable);
  }, [parametersTable]);

  useEffect(() => {
    console.log('parameters', parameters);
  }, [parameters]);

  const handleParametersTableUpdate = (updatedValue, index, column) => {
    const selectedColumn = [...parametersTable[column]];
    selectedColumn[index] = { ...selectedColumn[index], value: updatedValue }
    setParameters({
      ...parametersTable,
      [column]: selectedColumn
    })
  }

  return (
    <Modal className="modal-1" isOpen={isOpen} onRequestClose={onRequestClose}>
      <FaTimes size={25} onClick={onRequestClose} className="cross-icon" />
      <div className="modal-main">
        <h2 className="title">Adjust Parameters</h2>
        <div>
            <table border="1">
            <thead>
              <tr>
                <th style={{ padding: 6, textAlign: 'center' }}>°C</th>
                <th style={{ padding: 6, textAlign: 'center' }}>Correction</th>
                <th style={{ padding: 6, textAlign: 'center' }}>U (2K)</th>
              </tr>
            </thead>
            <tbody>
              {parameters?.degreeC?.map((item, index) => (
              <tr key={index}>
                  <td style={{ padding: 6 }}>
                  <input
                    className={"yellow"}
                    
                    onChange={(e) => {
                      handleParametersTableUpdate(e.target.value, index, 'degreeC')
                    }}
                    defaultValue={item.value}
                  />
                  </td>
                  <td style={{ padding: 6 }}>
                  <input
                    className={"yellow"}
                    
                    onChange={(e) => {
                      handleParametersTableUpdate(e.target.value, index, 'correction')
                    }}
                    defaultValue={parameters.correction[index].value}
                  />
                  </td>
                  <td style={{ padding: 6 }}>
                  <input
                    className={"yellow"}
                    
                    onChange={(e) => {
                      handleParametersTableUpdate(e.target.value, index, 'u2k')
                    }}
                    defaultValue={parameters.u2k[index].value}
                  />
                  </td>
              </tr>
              ))}
            </tbody>
            </table>
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 12 }}>
        <button
          id="btn-1"
          className="btn"
          type="button"
          style={{ alignSelf: 'center' }}
          onClick={handleUpdateParameters}
        >
          Update Parameters
        </button>
      </div>
    </Modal>
  );
};

export default ParametersModal;
