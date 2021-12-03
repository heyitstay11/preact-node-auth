import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
   
    return (
        <UserContext.Provider value={{
            user,
            authenticated,
            setUser,
            setAuthenticated,
        }}>
            { children }
        </UserContext.Provider>
    )   
}

const useUserContext = () => {
    return useContext(UserContext);
}

export {useUserContext, UserProvider};