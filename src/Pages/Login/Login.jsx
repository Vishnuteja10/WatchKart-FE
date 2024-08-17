import React, { useState,useEffect } from "react";
import styles from "./Login.module.css";
import logo from "../../Assets/Logo/logo.png";
import Footer from "../../Components/Footer/Footer";
import { useMediaQuery } from "react-responsive";
import Header from "../../Components/Header/LoginHeader/Header";
import { useNavigate } from "react-router-dom";
import useProductContext from "../../Hooks/useProductContext";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export default function Login() {
  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userId, setUserId, setLogin, login } = useProductContext();

  const EMAIL = "test1@gmail.com";
  const PASSWORD = "test1@123";

  const LOGIN = "https://watchkart-be.onrender.com/api/login";

  
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (email === EMAIL && password === PASSWORD) {
      loginUser();
    }
  }, [email, password]);

  function loginUser() {
    setLoader(true);
    axios.post(LOGIN, { email, password }).then(
      (response) => {
        if (response.data.success) {
          setLoader(false);
          const data = response.data;
          alert("login success");
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userid);
          setUserId(data.userid);
          setLogin(true);
          navigate("/");
        } else {
          setLoader(false);
          alert("Invalid credentials! login failed");
        }
      },
      (error) => {
        setLoader(false);
        alert("something went wrong");
      }
    );
  }

  function submitDetails(e) {
    e.preventDefault();
    if (!email || !password) {
      alert("please enter email and password!");
    } else {
      loginUser();
    }
  }

  function defaultLogin(e) {
    e.preventDefault();
    setEmail(EMAIL);
    setPassword(PASSWORD);
    // loginUser();
  }

  return (
    <div className={styles.main}>

      
    <div className={styles.loader}>
        <ClipLoader
          color={"black"}
          loading={loader}
          cssOverride={{ marginTop: "7vw" }}
        />
      </div>


      {isMobile ? <Header /> : ""}
      <div className={styles.outerBox}>
        {isMobile ? (
          <h1 className={styles.welcome}>Welcome</h1>
        ) : (
          <div className={styles.logoContainer}>
            {/* <img className={styles.logo} src={logo} alt="Logo Here"></img> */}
            <div className={styles.logo}> WatchKart </div>
          </div>
        )}
        <div className={styles.login}>
          <div className={styles.innerdiv}>
            {isMobile ? (
              <div className={styles.miniHeader}>
                <span className={styles.signIn}>Sign in.</span>
                <span className={styles.alreadyCustomer}>
                  Already a customer?
                </span>
              </div>
            ) : (
              <h1 className={styles.header}>Sign in</h1>
            )}
            <form onSubmit={submitDetails}>
              <div className={styles.email}>
                <label className={styles.label}>
                  Enter your email or mobile number
                </label>
                <br></br>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  type="text"
                ></input>
              </div>
              <div className={styles.password}>
                <label className={styles.label}>Password</label>
                <br></br>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  type="password"
                ></input>
                <br></br>
              </div>
              <div>
                <button className={styles.continue}>Continue</button>
              </div>
              <p className={styles.privacyNotice}>
                By continuing, you agree to WatchKart privacy notice and
                conditions of use.
              </p>
            </form>
          </div>
        </div>
        <div className={styles.newToMusicartConatiner}>
          <div className={styles.hr}>
            <hr></hr>
          </div>
          <div className={styles.newToMusicCart}>New to WatchKart?</div>
          <div className={styles.hr}>
            <hr></hr>
          </div>
        </div>

        <div>
          <button
            onClick={() => {
              navigate("/signup");
            }}
            className={styles.createAccount}
          >
            {" "}
            Create Your WatchKart account
          </button>
        </div>
        <span className={styles.guestUser} onClick={defaultLogin}>
            "Click here to Sign in as Guest user"
          </span>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
}
