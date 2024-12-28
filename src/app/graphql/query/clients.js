import { gql } from '@apollo/client';

const GET_CLIENTS = gql`
query Query($page: Int, $limit: Int) {
  clients(page: $page, limit: $limit) {
    clients {
      id
      clientName
      email
      phone
      goldDigger
      projects {
        id
        projectName
        language
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
    }
    totalData
    limit
    currentPage
    totalPages
  }
}
`

const SEARCH_CLIENT = gql`
query SearchClients($page: Int, $limit: Int, $search: String) {
  searchClients(page: $page, limit: $limit, search: $search) {
    clients {
      id
      clientName
      email
      projects {
        id
        projectName
        language
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
      phone
      goldDigger
    }
    totalData
    limit
    currentPage
    totalPages
  }
}
`



export {
  GET_CLIENTS, SEARCH_CLIENT
}