import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SignOutUser, fetchUserImage } from '../../redux/actionCreators/authActionCreator';
import fire from '../../API/firebase';

const NavigationComponent = () => {
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
      const storageRef = fire.storage().ref();
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
      <Link className="navbar-brand ms-5" to="/">
        React Firebase File Management System
      </Link>

      <ul className="navbar-nav ms-auto me-5">
        {isAuthenticated ? (
          <>
            <li className="nav-item" style={{ cursor: 'pointer', marginRight: '10px' }}>
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
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Welcome, {user.displayName}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/dashboard">
                    Dashboard
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
            </li>
          </>
        ) : (
          <>
            <li className="nav-item mx-2">
              <Link className="btn btn-primary btn-sm" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="btn btn-success btn-sm" to="/register">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavigationComponent;
