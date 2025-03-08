import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Message.scss";

const Message = () => {
  const { userId } = useParams(); // Assuming `userId` is passed as a parameter
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  const fetchNotifications = async () => {
    try {
      return await axios
        .get(`http://localhost:8080/api/notifications/user/${userId}`)
        .then((res) => res.data);
    } catch (error) {
      console.error("Localhost failed, trying production backend");
      return await axios
        .get(`https://agribitsystembackend-production.up.railway.app/api/notifications/user/${userId}`)
        .then((res) => res.data);
    }
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: fetchNotifications,
  });

  const mutation = useMutation({
    mutationFn: async (notification) => {
      try {
        return await axios.post("http://localhost:8080/api/notifications", notification);
      } catch (error) {
        console.error("Localhost failed, trying production backend");
        return await axios.post("https://agribitsystembackend-production.up.railway.app/api/notifications", notification);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", userId]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      userId: userId,
      content: e.target[0].value,
      timestamp: new Date().toISOString(),
      status: "Unread",
    });
    e.target[0].value = "";
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/notifications">Notifications</Link> User Notifications
        </span>
        {isLoading ? (
          "Loading notifications..."
        ) : error ? (
          "Error fetching notifications."
        ) : (
          <div className="messages">
            {data.map((notification) => (
              <div
                className={`item ${notification.status === "Unread" ? "unread" : ""}`}
                key={notification.id}
              >
                <p>{notification.content}</p>
                <span className="timestamp">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="Write a notification..." required />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;


