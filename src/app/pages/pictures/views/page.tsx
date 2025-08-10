<<<<<<< HEAD
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
=======
import PicturePublicViews from "@/app/components/PicturesPublicView"

function PicturesView() {
    return (
        <>
          <div>
              <PicturePublicViews/>
>>>>>>> bcb973c1298360509b00b8f277141b3965292bc9
          </div>
        </>
       
    )
}

export default PicturesView
