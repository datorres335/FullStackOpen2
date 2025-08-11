import { gql } from '@apollo/client';
import { REPOSITORY_FIELDS } from './fragments';

export const GET_REPOSITORIES = gql`
  query {
    repositories {
      edges {
        node {
          ...RepositoryFields
        }
        cursor
      }
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
  ${REPOSITORY_FIELDS}
`;

export const GET_REPOSITORY = gql`
  query getRepository($repositoryId: ID!) {
    repository(id: $repositoryId) {
      ...RepositoryFields
    }
  }
  ${REPOSITORY_FIELDS}
`;

export const ME = gql`
  query {
    me {
      id
      username
    }
  }
`;