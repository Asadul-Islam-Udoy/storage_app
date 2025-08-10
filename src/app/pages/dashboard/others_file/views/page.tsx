import ViewOthersLayout from "@/app/layout/ViewOthersFileLayout";
import { prisma } from "@/lib/prisma";
interface OthersFile {
  id: number | string;
  title: string;
  description: string;
  file: string;
  fileUrl:string;
  userId:number;
  createdAt: string;
}
export default async function ViewOthersFile() {
  const othersfile = await prisma.others_File.findMany();
        const normalizedVideos:OthersFile[] = othersfile.map((pdf) => ({
          id: pdf.id,
          title: pdf.title,
          description: pdf.description,
          file: `/${pdf.file}` || '', 
          fileUrl:pdf?.fileUrl || '',
          userId:pdf.userId,
          createdAt: pdf.createdAt?.toISOString() || "",
        }));
  return <ViewOthersLayout otherfiles={normalizedVideos}/>
}


