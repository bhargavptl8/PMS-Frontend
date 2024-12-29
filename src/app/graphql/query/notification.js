import { gql } from "@apollo/client";

const GET_NOTIFICATION = gql`
query Query($managerId: ID!) {
  notifications(managerId: $managerId) {
    projects {
      id
      projectName
      language
      startDate
      endDate
      submitDate
      status
    }
    manager {
      id
      firstName
      lastName
      email
      password
    }
    managerEmail
  }
}
`

export {
    GET_NOTIFICATION
}