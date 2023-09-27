import React, { useEffect, useState } from 'react';
import axios from 'axios';
import imgsrc from './delete.png';
import './fileList.css'
import Swal from 'sweetalert2'; // Import SweetAlert
import { confirmAlert } from 'react-confirm-alert'; // Import the confirmation dialog

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import the confirmation dialog styles

const deleteImageStyle = {
    cursor: 'pointer',
    width: '25px',
    height: '25px',
};
const MAX_FILE_NAME_LENGTH = 15; // Change this value to your desired character limit
const MAX_FILES_TO_DISPLAY = 10; // Change this value to the number of files you want to display

const FileList = ({ userData, filelistselected }) => {
    const [files, setFiles] = useState([]);
    const [deleteOccurred, setDeleteOccurred] = useState(false); // State variable to track delete operations    
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const userId = userData.id;
    const [selectedFiles, setSelectedFiles] = useState([]);


    useEffect(() => {
        // Fetch the file list when the component mounts and when deleteOccurred changes
        if (userId || deleteOccurred || uploadSuccess) {
            axios.get(`http://localhost:8000/get-file-list/?userId=${userId}`)
                .then((response) => {
                    console.log(response.data);
                    setFiles(response.data);
                    // Reverse the order of files to display the most recent one first
                    const reversedFiles = response.data.reverse();
                    // Select only the latest 10 files
                    setFiles(reversedFiles.slice(0, MAX_FILES_TO_DISPLAY));
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        console.log("Selected Files:", selectedFiles);
        filelistselected(selectedFiles)
    }, [userId, deleteOccurred, uploadSuccess, selectedFiles]); // Include deleteOccurred as a dependency

    const handleDelete = (file) => {
        console.log(`Delete file with ID ${file}`);
        console.log(userId);
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this file?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        axios
                            .post(
                                `http://localhost:8000/delete-file/?file=${file}&userId=${userId}`
                            )
                            .then((response) => {
                                console.log(response.data);
                                setDeleteOccurred(true);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    },
                },
                {
                    label: 'No',
                    onClick: () => {
                        // User canceled, do nothing
                    },
                },
            ],
        });
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            console.log(file)
            uploadFile(file, userData);
        }
    };

    const uploadFile = (file, userData) => {
        const userId = userData.id
        const username = userData.name
        const formData = new FormData();
        // 
        formData.append('userId', userId);
        formData.append('username', username);
        formData.append('file', file);


        axios
            .post('http://localhost:8000/upload-file', formData, {
                params: {
                    userId: userId,
                    username: username,
                }
            })
            .then((response) => {
                console.log('Response:', response.data);

                setUploadSuccess(true);
                Swal.fire({
                    position: 'middle-center',
                    icon: 'success',
                    title: 'File Uploaded SuccessFully',
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                console.log('Response Data:', error.response.data);
            });
    };
    const handleToggleSelect = (file) => {
        if (selectedFiles.includes(file)) {
            setSelectedFiles(selectedFiles.filter(selectedFile => selectedFile !== file));
        } else {
            setSelectedFiles([...selectedFiles, file]);
        }
        console.log("Toggle Files:", selectedFiles);
    };
    return (
        <div>
            <div className="file-upload-container">
                <div className="file-upload-form">
                    <div className="button-container">
                        <label type='button' htmlFor="file-input" className="select-button" style={{ marginLeft: '-9px', transition: 'background-color 0.3s' }}>
                            Upload File
                        </label>

                        <input
                            type="file"
                            id="file-input"
                            className="file-input"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            </div>
            <div>
                <ul style={{ listStyleType: 'none', paddingLeft: '5px', marginLeft: '10px', color: 'white', fontSize: '15px', marginTop: '30px' }}>
                    {/* {files.map((file) => (
                        <li key={file}>
                            <input
                                type="checkbox"
                                style={{ marginRight: "10px" }}
                                checked={selectedFiles.includes(file)}
                                onChange={() => handleToggleSelect(file)}
                            />
                            {file}
                            <img onClick={() => handleDelete(file)}
                                src={imgsrc}
                                alt="Delete"
                                style={deleteImageStyle}
                            />
                        </li>
                    ))} */}
                    {files.map((file) => (
                        <li key={file} style={{ display: 'flex', alignItems: 'center', marginTop: '5px', justifyContent: 'space-between', paddingRight: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input type="checkbox" style={{ marginRight: '10px' }} checked={selectedFiles.includes(file)}
                                onChange={() => handleToggleSelect(file)} />
                                <span className="file-name" style={{ fontWeight: 'bold' }}>
                                    {file.length > MAX_FILE_NAME_LENGTH
                                        ? `${file.slice(0, MAX_FILE_NAME_LENGTH - 3)}...`
                                        : file}
                                </span>
                            </div>
                            <img
                                onClick={() => handleDelete(file)}
                                src={imgsrc}
                                alt="Delete"
                                style={deleteImageStyle}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
}

export default FileList;
