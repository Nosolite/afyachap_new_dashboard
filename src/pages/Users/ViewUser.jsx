import React from 'react'
import { DialogContent, Slide, Tab, Tabs, } from '@mui/material'
import { AppDialog, DialogCloseBar } from '../../components/app-dialog';
import { Scrollbar } from '../../components/scrollbar';
import UserInformation from './UserInformation';
import PaymentHistory from './PaymentHistory';
import SharingStatistics from './SharingStatistics';
import BonusHistory from './BonusHistory';
import CheckoutHistory from './CheckoutHistory';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

function ViewUser({ open, handleClose, selected, }) {
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
                title="User Details"
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
                        label="User Information"
                        value={0}
                    />
                    <Tab
                        label="User Payment History"
                        value={1}
                    />
                    <Tab
                        label="Sharing Statistics"
                        value={2}
                    />
                    <Tab
                        label="Bonus History"
                        value={3}
                    />
                    <Tab
                        label="Checkout History"
                        value={4}
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
                        <UserInformation
                            selected={selected}
                        />
                    }
                    {currentTab === 1 &&
                        <PaymentHistory
                            selected={selected}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    }
                    {currentTab === 2 &&
                        <SharingStatistics
                            selected={selected}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    }
                    {currentTab === 3 &&
                        <BonusHistory
                            selected={selected}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    }
                    {currentTab === 4 &&
                        <CheckoutHistory
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

export default ViewUser