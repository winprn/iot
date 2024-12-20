import { Link } from 'react-router-dom';

function App() {
  return (
    <>
      <main className='mt-8 ml-28 font-[Chivo]'>
        <header className='flex gap-48 mr-28'>
          <div className='flex items-center gap-4 text-xl'>
            <div className='w-10 aspect-square bg-[#308BF3] rounded-full flex justify-center items-center text-white'>
              G
            </div>
            <p className='font-bold'>GloVibe</p>
          </div>
          <div className='flex items-center gap-12 text-lg'>
            <Link to='#' className='text-[#0075E2]'>
              Home
            </Link>
            <Link to='#' className='text-[#8E8E8E]'>
              Features
            </Link>
            <Link to='#' className='text-[#8E8E8E]'>
              About Us
            </Link>
          </div>
          <div className='flex items-center gap-6 ml-auto text-lg'>
            <Link to='/login' className='text-[#0075E2]'>
              Log in
            </Link>
            <Link
              to='/signup'
              className='text-white bg-[#0075E2] px-5 py-2 rounded-full'
            >
              Sign up
            </Link>
          </div>
        </header>
      </main>
    </>
  );
}

export default App;
