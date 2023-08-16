// import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {Navigate} from "react-router-dom";
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Route,Routes, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';
import { Documentation } from './Documentation';
import { useFormik } from 'formik';
// import { Card } from 'react-bootstrap';
import {Card,CardActions,CardContent, TextField } from '@mui/material';


export default function App() {
  return (
    <div className="App">
      <ButtonAppBar/>
      <Routes>
      <Route path="/" element={<Signin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<Sendotp />} />
        <Route path="/verify" element={<Verifyotp />} />
      <Route path='/mycomponent' element={<Proudctedroute> <MyComponent/></Proudctedroute> }></Route>
      <Route path='/document' element={ <Proudctedroute><Documentation/></Proudctedroute> }></Route>
      </Routes>
       </div>
  )
}

function ButtonAppBar() {
  const navigate=useNavigate()

  const handleClick = () => {
    localStorage.removeItem('token');
    setTimeout(() => {
      navigate("/login")
    }, 1500);
    console.log("logout")
  }
   return (
     <div  className='navbar'>
     <Box sx={{ flexGrow: 1 }}>
       <AppBar position="static">
         <Toolbar>
           <IconButton
             size="large"
             edge="start"
             color="inherit"
             aria-label="menu"
             sx={{ mr: 2 }}
           >
             {/* <MenuIcon /> */}
           </IconButton>
           <Button color="inherit"  onClick={()=>navigate("/")}>Home</Button>
           <Button color="inherit" onClick={()=>navigate("/document")} >Documentation</Button>
           <Button onClick={handleClick} color="inherit">LOGOUT</Button>
         </Toolbar>    
       </AppBar>
      
     </Box>
     </div>
   );
 }

 function Proudctedroute({children}){
  const token=localStorage.getItem('token');
  // const token=false;
  return(
   token? <section>{children}</section>:<Navigate replace to="/"/>
  //  token? <section>{children}</section>:<h1>unautharaied</h1>
  )
}


 function Sendotp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://bookmyshow-backend.vercel.app/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message);
      setTimeout(() => {
        navigate("/verify")
    }, 3000);
      // navigate("/verify")
    } catch (error) {
      console.log(error);
      setMessage('Failed to send OTP');
    }
  };
  return (
    <div className='parrent'>
      <Card  sx={{ maxWidth: 500 }}>
        <CardContent>
      <h1>Reset Password</h1>
      <form onSubmit={handleSendOtp}>
      <div className='child1'>
        <div><label><b>Email:</b></label></div>
        <div><TextField type="email"size="small" label="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><Button type="submit" size="medium" variant="contained">Send OTP</Button></div>
        </div>
      </form>
      {message && <p>{message}</p>}
      </CardContent>
      </Card>
    </div>
  );
}
 function Verifyotp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setpassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://bookmyshow-backend.vercel.app/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await response.json();
      setMessage(data.message);
      setTimeout(() => {
        navigate("/login")
    }, 3000);
    } catch (error) {
      console.log(error);
      setMessage('Failed to reset password');
    }
  };

  return (
    <div className='parrent'>
      <Card  sx={{ maxWidth: 500 }}>
        <CardContent>
      <form  className='newpassword' onSubmit={handleResetPassword}>
        <b>Reset Password</b>
        <div>
        <TextField type="text"label="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
        <TextField type="text" label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        </div>
        <div>
        <TextField
          type="password"
          label="New Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          required />
          </div>
          <div>
        <Button type="submit" size="medium" variant="contained">Reset Password</Button>
        </div>
      </form>
      {message && <p>{message}</p>}
      </CardContent>
      </Card>
    </div>
  );
}





