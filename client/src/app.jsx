import { Router, route } from 'preact-router'
import { Home } from './components/Home'
import { Login } from './components/Login/'
import { Signup } from './components/Signup'
import { Private } from './components/Private'
import { useUserContext } from './context/userContext';
import { useEffect } from 'preact/hooks'


const BASE_URL = import.meta.env.VITE_BASE_URL;
export const App = () => {
  const { authenticated, setUser, setAuthenticated} = useUserContext();
  const privateRoutes = ['/private'];

  const verifyUser = async () => {
    
    try {
        const res = await fetch(BASE_URL+ '/user/refresh', {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if(res.status === 200){
          setUser({id: data.id, token: data.token});
          setAuthenticated(true);
          console.log('auth')
        }else{
          console.log(data);
          setUser(null);
          setAuthenticated(false);
        }
    } catch (error) {
      setUser(null);
      setAuthenticated(false);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      verifyUser()
    }, 5 * 60 * 1000);
    verifyUser();
    return () => clearInterval(timer);
  }, [])
  
  const handlePathChange = (e) => {
    if(privateRoutes.includes(e.url) && !authenticated){
       route('/');
    }
  }
  
  return(
    <>
      <Router onChange={ handlePathChange }>
          <Home path="/" />
          <Login path="/login" />
          <Signup path="/signup" />
          <Private path="/private" />
      </Router> 
    </>
  )
}

