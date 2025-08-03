import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

type ActionItem = {
  label: string
  onClick: () => void
}

// Props que o componente aceita
type MenuButtonsProps = {
  actions: ActionItem[]
}

export function MenuButtons( { actions }: MenuButtonsProps ) {    
    return (
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            {
                actions.map((action, index) => (
                    <DropdownMenuItem key={index} onClick={action.onClick}>
                    {action.label}
                    </DropdownMenuItem>
                ))
            }
          </DropdownMenuContent>
        </DropdownMenu>
    )
}