import React from "react";
import { useParams } from "react-router-dom";

function ProfilePage() {
  const { id } = useParams();

  return (
    <>
      {id}
      <div>ProfilePage</div>
    </>
  );
}

export default ProfilePage;
