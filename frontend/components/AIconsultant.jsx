import React from "react";
import classes from "./AIconsultant.module.css";


function AIconsultant(){
    return(
        <section className={classes.frontPage}>
            <div className={classes.aiConsultationForm}>
            <h1>AI Consultation</h1>
            <textarea placeholder="Write about your symptoms"></textarea>
            <button>Submit</button>
        </div>
        </section>
    )
}

export default AIconsultant;