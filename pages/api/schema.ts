import * as fsp from 'fs/promises'

import { createSchema } from 'graphql-yoga'

export const STATIC_ROOT_PATH = 'root'

enum FileInfoType {
  FILE = 'file',
  DIRECTORY = 'directory',
  // like socket, link, fifo pipe,
  OTHER = 'other',
}

interface FileInfo {
  name: string
  type: FileInfoType
}

const typeDefs = /* GraphQL */ `
  scalar File
  scalar Buffer
  type FileInfo {
    name: String!
    type: String!
  }
  type Query {
    info: String!
    FileInfo: FileInfo!
    parentDirectory(parentDirectory: String!): String!
    getFileListByParentDirectory(parentDirectory: String!): [FileInfo!]!
    getFileContentByParentDirectory(parentDirectory: String!): Buffer!
  }
  type Mutation {
    uploadFileList(fileList: [File!]!, parentDirectory: String!): [FileInfo]!
  }
`
const resolvers = {
  Query: {
    info: () => 'This is an amazing framework!',
    getFileListByParentDirectory: async (
      _: unknown,
      { parentDirectory }: { parentDirectory: string }
    ): Promise<FileInfo[]> => {
      const res =
        (await fsp
          .readdir(`${STATIC_ROOT_PATH}${parentDirectory}`, {
            withFileTypes: true,
          })
          .catch((error) => {
            fsp.mkdir(`${STATIC_ROOT_PATH}${parentDirectory}`)
          })) ?? []
      return res.map((file) => ({
        name: file.name,
        type: file.isFile()
          ? FileInfoType.FILE
          : file.isDirectory()
          ? FileInfoType.DIRECTORY
          : FileInfoType.OTHER,
      }))
    },
    getFileContentByParentDirectory: async (
      _: unknown,
      { parentDirectory }: { parentDirectory: string }
    ): Promise<Buffer> => {
      const res = await fsp.readFile(`${STATIC_ROOT_PATH}${parentDirectory}`)
      return res
    },
    parentDirectory: (
      _: unknown,
      { parentDirectory }: { parentDirectory: string }
    ) => parentDirectory,
    FileInfo: {
      name: ({ name }: FileInfo) => name,
      type: ({ type }: FileInfo) => type,
    },
  },
  Mutation: {
    uploadFileList: async (
      _: unknown,
      {
        fileList,
        parentDirectory,
      }: { parentDirectory: string; fileList: any[] }
    ) => {
      for (const file of fileList) {
        await fsp.writeFile(
          `${STATIC_ROOT_PATH}${parentDirectory}/${file.name}`,
          file.blobParts
        )
      }
      return fileList.map(({ name, type, lastModified }: any) => ({
        name,
        type,
        lastModified,
      }))
    },
  },
}

export const schema = createSchema({
  typeDefs,
  resolvers,
})
