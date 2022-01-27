const initialState = { loginToken:false }

const token = (state=initialState,{type,payload})=>{
    switch(type){
        case 'VALID_TOKEN':
            return{loginToken:true}
        case 'UNVALID_TOKEN':
            return{loginToken:false}
        default:
            return state;
    }
}

export default token;

export const validToken = ()=>{
    return{
        type:"VALID_TOKEN",
        payload:true
    }
}

export const unvalidToken = ()=>{
    return{
        type:"UNVALID_TOKEN",
        payload:false
    }
}