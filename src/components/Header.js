import { Link, useNavigate } from "react-router-dom"
import { MdOutlineSearch } from "react-icons/md";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";


const Header = () => {
  const {user} = useSelector(state=>state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

    const handleSearch = async(e)=>{
      e.preventDefault()
      const urlParams = new URLSearchParams(window.location.search)
      urlParams.set('searchTerm', searchTerm)
      const searchQuery = urlParams.toString()
      navigate(`/search?${searchQuery}`)
      // try {
      //   const res = await axios.get(`${process.env.REACT_APP_DOMAIN_URL}/api/listing/get`)
      //   setSearchTerm(res.data)
      // } catch (error) {
      //   console.log(error)
      // }

    }

    useEffect(() => {
   const urlParams = new URLSearchParams(window.location.search)
   const searchTermFormUrl = urlParams.get('searchTerm')
   if(searchTermFormUrl){ 
    setSearchTerm(searchTermFormUrl)}
      }, [])
    

  return (
    <div className="w-full mb-1 ">
      <div className="px-10 py-3 flex  items-center justify-between bg-salte-200 shadow-md">
        <div>
          <Link to="/" className="text-sm sm:text-xl font-bold ">
            <span className="text-slate-500">Shark</span>
            <span className="text-slate-700">-Estate</span></Link>
        </div >

        <form className=" justify-between items-center border-gray-300 border rounded-md p-1 hidden sm:flex bg-slate-50" 
        onSubmit={handleSearch}>

          <input type="text" placeholder="search..." value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
           className="border-none  outline-none bg-transparent w-15 sm:w-48"/>
          <MdOutlineSearch className="bg-transparent" />

        </form>
        <div className="flex justify-between items-center gap-2 md:gap-6">
          <Link to="/" className=" text-slate-700 hidden sm:flex hover:underline text-sm sm:text-xl">Home</Link>
          <Link to="/about" className="  hover:underline text-sm sm:text-xl text-slate-700 ">About</Link>
          
          { user ? (<Link to={("/profile")}>
            <img src={user.avatar} alt="avatar"  className="h-[30px] w-[30px] rounded-full object-cover"/>
          </Link>) :
          (          <Link to="/signin" className="  hover:underline text-sm sm:text-xl text-slate-700">Sign In</Link>
          ) }
        </div>
      </div>
    </div>
  )
}

export default Header