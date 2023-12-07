import {  useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {useEffect, useRef, useState} from "react"
import { app } from '../firebase/Firebase'
import {getDownloadURL, getStorage , ref, uploadBytesResumable} from "firebase/storage"
import axios from "axios"
import { deletefailure, deletestart, deletesuccess, signout, updateFailure, updateStart, updateSuccess } from '../components/redux/user/UserSlice'

const Profile = () => {

  const fileRef = useRef(null)
  const {user, isLoading , error}= useSelector(state=>state.user)
  const [file, setFile]= useState(undefined)
  const [filePerc, setFilePerc]= useState(0)
  const [fileUploadError, setFileUploadError]= useState(false)
  const [formData, setFormData]= useState({})
  const [profileUpdatedSuccessfully, setProfileUpdatedSuccessfully]= useState(false)
  const [showListings, setShowListings]= useState([])
  const [listingError, setListingError]= useState(false)
 
const dispatch = useDispatch()


const handleChange =(e)=>{
setFormData({...formData , [e.target.id]: e.target.value })
}

 useEffect(()=>{
  if(file){
    handleUploadFile(file)
  }
 },[file])

 const handleUploadFile = ()=>{
  const storage = getStorage(app);
  const fileName = new Date().getTime() + file.name;
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef , file);

  uploadTask.on('state_changed',
  (snapshot)=>{
    const progress = (snapshot.bytesTransferred / 
    snapshot.totalBytes )* 100;
    setFilePerc(Math.round(progress));
  },
  (error)=>{
    setFileUploadError(true)
  },
  ()=>{
    getDownloadURL(uploadTask.snapshot.ref)
    .then((downloadUrl)=> setFormData({...formData, avatar: downloadUrl }))
  }) }







const handleUpdate = async (e) => {
  e.preventDefault();
  

  try {
    dispatch(updateStart());

    const response = await axios.put(`${process.env.REACT_APP_DOMAIN_URL}/api/users/${user._id}`, formData,{
      withCredentials:true,
    });

    const data = response.data;

    if (data.success === false) {
      dispatch(updateFailure(data.message));
    } else {
      dispatch(updateSuccess(response.data));
      setProfileUpdatedSuccessfully(true)
    }
  } catch (error) {
    dispatch(updateFailure(error.message));
  }
};





const handleDeleteAccount = async()=>{
try {
  dispatch(deletestart())
  const res = await axios.delete(`${process.env.REACT_APP_DOMAIN_URL}/api/users/${user._id}`);
  dispatch(deletesuccess(res.data))



} catch (error) {
  console.log(error)
  dispatch(deletefailure(error.message))
}
}




const handleSignOut = async ()=>{
  try {
   const res = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/api/auth/signout`)
   dispatch(signout(res.data))
  } catch (error) {
    console.log(error)
    
  }
}



const handleShowListings = async()=>{
  try {
    const res = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/api/users/listing/${user._id}`,{
      withCredentials:true,
    })

setShowListings(res.data)

  } catch (error) {
    setListingError(true)
  }

}




const handleDeleteList = async(listingId)=>{
  try {
    await axios.delete(`${process.env.REACT_APP_DOMAIN_URL}/api/listing/${listingId}`,{
      withCredentials:true,
    })

    setShowListings((prev)=>(prev.filter((listing)=> listing._id !== listingId)))


  } catch (error) {
   console.log(error)
  }
}












  return (
    <div className='flex flex-col  gap-3 p-2 md:max-w-[40%] mx-auto mt-36'>
      <h1 className='font-semibold text-center'>Profile</h1>
      <img src={formData.avatar || user.avatar} alt="profile-img"  className='w-20 h-20 rounded-full self-center object-cover mb-2 cursor-pointer'
       onClick={()=>fileRef.current.click()} />
    
      <p className='text-sm text-center'>
  {fileUploadError ? (
    <span className='text-red-700'>
      Error Image upload(image must be less than 2 mb) </span>
  ) : (
    filePerc > 0 && filePerc < 100 ? (
      <span className='text-slate-700'>
        {`Uploading ${filePerc}%`}</span>
    ) : (
      filePerc === 100 ? (
        <span className='text-green-700'>Image successfully uploaded</span>
      ) : ('')
    )
  )}
</p>

        
        <input type='file' ref={fileRef} accept='image/*' className='hidden' onChange={(e)=>setFile(e.target.files[0])} />

     
      <input type='username' defaultValue={user.username} placeholder='username'
       id="username" className='w-full p-1 border rounded-lg  border-black bg-white h-9 '
        onChange={handleChange}/>


      <input type='email' defaultValue={user.email} placeholder='email'
       id="email" className='w-full p-1 border rounded-lg  border-black bg-white h-9 '
        onChange={handleChange}/>

      <input type='password'  placeholder='password' id="password" 
       className='w-full p-1 border rounded-lg  border-black bg-white h-9 ' onChange={handleChange}/>

      <button className='bg-slate-700 rounded-lg p-2 text-white hover:opacity-90'
       onClick={handleUpdate} disabled={isLoading} >{ isLoading ? "Loading..." : "UPDATE"}</button>

<Link to='/createlist' className='bg-green-700 rounded-lg p-2 text-white hover:opacity-90 text-center'>
        CREATE LISTING
  
</Link>
      <div className='flex flex-row justify-between'>
        <Link to="/signup" className='text-red-700 text-sm' onClick={handleDeleteAccount}>Delete Account</Link>
        <Link to="/signin" className='text-red-700 text-sm' onClick={handleSignOut} >Sign Out</Link>
      </div>
      <p className='text-red-700 text-sm'> {error ? error : ""} </p>
      <p className='text-green-700 text-sm'> {profileUpdatedSuccessfully ? 'profile has been updated successfully' : ""} </p>
      <h1 className='text-green-700 text-center font-semibold cursor-pointer' 
      onClick={handleShowListings}>Show My Lists</h1>

      {showListings && showListings.length > 0 && (showListings.map((listing)=>(
       <div className='flex flex-row  items-center justify-between border gap-4 p-3' key={listing._id}>

            <Link to={`/listing/${listing._id}`} className=''>
                      <img src={listing.imageurls[0]} alt={listing.name} className='h-16 w-16 rounded-lg object-contain' />
              
            </Link>     

              <Link to={`/listing/${listing._id}`} className='flex-1' >
                <h1 className='truncate	 hover:underline   '>{listing.name}</h1>
                
              </Link>   

        <div className='flex flex-col  '> 
          <span className='text-red-700 cursor-pointer' onClick={()=>handleDeleteList(listing._id)}>Delete</span>
          <Link to={`/update-listing/${listing._id}`}>
            <span className='text-green-700' >Edit</span>
          </Link >
         </div>
       </div>
      )))}
    </div>
  )
}

export default Profile