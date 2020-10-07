import React, { useState, useEffect } from 'react'
import personsService from './services/persons'
import Notification from './components/Notification'

export default function App() {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [search, setSearch] = useState('')
    const [persons, setPersons] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)

    /* ---USEEFFECT/personsService---*/
    useEffect(() => {
        personsService
            .getAll()
            .then(personsDatabase => setPersons(personsDatabase))
    }, [])
    /*--handleName(search, filter, number)Change----*/
    const handleNewName = event => {
        setNewName(event.target.value)
    }
    const handleNewNumber = event => {
        setNewNumber(event.target.value)
    }
    const handleSearch = event => {
        setSearch(event.target.value)
    }
    /*---handlefunctions above---*/

    const findName = persons.some(element => element.name === newName)

    const addPerson = event => {
        event.preventDefault()
        let personObj = {
            name: newName,
            number: newNumber
        }
        const numberConfirm = id => {
            const name = persons.find(p => p.name === newName)
            const updateNumber = { ...name, number: newNumber }
            if (window.confirm(`${newName} is already in the phonebook, replace number?`)) {
                personsService
                    .update(name.id, updateNumber)
                    .then(changedNumber => {
                        setPersons(persons.map(name =>
                            name.id !== id ? name : changedNumber))
                        setErrorMessage(`${newName}'s phone number was updated`)
                        setTimeout(() => setErrorMessage(null), 5000)
                    })
            }
        }
        const showAlert = (condition) => {
            condition ? numberConfirm() :
                personsService
                    .create(personObj)
                    .then(data => {
                        setPersons(persons.concat(data))
                        setErrorMessage(`${newName} was added to the Phonebook`)
                        setTimeout(() => setErrorMessage(null), 5000)
                    })
        }
        showAlert(findName)
        setNewName('')
        setNewNumber('')

    }
    const deletePersonOf = id => {
        let person = persons.find(p => p.id === id)
        if (window.confirm(`Delete ${person.name} from Phonebook?`)) {
            // ---DELETE Person from the db.json---
            personsService
                .delete(id)
                .then(data => setPersons(persons.filter(p => p.id !== id)))
        }
    }
    const filteredPersons = search === '' ? persons :
        persons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={errorMessage} />
            <div>
                Search Person: <input value={search} onChange={handleSearch} />
                <hr />
            </div>
            <form onSubmit={addPerson}>
                <h3>Add a new Number</h3>
                <div>
                    Name: <input value={newName} onChange={handleNewName} />
                </div>
                <div>
                    Number: <input value={newNumber} onChange={handleNewNumber} />
                </div>
                <div>
                    <button type="submit" className='submit'>Add</button>
                </div>
            </form>
            <h3>Numbers</h3>
            <ol>
                {filteredPersons.map(p =>
                    <li key={p.name}>
                        {p.name} - {p.number}
                        <button onClick={() => deletePersonOf(p.id)}>
                            Delete</button>
                    </li>

                )}
            </ol>
        </div>
    )
} 