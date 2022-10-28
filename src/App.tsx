import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './App.css';

type SearchUserType = {
    login: string
    id: number
}
type SearchResultType = {
    items: SearchUserType[]
}

const App = () => {
    const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null)
    const [users, setUsers] = useState<SearchUserType[]>([])

    useEffect(() => {
        if (selectedUser) {
            document.title = selectedUser.login
        }
    }, [selectedUser])

    useEffect(() => {
        axios
            .get<SearchResultType>(`https://api.github.com/search/users?q=bruh`)
            .then(res => setUsers(res.data.items))
    }, [])

    return <div className="App">
        <div>
            <div>
                <input placeholder={"search"}/>
                <button>Find</button>
            </div>
            <ul>
                {
                    users.map(user => <li
                            key={user.id}
                            className={selectedUser === user ? 'selected' : ''}
                            onClick={() => {
                                setSelectedUser(user)
                            }}
                        >{user.login}</li>)
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
