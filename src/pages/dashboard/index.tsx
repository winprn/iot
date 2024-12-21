import Chat from '@/components/Chat';
import Info from '@/components/Info';
import Sidebar from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  return (
    <main className='relative bg-[#E8F3FC] h-screen flex items-center pl-20 gap-4'>
      <Sidebar />
      <Outlet />
      <Chat />
      <Info />
    </main>
  );
}
