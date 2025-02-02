import React from "react";
import classes from "./page.module.css";
// import Header from "@/components/Header";
import Main from "@/components/Front";
import Footer from "@/components/Footer";
import AIconsultant from "@/components/AIconsultant";

export default function page() {
  return (
    <div className={classes.container}>
      {/* <Header /> */}
      <Main />
      <Footer />
      {/* <AIconsultant /> */}
    </div>
  );
}
