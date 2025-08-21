import React from "react";

const TaskSidebar: React.FC = () => {
  return (
    <div className="task-sidebar">
      <h3>Tasks</h3>
      <ul>
        <li>Deliver meds to Room 3B</li>
        <li>Check patient in Room 2A</li>
        <li>Restock supplies in Room 1C</li>
      </ul>
    </div>
  );
};

export default TaskSidebar;
