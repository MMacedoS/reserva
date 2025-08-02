import { LucideBell, LucideMenu} from 'lucide-react';
import { UserAvatar } from '../Avatar';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { environment } from '@/environments/environment';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  sidebarToggle: boolean;
  setSidebarToggle: (value: boolean) => void;
}

export function Navbar({ sidebarToggle, setSidebarToggle }: NavbarProps) {
    const {user, logout} = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const closeDropdown = () => setIsOpen(false);

    return (      
        <div className="w-full">
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
                        <button className='justify-center text-white hover:bg-gray-400' onClick={toggleDropdown}>
                            <UserAvatar src={`${environment.apiUrl}/Public${user?.photo}`} alt="User Avatar" username={`${user?.name}`}/>
                        </button>
                        {isOpen && (
                            <div className='z-10 absolute py-1.5 w-40 text-center break-words bg-gray-50 rounded-lg shadow group-focus:block top-full right-0'>
                                <span className='word-break text-black text-sm'>{user?.name}</span>
                                <hr />
                                <ul className='py-2 text-sm text-gray-950'>
                                    <li className='py-2 text-center hover:bg-gray-300'>
                                        <Link to="/profile" onClick={closeDropdown}>
                                            Perfil
                                        </Link>
                                    </li>
                                    <li className='py-2 text-center hover:bg-gray-300'>
                                        <a onClick={logout}>Sair</a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}