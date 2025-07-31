import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { LoginCard } from "@/components/LoginCard";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(3, "Senha deve ter pelo menos 3 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const loginForm = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      navigate("/dashboard"); // redireciona após login
    } catch (err) {
      setError("Credenciais inválidas.");
    }
  };

  return (
    <LoginCard>
        <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-4">
                {error && <p className="text-red-500">{error}</p>}

                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <FormField control={loginForm.control} name="email" render={({field}) => {
                            return (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} placeholder="Digite seu email"/>
                                    </FormControl>
                                </FormItem>
                            )
                        }} />
                    </div>

                    <div className="grid gap-2">
                        <FormField control={loginForm.control} name="password" render={({field}) => {
                            return (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} type="password" placeholder="Digite sua senha"/>
                                    </FormControl>
                                </FormItem>
                            )
                        }} />
                    </div>

                    <Button className="w-full" type="submit">Entrar</Button>
                </div>
            </form>
      </Form>
    </LoginCard>
  );
}
