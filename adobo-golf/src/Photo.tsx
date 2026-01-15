import { useRef, useState, useTransition, type ChangeEvent } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { uploadImage } from './services/storage/client';

function App() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  
  const imageInputRef = useRef<HTMLInputElement>(null)
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      setImageUrls([...imageUrls, ...newImageUrls])
    }
  }

  const [isPending, startTransition] = useTransition()

  const convertBlobUrlToFile = async(blobUrl: string) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const fileName = Math.random().toString(36).slice(2,9);
    const mimeType = blob.type || "applicaiton/octet-stream";
    const file = new File([blob], `${fileName}.${mimeType.split('/')[1]}`,
    {
      type: mimeType,
    });
    return file
  }

  const handleClickUpload = async() => {
    startTransition(async() => {
      let urls = []
      for(const url of imageUrls){
        const imageFile = await convertBlobUrlToFile(url)

        const {imageUrl, error} = await uploadImage({
          file: imageFile,
          bucket: 'photos'
        })

        if(error) {
          console.error(error);
        }

        urls.push(imageUrl);
      }

      console.log(urls);
      setImageUrls([]);
    })
  }

  return (
    <>
      <div className='bg-gray-800 text-white h-screen'>
        <p>Upload File Here:</p>
        <input 
          type="file" 
          className='hidden' 
          ref={imageInputRef} 
          onChange={handleImageChange}
          disabled={isPending}
        />
        <button 
          onClick={() => imageInputRef.current?.click()} 
          disabled={isPending}
        >
          Select image
        </button>
        <div>
          {
            imageUrls.map((url,index) => (
              <img
                key={url}
                src={url}
                width={300}
                height={300}
                alt={`img=${index}`}
              />
            ))
          }
            
          
          
        </div>
        <button 
          onClick={handleClickUpload}
          disabled={isPending}
        >
          {isPending ? "Uploading..." : "Upload Images"}
        </button>
      </div>
    </>
  )
}

export default App
