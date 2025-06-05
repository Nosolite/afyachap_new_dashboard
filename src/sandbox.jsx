import React from 'react'
import { AppBar, Avatar, Card, CardContent, CardHeader, Container, Dialog, DialogContent, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, SvgIcon, Table, TableBody, TableCell, TableRow, Toolbar, Typography } from '@mui/material'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import CogIcon from '@heroicons/react/24/outline/CogIcon';
import { Scrollbar } from '../../components/scrollbar';
import { IOSSwitch } from '../../components/IOSSwitch';

function ViewSecretary({ open, handleClose, selected }) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen
            PaperProps={{
                style: {
                    boxShadow: "none"
                },
            }}
        >
            <DialogContent>
                <AppBar
                    id='appbar'
                    sx={{
                        position: 'relative',
                    }}
                    color='transparent'
                    elevation={0}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => {
                                handleClose()
                            }}
                            aria-label="close"
                        >
                            <SvgIcon fontSize='small'>
                                <XMarkIcon />
                            </SvgIcon>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container
                    maxWidth="xl"
                >
                    <Typography variant="h4" sx={{ mb: 4 }}>
                        View Secretary
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <Card sx={{ height: "75vh" }}>
                                <CardHeader
                                    avatar={
                                        <Avatar alt="Remy Sharp" src="https://www.users.afyachap.com/users/profileImages/female.png" />
                                    }
                                    title="Mwasumbi Sejoka"
                                    subheader="September 14, 2016"
                                />
                                <Scrollbar
                                    sx={{
                                        width: "100%",
                                        height: '75vh',
                                        px: 2,
                                        '& .simplebar-content': {
                                            height: '75vh'
                                        },
                                        '& .simplebar-scrollbar:before': {
                                            background: 'neutral.400'
                                        }
                                    }}
                                >
                                    <CardContent
                                        sx={{ mt: -5, }}
                                    >
                                        <Table
                                            sx={{
                                                '& th, & td': {
                                                    borderBottom: 'none',
                                                },
                                            }}
                                        >
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Email</TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={"bold"}>
                                                            john@doe.com
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Phone Number</TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={"bold"}>
                                                            +255747483834
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Date Of Birth</TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={"bold"}>
                                                            7/4/1980
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Age</TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={"bold"}>
                                                            43 Year(s)
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Gender</TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={"bold"}>
                                                            MALE
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Scrollbar>
                            </Card>
                        </Grid>
                        <Grid item md={6}>
                            <Card sx={{ height: "75vh" }}>
                                <CardHeader
                                    title="Tasks"
                                />
                                <Scrollbar
                                    sx={{
                                        width: "100%",
                                        height: '75vh',
                                        '& .simplebar-content': {
                                            height: '75vh'
                                        },
                                        '& .simplebar-scrollbar:before': {
                                            background: 'neutral.400'
                                        }
                                    }}
                                >
                                    <CardContent
                                        sx={{ mt: -5 }}
                                    >
                                        <List
                                            disablePadding
                                            sx={{ width: '100%', maxWidth: "100%", bgcolor: 'transparent', mb: 8 }}
                                        >
                                            <ListItem
                                                alignItems="flex-start"
                                                secondaryAction={
                                                    <IOSSwitch />
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <SvgIcon fontSize='small'>
                                                            <CogIcon />
                                                        </SvgIcon>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary="Activate User"
                                                    secondary="User will be able to activate or deactivate user"
                                                />
                                            </ListItem>
                                            <ListItem
                                                alignItems="flex-start"
                                                secondaryAction={
                                                    <IOSSwitch checked />
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <SvgIcon fontSize='small'>
                                                            <CogIcon />
                                                        </SvgIcon>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary="Activate Doctor"
                                                    secondary="User will be able to activate or deactivate doctor"
                                                />
                                            </ListItem>
                                            <ListItem
                                                alignItems="flex-start"
                                                secondaryAction={
                                                    <IOSSwitch />
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <SvgIcon fontSize='small'>
                                                            <CogIcon />
                                                        </SvgIcon>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary="Activate Administrator"
                                                    secondary="User will be able to activate or deactivate administrator"
                                                />
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Scrollbar>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </DialogContent>
        </Dialog>
    )
}

export default ViewSecretary