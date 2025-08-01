import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UploadPhotoProps = {
    imageUrlFromApi?: string; 
    onImageChange?: (file: File | null) => void;
};

export function UploadPhoto({ imageUrlFromApi, onImageChange }: UploadPhotoProps) {
    const [preview, setPreview] = useState<string | null>(imageUrlFromApi || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (imageUrlFromApi) setPreview(imageUrlFromApi);
    }, [imageUrlFromApi]);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onImageChange?.(file);
        }
    }

    function handleRemoveImage() {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onImageChange?.(null);
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Foto</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col items-center gap-4">
                    <label htmlFor="profile-picture" className="cursor-pointer flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">Foto</span>
                            )}
                        </div>
                        <input
                            id="profile-picture"
                            type="file"
                            accept=".jpg,.jpeg,.png,.svg,.webp,image/jpeg,image/png,image/svg+xml,image/webp"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <span className="text-blue-600 text-xs underline">Selecionar foto</span>
                    </label>
                    {preview && (
                        <Button
                            type="button"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={handleRemoveImage}
                        >
                            Remover foto
                        </Button>
                    )}
                    
                </form>
            </CardContent>
        </Card>
    );
}

