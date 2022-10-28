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
    const [tempSearch, setTempSearch] = useState('')

    useEffect(() => {
        if (selectedUser) {
            document.title = selectedUser.login
        }
    }, [selectedUser])

    const fetchData = (term: string) => {
        axios
            .get<SearchResultType>(`https://api.github.com/search/users?q=${term}`)
            .then(res => setUsers(res.data.items))
    }

    useEffect(() => {
        fetchData('Chopsqd')
    }, [])

    return <div className="App">
        <div>
            <div>
                <input
                    placeholder={"search"}
                    value={tempSearch}
                    onChange={(e) => {
                        setTempSearch(e.currentTarget.value)
                    }}
                />
                <button onClick={() => {
                    fetchData(tempSearch)
                }}>Find</button>
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
