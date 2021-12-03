import { Link } from 'preact-router/match';
import { useUserContext } from '../../context/userContext';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const Home = () => {
    const { authenticated, user, setUser } = useUserContext();
    const logout = () => {
        fetch(BASE_URL+ '/user/logout', {
            method: "POST",
            credentials:"include",
            headers: { 
                "Content-Type": "application/json",
                "X-Auth-Token": user?.token.toString(),
            },
        }).then(res => res.json())
        .then(setUser({...user, ["token"] : null}))
        .catch((err) => {
            setUser({...user, ["token"] : null})
        })
    }
    return (
    <main>
        <h1 class="page-head" >Home Page</h1>
        <p class="w-70ch max-w-90/100 text-lg my-8 mx-auto" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique explicabo expedita fuga eligendi in numquam illum, atque mollitia dolor deleniti tempora voluptatem sunt! Ab, maiores.</p>
        <div class="text-center">
            { (authenticated && user?.token) ? (
                <>
                <Link href="/private" class="button">Private</Link>
                 <button class="button  ml-6" onClick={() => logout()} >Logout</button>
                </>
            ) : (<>
                <Link href="/login" class="button">Login</Link>
                <Link href="/signup" class="button ml-6">Signup</Link>
                </>
            )}
        </div>
    </main>
    )
}