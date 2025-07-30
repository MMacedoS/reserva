import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserAvatar({ src, alt, username }: { src: string, alt: string, username: string }) {
  return (
    <Avatar className="w-8 h-8">
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{username}</AvatarFallback>
    </Avatar>
  );
}

