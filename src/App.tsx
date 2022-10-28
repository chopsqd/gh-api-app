import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
    const [selectedUser, setSelectedUser] = useState<string | null>(null)

    useEffect(() => {
        if (selectedUser) {
            document.title = selectedUser
        }
    }, [selectedUser])

    return <div className="App">
        <div>
            <div>
                <input placeholder={"search"}/>
                <button>Find</button>
            </div>
            <ul>
                {
                    ['Dimych', 'Artem', 'Misha']
                        .map(user => <li
                            className={selectedUser === user ? 'selected' : ''}
                            onClick={() => {
                                setSelectedUser(user)
                            }}
                        >{user}</li>)
                }
            </ul>
        </div>
        <div>
            <h2>Username</h2>
            <div>Details</div>
        </div>
    </div>
}

export default App;
