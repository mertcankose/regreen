import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Feed = () => {
  const communities = ["Community 1", "Community 2", "Community 3", "Community 4"];
  const [activeCommunity, setActiveCommunity] = useState("Community 1");

  const navigate = useNavigate();

  const posts = [
    { id: 1, content: "Post 1 content", imageUrl: "https://picsum.photos/500/300?random=1" },
    { id: 2, content: "Post 2 content", imageUrl: "https://picsum.photos/500/300?random=2" },
    { id: 3, content: "Post 3 content", imageUrl: "https://picsum.photos/500/300?random=3" },
  ];

  const handleCommunityClick = (community) => {
    setActiveCommunity(community);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-4 overflow-x-auto mb-4">
        {communities.map((community, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded cursor-pointer ${
              activeCommunity === community ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleCommunityClick(community)}
          >
            {community}
          </div>
        ))}
      </div>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded p-4 mb-4">
            <img src={post.imageUrl} alt={`Post ${post.id}`} className="w-40 h-auto mb-4 rounded" />
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
