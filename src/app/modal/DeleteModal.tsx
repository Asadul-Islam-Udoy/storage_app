'use client'

import { useState } from 'react'

interface DeleteModalProps {
  itemName?: string,
  videoId:number|string,
  videoDeleteShow:boolean,
  setVideoDeleteShow:React.Dispatch<React.SetStateAction<boolean>>
}

export default function DeleteModal({ videoId ,itemName = 'this item',videoDeleteShow,setVideoDeleteShow }: DeleteModalProps) {
  

  const handleDelete = () => {
    setVideoDeleteShow(false)
  }

  return (
    <>
      {videoDeleteShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3 text-red-600">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete <strong>{itemName}</strong>?</p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setVideoDeleteShow(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
