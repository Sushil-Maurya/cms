import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import React from 'react'
import './Editor.css'

function CkEditor() {
  return (
    <>
    <div className='card'>
        <div className='card-header d-flex justify-content-between align-items-center'>
            <h3 className='card-title'>Product Description</h3>
        </div>
        <div className='card-body'>
            <CKEditor
            editor={ ClassicEditor }
            // onChange={(event, editor) => {
            //     const data = editor.getData();
            //     // console.log({ event, editor, data })
            // }}
            // data=""
            // config={{
            //     ckfinder: {
            //       uploadUrl: ""
            //     }
            //   }}
            
            />
            
        </div>
    </div>
    </>
  )
}

export default CkEditor