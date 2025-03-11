import { createContext, useContext, useState } from "react";

export const ModalContext = createContext()

const ModalProvider = ({ children }) => {
    const [deleteCModal, setDeleteCModal] = useState({ isOpen: false, commentId: null });
    const [deleteRModal, setDeleteRModal] = useState({ isOpen: false, commentId: null, replyId: null });

return(
    <ModalContext.Provider value={{deleteCModal, setDeleteCModal, deleteRModal, setDeleteRModal}}> 

        {children}
    </ModalContext.Provider>
)

}
export default ModalProvider;