import React,{useEffect,useState} from 'react'
import moment from "moment"
import axios from 'axios'
import Upload from './Upload';

const ImageList = () => {
    const size = ['Small', 'Medium', 'Large'];
    const [images, setImages] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filenameFilter, setFilenameFilter] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    
    const fetchImages = async () => {
        try {
       
          const {data} = await axios.get('http://localhost:5000/allData');
          const sort = data.sort((a, b) => {
            const dateComparison = new Date(b.date) - new Date(a.date);
            if (dateComparison !== 0) {
              return dateComparison;
            }
            return a.filename.localeCompare(b.filename);
          });
          setImages(sort)
         
        } catch (error) {
          console.error('Error fetching images: ' + error.message);
         
        }
      };
      useEffect(() => {
        fetchImages();
      }, [selectedDate, filenameFilter,selectedSize]);
    
      const downloadFile = (filename) => {
        // Trigger download for the file
        const link = document.createElement('a');
        link.href = `http://localhost:5000/uploads/${filename}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
  return (
    <>


<div className="container">

  <Upload fetchImages={fetchImages}/>
<div className='filterSec'>
        
        <div className="name">
        <label>Filename:</label>
        <input type="text" placeholder="Enter filename" onChange={(e) => setFilenameFilter(e.target.value)} />
       </div>
       <div className="size">
        <label htmlFor="">Size:</label>
        <select onChange={(e) => setSelectedSize(e.target.value)}>
          <option value="">Select All</option>
          {size.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
      </select>
      </div>

      <div className="date">
        <label>Date:</label>
        <input type="date" className="formField" onChange={(e) => setSelectedDate(e.target.value)} />
        </div>

      
      </div>

    <div className="row">
      {
        images.filter((image) => {
            if (selectedDate && new Date(image.date).toISOString().split('T')[0] !== selectedDate) {
              return false;
            }
            if (filenameFilter && !image.filename.includes(filenameFilter)) {
              return false;
            }
            if (selectedSize) {
                const imageSize = image.size;
                switch (selectedSize) {
                  case 'Small':
                    if (imageSize > 611949) {
                      return false;
                    }
                    break;
                  case 'Medium':
                    if (imageSize <= 611949 || imageSize > 1024000) {
                      return false;
                    }
                    break;
                  case 'Large':
                    if (imageSize <= 1024001) {
                      return false;
                    }
                    break;
                  default:
                    break;
                }
              }

              return true;
            }).map(({filename,id,date,size,filetype})=>{
            return(
                <div className="col-sm-6 col-md-4 col-lg-3" key={id}>
                <div className="box">
            <div className="filename">
                <p>{filename.substring(0,16)}</p>
            </div>
            <div className="img-box">
          
            {filetype === 'Image' && (
                <><img src={`http://localhost:5000/uploads/${filename}`} alt="" className="img-fluid img-set" />
                 <div className='d-flex justify-content-end ' style={{padding:"0px 10px"}}>
                <button className='mb-2 mt-2 downloadBtn'  onClick={() => downloadFile(filename)}>Download</button></div></>
              )}
              <div className='d-flex justify-content-end ' style={{padding:"0px 10px"}}>
              {filetype === 'Text' && (
                  <button className='mb-2 mt-2 downloadBtn'  onClick={() => downloadFile(filename)}>Download {filetype} file</button>
                
              )}
              </div>

              <div className='d-flex justify-content-end ' style={{padding:"0px 10px"}}>
              {filetype === 'Excel' && (
                  <button className='mb-2 mt-2 downloadBtn'  onClick={() => downloadFile(filename)}>Download {filetype} file</button>
                
              )}
               {filetype === 'Executable' && (
                  <button className='mb-2 mt-2 downloadBtn'  onClick={() => downloadFile(filename)}>Download {filetype} file</button>
                
              )}
              </div>
            </div>
            <div className="details">
            <p>{moment(date).format("MMM Do YY")}</p>
            <p>{Math.floor(size/1024)}KB</p>
            </div>
        </div>
                </div>
            )
        })
      }
    </div>
</div>
    </>
  )
}

export default ImageList