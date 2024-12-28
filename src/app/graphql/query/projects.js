import { gql } from '@apollo/client';

const GET_PROJECTS = gql`
query Projects($page: Int, $limit: Int) {
  projects(page: $page, limit: $limit) {
    projects {
      id
      projectName
      language
      clients {
        id
        clientName
        email
        phone
        goldDigger
      }
      projectManager {
        id
        firstName
        lastName
        email
        password
      }
      startDate
      endDate
      submitDate
      status
    }
    totalData
    limit
    currentPage
    totalPages
  }
}
`

const SEARCH_PROJECTS = gql`
query Query($page: Int, $limit: Int, $search: String) {
  searchProjects(page: $page, limit: $limit, search: $search) {
    projects {
      id
      projectName
      language
      clients {
        id
        clientName
        email
        phone
        goldDigger
      }
      projectManager {
        id
        firstName
        lastName
        email
        password
      }
      startDate
      endDate
      submitDate
      status
    }
    totalData
    limit
    currentPage
    totalPages
  }
}
`




export {
  GET_PROJECTS,
  SEARCH_PROJECTS
}