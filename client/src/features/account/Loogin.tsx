import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';


import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { Paper } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import agent from '../../app/api/agent';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { error } from 'console';
import { Mode } from '@mui/icons-material';
import { useAppDispatch } from '../../app/store/configureStore';
import { signInUser } from './accountSlice';



export default function Login() {
  const navigate =useNavigate();
  const location=useLocation();
  const dispatch =useAppDispatch()
  const{register,handleSubmit,formState:{isSubmitting,errors,isValid}}=useForm({
    mode:'onTouched',
 
  }
    
  )
  // const [values,setValues]=React.useState({
  //   username: '',
  //   password:''
  // })
  // const handleSubmit = (event:any) => {
  //   event.preventDefault();
  //   agent.Account.login(values)
  // };
  //use [] to get access to the name
  // function handleInputChange(event:any){
  //   const {name,value}=event.target;
  //   setValues({...values,[name]:value})
    
  // }
  async function submitForm(data:FieldValues){
    // try{
    //   await agent.Account.login(data );
    // }catch(error)
    // {
    //   console.log(error)

    // }
    try{
    await dispatch(signInUser(data))
    navigate(location.state?.from.pathname||'/catalog')
    }catch(error){
      console.log(error)
    }
  }
   

  return (
    
      <Container component={Paper} maxWidth="sm" sx={{display:"flex",flexDirection:"column",alignItems:"center",p:4}}>
        
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              
              fullWidth              
              label="Username"
              // name="username"
              autoFocus
              // onChange={handleInputChange}
              // value={values.username}
              {...register('username',{required:'Username is required'})}
              error={!!errors.username}
              helperText={errors?.username?.message as string}

            />
            <TextField
              
              margin="normal"
              fullWidth
              // name="password"
              label="Password"
              type="password"
              // onChange={handleInputChange}
              // value={values.password}
              {...register('password',{required:'Password is required'})}
              error={!!errors.password}
              helperText={errors?.password?.message as string}
            />
            
            <LoadingButton
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}                                                                           

              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              
              <Grid item>
                <Link to='/register'>
                  { "Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
      </Container>
    
  );
}