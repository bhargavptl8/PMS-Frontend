import { gql } from "@apollo/client";

const CREATE_PROJECT = gql`
mutation RegisterProject($projectName: String!, $language: String!, $clients: [ID]!, $projectManager: ID!, $startDate: Date, $endDate: Date,$submitDate: Date, $status: String) {
  registerProject(projectName: $projectName, language: $language, clients: $clients, projectManager: $projectManager, startDate: $startDate, endDate: $endDate,submitDate:$submitDate, status: $status)
}
`
const UPDATE_PROJECT = gql`
mutation Mutation($projectName: String!, $language: String!, $clients: [ID]!, $projectManager: ID!, $projectId: ID!, $startDate: Date, $endDate: Date,$submitDate:Date, $status: String) {
  editProject(projectName: $projectName, language: $language, clients: $clients, projectManager: $projectManager, projectId: $projectId, startDate: $startDate, endDate: $endDate,submitDate:$submitDate, status: $status)
}
`
const DELETE_PROJECT = gql`
mutation DeleteProject($projectId: ID!) {
  deleteProject(projectId: $projectId)
}
`

export {
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT
}