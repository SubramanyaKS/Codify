import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { useLoading } from "../components/loadingContext";
import { useTheme } from "../context/ThemeContext";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave, FaArrowLeft, FaUserShield } from "react-icons/fa";

function AdminUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authorizationToken, API } = useAuth();
  const { setIsLoading } = useLoading();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
    isReadOnlyAdmin:false,
  });

  const getSingleUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API}/admin/users/${id}`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUserData({
          username: data.username,
          email: data.email,
          phone: data.phone,
          password: "",
          isAdmin: data.isAdmin,
          isReadOnlyAdmin : data.isReadOnlyAdmin
        });
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while fetching user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(`${API}/admin/users/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("User updated successfully");
        navigate("/admin/users");
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSingleUserData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-righteous flex items-center gap-2">
          <FaUser className="text-primary" />
          Update <span className="text-primary">User</span>
        </h2>
        
        <button
          onClick={() => navigate("/admin/users")}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
            ${isDark 
              ? 'bg-dark-bg-tertiary hover:bg-primary/20 text-dark-text-primary' 
              : 'bg-light-bg-tertiary hover:bg-primary/20 text-light-text-primary'
            }
          `}
        >
          <FaArrowLeft />
          <span>Back to Users</span>
        </button>
      </div>
      
      <div className={`p-6 rounded-xl shadow-lg ${
        isDark ? 'bg-dark-bg-secondary border border-dark-border' : 'bg-light-bg-secondary border border-light-border'
      }`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label 
                htmlFor="username" 
                className={`block mb-2 font-medium ${
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                }`}
              >
                Username
              </label>
              <div className={`relative`}>
                <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                }`}>
                  <FaUser />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-4 py-3 rounded-lg ${
                    isDark 
                      ? 'bg-dark-bg-tertiary text-dark-text-primary border-dark-border' 
                      : 'bg-light-bg-tertiary text-light-text-primary border-light-border'
                  } border focus:outline-none focus:ring-2 focus:ring-primary`}
                  required
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className={`block mb-2 font-medium ${
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                }`}
              >
                Email
              </label>
              <div className={`relative`}>
                <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                }`}>
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-4 py-3 rounded-lg ${
                    isDark 
                      ? 'bg-dark-bg-tertiary text-dark-text-primary border-dark-border' 
                      : 'bg-light-bg-tertiary text-light-text-primary border-light-border'
                  } border focus:outline-none focus:ring-2 focus:ring-primary`}
                  required
                />
              </div>
            </div>
            
            {/* Phone */}
            <div>
              <label 
                htmlFor="phone" 
                className={`block mb-2 font-medium ${
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                }`}
              >
                Phone
              </label>
              <div className={`relative`}>
                <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                }`}>
                  <FaPhone />
                </div>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-4 py-3 rounded-lg ${
                    isDark 
                      ? 'bg-dark-bg-tertiary text-dark-text-primary border-dark-border' 
                      : 'bg-light-bg-tertiary text-light-text-primary border-light-border'
                  } border focus:outline-none focus:ring-2 focus:ring-primary`}
                  required
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label 
                htmlFor="password" 
                className={`block mb-2 font-medium ${
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                }`}
              >
                Password (leave blank to keep unchanged)
              </label>
              <div className={`relative`}>
                <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                }`}>
                  <FaLock />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-4 py-3 rounded-lg ${
                    isDark 
                      ? 'bg-dark-bg-tertiary text-dark-text-primary border-dark-border' 
                      : 'bg-light-bg-tertiary text-light-text-primary border-light-border'
                  } border focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>
              <p className={`mt-1 text-sm ${
                isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
              }`}>
                Enter a new password only if you want to change it
              </p>
            </div>
          </div>
          
          {/* Admin Toggle */}
          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                checked={userData.isAdmin}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="isAdmin"
                className={`ml-2 flex items-center gap-2 font-medium ${
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                }`}
              >
                <FaUserShield className={userData.isAdmin ? "text-primary" : ""} />
                Admin privileges
              </label>
            </div>
            <p className={`mt-1 text-sm ${
              isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
            }`}>
              Grant this user administrative access to manage all aspects of the platform
            </p>
          </div>
          {/* Read Only  Admin Toggle */}
          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isReadOnlyAdmin"
                name="isReadOnlyAdmin"
                checked={userData.isReadOnlyAdmin}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="isReadOnlyAdmin"
                className={`ml-2 flex items-center gap-2 font-medium ${
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                }`}
              >
                <FaUserShield className={userData.isReadOnlyAdmin ? "text-primary" : ""} />
                Read only Admin privileges
              </label>
            </div>
            <p className={`mt-1 text-sm ${
              isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
            }`}>
              Grant this user administrative access to manage all aspects of the platform
            </p>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <FaSave />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminUpdate;


