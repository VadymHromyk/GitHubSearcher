import axios from "axios";

export type GetUsersResponse = {
    error: string | null
    login: string
    id: number
    avatar_url: string
    url: string
}
export type GetUserProfileResponse = {
    public_repos: number
    avatar_url: string
    email: string
    location: string
    created_at: string
    followers: number
    following: number
}
export type GetUserRepositoriesResponse = {
    id: number
    name: string
    forks_count: number
    stargazers_count: number
    html_url: string
}
export type SearchUsersResponse = {
    total_count: number
    items: Array<GetUsersResponse>
}
export type SearchRepositoriesResponse = {
    total_count: number
    items: Array<GetUserRepositoriesResponse>
}

const instance = axios.create({
    baseURL: 'https://api.github.com/',
})

const githubAPI = {
    getUsers() {
        return instance.get<GetUsersResponse[]>(`users?per_page=10`);
    },
    getUserProfile(name: string) {
        return instance.get<GetUserProfileResponse>(`users/${name}`);
    },
    getUserRepositories(name: string) {
        return instance.get<GetUserRepositoriesResponse[]>(`users/${name}/repos?per_page=10`);
    },
    searchUsers(name: string) {
        return instance.get<SearchUsersResponse>(`search/users?q=${name}&per_page=10`);
    },
    searchRepositories(queryString: string) {
        return instance.get<SearchRepositoriesResponse>(`search/repositories?${queryString}&per_page=10`);
    },
}

export default githubAPI;