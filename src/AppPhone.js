import React, { useState, useEffect } from 'react'
import axios from 'axios'
// import numbersService from './services/numbers'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])
  const handleNewName = event => {
    setNewName(event.target.value)
  }
  const handleNewNumber = event => {
    setNewNumber(event.target.value)
  }
  const handleSearch = event => {
    setSearch(event.target.value)
  }
  const addPerson = event => {
    event.preventDefault()
    const allPersons = persons.map(p => p.name)
    let personObject = {
      name: newName,
      number: newNumber
    }
    const confirmNumber=id=>{
      const name=persons.find(n=>n.name===newName)
      const updateNumber={...name, number:newNumber}
      if (window.confirm(`${newName} is already in the phonebook, replace number?`)) {
        personService
        .update(name.id, updateNumber)
        .then(alterdNumber=>{
          setPersons(persons.map(n=>n.id!==id?n:alterdNumber))
        })
      }
    }
    
    personService
      .create(personObject)
      .then(data => { setPersons(persons.concat(data)) })
    setNewName('')
    setNewNumber('')
  }
  const deletePersonOf = id => {
    const person = persons.find(p => p.id == id)
    if (window.confirm(`Delete ${person.name} from Phonebook?`)) {
        // ---DELETE Person from the db.json---
        personService
            .delete(id)
            .then(data => setPersons(persons.filter(p => p.id !== id)))
    }
}
    const filteredPersons = search === '' ? persons :
      persons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    return (
      <div>
        <h1>PhoneBook</h1>
        <div>
          Find Person with: <input value={search} onChange={handleSearch} />
        </div>
        <form onSubmit={addPerson}>
          <div>
            Name, fullname: <input value={newName} onChange={handleNewName} />
          </div>
          <div>
            Phone Number: <input value={newNumber} onChange={handleNewNumber} />
          </div>
          <div>
            <button type="submit">Add</button>
          </div>
          <h3>Numbers</h3>
          <ol>
            {filteredPersons.map(p =>
              <li key={p.name}>
                {p.name} - {p.number}
                <button onClick={() => deletePersonOf(p.id)}>
                  Delete
              </button>
              </li>
            )}
          </ol>
        </form>
      </div>
    )

  }

  export default App