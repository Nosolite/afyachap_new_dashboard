import { Box, Button } from '@mui/material';
import React from 'react'
import { postRequest } from '../../services/api-service';
import { publishUnpublishContentUrl } from '../../seed/url';
import { useSelector } from 'react-redux';

function ContentCreationPublish(props) {
  const {
    steps,
    activeStep,
    handleBack,
    handleNext,
    handleSkip,
    isStepOptional,
  } = props;
  const contentInformation = useSelector((state) => state.ContentInformationReducer)
  const [isSubmitting, setSubmitting] = React.useState(false)

  const publishContent = (handleNext) => {
    postRequest(
      publishUnpublishContentUrl,
      {
        content_id: contentInformation.id,
        publish: contentInformation.is_published === "YES" ? "NO" : "YES",
      },
      (data) => {
        handleNext()
        setSubmitting(false)
      },
      (error) => {
        setSubmitting(false)
      },
    )
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Button
          variant='outlined'
          onClick={() => publishContent(handleNext)}
          disabled={isSubmitting}
        >
          {isSubmitting ?
            "Is publishing..." :
            contentInformation.is_published === "YES" ?
              "Unpublish content" :
              "Publish content"
          }
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {isStepOptional(activeStep) && (
          <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
            Skip
          </Button>
        )}

        <Button onClick={handleNext}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </>
  )
}

export default ContentCreationPublish