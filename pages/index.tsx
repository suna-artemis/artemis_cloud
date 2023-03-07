import { useEffect, useState } from 'react'
import { Container, Paper } from '@mui/material'
import { useManualQuery, useMutation } from 'graphql-hooks'
import downloadFile from 'js-file-download'

import FileList from 'artemis/component/FileList'
import {
  FileListItemProps,
  FileListItemType,
} from 'artemis/component/FileListItem/type'

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
  query getFileInfoListByParentDirectory($parentDirectory: String!) {
    parentDirectory(parentDirectory: $parentDirectory)
    fileItemList: getFileListByParentDirectory(
      parentDirectory: $parentDirectory
    ) {
      fileName: name
      fileType: type
    }
  }
`
const GET_FILE_CONTENT_BY_PARENT_DIRECTORY = /* GraphQL */ `
  query getFileContentByParentDirectory($parentDirectory: String!) {
    parentDirectory(parentDirectory: $parentDirectory)
    fileContentBuffer: getFileContentByParentDirectory(
      parentDirectory: $parentDirectory
    )
  }
`
//#endregion

const Index = () => {
  const [fileType, setFileType] = useState(FileListItemType.DIRECTORY)
  const [parentDirectoryList, setParentDirectoryList] = useState<string[]>([
    ROOT_DIR,
  ])
  const [fileItemList, setFileItemList] = useState<FileListItemProps[]>([])
  //#region graphql hook
  const [uploadFiles] = useMutation(UPLOAD_FILE_LIST_MUTATION, {
    onSuccess: (result: any) => {
      getFileInfoByParentDirectory({
        variables: { parentDirectory: parentDirectoryList.join('') },
      })
    },
  })
  const [getFileInfoByParentDirectory, fileInfoRes] = useManualQuery(
    GET_FILE_INFO_LIST_BY_PARENT_DIRECTORY,
    {
      variables: {
        parentDirectory: parentDirectoryList.join(''),
      },
    }
  )
  const [getFileContentByParentDirectory, fileContentRes] = useManualQuery(
    GET_FILE_CONTENT_BY_PARENT_DIRECTORY,
    {
      variables: {
        parentDirectory: parentDirectoryList.join(''),
      },
    }
  )
  //#endregion

  //#region use effect
  useEffect(() => {
    if (
      !!fileInfoRes &&
      !fileInfoRes.loading &&
      !fileInfoRes.error &&
      fileInfoRes.data?.fileItemList
    ) {
      setFileItemList(fileInfoRes.data?.fileItemList)
    }
  }, [fileInfoRes])
  useEffect(() => {
    fileType === FileListItemType.DIRECTORY
      ? getFileInfoByParentDirectory({
          variables: { parentDirectory: parentDirectoryList.join('') },
        })
      : getFileContentByParentDirectory({
          variables: { parentDirectory: parentDirectoryList.join('') },
        })
  }, [
    fileType,
    parentDirectoryList,
    getFileInfoByParentDirectory,
    getFileContentByParentDirectory,
  ])
  useEffect(() => {
    if (
      !!fileContentRes &&
      !fileContentRes.loading &&
      !fileContentRes.error &&
      fileContentRes.data?.fileContentBuffer
    ) {
      downloadFile(
        Buffer.from(fileContentRes.data.fileContentBuffer.data),
        parentDirectoryList[parentDirectoryList.length - 1]
      )
    }
  }, [fileContentRes, parentDirectoryList])
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
      parentDirectoryList.length === 1 &&
      fileName === CURRENT_PARENT_DIRECTORY
    ) {
      // only allow go into directory and disallow to root directory's parent
      return
    } else if (fileName === CURRENT_PARENT_DIRECTORY) {
      // go back to parent directory
      setParentDirectoryList(
        parentDirectoryList.slice(0, parentDirectoryList.length - 1)
      )
    } else {
      setParentDirectoryList(
        parentDirectoryList.concat(
          `${fileName}${fileType === FileListItemType.DIRECTORY ? '/' : ''}`
        )
      )
      setFileType(fileType)
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
        <FileList
          fileItemList={fileItemList}
          parentDirectory={parentDirectoryList.join('')}
          onFileSelected={handleFileSelected}
          onFileClick={handleFileClick}
        />
      </Paper>
    </Container>
  )
}

export default Index
