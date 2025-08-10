import ViewPictureLayout from "@/app/layout/ViewPictureLayout"
import { prisma } from "@/lib/prisma";

interface Pictrue {
  id: number | string;
  title: string;
  description: string;
  picture: string;
  pictureUrl:string;
  userId:number;
  createdAt: string;
}


async function PicturesView() {
      const pictures = await prisma.pictures.findMany();
      const normalizedPictrue:Pictrue[] = pictures.map((picture) => ({
        id: picture.id,
        title: picture.title,
        description: picture.description,
        picture: `/pictures/${picture.picture}` || '', 
        pictureUrl:picture?.pictureUrl || '',
        userId:picture.userId,
        createdAt: picture.createdAt?.toISOString() || "",
      }));
    return (
        <>
          <div>
              <ViewPictureLayout pictures={normalizedPictrue}/>
          </div>
        </>
       
    )
}

export default PicturesView
