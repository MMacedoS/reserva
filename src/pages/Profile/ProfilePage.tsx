import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { FormData } from "./form/FormData";
import { UseUpdatePhoto } from "@/http/profile/useUpdatePhoto";
import { UploadPhoto } from "./form/UploadPhoto";
import { environment } from "@/environments/environment";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/layout/Footer";

export function ProfilePage() {
  const { sidebarToggle } = useSidebar();
  const { user } = useAuth();

  const { mutateAsync: createPhoto } = UseUpdatePhoto();

  async function handleFotoChange(file: File | null) {
    if (file) {
      await createPhoto({ file });
    }
  }

  return (
    <div className="col">
      <Sidebar />
      <div
        className={`${
          sidebarToggle ? "ml-5" : "ml-55"
        } py-20 mr-5  transition-all duration-1000 ease-in-out`}
      >
        <div className="grid grid-cols-3 items-start gap-8">
          <div className="col-span-full lg:col-span-2 w-full">
            <FormData />
          </div>
          <div className="col-span-full lg:col-span-1 w-full h-full mt-4 lg:mt-0">
            <UploadPhoto
              imageUrlFromApi={`${environment.apiUrl}/Public${user?.photo}`}
              onImageChange={handleFotoChange}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
