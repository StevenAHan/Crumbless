import { useState } from 'react';

function Login(props) {

    const [loginForm, setLoginForm] = useState({
      username: "",
      password: ""
    });

    function logMeIn(event) {
      fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginForm)
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then((data) => {
        props.setToken(data.access_token);
        window.location.replace("/profile");
      }).catch((error) => {
        console.error('There was an error!', error);
        alert("Invalid username or password");
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      });

      setLoginForm({
        username: "",
        password: ""
      });

      event.preventDefault();
    }

    function handleChange(event) { 
      const { value, name } = event.target;
      setLoginForm(prevNote => ({
          ...prevNote, [name]: value})
      );
    }

    return (
      <div className='register-container'>
        <h1>Login</h1>
          <form className="register-form">
            <input onChange={handleChange} 
                  type="username"
                  text={loginForm.username} 
                  name="username" 
                  placeholder="Username" 
                  value={loginForm.username} />
            <input onChange={handleChange} 
                  type="password"
                  text={loginForm.password} 
                  name="password" 
                  placeholder="Password" 
                  value={loginForm.password} />

          <button onClick={logMeIn}>Submit</button>
        </form>
      </div>
    );
}

export default Login;
