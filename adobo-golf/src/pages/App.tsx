import { useNavigate } from "react-router-dom"


function App() {

  const navigate = useNavigate();

  return (
    <>
      <div className='bg-gray-800 text-white h-screen flex justify-center items-center gap-20'>
        <button
          onClick={() => navigate('/series')}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded transition-colors"
        >
          Series
        </button>
        <button
          onClick={() => navigate('/players')}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded transition-colors"
        >
          Players
        </button>
        <button
          onClick={() => navigate('/gallery')}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded transition-colors"
        >
          Gallery
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded transition-colors"
        >
          Admin
        </button>
      </div>
    </>
  )
}

export default App
