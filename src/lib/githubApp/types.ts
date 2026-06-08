export interface GitHubAppRepository {
  owner: string;
  name: string;
  fullName: string;
  defaultBranch?: string;
  private: boolean;
  htmlUrl: string;
}

export type GitHubAppRepositoryListStatus = 'idle' | 'loading' | 'loaded' | 'not_configured' | 'error';
