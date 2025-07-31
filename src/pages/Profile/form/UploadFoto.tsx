import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UploadFoto () {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    Foto
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col items-center gap-4">
                    <label htmlFor="profile-picture" className="cursor-pointer flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
                            <span className="text-gray-400 text-sm">Foto</span>
                        </div>
                        <input
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            // onChange={handleImageChange}
                        />
                        <span className="text-blue-600 text-xs underline">Selecionar foto</span>
                    </label>
                    <Button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Salvar foto
                    </Button>
                </form>
            </CardContent>                       
        </Card>    
    );
}