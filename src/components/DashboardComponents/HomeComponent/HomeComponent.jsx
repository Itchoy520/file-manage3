import { shallowEqual, useSelector } from "react-redux";
import ShowItems from "../ShowItems/ShowItems";
import { createSelector } from "reselect";

// Select the relevant parts of the state
const selectFileFoldersState = (state) => state.filefolders;
const selectUserFolders = (state) => selectFileFoldersState(state).userFolders;
const selectUserFilesState = (state) => selectFileFoldersState(state).userFiles;

// Create a memoized selector using reselect
const selectFilteredUserFolders = createSelector(
  [selectUserFolders],
  (userFolders) => userFolders.filter((folder) => folder.data.parent === "root")
);

const selectFilteredUserFiles = createSelector(
  [selectUserFilesState], // Fix this line
  (userFiles) => userFiles.filter((file) => file.data.parent === "root")
);
const HomeComponent = () => {

//const folders = ["New folder", "new folder 2"];
    /*const files = [
      {data: {name:"New file"} }, 
      {data: {name:"new file 2"} },
    ];*/

    const { isLoading, userFolders, userFiles } = useSelector(
      (state) => ({
        isLoading: selectFileFoldersState(state).isLoading,
        userFolders: selectFilteredUserFolders(state),
        userFiles: selectFilteredUserFiles(state),
      }),
      shallowEqual
    );

  return (
    <div className="col-md-12 w-100">
      {
        isLoading ? (
          <h1 className="display-1 my-5 text-center">Loading...</h1>
        ) : (
          <>
            <ShowItems 
              title={"Created Folders"} 
              type={"folder"}
              items={userFolders}
            />
            <ShowItems 
            title={"Created Files"} 
            type={"file"} 
            items={userFiles.filter((file) => file.data.url === null)}
            />
            <ShowItems 
            title={"Uploaded Files"} 
            type={"file"} 
            items={userFiles.filter((file) => file.data.data === null)}
            />
          </> 
        )
      }
    </div>
  )
}

export default HomeComponent;

//error const folders = ["New folder", "new folder 2"];
//const files = [{name:"New file"}, {name:"new file 2"}];

//have error