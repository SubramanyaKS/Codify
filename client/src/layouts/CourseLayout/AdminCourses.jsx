import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useLoading } from "../../components/loadingContext";
import { useTheme } from "../../context/ThemeContext";
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrashAlt, FaEye, FaPlus, FaUser, FaLayerGroup } from "react-icons/fa";
import { MdSearch, MdCategory, MdVideoLibrary, MdSchedule, MdPlayArrow } from "react-icons/md";

function AdminCourses() {
  const { authorizationToken, API } = useAuth();
  const [courses, setCourses] = useState([]);
  const { setIsLoading } = useLoading();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API}/admin/courses`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCourses(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        setIsLoading(true);
        const response = await fetch(`${API}/admin/courses/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: authorizationToken,
          },
        });
        if (response.ok) {
          const data = await response.json();
          toast.success(data.message);
          fetchCourses();
        } else {
          toast.error("Course not deleted!");
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while deleting the course");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Get unique categories
  const categories = ["all", ...new Set(courses.map(course => course.course_category))];

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  // Get sorted and filtered courses
  const getSortedCourses = () => {
    let filteredCourses = [...courses];

    // Apply category filter
    if (selectedCategory !== "all") {
      filteredCourses = filteredCourses.filter(course =>
        course.course_category === selectedCategory
      );
    }

    // Apply search filter
    if (searchTerm) {
      filteredCourses = filteredCourses.filter(course =>
        course.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.creator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredCourses.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredCourses;
  };

  const sortedCourses = getSortedCourses();

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    if (sortConfig.direction === 'ascending') return <FaSortUp className="text-primary" />;
    if (sortConfig.direction === 'descending') return <FaSortDown className="text-primary" />;
    return <FaSort className="text-gray-400" />;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${isDark ? 'bg-dark-bg-primary text-dark-text-primary' : 'bg-light-bg-primary text-light-text-primary'}`}>
      {/* Background with grid pattern */}
      <div className={`absolute top-0 left-0 w-full h-full -z-10 bg-[size:30px_30px] ${isDark ? 'bg-grid-pattern-dark' : 'bg-grid-pattern-light'}`}>
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-dark-bg-primary/90 via-transparent to-dark-bg-primary/50' : 'bg-gradient-to-br from-light-bg-primary/90 via-transparent to-light-bg-primary/50'}`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-righteous tracking-wider mb-4 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
              Course Management
            </h1>
            <div className={`h-1 rounded-full bg-gradient-to-r ${isDark ? 'from-primary via-primary-dark to-primary' : 'from-primary via-primary-dark to-primary'}`}></div>
          </div>
          <p className={`mt-6 text-lg max-w-2xl mx-auto ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            Manage course content, categories, and creator information with comprehensive administrative controls.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-8">
          <div className={`relative p-6 rounded-2xl shadow-lg bg-gradient-to-br backdrop-blur-xl ${
            isDark 
              ? 'from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000' 
              : 'from-blue-50 to-indigo-50 border border-light-border'
          }`}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center`}>
                  <MdVideoLibrary className="text-primary text-xl" />
                </div>
                <div>
                  <h2 className={`text-xl font-righteous ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                    Course Management
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                    Search and manage courses
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search input */}
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl ${
                      isDark 
                        ? 'bg-dark-bg-tertiary text-dark-text-primary border-dark-border' 
                        : 'bg-white text-light-text-primary border-light-border'
                    } border focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
                  />
                  <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary text-xl" />
                </div>

                {/* Category filter */}
                <div className="flex items-center gap-2">
                  <MdCategory className="text-primary text-xl" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-4 py-3 rounded-xl ${
                      isDark
                        ? 'bg-dark-bg-tertiary text-dark-text-primary border-dark-border'
                        : 'bg-white text-light-text-primary border-light-border'
                    } border focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add New Course Button */}
                <Link
                  to="/admin/courses/add"
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  <FaPlus />
                  <span>Add Course</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: MdVideoLibrary,
              label: "Total Courses",
              value: courses.length,
              color: "text-blue-500",
              bgColor: "bg-blue-500/10"
            },
            {
              icon: FaLayerGroup,
              label: "Categories",
              value: categories.length - 1,
              color: "text-green-500",
              bgColor: "bg-green-500/10"
            },
            {
              icon: MdPlayArrow,
              label: "Filtered Results",
              value: sortedCourses.length,
              color: "text-purple-500",
              bgColor: "bg-purple-500/10"
            }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`group relative p-6 rounded-2xl shadow-lg bg-gradient-to-br transition-all duration-300 overflow-hidden hover:shadow-2xl hover:-translate-y-1 ${
                isDark 
                  ? 'from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl' 
                  : 'from-blue-50 to-indigo-50 border border-light-border hover:border-primary/50'
              }`}
            >
              {/* Animated border on hover */}
              <div className="absolute top-0 right-0 w-0 h-full bg-primary rounded-r-2xl group-hover:w-1 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 w-full h-0 bg-primary rounded-b-2xl group-hover:h-1 transition-all duration-300" />

              <div className="flex items-center">
                <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-300`}>
                  <stat.icon className={`${stat.color} text-2xl`} />
                </div>
                
                <div>
                  <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                    {stat.label}
                  </p>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} group-hover:text-primary transition-colors duration-300`}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Course Cards */}
        <div className="space-y-6">
          {sortedCourses.length === 0 ? (
            <div className={`relative p-12 rounded-2xl shadow-lg bg-gradient-to-br backdrop-blur-xl text-center transition-all duration-300 ${
              isDark 
                ? 'from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000' 
                : 'from-blue-50 to-indigo-50 border border-light-border'
            }`}>
              <div className={`w-20 h-20 mx-auto mb-6 rounded-xl flex items-center justify-center ${isDark ? 'bg-dark-bg-primary' : 'bg-light-bg-primary'}`}>
                <MdVideoLibrary className="text-primary text-3xl" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                No courses found
              </h3>
              <p className={`${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                {searchTerm ? "Try adjusting your search terms or category filter." : "Course content will appear here."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedCourses.map((course, index) => (
                <div
                  key={course._id}
                  className={`group relative p-6 rounded-2xl shadow-lg bg-gradient-to-br backdrop-blur-xl transition-all duration-300 overflow-hidden hover:shadow-2xl hover:-translate-y-1 ${
                    isDark 
                      ? 'from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000' 
                      : 'from-blue-50 to-indigo-50 border border-light-border hover:border-primary/50'
                  }`}
                >
                  {/* Animated border on hover */}
                  <div className="absolute top-0 right-0 w-0 h-full bg-primary rounded-r-2xl group-hover:w-1 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 w-full h-0 bg-primary rounded-b-2xl group-hover:h-1 transition-all duration-300" />

                  {/* Header with course info and actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                        <img
                          src={course.course_image || 'https://via.placeholder.com/64x64?text=Course'}
                          alt={course.course_title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x64?text=Course';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-lg mb-1 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} group-hover:text-primary transition-colors duration-300 line-clamp-2`}>
                          {course.course_title}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} flex items-center gap-1`}>
                          <FaUser className="text-xs" />
                          {course.creator_name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isDark 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-primary/20 text-primary'
                      }`}>
                        {course.course_category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Course description */}
                  <div className={`p-4 rounded-xl mb-4 ${
                    isDark 
                      ? 'bg-dark-bg-tertiary/50 border border-dark-border/30' 
                      : 'bg-white/50 border border-light-border/30'
                  }`}>
                    <div className="flex items-start gap-2 mb-2">
                      <MdVideoLibrary className="text-primary text-lg mt-1 flex-shrink-0" />
                      <span className={`text-sm font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                        Description:
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} pl-6 line-clamp-3`}>
                      {course.description || "No description available for this course."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/courses/update/${course._id}`}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                          isDark 
                            ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300' 
                            : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 hover:text-blue-600'
                        }`}
                        title="Edit course"
                      >
                        <FaEdit className="text-lg" />
                      </Link>
                      <button
                        onClick={() => deleteCourse(course._id)}
                        className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                          isDark 
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300' 
                            : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600'
                        }`}
                        title="Delete course"
                      >
                        <FaTrashAlt className="text-lg" />
                      </button>
                    </div>

                    <Link
                      to={`/courses/${course._id}`}
                      target="_blank"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                        isDark
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                      title="View course"
                    >
                      <FaEye className="text-sm" />
                      <span className="text-sm font-medium">View</span>
                    </Link>
                  </div>

                  {/* Course metadata */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-opacity-20 border-gray-300">
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`flex items-center gap-1 ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                        <MdVideoLibrary className="text-primary" />
                        ID: {course._id.slice(-6)}
                      </span>
                    </div>
                    <div className={`text-xs ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                      Course #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sorting Controls */}
        {courses.length > 0 && (
          <div className={`mt-8 p-4 rounded-xl ${
            isDark 
              ? 'bg-dark-bg-secondary border border-dark-border' 
              : 'bg-light-bg-secondary border border-light-border'
          }`}>
            <div className="flex flex-wrap items-center gap-4">
              <span className={`text-sm font-medium ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                Sort by:
              </span>
              
              {[
                { key: 'course_title', label: 'Title', icon: MdVideoLibrary },
                { key: 'course_category', label: 'Category', icon: MdCategory },
                { key: 'creator_name', label: 'Creator', icon: FaUser },
                { key: 'createdAt', label: 'Date', icon: MdSchedule }
              ].map((sortOption) => (
                <button
                  key={sortOption.key}
                  onClick={() => requestSort(sortOption.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    sortConfig?.key === sortOption.key
                      ? 'bg-primary text-white shadow-md'
                      : isDark
                        ? 'bg-dark-bg-tertiary text-dark-text-primary hover:bg-dark-bg-primary'
                        : 'bg-light-bg-tertiary text-light-text-primary hover:bg-light-bg-primary'
                  }`}
                >
                  <sortOption.icon className="text-sm" />
                  {sortOption.label}
                  {sortConfig?.key === sortOption.key && getSortIcon(sortOption.key)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCourses;