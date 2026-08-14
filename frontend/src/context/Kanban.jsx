import { createContext, useContext, useReducer } from 'react';
import { useEffect } from 'react';
const KanbanContext = createContext();

const initialState = {
  isDarkMode: localStorage.getItem('theme') === 'dark' ? true : false,
  isSidebarOpen: localStorage.getItem('sidebar') === 'open' ? true : false,
  isMobileSidebarOpen: false,
  isCreateBoardOpen: false,
  isDropDownOpen: false,
  isMenuTabOpen: false,
  isEditBoardOpen: false,
  isUploadModalOpen: false,
  isSmallMenuTabOpen: false,
  isEditInfoOpen: false,
  isEditTaskId: null,
  isEditTaskOpen: false,
  isDeleteModalOpen: false,
  isCreateTaskOpen: false,
  isAddColumnOpen: false,
  isOTPModalOpen: false,
  otpExpiresAt: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case 'TOGGLE_MOBILE_SIDEBAR':
      return { ...state, isMobileSidebarOpen: !state.isMobileSidebarOpen };
    case 'OPEN_CREATE_BOARD':
      return {
        ...state,
        isMobileSidebarOpen: false,
        isCreateBoardOpen: true,
      };
    case 'CLOSE_CREATE_BOARD':
      return {
        ...state,
        isMobileSidebarOpen: false,
        isCreateBoardOpen: false,
      };
    case 'TOGGLE_DROP_DOWN':
      return {
        ...state,
        isDropDownOpen: !state.isDropDownOpen,
        isMobileSidebarOpen: false,
        isMenuTabOpen: false,
        isDeleteModalOpen: false,
      };
    case 'TOGGLE_MENU_TAB':
      return {
        ...state,
        isDropDownOpen: false,
        isMenuTabOpen: !state.isMenuTabOpen,
        isMobileSidebarOpen: false,
      };
    case 'OPEN_CREATE_TASK':
      return {
        ...state,
        isCreateTaskOpen: true,
      };
    case 'CLOSE_CREATE_TASK':
      return {
        ...state,
        isCreateTaskOpen: false,
      };
    case 'OPEN_EDIT_BOARD':
      return {
        ...state,
        isEditBoardOpen: true,
        isDropDownOpen: false,
        isMobileSidebarOpen: false,
      };
    case 'CLOSE_EDIT_BOARD':
      return {
        ...state,
        isEditBoardOpen: false,
        isMobileSidebarOpen: false,
        isDropDownOpen: false,
      };
    case 'TOGGLE_UPLOAD_MODAL':
      return {
        ...state,
        isUploadModalOpen: !state.isUploadModalOpen,
        isEditBoardOpen: false,
        isMobileSidebarOpen: false,
        isDropDownOpen: false,
      };
    case 'TOGGLE_SMALL_MENUBAR':
      return {
        ...state,
        isSmallMenuTabOpen: !state.isSmallMenuTabOpen,
        isEditBoardOpen: false,
        isMobileSidebarOpen: false,
        isDropDownOpen: false,
      };
    case 'OPEN_TASK_INFO':
      return {
        ...state,
        isEditInfoOpen: true,
        isDeleteModalOpen: false,
        isCreateBoardOpen: false,
        isDropDownOpen: false,
        isMenuTabOpen: false,
        isEditBoardOpen: false,
        isUploadModalOpen: false,
        isSmallMenuTabOpen: false,
        isEditTaskOpen: false,
        isEditTaskId: action.payload,
      };
    case 'CLOSE_TASK_INFO':
      return {
        ...state,
        isEditInfoOpen: false,
      };
    case 'OPEN_EDIT_TASK':
      return {
        ...state,
        isEditTaskOpen: true,
        isEditInfoOpen: false,
        isDeleteModalOpen: false,
      };
    case 'CLOSE_EDIT_TASK':
      return {
        ...state,
        isEditTaskOpen: false,
      };
    case 'CLOSE_BOARD':
      return {
        ...state,
        isSmallMenuTabOpen: false,
        isDeleteModalOpen: false,
        isDropDownOpen: false,
        isUploadModalOpen: false,
        isEditBoardOpen: false,
        isMobileSidebarOpen: false,
      };
    case 'OPEN_COLUMN':
      return {
        ...state,
        isAddColumnOpen: true,
      };
    case 'CLOSE_COLUMN':
      return {
        ...state,
        isAddColumnOpen: false,
      };
    case 'OPEN_DELETE_MODAL':
      return {
        ...state,
        isDeleteModalOpen: true,
      };
    case 'OPEN_OTP_MODAL':
      return {
        ...state,
        isOTPModalOpen: true,
        otpExpiresAt: action.payload,
      };
    case 'CLOSE_OTP_MODAL':
      return {
        ...state,
        isOTPModalOpen: false,
        otpExpiresAt: null,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function Kanban({ children }) {
  const [
    {
      isDarkMode,
      isSidebarOpen,
      isCreateBoardOpen,
      isEditBoardOpen,
      isEditTaskId,
      isCreateTaskOpen,
      isDropDownOpen,
      isMenuTabOpen,
      isOTPModalOpen,
      isEditTaskOpen,
      isUploadModalOpen,
      isDeleteModalOpen,
      otpExpiresAt,
      isAddColumnOpen,
      isEditInfoOpen,
      isMobileSidebarOpen,
      isSmallMenuTabOpen,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('sidebar', isSidebarOpen ? 'open' : 'closed');
  }, [isSidebarOpen]);

  return (
    <KanbanContext.Provider
      value={{
        isDarkMode,
        isSidebarOpen,
        isEditTaskId,
        otpExpiresAt,
        isOTPModalOpen,
        isEditInfoOpen,
        isCreateTaskOpen,
        isAddColumnOpen,
        isMobileSidebarOpen,
        isSmallMenuTabOpen,
        isUploadModalOpen,
        isEditTaskOpen,
        isDropDownOpen,
        isMenuTabOpen,
        isEditBoardOpen,
        isCreateBoardOpen,
        isDeleteModalOpen,
        dispatch,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

function useKanban() {
  const context = useContext(KanbanContext);
  if (context === undefined)
    throw new Error('Context was used outside the parent container');

  return context;
}

export { useKanban, Kanban };
