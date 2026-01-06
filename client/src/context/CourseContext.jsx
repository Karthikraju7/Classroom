import { createContext, useContext, useState } from "react";

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const [activeCourse, setActiveCourse] = useState(null);
  const [role, setRole] = useState(null);

  return (
    <CourseContext.Provider
      value={{
        activeCourse,
        setActiveCourse,
        role,
        setRole,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  return useContext(CourseContext);
}
