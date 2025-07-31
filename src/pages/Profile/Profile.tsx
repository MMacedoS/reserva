import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { FormData } from "./form/FormData";
import { UploadFoto } from "./form/UploadFoto";

export function Profile() {
    const {sidebarToggle} = useSidebar();
   
    return (
        <div className="col">
            <Sidebar/>
            <div className={`${sidebarToggle ? 'ml-5' : 'ml-55' } py-4 mr-5`}>
               <div className="grid grid-cols-3 items-start gap-8">
                    <div className="col-span-full lg:col-span-2 w-full">
                        <FormData/>
                    </div>
                    <div className="col-span-full lg:col-span-1 w-full h-full mt-4 lg:mt-0">
                        <UploadFoto/>               
                    </div>
               </div>
            </div>
        </div>
    )
}