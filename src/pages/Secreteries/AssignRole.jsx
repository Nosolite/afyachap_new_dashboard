import React from 'react'
import { Autocomplete, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, Slide, TextField, Typography, } from '@mui/material'
import { getAllUsersUrl } from '../../seed/url'
import { authPostRequest } from '../../services/api-service'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

function AssignRole({
    open,
    handleClose,
    isSubmitting,
    handleAssignRole,
    userId,
    setUserId,
}) {
    const [isLoading, setIsLoading] = React.useState(false)
    const [options, setOptions] = React.useState([])
    const [value, setValue] = React.useState("")
    const [error, setError] = React.useState("")

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            // onClose={handleClose}
            aria-describedby="form-dialog"
            fullWidth={true}
            maxWidth={"md"}
        >
            <DialogTitle>Assign Role</DialogTitle>
            <DialogContent>
                <Autocomplete
                    options={options}
                    getOptionLabel={(option) =>
                        `${option.firstName.toString()} ${option.secondName.toString()}`
                    }
                    filterOptions={(x) => x}
                    noOptionsText={isLoading ? "Loading..." : "No items"}
                    includeInputInList
                    filterSelectedOptions
                    onChange={(event, value) => {
                        if (value) {
                            setUserId(value.id)
                        }
                    }}
                    renderOption={(props, option) => {

                        return (
                            <li {...props}>
                                <List sx={{ width: "100%" }}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar src={option.profileImage} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${option.firstName} ${option.secondName}`}
                                        />
                                    </ListItem>
                                </List>
                            </li>
                        )
                    }}
                    onInputChange={() => setOptions([])}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={`Search user`}
                            color='secondary'
                            fullWidth
                            margin='normal'
                            value={value}
                            onChange={(event) => {
                                setValue(event.target.value)
                                authPostRequest(
                                    getAllUsersUrl,
                                    { query: event.target.value },
                                    (data) => {
                                        setOptions(data.results)
                                        setIsLoading(false)
                                    },
                                    (error) => {
                                        error?.response?.data?.message && setError(error.response.data.message[0])
                                        setIsLoading(false)
                                    }
                                )
                            }}
                            onFocus={(event) => {
                                setValue(event.target.value)
                                authPostRequest(
                                    getAllUsersUrl,
                                    { query: event.target.value },
                                    (data) => {
                                        setOptions(data.results)
                                        setIsLoading(false)
                                    },
                                    (error) => {
                                        error?.response?.data?.message && setError(error.response.data.message[0])
                                        setIsLoading(false)
                                    }
                                )
                            }}
                        />
                    )}
                />
                <Typography
                    color="error"
                    sx={{
                        mt: 2,
                    }}
                >
                    {error}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button
                    disabled={isSubmitting}
                    onClick={() => {
                        userId > 0 && handleAssignRole()
                    }}
                >
                    {isSubmitting ?
                        "Loading..." :
                        'Assign Role'
                    }
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AssignRole