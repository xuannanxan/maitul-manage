import React, { useState } from 'react';
import {_contentList} from '../utils/api'

function List(){
    const handleSearchData =  async (page,paginate,tag,category_id,search)=>{
        return await _contentList(page,paginate,tag,category_id,search);
       
    }


    return (
        <div>

        </div>
    )
}

export default List