function Login() {
  const navigate = useNavigate();
  const [formstate, setformstate] = useState("success");

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    // validationSchema: formValidationSchema,
    onSubmit: async (values) => {
      console.log("submit");
      const data = await fetch("https://bookmyshow-backend.vercel.app/users/login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(values)
      });
      if (data.status === 400) {
        console.log("error");
        setformstate("error");
      } else {
        setformstate("success");
        const result = await data.json();
        console.log("success", result);
        localStorage.setItem("token", result.token);
        navigate("/mycomponent");
      }

    }
  });
  return (
    <div className="login-card">

      <Card sx={{ mx: 2, minHeight: 300 }} className="card">
        <CardContent>
          <form onSubmit={formik.handleSubmit} className='loginform'>
            <h2>LOGIN</h2>
            <div className='loginfield'>
              <TextField
                name='username'
                value={formik.values.username}
                onChange={formik.handleChange}
                label="Username"
                variant="outlined" />
              <TextField
                value={formik.values.password}
                onChange={formik.handleChange}
                label="Password"
                name="password"
                type="password"
                variant="outlined" />

              <CardActions className="btn">
                <Button color={formstate} type='submit' variant="contained">{formstate === "success" ? "submit" : "retry"}</Button>
                <label className="alreadyuser" onClick={() => navigate("/")}>Sign in</label>
                <label className="alreadyuser" onClick={() => navigate("/forget-password")}>
                  Forget Password?
                </label>
              </CardActions>

            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
function Signin() {
  const navigate = useNavigate();
  const [formstate, setformstate] = useState("success");

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      firstname: '',
      lastname: ''
    },
    // validationSchema: formValidationSchema,
    onSubmit: (newdata) => {
      // console.log(values)
      adddata(newdata);
    }
  });

  const adddata = (newdata) => {
    console.log(newdata);

    fetch("https://bookmyshow-backend.vercel.app/users/signup", {
      method: "POST",
      body: JSON.stringify(newdata),
      headers: {
        "content-type": "application/json"
      }
    });
    navigate("/mycomponent");
  };
  return (
    <div className="signin-card">
      <Card sx={{ mx: 2, minHeighteight: 350 }} className="card">
        <form onSubmit={formik.handleSubmit} className='loginform'>
          <h2>SIGNUP</h2>
          <div className='loginfield'>
            <TextField
              placeholder="username"
              name='username'
              value={formik.values.username}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Username"
              variant="outlined" required />
            <TextField
              placeholder="email"
              name='email'
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="email"
              variant="outlined" required />
            <TextField
              placeholder="firstname"
              value={formik.values.firstname}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Firstname"
              name="firstname"
              type="text"
              variant="outlined" required />
            <TextField
              placeholder="lastname"
              value={formik.values.lastname}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Lastname"
              name="lastname"
              type="text"
              variant="outlined" required />
            <TextField
              placeholder="password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label="Password"
              name="password"
              type="password"
              variant="outlined" required />
            <Button color="success" type='submit' variant="contained">submit</Button>
            <p className="alreadyuser" onClick={() => navigate("/login")} sx={{ fontSize: 7 }}>
              <a>Login</a>
            </p>
          </div>

        </form>
      </Card>
    </div>

  );
}
function MyComponent() {
  const list=['#heading 1\n##heading 2\n###heading 3\n####heading 4\n#####heading 5\n---\n> this is quote...\n---\n**This is Bold**\n*This is Italic*\n---\n####order&unorder list:\n1.list 1\n2.list 2\n3.list 3\n- list 1\n\- list 2\n- list 3\n---\n####picture:\n!(https://picsum.photos/536/354)(example)\n[google](https://www.google.com)\n---\n####paragraph:\n$When used as a noun hope only a feeling, but when used as a verb hope becomes the focal point of your motivation.  Sometimes in life all you have is hope.\n####code:\n`<div><h3>this is code..</h3></div>`\n####highlight:\nI need to highlight these =very important words=\n####strike:\n ~The world is flat.~ We now know that the world is round..']
   
  const [markdown, setMarkdown] = useState(`${list}`);
  const [preview, setPreview] = useState('');
  useEffect(() => {
    fetch('https://markdown-node.vercel.app/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown }),
    })
      .then((response) => response.text())
      .then((data) => setPreview(data));
  }, [markdown]);

  function handleChange(event) {
    setMarkdown(event.target.value);
  }
  function handleClearButtonClick() {
    setMarkdown('');
  }

  return (
    
      <div className='parrent'>
        <div className='child1'>
        <textarea className='input_box' value={markdown} onChange={handleChange} />
        <Button  variant="contained" className='clear_button' onClick={handleClearButtonClick}>Clear</Button>
        </div>
      <div className='output_box' dangerouslySetInnerHTML={{ __html: preview }}></div>
      </div>
    
  );
}

 