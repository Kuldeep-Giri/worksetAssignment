import React, { useState } from 'react'
import axios from 'axios'

const Upload = ({fetchImages}) => {
    const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

    const handleUpload = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('image', file);
    
        try {
          await axios.post('http://localhost:5000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          alert('File uploaded successfully')
          setFile(null)
          fetchImages()
        
        } catch (error) {
          console.error('Error uploading file: ' + error.message);
        }
      };
    
  return (
    <div className='container'>
  <div className="upload">
  <form action="" onSubmit={handleUpload}>
     <div className=''>
     {/* <label className="">
                  {file ? file.name : "Upload Photo"}
                  <input type="file" />
                </label> */}
                <div class="image-upload">
  <label for="file-input">
    <img src="https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/128/Downloads-icon.png"/>
  </label>
 
  <input id="file-input" type="file"  onChange={handleFileChange}/>
  {file ? file.name : ""}
</div>
     </div>
 
    <div className='mt-2'>
    {file && (
                  <div className="text-center">
                    <img style={{borderRadius:"10px"}}
                      src={URL.createObjectURL(file)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
    </div>

   <div className="center">
   <button>Upload</button>
   </div>
      </form>
    
  </div>
    </div>
  )
}

export default Upload