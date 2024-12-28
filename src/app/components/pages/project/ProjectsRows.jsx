import React, { useEffect } from 'react';
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
import { useMutation, useQuery } from '@apollo/client';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { InputAdornment, Menu, MenuItem, TextField } from '@mui/material';
import { GET_PROJECTS, SEARCH_PROJECTS } from '@/app/graphql/query/projects';
import RowsPagination from '../../common/RowsPagination';
import { DELETE_PROJECT } from '@/app/graphql/mutation/project';
import { ToastAction } from '@/app/redux/toastify/toastSlice';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import SearchIcon from '@mui/icons-material/Search';

function createData(projectId, projectName, language, startDate, endDate,submitDate, status, projectManager, clients) {
    return {
        projectId,
        projectName,
        language,
        startDate,
        endDate,
        submitDate,
        status,
        projectManager,
        clients
    };
}

const getManager = () => {
    let user = JSON.parse(Cookies.get("user"))
    return user;
}

function Row(props) {
    const { row, setModelOpen, setInitialValues, index, refetch, setValue, reset, setClientsValue, } = props;
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const actionMenuOpen = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const manager = getManager();

    // console.log("manager====", JSON.parse(Cookies.get("user")));

    const [deleteProject, { data: deletedProjectData, loading, error }] = useMutation(DELETE_PROJECT, {
        refetchQueries: [{ query: GET_PROJECTS }],
        awaitRefetchQueries: true,
    })

    // console.log(row?.clients?.map((client) => client?.clientName + " | " + client?.email));
    console.log("row====", row);

    let clientData = row?.clients?.map((client) => {
        return {
            key: client?.clientName + " | " + client?.email,
            id: client?.id
        }
    })
    // console.log("clientData", clientData);


    // row?.clients?.map((client) => client?.clientName + " | " + client?.email) ||
    // row?.clients?.map((client) => client?.clientName + " | " + client?.email) || []
    const handleEdit = () => {
        handleClose();
        setClientsValue(clientData);
        // setValue("client", clientData)
        reset({
            projectName: row?.projectName,
            language: row?.language,
            client: clientData,
            projectManager: manager?.firstName + " " + manager?.lastName,
            startDate: row?.startDate?.$d,
            endDate: row?.endDate?.$d,
            submitDate: row?.submitDate?.$d,
            status: row?.status
        })
        setInitialValues({
            projectName: row?.projectName,
            language: row?.language,
            client: clientData,
            projectManager: manager?.id,
            startDate: row?.startDate?.$d,
            endDate: row?.endDate?.$d,
            submitDate: row?.submitDate?.$d,
            status: row?.status,
            projectId: row?.projectId
        })
        setModelOpen(true);
    }

    const handleDelete = async () => {
        handleClose();
        try {
            let response = await deleteProject({
                variables: {
                    projectId: row?.projectId
                }
            })
            refetch();
            dispatch(
                ToastAction({
                    message: response?.data?.deleteProject,
                    severity: 'success'
                })
            )
        } catch (error) {
            dispatch(
                ToastAction({
                    message: error?.message,
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
                    {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                    {row?.projectName}
                </TableCell>
                <TableCell align="right">{row?.language}</TableCell>
                <TableCell align="right">{row?.status}</TableCell>
                <TableCell align="right">{row?.startDate === null ? "-" : new Date(row?.startDate)?.toLocaleDateString()}</TableCell>
                <TableCell align="right">{row?.endDate === null ? "-" : new Date(row?.endDate)?.toLocaleDateString()}</TableCell>
                <TableCell align="right">{row?.submitDate === null ? "-" : new Date(row?.submitDate)?.toLocaleDateString()}</TableCell>
                <TableCell align="right">
                    <IconButton onClick={handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Project Manager
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Manager Name</TableCell>
                                        <TableCell>Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row?.projectManager?.email}>
                                        <TableCell component="th" scope="row">
                                            1
                                        </TableCell>
                                        <TableCell>{row?.projectManager?.firstName + " " + row?.projectManager?.lastName}</TableCell>
                                        <TableCell>{row?.projectManager?.email}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Clients
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Client Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>GoldDigger</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row?.clients?.map((client, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{client?.clientName}</TableCell>
                                            <TableCell>{client?.email}</TableCell>
                                            <TableCell>{client?.phone}</TableCell>
                                            <TableCell>{client?.goldDigger === true ? "Yes" : "No"}</TableCell>
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

export default function ProjectsRows({ startDateFiltering, statusFiltering, projectData, setModelOpen, setInitialValues, manager, setValue, reset, setClientsValue }) {

    const [page, setPage] = React.useState(1);
    const [searchValue, setSerachValue] = React.useState("");
    const [projectDatas, setProjectDatas] = React.useState({});

    const { data: searchData, loading: searchLoading, refetch: searchRefetch } = useQuery(SEARCH_PROJECTS, {
        variables: { search: searchValue, page: page, limit: 10 },
    });

    let { data, loading, error, refetch } = useQuery(GET_PROJECTS, {
        variables: { page: page, limit: 10 },
    });

    console.log("data", data);

    useEffect(() => {
        let timer = setTimeout(() => {
            if (searchData) {
                setProjectDatas({ ...searchData?.searchProjects })
            }
            else {
                setProjectDatas({ ...data?.projects })
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [searchData])

    useEffect(() => {
        searchRefetch();
        if (data?.projects) {
            setProjectDatas({ ...data?.projects })
        }
    }, [data])

    useEffect(() => {
        refetch();
        searchRefetch();
    }, [projectData, page])

    useEffect(() => {
        function filtering() {
            let filterableData = data?.projects?.projects;
            if (statusFiltering) {
                filterableData = data?.projects?.projects?.filter((project) => {
                    return project?.status === statusFiltering
                }
                )
            }
            if (startDateFiltering !== "Invalid Date" && startDateFiltering) {
                filterableData = data?.projects?.projects?.filter((project) => {
                    return new Date(project?.startDate)?.toLocaleDateString() === startDateFiltering
                }
                )
            }
            if (statusFiltering && startDateFiltering !== "Invalid Date" && startDateFiltering) {
                filterableData = data?.projects?.projects?.filter((project) => {
                    return project?.status === statusFiltering && new Date(project?.startDate)?.toLocaleDateString() === startDateFiltering
                }
                )
            }
            console.log("filterableData", filterableData);

            setProjectDatas(prev => ({
                ...prev,
                projects: Array.isArray(filterableData) ? [...filterableData] : [],
            }))
        }

        filtering();
    }, [statusFiltering, startDateFiltering])

    const rows = projectDatas?.projects?.map((projectInfo, index) => {
        return createData(projectInfo?.id, projectInfo?.projectName, projectInfo?.language, projectInfo?.startDate, projectInfo?.endDate,projectInfo?.submitDate, projectInfo?.status, projectInfo?.projectManager, projectInfo?.clients)
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
                            <TableCell>Project Name</TableCell>
                            <TableCell align="right">Language</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Start Date</TableCell>
                            <TableCell align="right">End Date</TableCell>
                            <TableCell align="right">Submit Date</TableCell>
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
                                <Row setClientsValue={setClientsValue} reset={reset} setValue={setValue} key={row?.projectName} index={index} row={row} setModelOpen={setModelOpen} setInitialValues={setInitialValues} manager={manager} refetch={refetch} searchRefetch={searchRefetch} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <RowsPagination page={page} setPage={setPage} totalPages={projectDatas?.totalPages} />
        </Box>
    );
}