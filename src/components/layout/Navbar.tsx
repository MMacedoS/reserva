import { LucideBell, LucideMenu, LucideSearch, LucideUser } from 'lucide-react';
import { Input } from '../ui/input';
import React from 'react';
import { Avatar } from '../ui/avatar';
import { UserAvatar } from '../Avatar';

interface NavbarProps {
  sidebarToggle: boolean;
  setSidebarToggle: (value: boolean) => void;
}

export function Navbar({ sidebarToggle, setSidebarToggle }: NavbarProps) {
    return (      
        <div className={`${sidebarToggle ? '' : 'ml-50'} w-full`}>
            <nav className='bg-gray-800 px-4 py-3 flex justify-between'>
                <div className={`${!sidebarToggle ? 'invisible' : '' }  flex items-center text-xl text-white font-bold`}>
                    <LucideMenu className='text-white me-4 cursor-pointer' 
                    onClick={() => setSidebarToggle(!sidebarToggle)}/>
                </div>
                <div className='flex items-center gap-x-5'>
                    <div className='text-white'>
                        <LucideBell className='text-white w-6 h-6'/>
                    </div>
                    <div className='relative'>
                        <button className='text-white hover:bg-gray-400 group'>
                            <UserAvatar src="https://github.com/shadcn.png" alt="User Avatar" username="CN"/>
                            <div className='z-10 hidden absolute bg-white rounded-lg shadow w-32 group-focus:block top-full right-0'>
                                <ul className='py-2 text-sm text-gray-950'>
                                    <li className='py-2 text-center hover:bg-gray-300'>
                                        <a className='' href="">Perfil</a>
                                    </li>
                                    <li className='py-2 text-center hover:bg-gray-300'>
                                        <a href="">Sair</a>
                                    </li>
                                </ul>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}