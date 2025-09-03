import { useState, useEffect } from 'react';
import { useAuth } from '../store/auth.jsx';
import CardBodyd from './CardBodyd';
import SearchBard from './Searchbard.jsx'; // Import the SearchBar component
import './css/Courses.css'; // Include your CSS styles here

const CoursesList = () => {
  const { coursesData } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const uniqueCategories = [...new Set(coursesData.map(course => course.course_category))];
    setCategories(uniqueCategories);
  }, [coursesData]);

  // Filter courses based on the selected category and search term
  const filteredCourses = coursesData
    .filter(course => 
      (selectedCategory ? course.course_category === selectedCategory : true) &&
      (course.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       course.course_description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="flex flex-col gap-8 mb-8">
        <h2 className="text-3xl font-bold">All Courses</h2>
        <SearchBard searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-between">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CardBodyd key={course._id} course={course} />
          ))
        ) : (
          <div className="col-span-full text-center text-lg text-gray-500">
            No courses found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
