!include nsDialogs.nsh

!ifdef UNINSTALLER_OUT_FILE
!undef UNINSTALLER_OUT_FILE
!endif
!define UNINSTALLER_OUT_FILE "${BUILD_RESOURCES_DIR}\\uninstaller-placeholder.txt"

!ifndef BUILD_UNINSTALLER
Var DesktopShortcutCheckbox
Var StartupShortcutCheckbox
Var DesktopShortcutState
Var StartupShortcutState
!endif

!macro customPageAfterChangeDir
  Page custom CreateShortcutOptionsPage LeaveShortcutOptionsPage
!macroend

!ifndef BUILD_UNINSTALLER
Function CreateShortcutOptionsPage
  nsDialogs::Create 1018
  Pop $0
  ${If} $0 == error
    Abort
  ${EndIf}

  ${NSD_CreateLabel} 0 0 100% 24u "请选择要创建的快捷方式："
  Pop $0
  ${NSD_CreateCheckbox} 0 30u 100% 12u "创建桌面快捷方式"
  Pop $DesktopShortcutCheckbox
  ${NSD_SetState} $DesktopShortcutCheckbox ${BST_CHECKED}
  ${NSD_CreateCheckbox} 0 52u 100% 12u "开机自启动"
  Pop $StartupShortcutCheckbox
  ${NSD_SetState} $StartupShortcutCheckbox ${BST_CHECKED}
  nsDialogs::Show
FunctionEnd

Function LeaveShortcutOptionsPage
  ${NSD_GetState} $DesktopShortcutCheckbox $DesktopShortcutState
  ${NSD_GetState} $StartupShortcutCheckbox $StartupShortcutState
FunctionEnd
!endif

!macro customInstall
  WriteUninstaller "$INSTDIR\Uninstall HALO Music.exe"
  ${If} $DesktopShortcutState == ${BST_CHECKED}
    CreateShortCut "$DESKTOP\HALO Music.lnk" "$INSTDIR\HALO Music.exe"
  ${EndIf}
  ${If} $StartupShortcutState == ${BST_CHECKED}
    CreateShortCut "$SMSTARTUP\HALO Music.lnk" "$INSTDIR\HALO Music.exe" "--startup"
  ${EndIf}
!macroend

!macro customUnInstall
  Delete "$DESKTOP\HALO Music.lnk"
  Delete "$SMSTARTUP\HALO Music.lnk"
!macroend
