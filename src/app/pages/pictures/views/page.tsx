import ViewPictureLayout from "@/app/layout/ViewPictureLayout"

interface Picture {
  id: number | string;
  title: string;
  description: string;
  picture: string;
  pictureUrl:string;
  userId:number;
  createdAt: string;
}

interface PictrueProps {
  pictures: Picture[];
}
function PicturesView({pictures}:PictrueProps) {
    return (
        <>
          <div>
              <ViewPictureLayout pictures={pictures}/>
          </div>
        </>
       
    )
}

export default PicturesView
