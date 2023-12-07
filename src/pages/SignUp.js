import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase/Firebase'
import { loginSuccess } from '../components/redux/user/UserSlice'

const SignUp = () => {
    const [username, setUsername]= useState("")
    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")
    const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()

   
   


   
    const signWithGoogle = async()=>{
      try {
       
        const provider = new GoogleAuthProvider()
        const auth= getAuth(app) 
        const result = await signInWithPopup(auth, provider)
       
        
        const res = await axios.post(`${process.env.REACT_APP_DOMAIN_URL}/api/auth/google`,{
          name:result.user.displayName,
          email:result.user.email,
          photo:result.user.photoURL,
        },{
          withCredentials:true
        })
       
        const data = res.data
       
        
        dispatch(loginSuccess(data))
        
        navigate("/")
      } catch (err) {
        
        console.log("could not sign with googleeeeeeeeeeeee",err)
      }
    }





    const handleSubmit = async (e) => {
        e.preventDefault();
      
        
      
        try {
         setLoading(true)
           await axios.post(`${process.env.REACT_APP_DOMAIN_URL}/api/auth/register`, {
            username,
            email,
            password,
          });
          
      setLoading(false )
      navigate("/signin")

        } catch (error) {
          console.error('Error:', error.message);
          setLoading(false)
          setError(error.message)
        }
       
      };

      
  return (
    <div className='w-full h-[100vh] '>
       
        
        <div className='flex flex-col justify-center items-center gap-1 mt-44  sm:w-[60%]  md:w-[40%] mx-auto p-2'>
        <h1 className='font-bold text-2xl'>Sign Up</h1>
           <div className='w-[100%] mx-auto mb-2'>
             <h1 className=''>Username</h1>
             <input type='text' placeholder='username...' required className='w-full p-1 border rounded-lg  border-black bg-white h-9 '
               onChange={(e)=>{setUsername(e.target.value)}} />
           </div>
           <div className='w-[100%] mx-auto mb-2'>
             <h1>Email</h1>
             <input type='email' placeholder='email@example.com...' required  className='w-full p-1  rounded-lg  border border-black bg-white h-9'
             onChange={(e)=>{setEmail(e.target.value)}} />
           </div>
           <div className='w-[100%] mx-auto mb-2'>
             <h1>Password</h1>
             <input type='password' placeholder='password...' required minLength='6' className='w-full p-1  rounded-lg  border border-black bg-white h-9' 
             onChange={(e)=>{setPassword(e.target.value)}}/>
           </div>
           <button type='submit'  disabled={loading} className='w-full mb-2 border border-transparent bg-blue-800 text-white hover:opacity-90 disabled:opacity-80 transition-all h-9 mt-2 rounded-lg 'onClick={handleSubmit} > {loading ? 'Loading...' : 'Sign Up'}</button>
           <button  className='w-full border border-transparent bg-red-600 h-9 mt-2 rounded-lg  text-white hover:opacity-90 transition-all  ' onClick={signWithGoogle}>Sign up with Google</button>

           <div className='mb-2'>
            <p>you already have an account? <Link to="/signin" >
                <span className='text-blue-700 '>sign in</span>
            </Link ></p>
        </div>
        
        <p className='text-red-700 text-sm'> {error ? error : " "} </p>    

        </div>
       
    </div>
    
  )
}

export default SignUp