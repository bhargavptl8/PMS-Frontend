"use client"
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Avatar, Menu, MenuItem, Badge, Stack, Button } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRouter } from 'next/navigation';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import Cookies from 'js-cookie';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { GET_NOTIFICATION } from '@/app/graphql/query/notification';
import { useQuery } from '@apollo/client';
import DeleteIcon from '@mui/icons-material/Delete';

const drawerWidth = 240;

// function stringAvatar(name) {
//     return {
//         children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
//     };
// }

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const sideBar = [
    {
        name: "Client",
        path: "/dashboard",
        icon: <PeopleIcon />
    },
    {
        name: "Project",
        path: "/dashboard/projects",
        icon: <AccountTreeIcon />
    }
]

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

const getUserData = () => {
    const cookieValue = Cookies.get("user"); // Get the cookie value
    return cookieValue ? JSON.parse(cookieValue) : {}; // Parse only if it exists
};

export default function MiniDrawer({ children }) {
    const theme = useTheme();
    const router = useRouter()
    const [open, setOpen] = React.useState(false);
    const userData = getUserData();
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const [notifyMenu, setNotifyMenu] = React.useState(null);
    const openNotify = Boolean(notifyMenu);

    function handleNotifyClick(event) {
        setNotifyMenu(event.currentTarget);
    }
    const handleNotifyClose = () => {
        setNotifyMenu(null);
    };

    const [allNotificationData, setAllNotificationData] = React.useState([]);

    let { data: notificationData, loading, error, refetch } = useQuery(GET_NOTIFICATION, {
        variables: {
            managerId: userData?.id
        },
    });

    React.useEffect(() => {
        if (notificationData?.notifications?.length) {
            setAllNotificationData(notificationData?.notifications)
        }
    }, [notificationData])

    console.log("allNotificationData", allNotificationData);


    const [accountMenuAnchorEl, setAccountMenuAnchorEl] = React.useState(null);
    const accountMenuOpen = Boolean(accountMenuAnchorEl);
    const handleClick = (event) => {
        setAccountMenuAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAccountMenuAnchorEl(null);
    };

    const logout = () => {
        localStorage.clear();
        Cookies.remove('authToken', { path: '/' });
        Cookies.remove('user', { path: '/' });
        handleClose();
        router.push("/login");
        window.location.reload();
    }

    const acoountMenu = (
        <Menu
            anchorEl={accountMenuAnchorEl}
            id="account-menu"
            open={accountMenuOpen}
            onClose={handleClose}
            // onClick={handleClose}
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem disableRipple sx={{ cursor: 'default', "&:hover": "#fff!important" }}>
                <ListItemIcon>
                    <PersonIcon fontSize="small" />
                </ListItemIcon>
                {userData?.firstName?.charAt(0)?.toUpperCase() + userData?.firstName?.substring(1, userData?.firstName?.length) + " " + userData?.lastName?.charAt(0)?.toUpperCase() + userData?.lastName?.substring(1, userData?.firstName?.length)}
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    )

    const useFullName = userData
        ? `${userData?.firstName?.charAt(0)?.toUpperCase() || ''}${userData?.lastName?.charAt(0)?.toUpperCase() || ''}`
        : '';

    const notificationMenu = (

        <Menu
            id="basic-menu"
            anchorEl={notifyMenu}
            open={openNotify}
            onClose={handleNotifyClose}
        // sx={{width : "350px"}}
        >
            {
                allNotificationData?.map((projectNotification) => {
                    console.log("projectNotification", projectNotification)
                    return projectNotification?.projects?.map((project) => {
                        console.log("project", project)
                        return <>
                            <MenuItem disableRipple sx={{ cursor: 'default', "&:hover": "#fff!important" }}>
                                <List disablePadding>
                                    <ListItem alignItems="center" disablePadding>
                                        <Stack>
                                            <Typography variant="body1" display="block" >Project Name: {project?.projectName}</Typography>
                                            <Typography variant="body1" display="block" >language: {project?.language}</Typography>
                                            <Typography variant="body1" display="block" >Submit Date: {new Date(project?.submitDate)?.toLocaleDateString()}</Typography>
                                        </Stack>
                                        <ListItemIcon sx={{ minWidth: "42px!important" }}>
                                            <IconButton>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemIcon>
                                    </ListItem>
                                </List>
                            </MenuItem>
                            <Divider component="li" />
                        </>
                    })
                })
            }
        </Menu>

    )

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Project Management System
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                    </Box>
                    {/* <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                        onClick={handleNotifyClick}
                    >
                        <Badge badgeContent={17} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton> */}
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            {
                                userData && (
                                    <Avatar sx={{ width: 35, height: 35 }}>{useFullName}</Avatar>
                                )
                            }
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Typography variant="h6" noWrap component="div">
                        PMS
                    </Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {sideBar?.map((text) => (
                        <ListItem key={text?.name} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                onClick={() => router.push(text?.path)}
                                sx={[
                                    {
                                        minHeight: 48,
                                        px: 2.5,
                                    },
                                    open
                                        ? {
                                            justifyContent: 'initial',
                                        }
                                        : {
                                            justifyContent: 'center',
                                        },
                                ]}
                            >
                                <ListItemIcon
                                    sx={[
                                        {
                                            minWidth: 0,
                                            justifyContent: 'center',
                                        },
                                        open
                                            ? {
                                                mr: 3,
                                            }
                                            : {
                                                mr: 'auto',
                                            },
                                    ]}
                                >
                                    {text?.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={text?.name}
                                    sx={[
                                        open
                                            ? {
                                                opacity: 1,
                                            }
                                            : {
                                                opacity: 0,
                                            },
                                    ]}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
            {acoountMenu}
            {notificationMenu}
        </Box >
    );
}
