import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isLoading:false,
  error:null
}

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
    
    },
    loginSuccess: (state,action) => {
      state.user= action.payload
      state.isLoading = false
      state.error = null
    },
    loginFailure: (state, action) => {
      state.error = action.payload
      state.user = null
      state.isLoading = false
    },
    updateStart: (state) => {
      state.isLoading = true
    
    },
    updateSuccess: (state,action) => {
      state.user= action.payload
      state.isLoading = false
      state.error = null
    },
    updateFailure: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    deletestart:(state)=>{
      state.isLoading = true
    },
    deletesuccess:(state , action)=>{
      state.isLoading = false
      state.user = action.payload
      state.error = null
    },
    deletefailure:(state , action)=>{
      state.error = action.payload
      state.isLoading = false
    },
    signout:(state)=>{
      state.user = null
      state.isLoading = false
      state.error = null

    }
  },
})

// Action creators are generated for each case reducer function
export const { loginStart,
   loginSuccess,
   loginFailure, 
   updateFailure, 
   updateStart,
    updateSuccess,
  deletefailure,
deletestart,
deletesuccess,
signout,

} = UserSlice.actions

export default UserSlice.reducer