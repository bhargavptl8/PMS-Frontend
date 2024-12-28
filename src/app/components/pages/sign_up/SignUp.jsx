"use client"
import React, { useState } from 'react';
import { Button, TextField, Checkbox, Grid, Box, Typography, Container, IconButton, Snackbar } from '@mui/material';
import styles from './styles.module.css';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { waveform } from 'ldrs'
import { REGISTER_USER } from '@/app/graphql/mutation/userAuth';
import CloseIcon from '@mui/icons-material/Close';
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
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
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
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}

const SignUp = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  });

  const [addUser, { data, loading, error }] = useMutation(REGISTER_USER);

  console.log("data", data);
  console.log("error", error);

  const onSubmit = async (data) => {
    try {
      let response = await addUser({
        variables: {
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
          password: data?.password
        }
      })
      reset();
      router.push('/login');
      dispatch(
        ToastAction({
          message: response?.data?.registerUser,
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

  return (
    <Box className={styles.paper}>
      <Container component="main" maxWidth="xs">
        <div>
          <Typography component="h1" variant="h4" className={styles.heading}>
            Sign up
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <CustomTextField label="First Name" name="firstName" autoComplete="fname" type="text" id="firstName" autoFocus control={control} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField label="Last Name" name="lastName" autoComplete="lname" type="text" id="lastName" control={control} />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField label="Email Address" name="email" autoComplete="email" type="email" id="email" control={control} />
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
              ></l-waveform> : "Sign Up"
              }
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </Box>
  );
}

export default SignUp
