export const fileNameValidator = (fileName: string) => {
  // Must not be empty.
  // Must not start with .
  // Must not be com0-com9, con, lpt0-lpt9, nul, prn
  // Must not contain | * ? \ : < > $
  // Must not end with .
  const fileNameReg =
    /^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/
  return fileNameReg.test(fileName)
}
