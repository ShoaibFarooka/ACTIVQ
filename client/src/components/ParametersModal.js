import { useState, useEffect } from "react";
import "../styles/UserModal.css";
import { message } from 'antd';
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import equipmentService from "../services/equipmentService";
import { NUMBER_REGEX } from "../utils/constants";

const ParametersModal = ({ isOpen, onRequestClose, parametersTable, equipmentId, onUpdateParameters }) => {
  const [parameters, setParameters] = useState([]);
  const handleUpdateParameters = async () => {
    try {
      const response = await equipmentService.updateEquipmentParameters({ parameters }, equipmentId);
      message.success(response);
      onUpdateParameters();
    } catch (error) {
      message.error(error.response.data);
    }
  };
    
  useEffect(() => {
    setParameters(parametersTable);
    console.log('=--=:>', parametersTable);
  }, [parametersTable]);

  const handleParametersTableUpdate = (updatedValue, index, column) => {
    if (!NUMBER_REGEX.test(updatedValue)) {
      return;
    }
    const selectedColumn = [...parameters[column]];
    selectedColumn[index] = updatedValue
    setParameters({
      ...parameters,
      [column]: selectedColumn
    })
  };

  const generateBackgroundColorClass = (local, transmitted) => {
    // function calcs the background color for an input element.
    if (local === "" && transmitted === "") {
      return 'red';
    } else if ((local !== "" && transmitted === "") || (local === "" && transmitted !== "") || (local !== transmitted)) {
      return 'yellow';
    } else {
      return 'green';
    }
  };

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
                    className={generateBackgroundColorClass(parameters?.degreeC[index]?.trim(), parametersTable?.degreeC[index]?.trim())}
                    onChange={(e) => handleParametersTableUpdate(e.target.value, index, 'degreeC')}
                    value={parameters.degreeC[index] ?? ''}
                  />
                  </td>
                  <td style={{ padding: 6 }}>
                  <input
                    className={generateBackgroundColorClass(parameters?.correction[index]?.trim(), parametersTable?.correction[index]?.trim())}
                    onChange={(e) => handleParametersTableUpdate(e.target.value, index, 'correction')}
                    value={parameters.correction[index] ?? ''}
                  />
                  </td>
                  <td style={{ padding: 6 }}>
                  <input
                    className={generateBackgroundColorClass(parameters?.u2k[index]?.trim(), parametersTable?.u2k[index]?.trim())}
                    onChange={(e) => handleParametersTableUpdate(e.target.value, index, 'u2k')}
                    value={parameters.u2k[index] ?? ''}
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
