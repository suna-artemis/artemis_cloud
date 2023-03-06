import { useEffect, useState } from 'react'
import { Container, Paper, Backdrop } from '@mui/material'
import { useManualQuery, useMutation, useQueryClient } from 'graphql-hooks'

import FileList from 'artemis/component/FileList'
import { FileListItemType } from 'artemis/component/FileListItem/type'

const CURRENT_PARENT_DIRECTORY = '..'
const ROOT_DIR = '/'

//#region request graphQL query and mutation
const UPLOAD_FILE_LIST_MUTATION = /* GraphQL */ `
  mutation uploadFileList($fileList: [File!]!, $parentDirectory: String!) {
    uploadFileList(fileList: $fileList, parentDirectory: $parentDirectory) {
      name
      type
    }
  }
`
const GET_FILE_INFO_LIST_BY_PARENT_DIRECTORY = /* GraphQL */ `
  query MyQuery($parentDirectory: String!) {
    parentDirectory(parentDirectory: $parentDirectory)
    fileItemList: getFileListByParentDirectory(
      parentDirectory: $parentDirectory
    ) {
      fileName: name
      fileType: type
    }
  }
`
//#endregion

const Index = () => {
  const client = useQueryClient()

  const [uploadFiles] = useMutation(UPLOAD_FILE_LIST_MUTATION, {
    onSuccess: (result: any) => {
      getFileInfoByParentDirectory({
        variables: { parentDirectory: parentDirectoryList.join('') },
      })
    },
  })
  const [parentDirectoryList, setParentDirectoryList] = useState<string[]>([
    ROOT_DIR,
  ])

  // fetch file info list
  const [getFileInfoByParentDirectory, fileInfoRes] = useManualQuery(
    GET_FILE_INFO_LIST_BY_PARENT_DIRECTORY,
    {
      variables: {
        parentDirectory: parentDirectoryList.join(''),
      },
    }
  )
  //#endregion

  //#region use effect
  useEffect(() => {
    getFileInfoByParentDirectory({
      variables: { parentDirectory: parentDirectoryList.join('') },
    })
  }, [getFileInfoByParentDirectory, parentDirectoryList])
  //#endregion

  //#region handle method
  const handleFileSelected = (fileList: FileList) => {
    uploadFiles({
      variables: {
        fileList,
        parentDirectory: parentDirectoryList.join(''),
      },
    })
  }
  const handleFileClick = (
    parentDirectory: string,
    fileName: string,
    fileType: FileListItemType
  ) => {
    if (
      fileType !== FileListItemType.DIRECTORY ||
      (parentDirectoryList.length === 1 &&
        fileName === CURRENT_PARENT_DIRECTORY)
    ) {
      // only allow go into directory and disallow to root directory's parent
      return
    } else if (fileName === CURRENT_PARENT_DIRECTORY) {
      // go back to parent directory
      setParentDirectoryList(
        parentDirectoryList.slice(0, parentDirectoryList.length - 1)
      )
    } else {
      // go into target directory
      setParentDirectoryList(parentDirectoryList.concat(`${fileName}/`))
    }
  }
  //#endregion

  if (fileInfoRes.loading) {
    return <div>loading</div>
  }
  if (fileInfoRes.error) {
    return <div>error</div>
  }

  return (
    <Container maxWidth="xl">
      <Paper
        sx={{
          p: 2,
          mr: 2,
          position: 'relative',
          borderRadius: 4,
          margin: {
            xs: 4,
            md: 0,
          },
          width: {
            xs: '80%',
            md: 1024,
          },
          height: {
            xs: 480,
            md: 720,
          },
        }}
      >
        {fileInfoRes.data && (
          <FileList
            fileItemList={fileInfoRes.data.fileItemList}
            parentDirectory={parentDirectoryList.join('')}
            onFileSelected={handleFileSelected}
            onFileClick={handleFileClick}
          />
        )}
      </Paper>
    </Container>
  )
}

export default Index
