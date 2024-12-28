"use client"
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import Cookies from 'js-cookie';
import { Box, Button, Grid2, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import ModalPopup from '../../common/ModalPopup';
import { useForm } from 'react-hook-form';
import { CustomDatePicker, CustomMultiSelectFiled, CustomSelectFiled, CustomTextField } from '../../common/CustomField';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import ProjectsRows from './ProjectsRows';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PROJECT, UPDATE_PROJECT } from '@/app/graphql/mutation/project';
import { GET_CLIENTS } from '@/app/graphql/query/clients';
import { GET_PROJECTS } from '@/app/graphql/query/projects';
import { ToastAction } from '@/app/redux/toastify/toastSlice';
import { useDispatch } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import ClearIcon from "@mui/icons-material/Clear";

const validationSchema = yup.object().shape({
    projectName: yup.string().required("Project Name is required"),
    language: yup.string().required("Language is required"),
    client: yup
        .array()
        .min(1, "At least one client is required") // Validation for multi-select
        .required("Client is required"),
    projectManager: yup.string().required("Project Manager Name is required"),
    status: yup.string().required("Status is required")
});

const statusOptions = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PAUSED']
const Project = () => {
    const dispatch = useDispatch();
    const manager = JSON.parse(Cookies.get("user"));
    const [modelOpen, setModelOpen] = React.useState(false);
    const [clientsValue, setClientsValue] = React.useState([]);
    const [statusFiltering, setStatusFiltering] = React.useState("");
    const [startDateFiltering, setStartDateFiltering] = React.useState("");
    const [initialValues, setInitialValues] = useState({
        projectName: "",
        language: "",
        client: [],
        projectManager: manager?.firstName + " " + manager?.lastName,
        startDate: null,
        endDate: null,
        submitDate: null,
        status: ""
    })
    const [clientOptions, setClientOptions] = React.useState([]);
    const handleOpen = () => setModelOpen(true);
    const handleClose = () => {
        setModelOpen(false);
        setInitialValues({
            projectName: "",
            language: "",
            client: [],
            projectManager: manager?.firstName + " " + manager?.lastName,
            startDate: null,
            endDate: null,
            submitDate: null,
            status: ""
        })
        reset({
            projectName: "",
            language: "",
            client: [],
            projectManager: manager?.firstName + " " + manager?.lastName,
            startDate: null,
            endDate: null,
            submitDate: null,
            status: ""
        });
        setClientsValue([]);
    };

    console.log("statusFiltering", statusFiltering);
    console.log("startDateFiltering", startDateFiltering);

    const { handleSubmit, control, reset, setError, clearErrors, setValue, watch } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues
    });

    const { data: clientData, loading: clientLoading } = useQuery(GET_CLIENTS);


    useEffect(() => {
        let options = clientData?.clients?.clients?.map((client) => ({
            key: client?.clientName + " | " + client?.email,
            id: client?.id
        }))
        setClientOptions(options)
    }, [clientData])

    const [addProject, { data: projectData, loading }] = useMutation(CREATE_PROJECT, {
        refetchQueries: [{ query: GET_PROJECTS }],
        awaitRefetchQueries: true
    })

    const [editProject, { data: editProjectData, loading: editProjectLoading }] = useMutation(UPDATE_PROJECT, {
        refetchQueries: [{ query: GET_PROJECTS }],
        awaitRefetchQueries: true
    })

    const onSubmit = async (data) => {
        // console.log("data", data, clientsValue?.map((client) => client?.id), initialValues);
        try {
            let response;
            if (initialValues && initialValues?.projectName && initialValues?.language && initialValues?.status) {
                response = await editProject({
                    variables: {
                        projectName: data?.projectName,
                        language: data?.language,
                        clients: clientsValue?.map((client) => client?.id),
                        projectManager: manager?.id,
                        startDate: data?.startDate?.$d,
                        endDate: data?.endDate?.$d,
                        submitDate: data?.submitDate?.$d,
                        status: data?.status,
                        projectId: initialValues?.projectId
                    }
                })
                dispatch(
                    ToastAction({
                        message: response?.data?.editProject,
                        severity: 'success'
                    })
                )
                handleClose();
            }
            else {
                response = await addProject({
                    variables: {
                        projectName: data?.projectName,
                        language: data?.language,
                        clients: clientsValue?.map((client) => client?.id),
                        projectManager: manager?.id,
                        startDate: data?.startDate?.$d,
                        endDate: data?.endDate?.$d,
                        submitDate: data?.submitDate?.$d,
                        status: data?.status
                    }
                })
                dispatch(
                    ToastAction({
                        message: response?.data?.registerProject,
                        severity: 'success'
                    })
                )
            }
            handleClose();
        } catch (error) {
            dispatch(
                ToastAction({
                    message: error?.message,
                    severity: 'error'
                })
            )
        }
    };

    const modalheading = (
        <Typography id="client-modal-title" variant="h5" component="h2" sx={{ marginBottom: '22px' }}>
            Project
        </Typography>
    )

    const modalBody = (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid2 container spacing={2}>
                <CustomTextField label="Project Name" name="projectName" id="projectName" control={control} required />
                <CustomSelectFiled label="Language" name="language" id="language" control={control} required options={[
                    "React.js", "Node.js", "PHP", "Python"
                ]} />
                <CustomMultiSelectFiled label="Client" name="client" id="client" control={control} required options={clientOptions} setClientsValue={setClientsValue} clientsValue={clientsValue} />
                <CustomTextField label="Project Manager" name="projectManager" id="projectManager" control={control} required disabled />
                <CustomDatePicker name="startDate" label="Start Date" control={control} required />
                <CustomDatePicker name="endDate" label="End Date" control={control} required />
                <CustomDatePicker name="submitDate" label="Submit Date" control={control} required />
                <CustomSelectFiled label="Status" name="status" id="status" control={control} required options={['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PAUSED']} />
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <Button variant='contained' type="submit">
                        Submit
                    </Button>
                </Box>
            </Grid2>
        </form>
    )

    function ClearableSelect({ statusOptions }) {

        const handleClear = () => {
            setStatusFiltering("")
        };

        const handleChange = (event) => {
            setStatusFiltering(event?.target?.value)
        };

        return (
            <TextField
                select
                id="status"
                value={statusFiltering}
                onChange={handleChange}
                fullWidth
                label="Status"
                InputProps={{
                    endAdornment: statusFiltering && (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClear} size="small">
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            >
                {statusOptions?.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
        );
    }


    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />}>
                    Project
                </Button>
                <Stack direction={"row"} spacing={2}>
                    <ClearableSelect
                        statusOptions={statusOptions}
                    />
                    {/* <FormControl fullWidth>
                        <InputLabel id={"status"}>Status</InputLabel>
                        <Select
                            id="status"
                            sx={{
                                width: "100%"
                            }}
                            slotProps={{
                                field: {
                                    clearable: true,
                                },
                            }}
                            onChange={(e) => setStatusFiltering(e.target?.value)}
                            defaultValue={"ALL"}
                            fullWidth label="Status" name="status">
                            {statusOptions?.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                        >
                            <DesktopDatePicker
                                sx={{ width: "100%" }}
                                label={"Start Date"}
                                onChange={(date) => setStartDateFiltering(new Date(date?.$d)?.toLocaleDateString())}
                                slotProps={{
                                    field: {
                                        clearable: true,
                                    },
                                }}
                            />

                        </Box>
                    </LocalizationProvider>
                </Stack>
            </Box>
            {modelOpen &&
                <ModalPopup modelOpen={modelOpen} handleOpen={handleOpen} handleClose={handleClose} heading={modalheading} body={modalBody} />
            }
            <Box sx={{ marginTop: '22px' }}>
                <ProjectsRows startDateFiltering={startDateFiltering} statusFiltering={statusFiltering} setClientsValue={setClientsValue} reset={reset} projectData={projectData} setModelOpen={setModelOpen} setInitialValues={setInitialValues} manager={manager} setValue={setValue} />
            </Box>
        </Box>
    )
}

export default Project
