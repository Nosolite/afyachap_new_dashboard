import React from 'react'
import { Avatar, Button, CircularProgress, IconButton, InputAdornment, OutlinedInput, SvgIcon, Typography, useMediaQuery } from '@mui/material'
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
// import { matchIsNumeric } from '../../handlers/validation-functions';

function Login() {
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const navigate = useNavigate()
    const auth = useAuth()
    const [display, setDisplay] = React.useState('phoneNumber')
    const [phoneNumber, setPhoneNumber] = React.useState('')
    const [otp, setOtp] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)

    const handleChange = (newValue) => {
        setOtp(newValue)
    }

    const handleComplete = async (value) => {
        const phone = phoneNumber.toString().slice(-9)
        await auth.validatePhone(phone, value, setIsLoading, navigate)
    }

    // const validateChar = (value, index) => {
    //     return matchIsNumeric(value)
    // }

    const handleLogin = async () => {
        if (phoneNumber.length === 9) {
            const phone = phoneNumber.toString().slice(-9)
            await auth.signInByPhoneNumber(phone, setIsLoading, setDisplay)
        }
    }

    return (
        <>
            {display === "phoneNumber" &&
                <OutlinedInput
                    id="phone"
                    placeholder="Phone Number"
                    type="number"
                    fullWidth
                    value={phoneNumber}
                    startAdornment={(
                        <InputAdornment position="start">
                            <Typography>+255</Typography>
                        </InputAdornment>
                    )}
                    endAdornment={
                        <InputAdornment position="end">
                            {!isLoading &&
                                <Avatar
                                    sx={{
                                        backgroundColor: 'transparent',
                                        height: 30,
                                        width: 30,
                                        border: `1px solid grey`
                                    }}
                                >
                                    <IconButton
                                        onClick={handleLogin}
                                    >
                                        <SvgIcon fontSize='small'>
                                            <ArrowRightIcon />
                                        </SvgIcon>
                                    </IconButton>
                                </Avatar>
                            }
                            {isLoading &&
                                <CircularProgress
                                    size={26}
                                />
                            }
                        </InputAdornment>
                    }
                    sx={{ maxWidth: 350, my: 1 }}
                    onChange={(event) => {
                        setPhoneNumber(event.target.value)
                    }}
                />
            }
            {display === "OTP" &&
                <>
                    <MuiOtpInput
                        value={otp}
                        onChange={handleChange}
                        length={6}
                        onComplete={handleComplete}
                        TextFieldsProps={{ size: 'small', placeholder: '-' }}
                        sx={{
                            display: "flex",
                            maxWidth: "520px",
                            marginInline: "auto",
                            gap: "6px",
                            my: 1,
                            ...(lgUp && {
                                gap: "30px",
                            }),
                        }}
                    />
                    <Button
                        onClick={() => setDisplay("phoneNumber")}
                    >
                        Edit phone number
                    </Button>
                    <Button
                        onClick={handleLogin}
                    >
                        Resend OTP
                    </Button>
                </>
            }
            <Typography sx={{ my: 4 }}>
                Or
            </Typography>
            <GoogleLogin
                onSuccess={async credentialResponse => {
                    const credential = credentialResponse.credential;
                    const decodedToken = jwtDecode(credential);
                    await auth.signInByEmail(decodedToken.email, navigate)
                }}
                onError={() => { }}
                useOneTap
            />
        </>
    )
}

export default Login