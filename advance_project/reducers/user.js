const initialState = { userData:{firstName:'', lastName:'', email:''} }

const user = (state=initialState,{type,payload})=>{
    switch(type){
        case 'UPDATE_USER':
            return{userData:payload}
        case 'CLEAR_USER':
            return{userData:""}
        default:
            return state;
    }
}

export default user;

export const updateUserData = (new_data)=>{
    return{
        type:"UPDATE_USER",
        payload:new_data
    }
}

export const clearUserData = ()=>{
    return{
        type:"CLEAR_USER",
        payload:''
    }
}