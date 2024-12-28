"use client"
import React, { useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid2, Typography } from '@mui/material';
import ModalPopup from '../../common/ModalPopup';
import { useForm } from 'react-hook-form';
import { CustomNumberField, CustomSelectFiled, CustomTextField } from '../../common/CustomField';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import ClientsRows from './ClientsRows';
import { CREATE_CLIENT, UPDATE_CLIENT } from '@/app/graphql/mutation/client';
import { useMutation } from '@apollo/client';
import { GET_CLIENTS } from '@/app/graphql/query/clients';
import { useSelector, useDispatch } from 'react-redux';
import { ToastAction } from '@/app/redux/toastify/toastSlice';

const validationSchema = yup.object().shape({
    clientName: yup.string().required("Client Name is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    phone: yup.string().required("Phone no. is required").min(10, "Minimum 10 number must"),
    goldDigger: yup.string().required("GoldDigger is required"),
});

// const initialValues = {
//     clientName: "",
//     email: "",
//     goldDigger: "",
//     phone: ""
// }

const Client = () => {
    const dispatch = useDispatch();
    let toastify = useSelector(state => state?.toastify);
    console.log("toastify", toastify);
    const [modelOpen, setModelOpen] = React.useState(false);
    const [initialValues, setInitialValues] = React.useState({
        clientName: "",
        email: "",
        goldDigger: "",
        phone: ""
    });
    const handleOpen = () => setModelOpen(true);
    const handleClose = () => setModelOpen(false);

    const { handleSubmit, control, reset, setError, clearErrors } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues
    });

    useEffect(() => {
        reset(initialValues);
    }, [initialValues])

    useEffect(() => {
        if (!modelOpen) {
            setInitialValues({
                clientName: "",
                email: "",
                goldDigger: "",
                phone: ""
            })
        }
    }, [modelOpen])

    const [addClient, { data: clientData, loading }] = useMutation(CREATE_CLIENT, {
        refetchQueries: [{ query: GET_CLIENTS }],
        awaitRefetchQueries: true
    })

    const [editClient, { data: editedClientData, loading: editedClientLoading }] = useMutation(UPDATE_CLIENT, {
        refetchQueries: [{ query: GET_CLIENTS }],
        awaitRefetchQueries: true
    })

    const onSubmit = async (data) => {
        try {
            let response;
            if (initialValues && initialValues?.clientName && initialValues?.email && initialValues?.phone) {
                response = await editClient({
                    variables: {
                        clientId: initialValues?.clientId,
                        clientName: data?.clientName,
                        email: data?.email,
                        goldDigger: data?.goldDigger,
                        phone: Number(data?.phone)
                    }
                })
                dispatch(
                    ToastAction({
                        message: response?.data?.editClient,
                        severity: 'success'
                    })
                )
            }
            else {
                response = await addClient({
                    variables: {
                        clientName: data?.clientName,
                        email: data?.email,
                        goldDigger: data?.goldDigger,
                        phone: Number(data?.phone)
                    }
                })
                dispatch(
                    ToastAction({
                        message: response?.data?.registerClient,
                        severity: 'success'
                    })
                )
            }
            reset();
            setModelOpen(false);
        } catch (error) {
            dispatch(
                ToastAction({
                    message: error?.message || "Some thing wrong",
                    severity: 'error'
                })
            )
        }
    };

    const modalheading = (
        <Typography id="client-modal-title" variant="h5" component="h2" sx={{ marginBottom: '22px' }}>
            Client
        </Typography>
    )
    const modalBody = (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid2 container spacing={2}>
                <CustomTextField label="Client Name" name="clientName" id="clientName" control={control} required />
                <CustomTextField label="Email" name="email" id="email" control={control} required />
                <CustomNumberField label="Phone" name="phone" id="phone" control={control} required setError={setError} clearErrors={clearErrors} />
                <CustomSelectFiled label="GoldDigger" name="goldDigger" id="goldDigger" control={control} required options={[
                    "YES", "NO"
                ]} />
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <Button variant='contained' type="submit">
                        Submit
                    </Button>
                </Box>
            </Grid2>
        </form>
    )

    return (
        <Box>
            <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>
                Client
            </Button>
            {modelOpen &&
                <ModalPopup modelOpen={modelOpen} handleOpen={handleOpen} handleClose={handleClose} heading={modalheading} body={modalBody} />
            }
            <Box sx={{ marginTop: '22px' }}>
                <ClientsRows clientData={clientData} setModelOpen={setModelOpen} modelOpen={modelOpen} initialValues={initialValues} setInitialValues={setInitialValues} />
            </Box>
        </Box>
    )
}

export default Client
