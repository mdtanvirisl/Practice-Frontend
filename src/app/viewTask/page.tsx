"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import TopBar from "../components/topbar/page";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  createdBy: {
    userid: number;
    name: string;
    email: string;
    username: string;
    address: string;
    filename: string;
  } | null; 
  assignedTo: Array<{
    userid: number;
    name: string;
    email: string;
    username: string;
    address: string;
    filename: string;
  }> | null; 
}

export default function ViewTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3444/user/alltasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setTasks(response.data); // Assuming the response contains an array of tasks
      }
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks. Please try again.");
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when the component mounts
  }, []);

  return (
    <>
      <TopBar />
      <div className="max-w-7xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-center mb-4">All Tasks</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full shadow-xl">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.status}</td>
                  <td>
                    {/* Safely accessing createdBy properties using optional chaining */}
                    {task.createdBy?.name ? (
                      <div className="font-semibold">{task.createdBy.name}</div>
                    ) : (
                      <div className="text-gray-500">N/A</div>
                    )}
                    {task.createdBy?.email && <div>{task.createdBy.email}</div>}
                  </td>
                  <td>
                    {/* Checking if assignedTo is not null and then rendering assigned users */}
                    {task.assignedTo && task.assignedTo.length > 0 ? (
                      task.assignedTo.map((user) => (
                        <div key={user.userid}>
                          <div className="font-semibold">{user.name}</div>
                          <div>{user.email}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No assignees</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
