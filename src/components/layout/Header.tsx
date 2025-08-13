import {
  LucideBadgeDollarSign,
  LucideBlocks,
  LucideCalendarDays,
  LucideHotel,
  LucideLayoutDashboard,
  LucidePersonStanding,
  LucideReceipt,
  LucideReceiptText,
  LucideSettings,
  LucideUserStar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PermissionGuard } from "@/components/PermissionGuard";

interface NavbarProps {
  sidebarToggle: boolean;
  setSidebarToggle: (value: boolean) => void;
}

export function Header({ sidebarToggle, setSidebarToggle }: NavbarProps) {
  return (
    <div
      className={`transform 
        transition-transform duration-1000 
        ease-in-out w-50 bg-gray-800 fixed h-full px-4 py-2 
        ${sidebarToggle ? "-translate-x-full" : "translate-x-0"}`}
    >
      <div className="my-2 mb-4">
        <div
          className="flex flex-col items-center text-2x text-white font-bold p-4"
          onClick={() => setSidebarToggle(!sidebarToggle)}
        >
          <LucideLayoutDashboard className="inline-block w-6 h-6 mr-2 -mt-2" />
          <span className="">Sistema Reservas</span>
        </div>
        <hr />
        <ul className="mt-3 text-white text-sm font-semibold">
          <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
            <Link
              to="/dashboard"
              className="px-3 py-2 text-white flex items-center"
            >
              <LucideBlocks className="inline-block w-6 h-6 mr-2 -mt-2" />
              Dashboard
            </Link>
          </li>
          <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
            <Link
              to="/clients"
              className="px-3 py-2 text-white flex items-center"
            >
              <LucideUserStar className="inline-block w-6 h-6 mr-2 -mt-2" />
              Hospedes
            </Link>
          </li>
          <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
            <Link
              to="/apartments"
              className="px-3 py-2 text-white flex items-center"
            >
              <LucideHotel className="inline-block w-6 h-6 mr-2 -mt-2" />
              Apartamentos
            </Link>
          </li>

          <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
            <Link
              to="/reservations"
              className="px-3 py-2 text-white flex items-center"
            >
              <LucideCalendarDays className="inline-block w-6 h-6 mr-2 -mt-2" />
              Reservas
            </Link>
          </li>
          <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
            <Link
              to="/sales"
              className="px-3 py-2 text-white flex items-center"
            >
              <LucideBadgeDollarSign className="inline-block w-6 h-6 mr-2 -mt-2" />
              Vendas
            </Link>
          </li>
          <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
            <Link
              to="/reports"
              className="px-3 py-2 text-white flex items-center"
            >
              <LucideReceiptText className="inline-block w-6 h-6 mr-2 -mt-2" />
              Relatórios
            </Link>
          </li>
          <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
            <Link
              to="/invoices"
              className="px-3 py-2 text-white flex items-center"
            >
              <LucideReceipt className="inline-block w-6 h-6 mr-2 -mt-2" />
              Financeiro
            </Link>
          </li>
          <PermissionGuard requiredAccess={["administrador", "gerente"]}>
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
              <Link
                to="/employees"
                className="px-3 py-2 text-white flex items-center"
              >
                <LucidePersonStanding className="inline-block w-6 h-6 mr-2 -mt-2" />
                Funcionarios
              </Link>
            </li>
          </PermissionGuard>
          <PermissionGuard requiredAccess={["administrador"]}>
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
              <Link
                to="/settings"
                className="px-3 py-2 text-white flex items-center"
              >
                <LucideSettings className="inline-block w-6 h-6 mr-2 -mt-2" />
                Configurações
              </Link>
            </li>
          </PermissionGuard>
        </ul>
      </div>
    </div>
  );
}
