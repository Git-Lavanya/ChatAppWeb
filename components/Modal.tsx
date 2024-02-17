import React from "react";
import Styles from "../styles/Comp.module.scss";
export default function Modal(props) {
  const { onClose, open, children } = props;
  return (
    <div
      className={Styles[open ? "modal-overlay" : "modal-hidden"]}
      id="myModal"
    >
      <div className={Styles["modal-container"]}>
        <span className={Styles["modal-close"]} onClick={onClose}>
          &times;
        </span>
        <p>{children}</p>
      </div>
    </div>
  );
}
