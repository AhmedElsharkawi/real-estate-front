import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import {  useNavigate, useParams } from 'react-router-dom'
import { app } from '../firebase/Firebase';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CreateListing = (e) => {

    const[files, setFiles]=useState('')
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        imageurls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularprice: 50,
        discountprice: 0,
        offer: false,
        parking: false,
        furnished: false,
      });

      const params = useParams()
      const listingId = params.listingId

      useEffect(() => {
      const fetchListing = async()=>{
      const res = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/api/listing/get/${listingId}`)
      setFormData(res.data)
      if(res.data.success === false){
        console.log(res.data.message)
      }}
    fetchListing()    
    }, [listingId])
      
    

      const {user}= useSelector(state=>state.user)
      const navigate = useNavigate()

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
          setFormData({
            ...formData,
            type: e.target.id,
          });
        }
    
        if (
          e.target.id === 'parking' ||
          e.target.id === 'furnished' ||
          e.target.id === 'offer'
        ) {
          setFormData({
            ...formData,
            [e.target.id]: e.target.checked,
          });
        }
    
        if (
          e.target.type === 'number' ||
          e.target.type === 'text' ||
          e.target.type === 'textarea'
        ) {
          setFormData({
            ...formData,
            [e.target.id]: e.target.value,
          });
        }
      };



const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageurls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageurls: formData.imageurls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };



  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageurls: formData.imageurls.filter((_, i) => i !== index),
    });
  };



  const handleUpdateList = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageurls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularprice < +formData.discountprice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
  
      const response = await axios.put(`${process.env.REACT_APP_DOMAIN_URL}/api/listing/${listingId}`, {
        ...formData,
        userRef: user._id,
        
      },{
        withCredentials:true,
      });
  
      const data = response.data;
      
      setLoading(false);
  
      if (data.success === false) {
        setError(data.message);
      }
  
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  



return (
   <>
     <h1 className='text-center mt-12 mb-[-20px] font-bold text-2xl'>Update a Listing</h1>
     <div className='sm:flex flex-col  xl:flex-row justify-between  mt-12 w-[60%] mx-auto gap-3'>
         <div className='flex-1 flex flex-col gap-5 '>
             <input type='text' placeholder='Name' id='name'
             maxLength='20' minLength='5'required 
              className='p-2 bg-white rounded-lg  outline-none'
              onChange={handleChange}
            value={formData.name} />

             <textarea type='text' placeholder='Description' 
             id='description' required 
             className='p-2 bg-white rounded-lg outline-none' 
             onChange={handleChange}
            value={formData.description} />

             <input type='text' placeholder='Address'id='address' 
              required 
              className='p-2 bg-white rounded-lg outline-none' 
              onChange={handleChange}
            value={formData.address} />

             <div className='flex flex-row items-center flex-wrap gap-3'>

                 <div className='flex items-center gap-1'>

                     <input type='checkbox'
                     id='sale' 
                     onChange={handleChange}
                     checked={formData.type === 'sale'}
                     /> 
                     <span>Sell</span>
                 </div>

                 <div    className='flex items-center gap-1'>
                     <input type='checkbox'
                     id='rent'  className=' ' 
                     onChange={handleChange}
                     checked={formData.type === 'rent'}
                     />
                     <span>Rent</span>
                 </div>
                 <div   className='flex items-center gap-1'>
                     <input type='checkbox'
                     id='parking' className='' 
                     onChange={handleChange}
                     checked={formData.parking}
                     />
                     <span>Parking spot</span>
                 </div>
                 <div  className='flex items-center gap-1'>
                     <input type='checkbox' id='furnished' className='' 
                     onChange={handleChange}
                     checked={formData.furnished}
                     />
                     <span>Furnished</span>
                 </div>
                 <div className='flex items-center gap-1'>
                     <input type='checkbox' id='offer' className=''
                     onChange={handleChange}
                     checked={formData.offer}
                     />
                     <span>Offer</span>
                 </div>

             </div>
             <div className='flex items-center gap-3 flex-wrap'>
                <div className='flex items-center  gap-2' >
                    <input type='number' min='1' max='10'
                     id='bedrooms' required 
                     className='bg-white rounded-lg h-10 w-10  text-center outline-none ' 
                     onChange={handleChange}
                     value={formData.bedrooms}
                     />
                    <span>Beds</span>
                </div>
                <div  className='flex items-center gap-2' >
                    <input type='number'  min='1' max='10' id='bathrooms' required 
                     className='bg-white rounded-lg h-10 w-10  text-center outline-none'
                     onChange={handleChange}
                     value={formData.bathrooms}
                     />
                    <span>Baths</span>
                </div>

                <div  className='flex items-center gap-2' >
                    <input type='number'  id='regularprice'
                    min='50'
                    max='10000000' required 
                     className='bg-white rounded-lg h-10 w-10  text-center outline-none'
                     onChange={handleChange}
                     value={formData.regularprice}
                     />
                    <span>Regular Price 
                    <span className='block text-xs text-center text-gray-700'>($/Month)</span>
                    </span>
                </div>
                {formData.offer && (
                    <div  className='flex items-center gap-2' >
                    <input type='number'  id='discountprice' min='0' max='10000000' required 
                     className='bg-white rounded-lg h-10 w-10  text-center outline-none'
                     onChange={handleChange}
                     value={formData.discountprice}
                     />
                    <span>
                        Discounted Price
                         <span className='block text-xs text-center text-gray-700'>($/Month)</span>
                         </span>
                </div>
                )}
             </div>
         </div>
         <div className='mt-5 flex-1 flex flex-col gap-3 xl:mt-0'>
            <div className='flex flex-row items-center gap-1 flex-wrap'>
                <h1 className='font-semibold '>Images: </h1>
                <span className='text-sm text-gray-400'> the first image will be the cover(max 6)</span>
            </div>
            <div className='flex flex-row items-center gap-3  flex-wrap'>
                <input type='file' id='imageulrs' accept='image/*' multiple  className=' border p-1 rounded-lg' onChange={(e)=>setFiles(e.target.files)} />
                <button disabled={uploading}
                 className=' border border-green-700 text-center rounded-lg  text-green-700 p-2 disabled:opacity-80 hover:opacity-90' onClick={handleImageSubmit}>
                    {uploading ? "Uploading..." : "Upload"}
                    </button>
            </div>
            <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageurls.length > 0 &&
            formData.imageurls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                 <img
                  src={url}
                  alt='listingImage'
                  className='w-20 h-20 object-contain rounded-lg'
                    />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}

          
            
                <button className='text-center text-white bg-slate-700 rounded-lg p-2 hover:opacity-90' type='button' disabled={loading || uploading}
                 onClick={handleUpdateList}> {loading ? 'Updating...' : 'Update listing'} </button>
                
               
                {error && <p className='text-red-700 text-sm'>{error}</p>}
         </div>
     </div>
   </>
  )
}

export default CreateListing