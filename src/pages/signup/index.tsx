import { ButtonBase } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import { SUPABASE_CLIENT } from '@/lib/utils';
import { useState } from 'react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [productID, setProductID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const checkValid = async () => {
    const { data: products, error } = await SUPABASE_CLIENT.from('products')
      .select('product_id')
      .eq('product_id', productID);

    if (error) {
      console.error(error);
      setError('An error occurred');
      return false;
    }

    if (products.length === 0) {
      console.error('Product not found');
      setError('Product not found');
      return false;
    }

    return true;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!(await checkValid())) {
      return;
    }

    const {
      data: { user },
      error,
    } = await SUPABASE_CLIENT.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error(error);
      setError('An error occurred');
      return;
    }

    console.log(user);
    window.location.href = '/login';
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
          <h1 className='text-2xl font-bold'>Sign Up</h1>
          <p>Sign up your product</p>
        </div>
        <form
          className='flex flex-col gap-4 w-[300px] text-center'
          onSubmit={onSubmit}
        >
          <TextField
            label='Email'
            required
            size='small'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label='Product ID'
            required
            size='small'
            value={productID}
            onChange={(e) => setProductID(e.target.value)}
          />
          <TextField
            label='Password'
            required
            size='small'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className='text-red-500'>{error}</p>}
          <ButtonBase
            className='!rounded-full !bg-[#0075E2] !text-white !py-2'
            type='submit'
          >
            Continue
          </ButtonBase>
          <p>
            Already registered?{' '}
            <Link to='/login' className='text-[#003F88]'>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
