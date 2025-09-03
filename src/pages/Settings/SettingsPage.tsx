import { Sidebar } from "@/components/layout/Sidebar";
import { FormData } from "./Form/FormData";
import { getSettings } from "@/http/settings/getSettings";

export function SettingsPage() {
  const { data, isLoading } = getSettings();

  return (
    <Sidebar>
      <div className="grid grid-cols-1 items-start gap-8">
        <div className="col-span-full lg:col-span-2 w-full">
          {!isLoading && <FormData setting={data?.data} />}
        </div>
      </div>
    </Sidebar>
  );
}
