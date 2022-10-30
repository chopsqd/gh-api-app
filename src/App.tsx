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

type UsersListPropsType = {
    term: string
    selectedUser: SearchUserType | null
    onUserSelect: (user: SearchUserType) => void
}
export const UsersList = (props: UsersListPropsType) => {
    const [users, setUsers] = useState<SearchUserType[]>([])

    useEffect(() => {
        axios
            .get<SearchResultType>(`https://api.github.com/search/users?q=${props.term}`)
            .then(res => setUsers(res.data.items))
    }, [props.term])

    return <ul>
        {
            users.map(user => <li
                key={user.id}
                className={props.selectedUser === user ? 'selected' : ''}
                onClick={() => {
                    props.onUserSelect(user)
                }}
            >{user.login}</li>)
        }
    </ul>
}

type TimerPropsType = {
    seconds: number
    onChange: (actualSeconds: number) => void
    timerKey: string
}
export const Timer = (props: TimerPropsType) => {
    const [seconds, setSeconds] = useState(props.seconds)

    useEffect(() => {
        setSeconds(props.seconds)
    }, [props.seconds])

    useEffect(() => {
        props.onChange(seconds)
    }, [seconds])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSeconds((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(intervalId)
    }, [props.timerKey])

    return <div>{seconds}</div>
}

type UserDetailsPropsType = {
    user: SearchUserType | null

}
export const UserDetails = (props: UserDetailsPropsType) => {
    const [userDetails, setUserDetails] = useState<UserType | null>(null)
    const [seconds, setSeconds] = useState(10)

    useEffect(() => {
        if (!!props.user) {
            axios
                .get<UserType>(`https://api.github.com/users/${props.user.login}`)
                .then(res => {
                    setSeconds(10)
                    setUserDetails(res.data)
                })
        }
    }, [props.user])

    useEffect(() => {
        if(seconds < 1) {
            setUserDetails(null)
        }
    }, [seconds])

    return <div>
        {
            userDetails && <div>
                <Timer seconds={seconds} onChange={setSeconds} timerKey={userDetails.id.toString()}/>
                <h2>
                    <a href={`https://github.com/${userDetails.login}`} target={"_blank"}>{userDetails.login}</a>
                </h2>
                <img src={userDetails.avatar_url}/><br/>
                {userDetails.login}, followers: {userDetails.followers}
            </div>
        }
    </div>
}

const App = () => {
    const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null)
    const [searchTerm, setSearchTerm] = useState('Chopsqd')

    useEffect(() => {
        if (selectedUser) {
            document.title = selectedUser.login
        }
    }, [selectedUser])

    return <div className="App">
        <div>
            <Search value={searchTerm} onSubmit={(value: string) => {
                setSearchTerm(value)
            }}/>
            <button onClick={() => setSearchTerm('Chopsqd')}>Reset</button>
            <UsersList term={searchTerm} selectedUser={selectedUser} onUserSelect={setSelectedUser}/>
        </div>
        <UserDetails user={selectedUser}/>
    </div>
}

export default App;
