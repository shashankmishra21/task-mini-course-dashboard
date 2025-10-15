import React, { useEffect, useState } from 'react';
import API from '../api';

const Dashboard = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    API.get('/course').then((res) => setCourses(res.data));
  }, []);

  const handleComplete = async (moduleId: number) => {
    await API.post(`/progress/complete/${moduleId}`);
    API.get('/course').then((res) => setCourses(res.data));
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Course Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Courses</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Progress</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {course.modules.map((mod: any) => (
                  <div key={mod.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{mod.isCompleted ? '✅' : '⬜'}</span>
                      <span className={mod.isCompleted ? 'text-gray-500' : 'text-gray-800'}>{mod.title}</span>
                    </div>
                    {!mod.isCompleted && (
                      <button
                        onClick={() => handleComplete(mod.id)}
                        className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
