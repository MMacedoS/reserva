import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle2Icon } from "lucide-react";

interface Props {
  message?: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

export function showAutoDismissAlert(
  {
    message = "Success! Your changes have been saved",
    description = "This is an alert with icon, title and description.",
    duration = 2000,
    onClose
  }: Props) {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);

  const AlertWrapper = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        root.unmount();
        div.remove();
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="fixed top-4 right-4 z-50 w-[300px] shadow-lg">
        <Alert>
          <CheckCircle2Icon className="h-5 w-5 text-green-600" />
          <AlertTitle>{message}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      </div>
    );
  };

  root.render(<AlertWrapper />);
}
