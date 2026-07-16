function AuthScreen({
  email,
  setEmail,
  password,
  setPassword,
  onSignUp,
  onLogIn,
  errorMessage,
}) {
  return (
    <div className="auth-container">
      <h1>My Fitness Tracker💪</h1>
      <input
        className="auth-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <button className="auth-btn" onClick={onSignUp}>
          Sign Up
        </button>
        <button className="auth-btn" onClick={onLogIn}>
          Log In
        </button>
        <p className="error-message">{errorMessage}</p>
      </div>
    </div>
  );
}

export default AuthScreen;
