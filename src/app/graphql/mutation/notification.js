import { gql } from "@apollo/client";

const CREATE_NOTIFICATION = gql`
mutation RegisterNotification($managerId: ID!, $managerEmail: String!, $projectsId: [ID]) {
  registerNotification(managerId: $managerId, managerEmail: $managerEmail, projectsId: $projectsId)
}
`

export { 
    CREATE_NOTIFICATION
}