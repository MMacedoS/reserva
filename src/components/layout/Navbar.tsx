import { LucideDollarSign, LucideMenu } from "lucide-react";
import { UserAvatar } from "../Avatar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { environment } from "@/environments/environment";
import { useAuth } from "@/hooks/useAuth";
import { CashboxForm } from "../CashboxForm";
import { formatValueToBRL } from "@/lib/utils";
import { Button } from "../ui/button";
import { AlertDialogCashbox } from "@/shared/components/AlertDialogCashbox";
import { closeCashbox } from "@/http/cashbox/closeCashbox";

interface NavbarProps {
  sidebarToggle: boolean;
  setSidebarToggle: (value: boolean) => void;
}

export function Navbar({ sidebarToggle, setSidebarToggle }: NavbarProps) {
  const { user, logout, cashbox } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCashboxFormOpen, setIsCashboxFormOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleCashboxClick = () => {
    if (!cashbox) {
      setIsCashboxFormOpen(true);
    }
  };

  const { mutate: close } = closeCashbox();
  const handleCloseCashbox = async (finalAmount?: number) => {
    await close(finalAmount);
    setOpenConfirmDialog(false);
  };

  return (
    <div className="w-full">
      <nav className="bg-gray-800 px-4 py-3 flex justify-between">
        <div
          className={`${
            !sidebarToggle ? "invisible" : ""
          }  flex items-center text-xl text-white font-bold`}
        >
          <LucideMenu
            className="text-white me-4 cursor-pointer"
            onClick={() => setSidebarToggle(!sidebarToggle)}
          />
        </div>
        <div className="flex items-center gap-x-5">
          <div className="text-white">
            {cashbox ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  <Button
                    variant="link"
                    className="p-0 m-0 hover:underline text-white cursor-pointer"
                    onClick={() => {
                      setOpenConfirmDialog(true);
                    }}
                  >
                    Caixa Aberto
                  </Button>
                </span>
                <span className="text-sm font-medium">
                  {formatValueToBRL(cashbox.current_balance)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleCashboxClick}
                className="flex items-center gap-2 hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                title="Abrir Caixa"
              >
                <LucideDollarSign className="text-white w-6 h-6" />
                <span className="text-sm">Abrir Caixa</span>
              </button>
            )}
          </div>
          <div className="relative">
            <button
              className="justify-center text-white hover:bg-gray-400"
              onClick={toggleDropdown}
            >
              <UserAvatar
                src={`${environment.apiUrl}/Public${user?.photo}`}
                alt="User Avatar"
                username={`${user?.name}`}
              />
            </button>
            {isOpen && (
              <div className="z-10 absolute py-1.5 w-40 text-center break-words bg-gray-50 rounded-lg shadow group-focus:block top-full right-0">
                <span className="word-break text-black text-sm">
                  {user?.name}
                </span>
                <hr />
                <ul className="py-2 text-sm text-gray-950">
                  <li className="py-2 text-center hover:bg-gray-300">
                    <Link to="/profile" onClick={closeDropdown}>
                      Perfil
                    </Link>
                  </li>
                  <li className="py-2 text-center hover:bg-gray-300">
                    <a onClick={logout}>Sair</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      <CashboxForm
        open={isCashboxFormOpen}
        onClose={() => setIsCashboxFormOpen(false)}
      />

      <AlertDialogCashbox
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={(finalAmount) => {
          handleCloseCashbox(finalAmount);
        }}
        item={cashbox}
        type="Cashbox"
      />
    </div>
  );
}
