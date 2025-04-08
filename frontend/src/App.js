import "./style/darkmode.css"
import "./style/tab.css"
import Home from "./Home"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import Pricing from "./Pricing";
import Account from "./Account/Account";
import ErrorPage from "./Error/ErrorPage";
import Dashboard from "./Dashboard";
import Verify from "./Account/2fa/Verify";
import Avatar from "./Avatar/Avatar";

// Create a context for authentication
export const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

function App() {
  // Create a state for authentication
  const [auth, setAuth] = useState(() => {
    // Initialize from localStorage if available
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('auth_username');
    return {
      isAuthenticated: !!token,
      token: token || null,
      username: username || null,
      user: null
    };
  });

  // Create a state for pending verification
  const [pendingVerification, setPendingVerification] = useState(null);

  // Check token validity on initial load
  useEffect(() => {
    const validateToken = async () => {
      if (auth.token) {
        try {
          const response = await fetch('http://localhost:3001/api/protected', {
            headers: {
              'Authorization': auth.token
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Update user data if token is valid
              setAuth(prev => ({
                ...prev,
                isAuthenticated: true,
                username: data.user.username,
                user: data.user
              }));
            } else {
              // Clear auth if token is invalid
              handleLogout();
            }
          } else if (response.status === 401) {
            // Clear auth if token is invalid
            handleLogout();
          }
        } catch (error) {
          console.error("Error validating token:", error);
        }
      }
    };

    validateToken();
  }, []);

  // Function to handle login
  const handleLogin = (authResponse) => {
    if (authResponse.success) {
      if (authResponse.requires2FA) {
        // Store verification details when 2FA is required
        setPendingVerification({
          username: authResponse.username,
          token: authResponse.partialToken // If your backend provides a partial token for 2FA
        });
        console.log(`2FA required for ${authResponse.username}`);
      } else {
        // Set authentication directly when no 2FA is needed
        const newAuth = {
          isAuthenticated: true,
          token: authResponse.token,
          username: authResponse.username,
          user: null // Will be populated on dashboard load
        };

        setAuth(newAuth);
        localStorage.setItem('authToken', authResponse.token);
        localStorage.setItem('auth_username', authResponse.username);

        console.log(`Authentication successful for ${authResponse.username}`);

        // Redirect if specified
        if (authResponse.redirect) {
          window.location.href = authResponse.redirect;
        }
      }
    } else {
      console.log(`Authentication failed: ${authResponse.message}`);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      token: null,
      username: null,
      user: null
    });
    localStorage.removeItem('authToken');
    localStorage.removeItem('auth_username');
  };

  // Handle 2FA verification success
  const handleVerifySuccess = (result) => {
    console.log("Verify result:", result);

    if (result.success) {
      // When 2FA is verified successfully, complete authentication
      const newAuth = {
        isAuthenticated: true,
        token: result.token,
        username: result.username || pendingVerification.username,
        user: null // Will be populated on dashboard load
      };

      setAuth(newAuth);
      setPendingVerification(null);
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('auth_username', result.username || pendingVerification.username);

      console.log(`2FA verification successful for ${result.username || pendingVerification.username}`);

      // Redirect if specified
      if (result.redirect) {
        window.location.href = result.redirect;
      }
    } else {
      console.log(`2FA verification failed: ${result.message}`);
    }
  };

  // Create a PrivateRoute component
  const PrivateRoute = ({ children }) => {
    return auth.isAuthenticated ? children : <Navigate to="/account/login" />;
  };

  const url_main = "http://localhost:3001"
  return (
    // Provide the auth state and functions to all child components
    <AuthContext.Provider value={{
      auth,
      login: handleLogin,
      logout: handleLogout,
      pendingVerification,
      updateUser: (userData) => setAuth(prev => ({ ...prev, user: userData }))
    }}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<ErrorPage error={404}/>} />
          <Route path="/pricing" element={<Pricing />} />

          <Route path="/account" element={
            <Account
              url={url_main}
              onAuthEvent={handleLogin}
            />
          } />
          <Route path="/account/login" element={
            <Account
              defaultTab="login"
              url={url_main}
              onAuthEvent={handleLogin}
            />
          } />
          <Route path="/account/signup" element={
            <Account
              defaultTab="signup"
              url={url_main}
              onAuthEvent={handleLogin}
            />
          } />

          <Route path="/2fa/verify-2fa" element={
            <Verify
              url={url_main}
              username={pendingVerification?.username}
              onVerifySuccess={handleVerifySuccess}
            />
          }/>

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard url={url_main} />
            </PrivateRoute>
          } />


        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
