import React from 'react'
import { DialogContent, Slide, Tab, Tabs, } from '@mui/material'
import { AppDialog, DialogCloseBar } from '../../components/app-dialog';
import { Scrollbar } from '../../components/scrollbar';
import AuthorInformation from './AuthorInformation';
import AuthorCheckouts from './AuthorCheckouts';
import AuthorPerformance from './AuthorPerformance';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

function ViewAuthor({ open, handleClose, selected }) {
    const [isLoading, setIsLoading] = React.useState(false)
    const [currentTab, setCurrentTab] = React.useState(0)

    const handleTabChange = React.useCallback(
        (event, value) => {
            setCurrentTab(value)
        },
        []
    )

    return (
        <AppDialog
            open={open}
            TransitionComponent={Transition}
            aria-describedby="form-dialog"
            fullWidth={true}
            maxWidth={"md"}
        >
            <DialogCloseBar
                onClose={handleClose}
                iconSize="small"
                title="Author"
            />
            <DialogContent>
                <Tabs
                    onChange={handleTabChange}
                    value={currentTab}
                    sx={{ mt: { xs: 0, md: -4 }, ml: { xs: 0, md: 3 }, mb: { xs: 1, md: 3 } }}
                    variant='scrollable'
                    scrollButtons="auto"
                >
                    <Tab
                        label="Author Information"
                        value={0}
                    />
                    <Tab
                        label="Author checkout history"
                        value={1}
                    />
                    <Tab
                        label="Author performance"
                        value={2}
                    />
                </Tabs>
                <Scrollbar
                    sx={{
                        width: "100%",
                        height: '100%',
                        px: 2,
                        '& .simplebar-content': {
                            height: '100%'
                        },
                        '& .simplebar-scrollbar:before': {
                            background: 'neutral.400'
                        }
                    }}
                >
                    {currentTab === 0 &&
                        <AuthorInformation
                            selected={selected}
                        />
                    }
                    {currentTab === 1 &&
                        <AuthorCheckouts
                            selected={selected}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    }
                    {currentTab === 2 &&
                        <AuthorPerformance
                            selected={selected}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    }
                </Scrollbar>
            </DialogContent>
        </AppDialog>
    )
}

export default ViewAuthor