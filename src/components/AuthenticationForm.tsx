import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, FormControl, FormLabel, Input, Stack } from '@mui/joy';
import Link from '@mui/joy/Link';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api/firebase.ts';
import { useAppState } from '../context/AppState.tsx';
import { authSchema } from '../schema/authenticationFormSchema.ts';
import { AuthForm, FormValues } from '../types/authenticationFormTypes.ts';
import RoutesEnum from '../types/routesEnum.ts';
import ErrorMessage from './ErrorMessage.tsx';

export default function AuthenticationForm(): JSX.Element {
  const navigate = useNavigate();

  const {
    state: { registerApp },
    dispatch,
  } = useAppState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(authSchema),
  });

  const onSubmitRegistration = async (data: FormValues) => {
    const { email, password } = data;

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
        navigate(RoutesEnum.APP);
      })
      .catch((error) => {
        // To Do: add notification toast
        alert(error.message);
      });
  };

  const onSubmitLogIn = async (data: FormValues) => {
    const { email, password } = data;

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
        navigate(RoutesEnum.APP);
      })
      .catch((error) => {
        // To Do: add notification toast
        alert(error.message);
      });
  };

  return (
    <form onSubmit={registerApp ? handleSubmit(onSubmitRegistration) : handleSubmit(onSubmitLogIn)}>
      <FormControl error={!!errors?.email}>
        <FormLabel>Email</FormLabel>
        <Input type='email' {...register(AuthForm.EMAIL)} />
        {!!errors?.email && <ErrorMessage error={errors.email} />}
      </FormControl>

      <FormControl error={!!errors?.password}>
        <FormLabel>Password</FormLabel>
        <Input type='password' {...register(AuthForm.PASSWORD)} />
        {!!errors?.password && <ErrorMessage error={errors.password} />}
      </FormControl>

      <Stack gap={4} sx={{ mt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Checkbox size='sm' label='Remember me' name='persistent' />
          <Link level='title-sm' href='#replace-with-a-link'>
            Forgot your password?
          </Link>
        </Box>

        <Button type='submit' fullWidth color='warning'>
          {registerApp ? 'Registration' : 'Sign in'}
        </Button>
      </Stack>
    </form>
  );
}
