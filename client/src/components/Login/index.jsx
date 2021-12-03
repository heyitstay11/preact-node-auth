import { useState } from 'preact/hooks';
import { useUserContext } from '../../context/userContext';
import { route } from 'preact-router'

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const Login = () => {
  const { setUser, setAuthenticated} = useUserContext();  

    const [formData, setFormData] = useState({
      email:'',
      password:''
    });

    const handleInput = (e) => {
      const [property, value] = [e.target.name, e.target.value];
      setFormData({...formData, [property]: value});
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Login');
      try {
        const res = await fetch(BASE_URL+'/user/login', {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        const data = await res.json();
        if(res.status === 200){
          console.log(data);
          setUser({id: data.id, token: data.token});
          setAuthenticated(true);
          route('/');
        }else{
           console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    return (
      <main>
      <h1 class="page-head" >Login</h1>
      <form onSubmit={handleSubmit} class="flex flex-col w-400px max-w-92/100 mx-auto my-6" >

        <label htmlFor="email" class="text-xl mt-4">Email *</label>
        <input onInput={handleInput} value={formData.email} id="email" name="email" type="email" required />

        <label htmlFor="password" class="text-xl mt-4">Password *</label>
        <input onInput={handleInput} value={formData.password}id="password" name="password" type="password" required />

        <button class="button w-min mx-auto mt-4" type="submit">Submit</button>
      </form>
      </main>
    )
}