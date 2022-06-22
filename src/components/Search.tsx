import { TextField } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import githubAPI, { GetUsersResponse } from '../api';
import './../App.css';

export function Search() {

    const [users, setUsers] = useState<null | GetUsersResponse[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [timerId, setTimerId] = useState<number>(0)

    const fetchUsers = () => {
        githubAPI.getUsers()
            .then((data) => setUsers(data.data))
    }

    useEffect(() => {
        fetchUsers()
    }, []);

    const getUsersByValue = (value: string) => {
        if (value) {
            githubAPI.searchUsers(value)
                .then(data => setUsers(data.data.items))
        } else {
            fetchUsers()
        }
    }

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        setSearchValue(value);
        clearTimeout(timerId)
        const id: number = +setTimeout(getUsersByValue, 500, value)
        setTimerId(id)
    }

    return (
        <div className="search">
            <div className="searchHeader">
                <h2>GitHub Searcher</h2>
                <TextField fullWidth={true} type="text" name="search" placeholder="Search for Users"
                    value={searchValue} onChange={onSearchChange}
                />
            </div>
            <div>
                {users ? users.map(user => (
                    <UserSmallProfile key={user.id} {...user} />
                ))
                    : ""
                }
            </div>
        </div>
    );
};

function UserSmallProfile(user: GetUsersResponse) {

    const navigate = useNavigate();
    const [repoCount, setRepoCount] = useState<number>();

    useEffect(() => {
        githubAPI.getUserProfile(user.login)
            .then((data) => setRepoCount(data.data.public_repos));
    }, []);

    const chooseUser = (userlogin: string) => {
        navigate("/profile", { state: { userlogin: userlogin } });
    }

    return (
        <div className="usersList" onClick={() => chooseUser(user.login)} >
            <div><img src={user.avatar_url} /></div>
            <div className="usersInfo">
                <div>
                    User name: {user.login}
                </div>
                <div>
                    Repositories: {repoCount}
                </div>
            </div>
        </div>
    );
};