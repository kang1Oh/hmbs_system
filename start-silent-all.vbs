Set WshShell = CreateObject("WScript.Shell")

' Get the current directory of the script
strPath = WshShell.CurrentDirectory

' Start Backend (Hidden)
WshShell.Run "cmd /c cd /d " & strPath & "\express-backend && npm start", 0, False

' Wait 5 seconds for backend to initialize
WScript.Sleep 5000

' Start Frontend (Hidden)
WshShell.Run "cmd /c cd /d " & strPath & "\react-frontend && npm run dev", 0, False

Set WshShell = Nothing
