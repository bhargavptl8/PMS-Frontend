"use client"
import React, { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSelector } from 'react-redux';

export default function ToastMessage() {
    let toastify = useSelector(state => state?.toastify);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (toastify?.open) {
            setOpen(true);
        }
        else {
            setOpen(false);
        }
    }, [toastify])

    console.log("toastify", toastify);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={toastify?.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {toastify?.message || ""}
                </Alert>
            </Snackbar>
        </div>
    );
}