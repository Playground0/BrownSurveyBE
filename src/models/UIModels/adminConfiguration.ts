export interface AdminConfiguration{
    id: string,
    type: string,
    collections: AdminConfigurationCollections[]
}

export interface AdminConfigurationCollections{
    id: string,
    name: string
}