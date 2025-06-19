// Default configuration values
export const DEFAULT_CONFIG = {
  MIRO_WORKSPACE_ID: '3458764627547574495',
  TRELLO_BOARD_ID: 'KE5TzV2Y',
  TRELLO_LIST_ID: '681f6826a4dd59bb2c717861',
} as const;

// Environment variable fallbacks
export const getDefaultMiroWorkspaceId = (): string => {
  return process.env.REACT_APP_MIRO_DEFAULT_WORKSPACE_ID || DEFAULT_CONFIG.MIRO_WORKSPACE_ID;
};

export const getDefaultTrelloBoardId = (): string => {
  return process.env.REACT_APP_TRELLO_DEFAULT_BOARD_ID || DEFAULT_CONFIG.TRELLO_BOARD_ID;
};

export const getDefaultTrelloListId = (): string => {
  return process.env.REACT_APP_TRELLO_DEFAULT_LIST_ID || DEFAULT_CONFIG.TRELLO_LIST_ID;
};
