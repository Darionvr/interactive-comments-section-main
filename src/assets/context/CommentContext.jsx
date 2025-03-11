import { createContext, useState } from "react";
import data from "../../data.json"


export const CommentContext = createContext()

const CommentProvider = ({children}) => {

    const [comments, setComments] = useState(data.comments);
    const myUser = data.currentUser;
    
    return(
        <CommentContext.Provider value={{comments, setComments, myUser}}>

            {children}

        </CommentContext.Provider>
    )
}

export default CommentProvider;