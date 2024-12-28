import { gql } from "@apollo/client";

const REGISTER_USER = gql`
mutation RegisterUser($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
  registerUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password)
}
`
const LOGIN_USER = gql`
mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      data {
        id
        firstName
        lastName
        email
        password
      }
      message
      token
    }
  }
`


export {
    REGISTER_USER,
    LOGIN_USER
}