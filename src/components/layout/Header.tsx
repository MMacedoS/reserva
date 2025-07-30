import { useAuth } from "@/contexts/AuthContext";
import { LucideBadgeDollarSign, LucideBlocks, LucideBox, LucideCalendarDays, LucideCircleDashed, LucideHotel, LucideLayoutDashboard, LucidePersonStanding, LucideReceipt, LucideReceiptText, LucideSettings, LucideUserStar } from "lucide-react";

interface NavbarProps {
  sidebarToggle: boolean;
  setSidebarToggle: (value: boolean) => void;
}

export function Header({sidebarToggle, setSidebarToggle}: NavbarProps) {
  return (
    <div className={`${sidebarToggle ? 'hidden' : 'block' } w-50 bg-gray-800 fixed h-full px-4 py-2`}>
      <div className="my-2 mb-4">
        <div className="flex flex-col items-center text-2x text-white font-bold p-4" 
            onClick={() => setSidebarToggle(!sidebarToggle)}>
            <LucideLayoutDashboard className="inline-block w-6 h-6 mr-2 -mt-2" />
            <span className="">Sistema Reservas</span>
        </div>
        <hr />
        <ul className='mt-3 text-white text-sm font-semibold'>
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
                <a href="/dashboard" className='px-3 py-2 text-white flex items-center'>
                    <LucideBlocks className="inline-block w-6 h-6 mr-2 -mt-2" />
                    Dashboard
                </a>
            </li>                    
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
                <a href="/clients" className='px-3 py-2 text-white flex items-center'>
                    <LucideUserStar className="inline-block w-6 h-6 mr-2 -mt-2" />
                    Hospedes
                </a>
            </li>
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
                <a href="/apartments" className='px-3 py-2 text-white flex items-center'>
                    <LucideHotel className="inline-block w-6 h-6 mr-2 -mt-2" />
                    Apartamentos
                </a>
            </li>
            
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
                <a href="/reservations" className='px-3 py-2 text-white flex items-center'>
                    <LucideCalendarDays className="inline-block w-6 h-6 mr-2 -mt-2" />
                    Reservas
                </a>
            </li>
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
                <a href="/sales" className='px-3 py-2 text-white flex items-center'>
                    <LucideBadgeDollarSign className="inline-block w-6 h-6 mr-2 -mt-2" />
                    Vendas
                </a>
            </li>
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
                <a href="/reports" className='px-3 py-2 text-white flex items-center'>
                    <LucideReceiptText className="inline-block w-6 h-6 mr-2 -mt-2" />
                    Relatórios
                </a>
            </li>
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
                <a href="/invoices" className='px-3 py-2 text-white flex items-center'>
                    <LucideReceipt className="inline-block w-6 h-6 mr-2 -mt-2" />
                    Financeiro
                </a>
            </li>    
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
                <a href="/employees" className='px-3 py-2 text-white flex items-center'>
                    <LucidePersonStanding className="inline-block w-6 h-6 mr-2 -mt-2" />
                    Funcionarios
                </a>
            </li>
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
                <a href="/settings" className='px-3 py-2 text-white flex items-center'>
                    <LucideSettings className="inline-block w-6 h-6 mr-2 -mt-2" />
                    Configurações
                </a>
            </li>                
        </ul>
      </div>
    </div>
  );
}
