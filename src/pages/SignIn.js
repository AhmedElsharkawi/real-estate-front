import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginFailure, loginStart, loginSuccess } from '../components/redux/user/UserSlice'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from '../firebase/Firebase'

const SignIn = () => {
   
    const [email, setEmail]= useState("")
    const [loading, setLoading]= useState(false)
    const [password, setPassword]= useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {isLoading, error } = useSelector(state => state.user);

    
    const signWithGoogle = async()=>{
      try {
        setLoading(true)
        const provider = new GoogleAuthProvider()
        const auth= getAuth(app) 
        const result = await signInWithPopup(auth, provider)
       
        
        const res = await axios.post(`${process.env.REACT_APP_DOMAIN_URL}/api/auth/google`,{
          name:result.user.displayName,
          email:result.user.email,
          photo:result.user.photoURL,
        },{
          withCredentials:true,
        })
       
        const data = res.data
       
        
        dispatch(loginSuccess(data))
        setLoading(false)
        navigate("/")
      } catch (err) {
        setLoading(false)
        console.log("could not sign with googleeeeeeeeeeeee",err)
      }
    }




const handleSubmit = async (e)=>{
    e.preventDefault()
    dispatch(loginStart())
    try {
        const res = await axios.post(`${process.env.REACT_APP_DOMAIN_URL}/api/auth/login`,{
          email,
          password,
        },{
          withCredentials:true,
        })
        console.log(res)
       dispatch(loginSuccess(res.data))
       navigate("/")
      
    } catch (error) {
      
        dispatch(loginFailure(error.message))
    }

}

  return (
    <div className='w-full h-[100vh] '>
       
        
        <div className='flex flex-col justify-center items-center gap-1 mt-44 sm:w-[60%]  md:w-[40%] mx-auto p-2 '>
        <h1 className='font-bold text-2xl'>Sign In</h1>
         
           <div className='w-[100%] mx-auto mb-2'>
             <h1>Email</h1>
             <input type='email' placeholder='email@example.com...' required  className='w-full p-1  rounded-lg  border border-black bg-white h-9'
             onChange={(e)=>{setEmail(e.target.value)}} />
           </div>
           <div className='w-[100%] mx-auto mb-2'>
             <h1>Password</h1>
             <input type='password' placeholder='password...' required minLength={6} className='w-full p-1  rounded-lg  border border-black bg-white h-9' 
             onChange={(e)=>{setPassword(e.target.value)}}/>
           </div>
           <button type='submit'  disabled={isLoading} className='w-full mb-2 border border-transparent bg-blue-800 h-9 mt-2 rounded-lg  disabled:opacity-80 text-white hover:opacity-90 transition-all' onClick={handleSubmit} > {isLoading ? 'Loading...' : 'Sign In'}</button>
           <button  disabled={loading} className='w-full border border-transparent bg-red-600 h-9 mt-2 rounded-lg   text-white hover:opacity-90 transition-all' onClick={signWithGoogle}>{loading ?  'Loading...': 'Continue with Google'}</button>

           <div className='mb-2'>
            <p>you dont have an account? <Link to="/signup" >
                <span className='text-blue-700'>sign up</span>
            </Link >
            </p>
        </div>
        
        <p className='text-red-700 text-sm'> {error ? error : " "} </p>
       

        </div>
       
    </div>
  )
}

export default SignIn