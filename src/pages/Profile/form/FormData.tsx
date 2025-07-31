import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { UseProfile } from "@/http/profile/useProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const createProfileSchema = z.object({
    name: z.string()
    .min(3, 'o nome é obrigatório conter  no minino 3 caracteres')
    .max(100, 'Não deve ultrapassar 100 caracteres'),
    email: z.email("Email inválido").min(5, "Email é obrigatório"),
    access: z.string()
})

type CreateProfileFormData = z.infer<typeof createProfileSchema>;

export function FormData() {
    const {user} = useAuth();

    const { mutateAsync: createProfile } = UseProfile();
    const form = useForm<CreateProfileFormData>({
        resolver: zodResolver(createProfileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            access: user?.access || ''
        }
    })

    async function handleCreateForm(data: CreateProfileFormData) {
        await createProfile(data);
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="flex flex-col gap-4"
                     onSubmit={form.handleSubmit(handleCreateForm)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full">
                                <FormField control={form.control}
                                    name="name"
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            </div>
                            <div className="w-full">
                                <FormField control={form.control}
                                    name="email"
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full">
                                <FormField control={form.control}
                                    name="access"
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Acesso</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={user.access}/>
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            </div>
                        </div>
                        <div className="text-end">
                            <Button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Atualizar dados
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}