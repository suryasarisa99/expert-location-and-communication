import React, { useState, useEffect } from "react";

function TeacherForm() {
  // Initialize state with data from localStorage if available
  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem("formData");
    return savedFormData
      ? JSON.parse(savedFormData)
      : {
          name: "",
          skills: [],
          workExperience: [],
          educationDetails: [],
        };
  });

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = async () => {
    // Submit formData to the backend
    // Clear formData from localStorage on successful submission
    localStorage.removeItem("formData");
    // Handle submission logic...
  };

  // Render form steps and update formData as the user progresses
  // Final step would call handleSubmit to submit all data
}
