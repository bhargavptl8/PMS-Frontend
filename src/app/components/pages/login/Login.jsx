"use client"
import React from 'react';
import Cookies from 'js-cookie';
import { Button, Grid, Box, Typography, Container } from '@mui/material';
import styles from './styles.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Link from 'next/link';
import { LOGIN_USER } from '@/app/graphql/mutation/userAuth';
import { useMutation } from '@apollo/client';
import { waveform } from 'ldrs'
import { useRouter } from 'next/navigation'
import { CustomPasswordField, CustomTextField } from '../../common/CustomField';
import { ToastAction } from '@/app/redux/toastify/toastSlice';
import { useDispatch } from 'react-redux';

waveform.register()

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        PMS SYSTEM
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain at least one uppercase letter, one number and one special character"
    )
    .required("Password is required"),
});

const initialValues = {
  email: '',
  password: '',
}

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  });

  const [loginUser, { data, loading }] = useMutation(LOGIN_USER)

  console.log("data", data);

  const onSubmit = async (data) => {
    try {
      let response = await loginUser({
        variables: {
          email: data?.email,
          password: data?.password
        }
      })
      reset();
      dispatch(
        ToastAction({
          message: response?.data?.loginUser?.message,
          severity: 'success'
        })
      )
      let userData = response?.data?.loginUser?.data;
      if (userData) {
        localStorage.setItem("user", JSON.stringify({
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        }))
        localStorage.setItem("authToken", response?.data?.loginUser?.token)
        Cookies.set('authToken', response?.data?.loginUser?.token, { expires: 7, path: '/' });
        Cookies.set('user', JSON.stringify({
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        }), { expires: 7, path: '/' });

      }
      router.push('/dashboard');
    } catch (error) {
      dispatch(
        ToastAction({
          message: error?.message || "Some thing wrong!",
          severity: 'error'
        })
      )
    }
  }


  return (
    <Box className={styles.paper}>
      <Container component="main" maxWidth="xs">
        <Box>
          <Typography component="h1" variant="h4" className={styles.heading}>
            Login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomTextField label="Email Address" name="email" autoComplete="email" type="email" id="email" autoFocus control={control} />
              </Grid>
              <Grid item xs={12}>
                <CustomPasswordField label="Password"
                  name="password"
                  control={control}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <l-waveform
                size="35"
                stroke="3.5"
                speed="1"
                color="#fff"
              ></l-waveform> : "Login"
              }
            </Button>
            <Grid container alignItems="flex-end" flexDirection="column" spacing={2}>
              <Grid item>
                <Link href="/" variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Grid>
              {/* <Grid item>
                <Link href="#" variant="body2">
                  Forgot Password?
                </Link>
              </Grid> */}
            </Grid>
          </form>
        </Box>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </Box>
  );
}

export default Login
