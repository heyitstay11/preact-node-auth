import { route } from 'preact-router';
import { useState, useEffect } from 'preact/hooks';
import { useUserContext } from '../../context/userContext';

const BASE_URL = import.meta.env.VITE_BASE_URL;
export const Private = () => {

    const { user } = useUserContext();
    const [data, setData] = useState(null);

    const getData = async () => {
        const res = await fetch(BASE_URL + '/user/myData', {
            method: "GET",
            credentials:"include",
            headers: { 
                "Content-Type": "application/json",
                "X-Auth-Token": user?.token.toString(),
             },
        });
        const data = await res.json();
        setData(data);
    }

    useEffect(() => {
        getData();
    }, []);

    return(
    <>
        <h1 class="page-head">Personal info - {(new Date).toISOString()} </h1>
        <p class="w-70ch max-w-90/100 text-lg my-8 mx-auto">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos numquam voluptates molestiae 
            reprehenderit modi error similique aliquam qui consequatur unde.</p>
            {data ? (
                <p class="w-70ch max-w-90/100 text-lg my-8 mx-auto">{ JSON.stringify(data) }</p>
            )  : null}
        <div class="text-center">
            <button class="button" onClick={() => getData()} >Refresh Data</button>
        </div>
    </>
    )
}