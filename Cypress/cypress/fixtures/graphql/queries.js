export const getHubStatus = `query getHubStatus($projectID: String!){
  getHubStatus(projectID: $projectID){
    id
    RepoURL
    RepoBranch
    IsAvailable
    TotalExp
    HubName
    IsPrivate
    AuthType
    Token
    UserName
    Password
    IsRemoved
    SSHPrivateKey
    SSHPublicKey
    LastSyncedAt
  }
}`;