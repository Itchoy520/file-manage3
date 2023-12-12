import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SignOutUser, fetchUserImage } from '../../../redux/actionCreators/authActionCreator';
import { useRef } from 'react';
import fire from '../../../API/firebase';
import '../../../style.css';

const Navbar = () => {
  const inputRef = useRef(null);
  const [image, setImage] = useState(null);

  const { isAuthenticated, user, userImage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleHomeClick = () => {
    window.location.reload();
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    // Validate file type (PNG, JPEG, GIF)
    const validFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
    if (!validFileTypes.includes(file.type)) {
      alert('Invalid file type. Please select a PNG, JPEG, or GIF file.');
      return;
    }

    try {
      // Generate a unique filename or use the user's ID as the filename
      const filename = `${user.uid}_${file.name}`;

      // Upload the file to Firebase Storage
      const storageRef = fire.storage().ref(); // Use the storage instance from firebase
      const imageRef = storageRef.child(`images/${filename}`);
      await imageRef.put(file);

      // Get the download URL of the uploaded image
      const imageUrl = await imageRef.getDownloadURL();

      // Update the image state and localStorage
      setImage(imageUrl);
      localStorage.setItem('userImage', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  useEffect(() => {
    setImage(userImage || "./user.png");

    const storedImageData = localStorage.getItem('userImage');
    if (storedImageData) {
      setImage(storedImageData);
    }

    if (isAuthenticated) {
      dispatch(fetchUserImage(user.uid));
    }
  }, [isAuthenticated, user.uid, userImage]);
  

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-lg p-3">
      <Link className="navbar-brand ms-5" to="/dashboard">
        File Management System
      </Link>

      {isAuthenticated && (
        <div className="user-info-container ms-auto">
          <div
            onClick={handleImageClick}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            {image ? (
              <img
                src={image}
                alt=""
                className="img-display-after"
              />
            ) : (
              <img src="./user.png" alt="" className="img-display-before" />
            )}
            <input
              type="file"
              ref={inputRef}
              onChange={handleImageChange}
              accept=".png, .jpeg, .jpg, .gif" // Specify accepted file types
              style={{ display: 'none' }}
            />
          </div>

          <div className="dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ marginRight: '30px' }}
            >
              Welcome, {user.displayName}
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <Link className="dropdown-item" onClick={handleHomeClick}>
                  Home
                </Link>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => dispatch(SignOutUser())}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
