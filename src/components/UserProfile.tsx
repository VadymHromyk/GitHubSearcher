import { TextField } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import githubAPI, { GetUserProfileResponse, GetUserRepositoriesResponse } from '../api';

export interface LocationProp {
    userlogin: string
}

export function UserProfile() {

    const [userProfile, setUserProfile] = useState<GetUserProfileResponse>();
    const [usersRepositories, setUsersRepositories] = useState<GetUserRepositoriesResponse[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [timerId, setTimerId] = useState<number>(0)

    const data = useLocation().state as LocationProp;

    const fetchRepositories = () => {
        githubAPI.getUserProfile(data.userlogin)
            .then((data) => setUserProfile(data.data))
            .then(() => githubAPI.getUserRepositories(data.userlogin))
            .then((data) => setUsersRepositories(data.data))
    }

    useEffect(() => {
        fetchRepositories()
    }, []);

    const getRepositoriesByValue = (value: string) => {
        const queryString = 'q=' + encodeURIComponent(`${value} in:name user:${data.userlogin}`);
        if (value) {
            githubAPI.searchRepositories(queryString)
                .then(data => setUsersRepositories(data.data.items))
        } else {
            fetchRepositories()
        }
    }

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        setSearchValue(value);
        clearTimeout(timerId)
        const id: number = +setTimeout(getRepositoriesByValue, 500, value)
        setTimerId(id)
    }

    const formatDate = (date: string | undefined) => {
        if (date) {
            return date.toString().slice(0, 10)
        }
        else return "none"
    };

    const openRepoOnGithub = (urlRepo: string) => {
        window.open(urlRepo, "_blank")
    }

    return (
        <div className="userProfile">
            <div className="userProfileTitle">
                <h2>GitHub Searcher</h2>
            </div>
            <div className="userProfileInfo">
                <img src={userProfile?.avatar_url} />
                <div>
                    UserName: <br />
                    Email: <br />
                    Location: <br />
                    Join Date: <br />
                    Followers: <br />
                    Following: <br />
                </div>
                <div>
                    {data.userlogin} <br />
                    {userProfile?.email || "none email"} <br />
                    {userProfile?.location || "none location"} <br />
                    {formatDate(userProfile?.created_at)} <br />
                    {userProfile?.followers} <br />
                    {userProfile?.following} <br />
                </div>
            </div>
            <div>
                <TextField fullWidth={true} type="text" name="search" placeholder="Search for User's Repositories"
                    value={searchValue} onChange={onSearchChange}
                />
            </div>
            <div>
                <h3>Repositories:</h3>
                {usersRepositories ? usersRepositories.map(repository => (
                    <div
                        key={repository.id}
                        onClick={() => openRepoOnGithub(repository.html_url)}
                        className="reposInfo"
                    >
                        <div>
                            {repository.name} <br />
                        </div>
                        <div>
                            {repository.forks_count} Forks <br />
                            {repository.stargazers_count} Stars <br />
                        </div>
                    </div>
                ))
                    : ""
                }
            </div>
        </div>
    );
};
