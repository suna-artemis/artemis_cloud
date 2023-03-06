import {
  useCallback,
  MouseEvent,
  useState,
  CSSProperties,
  ChangeEvent,
} from 'react'

import {
  IconButton,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  ListItem,
  Box,
  ListItemButton,
  Menu,
  MenuItem,
  Typography,
  Input,
} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  ModifyType,
  FileListItemType,
  ModifyHandler,
  FileListItemProps,
} from './type'
import { fileNameValidator } from 'artemis/common/Util'

interface Props extends FileListItemProps {
  parentDirectory: string
  onModify: ModifyHandler
  isBackToParent?: boolean
  onFileClick: (
    parentDirectory: string,
    fileName: string,
    fileType: FileListItemType
  ) => void
  style?: CSSProperties
}

const FileListItem = ({
  parentDirectory,
  fileName,
  fileType,
  isBackToParent = false,
  onFileClick: onClick,
  onModify,
  ...restProps
}: Props) => {
  const [stateFileName, setStateFileName] = useState(fileName)
  const [isEdit, setIsEdit] = useState(false)
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)

  const generateItemIcon = useCallback(() => {
    switch (fileType) {
      case FileListItemType.DIRECTORY:
        return <FolderIcon />
      case FileListItemType.FILE:
        return <InsertDriveFileIcon />
    }
  }, [fileType])

  const handleClick = () => {
    onClick(parentDirectory, fileName, fileType)
  }
  const handleFileNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setStateFileName(e.target.value)
  }
  const handleDownload = () => {
    console.log('download')
  }
  const handleRename = () => {
    const isAllowToRename = fileNameValidator(stateFileName.trim())
    setIsEdit(false)
  }
  const handleDelete = (e: MouseEvent) => {
    // prevent parent dom element caught click event
    e.stopPropagation()
    onModify(parentDirectory, fileName, ModifyType.DELETE)
  }
  const handleMenuClose = () => {
    setAnchor(null)
  }

  return (
    <ListItem
      {...restProps}
      secondaryAction={
        !isBackToParent ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(e) => {
                e.preventDefault()
                setAnchor(e.currentTarget)
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchor}
              open={!!anchor}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                onClick={(e) => {
                  e.preventDefault()
                  // setIsEdit(true)
                  handleMenuClose()
                }}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Rename</ListItemText>
                <Typography variant="body2" color="text.secondary" />
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <></>
        )
      }
    >
      <ListItemButton style={{ display: 'flex' }} onClick={handleClick}>
        <ListItemAvatar>
          <ListItemIcon>{generateItemIcon()}</ListItemIcon>
        </ListItemAvatar>
        {isEdit ? (
          <Input
            sx={{ width: '100%' }}
            value={stateFileName}
            onChange={handleFileNameChanged}
            onBlur={handleRename}
          />
        ) : (
          <ListItemText
            primary={fileName}
            secondary={null && parentDirectory}
          />
        )}
      </ListItemButton>
    </ListItem>
  )
}

export default FileListItem
