import {
  LucideBadgeDollarSign,
  LucideBanknote,
  LucideBlocks,
  LucideChevronDown,
  LucideChevronRight,
  LucideHotel,
  LucideLayoutDashboard,
  LucidePersonStanding,
  LucideReceipt,
  LucideReceiptText,
  LucideSettings,
  LucideShieldCheck,
  LucideUserStar,
  LucidePackage,
  LucideDollarSign,
  LucideDoorClosed,
  LucideDoorClosedLocked,
  LucideConciergeBell,
  LucideTickets,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PermissionGuard } from "@/components/PermissionGuard";
import { CashboxGuard } from "../CashboxGuard";

interface NavbarProps {
  sidebarToggle: boolean;
  setSidebarToggle: (value: boolean) => void;
}

export function Header({ sidebarToggle, setSidebarToggle }: NavbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  return (
    <div
      className={`transform 
        transition-transform duration-1000 
        ease-in-out w-50 bg-gray-800 fixed h-full px-4 py-2 
        overflow-y-auto 
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
              to="/customers"
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
              <LucideDoorClosed className="inline-block w-6 h-6 mr-2 -mt-2" />
              Apartamentos
            </Link>
          </li>
          <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
            <Link
              to="/reservations/accommodation"
              className="px-3 py-2 text-white flex items-center"
            >
              <LucideConciergeBell className="inline-block w-6 h-6 mr-2 -mt-2" />
              Hospedagem
            </Link>
          </li>

          <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
            <div
              onClick={() => toggleDropdown("hospedagem")}
              className="px-3 py-2 text-white flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center">
                <LucideHotel className="inline-block w-6 h-6 mr-2 -mt-2" />
                Reservas
              </div>
              {openDropdown === "hospedagem" ? (
                <LucideChevronDown className="w-4 h-4" />
              ) : (
                <LucideChevronRight className="w-4 h-4" />
              )}
            </div>
            <ul
              className={`ml-4 mt-2 text-xs transition-all duration-300 ease-in-out scrollbar-hide ${
                openDropdown === "hospedagem"
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
                <Link
                  to="/reservations"
                  className="px-3 py-2 text-white flex items-center"
                >
                  <LucideDoorClosedLocked className="inline-block w-6 h-6 mr-2 -mt-2" />
                  Cadastrar
                </Link>
              </li>

              <CashboxGuard>
                <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
                  <Link
                    to="/reservations/confirmations"
                    className="px-3 py-2 text-white flex items-center"
                  >
                    <LucideTickets className="inline-block w-6 h-6 mr-2 -mt-2" />
                    Confirmações
                  </Link>
                </li>
              </CashboxGuard>
            </ul>
          </li>
          <PermissionGuard requiredPermission={["products.view"]}>
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
              <Link
                to="/products"
                className="px-3 py-2 text-white flex items-center"
              >
                <LucidePackage className="inline-block w-6 h-6 mr-2 -mt-2" />
                Produtos
              </Link>
            </li>
          </PermissionGuard>
          <CashboxGuard>
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
              <Link
                to="/sales"
                className="px-3 py-2 text-white flex items-center"
              >
                <LucideBadgeDollarSign className="inline-block w-6 h-6 mr-2 -mt-2" />
                Vendas
              </Link>
            </li>
          </CashboxGuard>
          <PermissionGuard
            requiredAccess={[
              "administrador",
              "gerente",
              "recepcionista",
              "financeiro",
              "recepcionista_bar",
            ]}
          >
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
              <div
                onClick={() => toggleDropdown("reports")}
                className="px-3 py-2 text-white flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center">
                  <LucideReceiptText className="inline-block w-6 h-6 mr-2 -mt-2" />
                  Relatórios
                </div>
                {openDropdown === "reports" ? (
                  <LucideChevronDown className="w-4 h-4" />
                ) : (
                  <LucideChevronRight className="w-4 h-4" />
                )}
              </div>
              <ul
                className={`ml-4 mt-2 text-xs transition-all duration-300 ease-in-out scrollbar-hide ${
                  openDropdown === "reports"
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <PermissionGuard requiredPermission={["financial.reports"]}>
                  <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
                    <Link
                      to="/report-transactions"
                      className="px-3 py-2 text-white flex items-center"
                    >
                      <LucideBanknote className="inline-block w-6 h-6 mr-2 -mt-2" />
                      Caixas
                    </Link>
                  </li>
                </PermissionGuard>
                <PermissionGuard requiredPermission={["financial.reports"]}>
                  <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
                    <Link
                      to="/report-reservations"
                      className="px-3 py-2 text-white flex items-center"
                    >
                      <LucideBanknote className="inline-block w-6 h-6 mr-2 -mt-2" />
                      Reservas
                    </Link>
                  </li>
                </PermissionGuard>
              </ul>
            </li>
            <PermissionGuard
              requiredPermission={[
                "cashbox.transactions",
                "cashbox.view",
                "cashbox.open",
                "cashbox.close",
                "cashbox.transactions",
              ]}
            >
              <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
                <div
                  onClick={() => toggleDropdown("finance")}
                  className="px-3 py-2 text-white flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center">
                    <LucideReceipt className="inline-block w-6 h-6 mr-2 -mt-2" />
                    Financeiro
                  </div>
                  {openDropdown === "finance" ? (
                    <LucideChevronDown className="w-4 h-4" />
                  ) : (
                    <LucideChevronRight className="w-4 h-4" />
                  )}
                </div>
                <ul
                  className={`ml-4 mt-2 text-xs transition-all duration-300 ease-in-out scrollbar-hide ${
                    openDropdown === "finance"
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <PermissionGuard
                    requiredPermission={["financial.cashbox.reports"]}
                  >
                    <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
                      <Link
                        to="/finance"
                        className="px-3 py-2 text-white flex items-center"
                      >
                        <LucideReceipt className="inline-block w-4 h-4 mr-2 -mt-1" />
                        Caixas
                      </Link>
                    </li>
                  </PermissionGuard>
                  <li>
                    <Link
                      to="/finance/transactions"
                      className="px-3 py-2 text-white flex items-center"
                    >
                      <LucideDollarSign className="inline-block w-4 h-4 mr-2 -mt-1" />
                      Meu Histórico
                    </Link>
                  </li>
                  <CashboxGuard>
                    <li className="mb-2 rounded hover:shadow hover:bg-gray-700 py-2">
                      <Link
                        to="/finance/releases"
                        className="px-3 py-2 text-white flex items-center"
                      >
                        <LucideBadgeDollarSign className="inline-block w-4 h-4 mr-2 -mt-1" />
                        Lançamentos
                      </Link>
                    </li>
                  </CashboxGuard>
                </ul>
              </li>
            </PermissionGuard>
            <PermissionGuard requiredPermission={["employees.view"]}>
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
            <li className="mb-2 rounded hover:shadow  hover:bg-gray-700 py-2">
              <Link
                to="/permissions"
                className="px-3 py-2 text-white flex items-center"
              >
                <LucideShieldCheck className="inline-block w-6 h-6 mr-2 -mt-2" />
                Permissões
              </Link>
            </li>
          </PermissionGuard>
        </ul>
      </div>
    </div>
  );
}
