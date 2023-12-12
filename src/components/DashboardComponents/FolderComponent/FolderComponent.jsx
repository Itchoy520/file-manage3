import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import ShowItems from "../ShowItems/ShowItems";
import { createSelector } from "reselect";


const selectFileFoldersState = (state) => state.filefolders;

const selectUserFolders = createSelector(
    selectFileFoldersState,
    (filefolders) => filefolders.userFolders
);

const selectCurrentFolderData = createSelector(
    [selectUserFolders, (_, { folderId }) => folderId],
    (userFolders, folderId) =>
        userFolders.find((folder) => folder.docId === folderId)?.data
);

const selectChildFolders = createSelector(
    [selectUserFolders, (_, { folderId }) => folderId],
    (userFolders, folderId) =>
        userFolders.filter((folder) => folder.data.parent === folderId)
);

const selectChildFiles = createSelector(
  [selectFileFoldersState, selectChildFolders, (_, { folderId }) => folderId],
  (filefolders, childFolders, folderId) =>
    filefolders.userFiles.filter((file) => file.data.parent === folderId)
);

const FolderComponent = () => {

    const { folderId } = useParams();

    const { currentFolderData, childFolders, childFiles } = useSelector(
      (state) => ({
          currentFolderData: selectCurrentFolderData(state, { folderId }),
          childFolders: selectChildFolders(state, { folderId }),
          childFiles: selectChildFiles(state, { folderId}),
      }),
      shallowEqual
  );

  const createdFiles = childFiles && childFiles.filter((file) => file.data.url === null);
  const uploadedFiles = childFiles && childFiles.filter((file) => file.data.data === null);


  return (
    <div>
      {
        childFolders.length > 0 ? (
          <>
            {
              childFolders.length > 0 && (
                <ShowItems 
                title={"Created Folders"} 
                type={"folder"}
                items={childFolders}
              />
              )
            }
            
            {
              createdFiles && createdFiles.length > 0 && (
                <ShowItems 
                  title={"Created Files"} 
                  type={"file"}
                  items={createdFiles}
              />
              )
            }

            {
              uploadedFiles && uploadedFiles.length > 0 && (
                <ShowItems 
                  title={"Uploaded Files"} 
                  type={"file"}
                  items={uploadedFiles}
              />
              )
            }
           
          </>
        ): (
          <p className="text-center my-5">
            Empty Folder
          </p>
        )
      }
    </div>

  )
}

export default FolderComponent;

//have error