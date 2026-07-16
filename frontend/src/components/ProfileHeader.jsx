function ProfileHeader({ session, onSignOut }) {
  return (
    <div className="profile-header">
      <p>
        Logged in as: <strong>{session.user.email}</strong>
      </p>
      <button onClick={onSignOut} className="logout-btn">
        Log Out
      </button>
    </div>
  );
}

export default ProfileHeader;
