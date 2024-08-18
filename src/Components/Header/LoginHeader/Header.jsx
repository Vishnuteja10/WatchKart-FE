import React from "react";
import style from "./Header.module.css";
import logo from "../../../Assets/Logo/icon.png";
export default function Header() {
  return (
    <div className={style.header}>
      <div className={style.logoContainer}>
        <div className={style.logo}>WatchKart</div>
      </div>
    </div>
  );
}
