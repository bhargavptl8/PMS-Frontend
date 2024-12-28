import { gql } from "@apollo/client";

const CREATE_CLIENT = gql`
mutation Mutation($clientName: String!, $email: String!, $phone: Int!, $goldDigger: String!) {
  registerClient(clientName: $clientName, email: $email, phone: $phone, goldDigger: $goldDigger)
}
`
const UPDATE_CLIENT = gql`
mutation Mutation($clientId: ID!, $clientName: String!, $email: String!, $phone: Int!, $goldDigger: String!) {
  editClient(clientId: $clientId, clientName: $clientName, email: $email, phone: $phone, goldDigger: $goldDigger)
}
`
const DELETE_CLIENT = gql`
mutation DeleteClient($clientId: ID!) {
  deleteClient(clientId: $clientId)
}
`

export {
  CREATE_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT
}