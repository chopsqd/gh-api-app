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
type UserType = {
    login: string
    id: number
    avatar_url: string
    followers: number
}

type SearchPropsType = {
    value: string
    onSubmit: (fixedValue: string) => void
}
export const Search = (props: SearchPropsType) => {
    const [tempSearch, setTempSearch] = useState('')

    useEffect(() => {
        setTempSearch(props.value)
    }, [props.value])

    return <div>
        <input
            placeholder={"search"}
            value={tempSearch}
            onChange={(e) => {
                setTempSearch(e.currentTarget.value)
            }}
        />
        <button onClick={() => {
            props.onSubmit(tempSearch)
        }}>Find
        </button>
    </div>
}

const App = () => {
    const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null)
    const [userDetails, setUserDetails] = useState<UserType | null>(null)
    const [users, setUsers] = useState<SearchUserType[]>([])
    const [searchTerm, setSearchTerm] = useState('Chopsqd')

    useEffect(() => {
        if (selectedUser) {
            document.title = selectedUser.login
        }
    }, [selectedUser])
    useEffect(() => {
        axios
            .get<SearchResultType>(`https://api.github.com/search/users?q=${searchTerm}`)
            .then(res => setUsers(res.data.items))
    }, [searchTerm])
    useEffect(() => {
        if (!!selectedUser) {
            axios
                .get<UserType>(`https://api.github.com/users/${selectedUser.login}`)
                .then(res => setUserDetails(res.data))
        }
    }, [selectedUser])

    return <div className="App">
        <div>
            <Search value={searchTerm} onSubmit={(value: string) => {
                setSearchTerm(value)
            }}/>
            <button onClick={() => setSearchTerm('Chopsqd')}>Reset</button>
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
            <h2>{userDetails?.login ?? 'Username'}</h2>
            {
                userDetails && <div>
                    <img src={userDetails.avatar_url}/><br/>
                    {userDetails.login}, followers: {userDetails.followers}
                </div>
            }
        </div>
    </div>
}

export default App;
