import RepositoryItem from './RepositoryItem';

const RepositoryInfo = ({ repository }) => {
  return <RepositoryItem repository={repository} showGitHubButton={true} />;
};

export default RepositoryInfo;