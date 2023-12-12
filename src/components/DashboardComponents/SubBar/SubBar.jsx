import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faFileUpload , faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import "./SubBar.css";
import { useNavigate } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { changeFolder } from "../../../redux/actionCreators/fileFoldersActionCreator";

//have changes added showSubBar
const SubBar = ({ setIsCreateFolderModalOpen, setIsCreateFileModalOpen, showSubBar, setIsFileUploadModalOpen }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {currentFolder, currentFolderData, userFolders} = useSelector(
        (state) => ({
        currentFolder: state.filefolders.currentFolder,
        currentFolderData: state.filefolders.userFolders.find(
            (folder) => folder.docId === state.filefolders.currentFolder
        ),
        userFolders: state.filefolders.userFolders,
    }), shallowEqual);

    const handleNavigate = (link, id) => {
    // Assuming that 'changeFolder' action creator updates the Redux state
    dispatch(changeFolder(id));
    navigate(link);
  };

  return (
    //have changes added showSubBar
    <nav className={`navbar navbar-expand-lg mt-2 navbar-light bg-white py-2 ${showSubBar ? '' : 'd-none'}`}>
        <nav className="ms-5" aria-label="breadcrumb">
            <ol className="breadcrumb dd-flex align-items-center">
            {currentFolder !== "root" ? (
      <>
        <button
          onClick={() => handleNavigate("/dashboard", "root")}
          className="breadcrumb-item btn btn-link text-decoration-none"
        >
          Root
        </button>
        {currentFolderData?.data.path.map((folderId, index) => {
          const folder = userFolders.find((fldr) => fldr.docId === folderId);
          if (folder) {
            return (
              <button
                key={index}
                className="breadcrumb-item btn btn-link text-decoration-none"
                onClick={() =>
                  handleNavigate(`/dashboard/folder/${folder.docId}`, folder.docId)
                }
              >
                {folder.data.name}
              </button>
            );
          }
          return null;
        })}
        <li className="breadcrumb-item active">{currentFolderData?.data.name}</li>
      </>
    ) : (
      <>
        <li className="breadcrumb-item active">Root</li>
      </>
    )}
                        
            </ol>
        </nav>

        <ul className="navbar-nav ms-auto me-5">
            <li className="nav-item mx-2">
                <button className="btn btn-outline-dark"
                  onClick={() => setIsFileUploadModalOpen(true)}>
                <FontAwesomeIcon icon={faFileUpload} /> &nbsp;
                    Upload File
                </button>
            </li>
            <li className="nav-item mx-2">
                <button className="btn btn-outline-dark" onClick={() => setIsCreateFileModalOpen(true)}>
                    <FontAwesomeIcon icon={faFileAlt} /> &nbsp;
                    Create File
                </button>
            </li>
            <li className="nav-item ms-2">
                <button className="btn btn-outline-dark" 
                onClick={() => setIsCreateFolderModalOpen(true)}>
                    <FontAwesomeIcon icon={faFolderPlus} /> &nbsp;
                    Create Folder
                </button>
            </li>
        </ul>
    </nav>
  )
}

export default SubBar



/*
{currentFolder !== "root" ? (
                    <>
                        <button
                            onClick={() => handleNavigate("/dashboard", "root")}
                            className="breadcrumb-item btn btn-link text-decoration-none"
                        >
                            Root
                        </button>
                        {currentFolderData?.data.path.map((folder, index) => (
                            <button
                                key={index}
                                className="breadcrumb-item btn btn-link text-decoration-none"
                                onClick={() =>
                                    handleNavigate(
                                        `/dashboard/folders/${
                                            userFolders.find((fldr) => folder === fldr.docId).docId
                                        }`,
                                        userFolders.find((fldr) => folder === fldr.docId).docId
                                    )
                                }
                            >
                                {userFolders.find((fldr) => folder === fldr.docId).data.name}
                            </button>
                        ))}
                        <li className="breadcrumb-item active ">
                            {currentFolderData?.data.name}
                        </li>
                    </>
                ) : (
                    <>
                        <li className="breadcrumb-item active">Root</li>
                    </>
                )}
*/