import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { FormData } from "./Form/FormData";
import { useSettings } from "@/http/settings/useSettings";

export function Settings() {
    const {sidebarToggle} = useSidebar();
    const { data, isLoading} = useSettings();

    return (
            <div className="col">
                <Sidebar/>            
                <div className={`${sidebarToggle ? 'ml-5' : 'ml-55' } py-20 mr-5  transition-all duration-1000 ease-in-out`}>
                   <div className="grid grid-cols-1 items-start gap-8">
                        <div className="col-span-full lg:col-span-2 w-full">
                           {!isLoading && (
                                <FormData setting={data?.data}/>
                           )}
                        </div>
                   </div>
                </div>            
            </div>
        )
}