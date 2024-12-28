import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { GET_CLIENTS, SEARCH_CLIENT } from '@/app/graphql/query/clients';
import { useMutation, useQuery } from '@apollo/client';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FormControl, InputAdornment, Menu, MenuItem, OutlinedInput, TextField } from '@mui/material';
import RowsPagination from '../../common/RowsPagination';
import { DELETE_CLIENT } from '@/app/graphql/mutation/client';
import { ToastAction } from '@/app/redux/toastify/toastSlice';
import { useDispatch } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';

function createData(no, name, email, phone, goldDigger, projects, clientId) {
    return {
        no,
        name,
        email,
        phone,
        goldDigger,
        projects,
        clientId
    };
}

function Row(props) {
    const dispatch = useDispatch();
    const { row, setModelOpen, setInitialValues, refetch } = props;

    const [open, setOpen] = React.useState(false);

    const [deleteClient, { data: deletedClientData, loading }] = useMutation(DELETE_CLIENT, {
        refetchQueries: [{ query: GET_CLIENTS }],
        awaitRefetchQueries: true,
    })

    const fillRecordInModel = (data) => {
        setInitialValues({
            clientName: data?.name,
            email: data?.email,
            goldDigger: data?.goldDigger,
            phone: data?.phone,
            clientId: data?.clientId
        })
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const actionMenuOpen = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleClose();
        fillRecordInModel(row);
        setModelOpen(true);
    }

    const handleDelete = async () => {
        handleClose();
        try {
            let response = await deleteClient({
                variables: {
                    clientId: row?.clientId
                }
            })
            refetch();
            dispatch(
                ToastAction({
                    message: response?.data?.deleteClient,
                    severity: 'success'
                })
            )
        } catch (error) {
            console.log(error);
            dispatch(
                ToastAction({
                    message: error?.message || "Some thing wrong!",
                    severity: 'error'
                })
            )
        }
    }

    const actionMenu = (
        <Menu
            id="ActionMenu-menu"
            anchorEl={anchorEl}
            open={actionMenuOpen}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'ActionMenu-button',
            }}
        >
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
    )

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row?.no}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row?.name}
                </TableCell>
                <TableCell align="right">{row?.email}</TableCell>
                <TableCell align="right">{row?.phone}</TableCell>
                <TableCell align="right">{row?.goldDigger}</TableCell>
                <TableCell align="right">
                    <IconButton onClick={(e) => {
                        handleClick(e);
                    }}>
                        <MoreVertIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Project
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>ProjectName</TableCell>
                                        <TableCell>Manager Name</TableCell>
                                        <TableCell>Manager Email</TableCell>
                                        <TableCell align="right">Language</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                        <TableCell align="right">Start Date</TableCell>
                                        <TableCell align="right">End Date</TableCell>
                                        <TableCell align="right">Submit Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row?.projects?.map((project, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{project?.projectName}</TableCell>
                                            <TableCell align="right">{project?.projectManager?.firstName + " " + project?.projectManager?.lastName}</TableCell>
                                            <TableCell align="right">{project?.projectManager?.email}</TableCell>
                                            <TableCell align="right">
                                                {project?.language === "" ? "-" : project?.language}
                                            </TableCell>
                                            <TableCell align="right">
                                                {project?.status === "" ? "-" : project?.status}
                                            </TableCell>
                                            <TableCell align="right">
                                                {project?.startDate === null ? "-" : new Date(project?.startDate)?.toLocaleDateString()}
                                            </TableCell>
                                            <TableCell align="right">
                                                {project?.endDate === null ? "-" : new Date(project?.endDate)?.toLocaleDateString()}
                                            </TableCell>
                                            <TableCell align="right">{project?.submitDate === null ? "-" : new Date(project?.submitDate)?.toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            {
                actionMenu
            }
        </React.Fragment>
    );
}

export default function ClientsRows({ initialValues, setInitialValues, clientData, setModelOpen, modelOpen }) {

    const [page, setPage] = React.useState(1);
    const [searchValue, setSerachValue] = React.useState("");
    const [clientDatas, setClientDatas] = React.useState([]);

    const { data: searchData, loading: searchLoading, refetch: searchRefech } = useQuery(SEARCH_CLIENT, {
        variables: { search: searchValue, page: page, limit: 10 },
    });

    const { data, loading, error, refetch } = useQuery(GET_CLIENTS, {
        variables: { page: page, limit: 10 },
    });

    console.log("searchData", searchData);

    useEffect(() => {
        let timer = setTimeout(() => {
            if (searchData) {
                setClientDatas(searchData?.searchClients)
            }
            else {
                setClientDatas(data?.clients)
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [searchData])

    useEffect(() => {
        if (data?.clients) {
            setClientDatas(data?.clients)
        }
    }, [data])

    console.log("data", data);

    useEffect(() => {
        refetch();
        searchRefech();
    }, [clientData, page])

    const rows = clientDatas?.clients?.map((clientInfo, index) => {
        return createData(index + 1, clientInfo?.clientName, clientInfo?.email, clientInfo?.phone, clientInfo?.goldDigger, clientInfo?.projects, clientInfo?.id)
    })

    return (
        <Box>
            <TableContainer component={Paper}>
                <TextField
                    // label="With normal TextField"
                    id="client-searchbar"
                    type='search'
                    onChange={(e) => setSerachValue(e?.target?.value?.trim())}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment sx={{
                                ".MuiInputAdornment-root": {
                                    marginTop: "0px"
                                }
                            }} position="start"><SearchIcon /></InputAdornment>,
                        },
                    }}
                    variant="filled"
                    fullWidth
                />
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>No.</TableCell>
                            <TableCell>Client Name</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Phone</TableCell>
                            <TableCell align="right">Gold Digger</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!rows?.length ? (
                            <TableRow>
                                <TableCell>
                                    no rows
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows?.map((row, index) => (
                                <Row key={row?.name} row={row} index={index} setModelOpen={setModelOpen} setInitialValues={setInitialValues} refetch={refetch} />
                            ))
                        )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <RowsPagination page={page} setPage={setPage} totalPages={clientDatas?.totalPages} />
        </Box >
    );
}