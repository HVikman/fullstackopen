import { useState, useEffect } from "react";
import personService from "./services/persons";
import "./app.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);
  console.log(persons.length, "persons");

  const addPerson = (event) => {
    event.preventDefault();
    console.log("click", event.target);

    const oldPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (oldPerson) {
      const confirmed = window.confirm(
        `${newName} already exists with number ${oldPerson.number}. Replace the old number with ${newNumber}?`
      );

      if (confirmed) {
        const newPerson = { ...oldPerson, number: newNumber };

        personService
          .update(oldPerson.id, newPerson)
          .then(() => {
            setPersons((prevpersons) =>
              prevpersons.map((person) =>
                person.id === oldPerson.id ? newPerson : person
              )
            );
            setNewName("");
            setNewNumber("");
            setMessage(`Updated ${newName}`);
            setMessageType("ok");
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          })
          .catch((error) => {
            setMessage(`${oldPerson.name} does not exist anymore`);
            setMessageType("error");
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          });
      }
    } else {
      const newObject = { name: newName, number: newNumber };

      personService.create(newObject).then((response) => {
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");

        setMessage(`Added ${newName}`);
        setMessageType("ok");
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };
  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);
  };

  const personsToShow = persons.filter(
    (person) =>
      person.name && person.name.toLowerCase().startsWith(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add person</h2>
      <Form
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={personsToShow}
        setPersons={setPersons}
        setMessage={setMessage}
        setMessageType={setMessageType}
      />
    </div>
  );
};

export default App;

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter persons: <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};
const Form = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};
const Persons = ({ persons, setPersons, setMessage, setMessageType }) => {
  const handleDelete = (person) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((oldperson) => oldperson.id !== person.id));
          setMessage(`${person.name} deleted`);
          setMessageType("ok");
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        })
        .catch((error) => {
          setMessage(`${person.name} does not exist anymore`);
          setMessageType("error");
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        });
    }
  };

  return (
    <div>
      {persons.length > 0 &&
        persons.map((person) => (
          <p key={person.id}>
            {person.name} {person.number}{" "}
            <button type="button" onClick={() => handleDelete(person)}>
              delete
            </button>
          </p>
        ))}
    </div>
  );
};
const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }
  return <div className={type}>{message} </div>;
};
