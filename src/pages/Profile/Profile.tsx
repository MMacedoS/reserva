import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { FormData } from "./form/FormData";
import { useAuth } from "@/contexts/AuthContext";
import { UseUpdatePhoto } from "@/http/profile/useUpdatePhoto";
import { UploadPhoto } from "./form/UploadPhoto";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

export function Profile() {
    const {sidebarToggle} = useSidebar();
    const {user} = useAuth();
    
    const { mutateAsync: createPhoto } = UseUpdatePhoto();
    const form = useForm<{file: File}>({
        defaultValues: {
            file: undefined
        }
    })

   async function handleFotoChange(file: File | null) {
        if(file){
            await createPhoto({file});
        }
    }
   
    return (
        <div className="col">
            <Sidebar/>            
            <div className={`${sidebarToggle ? 'ml-5' : 'ml-55' } py-4 mr-5`}>
               <div className="grid grid-cols-3 items-start gap-8">
                    <div className="col-span-full lg:col-span-2 w-full">
                        <FormData/>
                    </div>
                    <div className="col-span-full lg:col-span-1 w-full h-full mt-4 lg:mt-0">
                        <UploadPhoto
                         imageUrlFromApi={`http://sistemareserva.localhost:8080/Public/${user?.photo}`}
                         onImageChange={handleFotoChange}
                        />               
                    </div>
               </div>
            </div>            
        </div>
    )
}