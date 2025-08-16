import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatValueToBRL, textSlice } from "@/lib/utils";

type HoverCardToTableProps = {
  title: string;
  type: string;
  item?: any;
};

const HoverCardToTable = ({ title, type, item }: HoverCardToTableProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>{textSlice(title, 20)}</HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm ">
          <strong>{title}</strong>
        </p>
        {type === "transaction" && (
          <div className="mt-2">
            <strong className="text-muted-foreground text-center">
              Detalhes:
            </strong>
            <div className="mt-1">
              <p className="text-muted-foreground">
                <strong>Descrição:</strong> {item.description}
              </p>
              <p className="text-muted-foreground">
                <strong>Tipo:</strong> {item.type}
              </p>
              <p className="text-muted-foreground">
                <strong>Forma:</strong> {item.payment_form}
              </p>
              <p className="text-muted-foreground">
                <strong>Valor:</strong> {formatValueToBRL(item.amount)}
              </p>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardToTable;
