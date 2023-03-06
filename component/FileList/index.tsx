import style from './style.module.css'

import { CURRENT_PARENT_DIRECTORY } from 'artemis/common/Const'
import FileListItem from '../FileListItem'
import {
  DeleteOpts,
  FileListItemProps,
  FileListItemType,
  ModifyType,
} from '../FileListItem/type'

import { List, Paper } from '@mui/material'
import UploadSpeedDial from '../UploadSpeedDial'

interface Props {
  fileItemList: FileListItemProps[]
  parentDirectory: string
  onFileClick: (
    parentDirectory: string,
    fileName: string,
    fileType: FileListItemType
  ) => void
  onFileSelected: (fileList: FileList) => void
}

const FileList = ({
  parentDirectory,
  fileItemList,
  onFileSelected,
  onFileClick,
}: Props) => {
  const handleFileClick = (
    parentDirectory: string,
    fileName: string,
    fileType: FileListItemType
  ) => {
    console.log('row clicked', parentDirectory, fileName)
    onFileClick(parentDirectory, fileName, fileType)
  }
  const onModify = (
    name: string,
    parentDirectory: string,
    type: ModifyType,
    opts?: DeleteOpts
  ) => {
    switch (type) {
      case ModifyType.DELETE:
        console.log('deleted!', parentDirectory)
        break
      case ModifyType.MOVE:
        console.log('move', parentDirectory, opts)
        break
      case ModifyType.RENAME:
        console.log('rename', parentDirectory, opts)
    }
  }
  return (
    <>
      <List
        className={style.FileListContainer}
        sx={{
          height: {
            xs: 480,
            md: 720,
          },
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: -8,
            backgroundColor: '#fff',
            zIndex: 1001,
          }}
        >
          <FileListItem
            fileName={CURRENT_PARENT_DIRECTORY}
            fileType={FileListItemType.DIRECTORY}
            parentDirectory={parentDirectory}
            onFileClick={() =>
              handleFileClick(
                parentDirectory,
                CURRENT_PARENT_DIRECTORY,
                FileListItemType.DIRECTORY
              )
            }
            onModify={() => {}}
            isBackToParent={true}
          ></FileListItem>
        </div>
        {fileItemList.map(({ fileName, fileType }) => (
          <FileListItem
            key={parentDirectory + fileName}
            fileName={fileName}
            fileType={fileType}
            parentDirectory={parentDirectory}
            onFileClick={handleFileClick}
            onModify={onModify}
          />
        ))}
      </List>
      <UploadSpeedDial onFileSelected={onFileSelected} />
    </>
  )
}

export default FileList
