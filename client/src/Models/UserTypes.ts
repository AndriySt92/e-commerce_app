export interface IUser {
    _id: string
    name: string
    email: string
    isAdmin: string
    createdAt:string
    token?: string 
}

export interface ILoginFormData {
    email: string
    password: string
}

export interface IRegisterFormData extends ILoginFormData {
    name: string
}

export interface IUpdateProfileFormData {
    name?: string
    email: string
    password: string
}
