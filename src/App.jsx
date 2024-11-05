import { useState, useEffect } from 'react'
import './App.css'
import { Link } from "react-router-dom";
import { supabase } from './client'

function App() {
  const [user, setUser] = useState({})
  const [users, setUsers] = useState([])
  const [name, setName] = useState("")
  const [speed, setSpeed] = useState(0)
  const [color, setColor] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentEditUser, setCurrentEditUser] = useState(null)

  const readUser = async () => {
    sessionStorage.clear()
    const {data} = await supabase
      .from('users')
      .select()
      .order('created_at', { ascending: true })

    setUsers(data);
    data.forEach((entry) => {
      sessionStorage.setItem(`${entry.id}`, JSON.stringify(entry))
    })
  }

  const createUser = async (event) => {
    event.preventDefault();
    try {
      const {error} = await supabase
        .from('users')
        .insert({ name: name, speed: speed, color: color })
        .select();
      if (error) throw error;
      setUser({ name: name, speed: speed, color: color })
      await readUser()
    } catch (err) {
      console.log(err)
    }
  }

  const openEditModal = (user) => {
    setCurrentEditUser(user)
    setName(user.name)
    setSpeed(user.speed)
    setColor(user.color)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentEditUser(null)
    setName("")
    setSpeed(0)
    setColor("")
  }

  const updateUser = async () => {
    if (!currentEditUser) return
    try {
      const { error } = await supabase
        .from('users')
        .update({ name: name, speed: speed, color: color })
        .eq('id', currentEditUser.id)
      if (error) throw error
      await readUser()
      closeModal()
    } catch (err) {
      console.log(err)
    }
  }

  const deleteUser = async (id) => {
    await supabase
      .from('users')
      .delete()
      .eq('id', id)
    await readUser()
  }

  useEffect(() => {
    readUser()
  }, [])

  return (
    <div className="app-container">
      <div className="weather-wrapper">
        <div className="weather-box">
          <h3>This is the list of all your crewmates!</h3>
          <div className="input-group">
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="speed"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
            />
            <select
              className="days"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="" disabled>Select a color</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="pink">Pink</option>
              <option value="brown">Brown</option>
              <option value="black">Black</option>
            </select>

            <button onClick={createUser}>Create User</button>
          </div>
        </div>

        <div className="forecast-container">
          {users.map((entry) => (
            <div key={entry.id} className="forecast-item">
              <h4>{entry.name}</h4>
              <Link to={`/Details/${entry.id}`}>
                <img
                  src={`/${entry.color}.png`}
                  alt={`${entry.color}`}
                />
              </Link>
              <button onClick={() => openEditModal(entry)}>Edit</button>
              <button onClick={() => deleteUser(entry.id)}>Delete</button>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit User</h2>
              <input
                type="text"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
              />
              <select
              className="days"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="" disabled>Select a color</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="pink">Pink</option>
              <option value="brown">Brown</option>
              <option value="black">Black</option>
            </select>
              <button onClick={updateUser}>Update User</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
