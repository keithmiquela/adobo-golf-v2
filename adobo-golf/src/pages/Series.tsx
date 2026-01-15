import React from 'react'
import { createSupabaseClient } from '../services/supabase'

const Series = () => {

    const database = createSupabaseClient();


    const clickButton = async() => {
        const {data, error} = await database
        .from('series')
        .select(`*`)
        if(error){
            console.error(error);
            return;
        }
        console.log(data);
    }
  return (
    <>
        <div className=' bg-gray-800 text-white h-screen flex justify-center items-center'>
            <div className='w-[90vw] bg-gray-600 text-center'>
                <button onClick={clickButton}>Test</button>
            </div>
        </div>
    </>
  )
}

export default Series