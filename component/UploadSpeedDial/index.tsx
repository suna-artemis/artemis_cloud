import { ChangeEvent, useRef } from 'react'

import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material'
import { UploadFile, CreateNewFolder } from '@mui/icons-material'

interface Props {
  onFileSelected: (fileList: FileList) => void
}

const UploadSpeedDial = ({ onFileSelected }: Props) => {
  const uploadRef = useRef<HTMLInputElement>(null)

  const onUploadBtnClick = () => {
    if (!!uploadRef.current) {
      uploadRef.current.click()
    }
  }

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    !!e.target?.files?.length && onFileSelected(e.target.files)
  }

  return (
    <SpeedDial
      sx={{ position: 'absolute', bottom: 48, right: 48 }}
      icon={<SpeedDialIcon />}
      ariaLabel={''}
    >
      <SpeedDialAction
        icon={<UploadFile />}
        tooltipTitle={'Upload file here.'}
        onClick={onUploadBtnClick}
      ></SpeedDialAction>
      <input
        ref={uploadRef}
        type="file"
        accept="*"
        onChange={handleFileSelected}
        hidden
        multiple
      />
      <SpeedDialAction
        icon={<CreateNewFolder />}
        tooltipTitle={'Create new folder here.'}
      />
    </SpeedDial>
  )
}

export default UploadSpeedDial
