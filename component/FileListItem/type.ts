export enum FileListItemType {
  DIRECTORY = 'directory',
  // when unknown file type, use it
  FILE = 'file',
}

export enum ModifyType {
  DELETE = 'delete',
  RENAME = 'rename',
  MOVE = 'move',
}

export interface FileListItemProps {
  fileName: string
  fileType: FileListItemType
}

export type DeleteOpts = { newName?: string; moveToPath?: string }

export interface ModifyHandler {
  /**
   * @param parentFolder The file parent folder which will be modified.
   * @param fileName The file name which will be modified.
   * @param modifyType Modify type: delete, rename, move.
   * @param opts Sometimes we need extra params like the path we will move to.
   */
  (
    parentFolder: string,
    fileName: string,
    modifyType: ModifyType,
    opts?: DeleteOpts
  ): void
}
