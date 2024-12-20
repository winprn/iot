import { cn } from '@/lib/utils';
import {
  AlignLeft,
  FileClock,
  House,
  Lamp,
  LogOut,
  Settings,
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const MENU_ITEMS = [
  {
    name: 'Home',
    icon: House,
    link: '/',
  },
  {
    name: 'History',
    icon: FileClock,
    link: '/history',
  },
];

const ACTION_ITEMS = [
  {
    name: 'Settings',
    icon: Settings,
    link: '/settings',
  },
  {
    name: 'Logout',
    icon: LogOut,
    link: '/logout',
  },
];

export default function Sidebar() {
  return (
    <section
      className='bg-white w-[250px] h-[80%] rounded-xl pl-5 pt-10'
      style={{
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className='flex items-center gap-4 text-xl mb-8'>
        <div className='w-10 aspect-square bg-[#308BF3] rounded-full flex justify-center items-center text-white'>
          G
        </div>
        <p className='font-bold'>GloVibe</p>
      </div>
      <div className='flex flex-col gap-4 mb-8'>
        <h2 className='text-lg text-[#405D9F]'>Menu</h2>
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.link}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 hover:bg-slate-100 p-2 rounded-lg text-[#6C7894]',
                isActive && 'text-[#2892F0]'
              )
            }
          >
            <item.icon size={24} />
            <p>{item.name}</p>
          </NavLink>
        ))}
      </div>
      <div className='flex flex-col gap-4'>
        <h2 className='text-lg text-[#405D9F]'>Actions</h2>
        {ACTION_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.link}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 hover:bg-slate-100 p-2 rounded-lg text-[#6C7894]',
                isActive && 'text-[#2892F0]'
              )
            }
          >
            <item.icon size={24} />
            <p>{item.name}</p>
          </NavLink>
        ))}
      </div>
    </section>
  );
}
