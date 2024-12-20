import { ButtonBase } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SUPABASE_CLIENT } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigator = useNavigate();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      data: { user },
      error,
    } = await SUPABASE_CLIENT.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      return;
    }

    localStorage.setItem('user', JSON.stringify(user));
    navigator('/');
  };

  return (
    <main className='flex flex-col gap-8 items-center justify-center h-screen bg-[#E8F3FC]'>
      <div className='flex items-center gap-4 text-xl'>
        <div className='w-10 aspect-square bg-[#308BF3] rounded-full flex justify-center items-center text-white'>
          G
        </div>
        <p className='font-bold'>GloVibe</p>
      </div>
      <div className='flex flex-col gap-6 items-center p-10 bg-white rounded-xl'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Log in</h1>
          <p>Log in to access our controller</p>
        </div>
        <form
          className='flex flex-col gap-4 w-[300px] text-center'
          onSubmit={onSubmit}
        >
          <TextField
            label='Email'
            required
            size='small'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label='Password'
            required
            size='small'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ButtonBase
            className='!rounded-full !bg-[#0075E2] !text-white !py-2'
            type='submit'
          >
            Continue
          </ButtonBase>
          <p>
            Don't have an account?{' '}
            <Link to='/signup' className='text-[#003F88]'>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
