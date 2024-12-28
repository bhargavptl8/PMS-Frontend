import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    minHeight: 450,
    maxHeight: "70%",
    overflow: "auto",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const ModalPopup = ({ modelOpen, handleClose, heading, body }) => {

    return (
        <div>
            <Modal
                open={modelOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {heading}
                    {body}
                </Box>
            </Modal>
        </div>
    );

}

export default ModalPopup;