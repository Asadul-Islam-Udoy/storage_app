import UserListLayout from "@/app/layout/UserListsLayout";
import { prisma } from "@/lib/prisma";
import { Audios, Profile, Videos, Pictures, Others_File } from "@prisma/client";
 // Prisma's generated type

interface User {
  id: number | string;
  name: string;
  email: string;
  videos: Videos[];       // array of Videos
  audios: Audios[];       // array of Audios
  pictures: Pictures[];   // array of Pictures
  othersFile: Others_File[]; // array of Others_File
  profile: Profile | null;
  createdAt: string;
}

export default async function UserLists() {
  const users = await prisma.users.findMany({
select: {
    id: true,
    name: true,
    email: true,
    createdAt: true,
    videos: true,
    audios: true,
    pictures: true,
    othersFile: true,
    profile: true,
  },
  });


  const normalizedUsers: User[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    videos: user.videos || [],
    audios: user.audios || [],
    pictures: user.pictures || [],
    othersFile: user.othersFile || [],
    profile: user.profile || null,
    createdAt: user.createdAt?.toISOString() || "",
  }));


  return (
    <div className="min-h-screen">
      <UserListLayout users={normalizedUsers} />
    </div>
  );
}
