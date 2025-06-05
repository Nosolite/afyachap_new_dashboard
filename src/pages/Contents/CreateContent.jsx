import React from 'react'
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide, Step, StepLabel, Stepper, SvgIcon, Typography, useMediaQuery } from '@mui/material'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import ContentCreationForm from './ContentCreationForm';
import ContentCreationCovers from './ContentCreationCovers';
import ContentCreationPublish from './ContentCreationPublish';
import { Scrollbar } from '../../components/scrollbar';
import { CREATE, UPDATE } from '../../utils/constant';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const steps = [
    'Create content',
    'Upload images and videos',
    'Publish content',
];

function CreateContent({ open, handleClose, selected, action, fetcher, contents }) {
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const [activeStep, setActiveStep] = React.useState(action === CREATE ? 0 : 1);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepOptional = (step) => {
        return step === 8;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        action === UPDATE ? fetcher(contents.page) : fetcher(1)
        setActiveStep(0);
        handleClose();
    };

    const contentComponents = [
        <ContentCreationForm
            steps={steps}
            activeStep={activeStep}
            handleBack={handleBack}
            handleNext={handleNext}
            handleSkip={handleSkip}
            isStepOptional={isStepOptional}
        />,
        <ContentCreationCovers
            steps={steps}
            activeStep={activeStep}
            handleBack={handleBack}
            handleNext={handleNext}
            handleSkip={handleSkip}
            isStepOptional={isStepOptional}
        />,
        <ContentCreationPublish
            steps={steps}
            activeStep={activeStep}
            handleBack={handleBack}
            handleNext={handleNext}
            handleSkip={handleSkip}
            isStepOptional={isStepOptional}
        />,
    ]

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            aria-describedby="form-dialog"
            fullWidth={true}
            maxWidth={"lg"}
        >
            <DialogActions>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => {
                        fetcher(contents.page)
                        handleClose()
                    }}
                    aria-label="close"
                >
                    <SvgIcon fontSize='small'>
                        <XMarkIcon />
                    </SvgIcon>
                </IconButton>
            </DialogActions>
            <DialogTitle>
                {`${action} Content`}
            </DialogTitle>
            <DialogContent>
                <Stepper
                    activeStep={activeStep}
                    sx={{ overflow: lgUp ? 'hidden' : 'scroll', mb: 4 }}
                >
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = (
                                <Typography variant="caption">Optional</Typography>
                            );
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Avatar
                                sx={{
                                    backgroundColor: 'transparent',
                                    height: 150,
                                    width: 150,
                                    border: `2px solid #0b6d36`
                                }}
                            >
                                <SvgIcon fontSize="large" sx={{ color: "primary.main", fontSize: 70 }}>
                                    <CheckIcon />
                                </SvgIcon>
                            </Avatar>
                            <Typography variant='h5' sx={{ mt: 4 }}>Content {action}d Successfully</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Done</Button>
                        </Box>
                    </React.Fragment>
                ) : (
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
                        {contentComponents.map((component, index) => {
                            return (
                                <React.Fragment key={index}>
                                    {activeStep === index && component}
                                </React.Fragment>
                            );
                        })}
                    </Scrollbar>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default CreateContent