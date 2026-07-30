import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { assets } from "../../../assets/assets";
const Footer = () => {
  return (
    <>
      <div className="footer" id="footer">
        <div className="footer-content">
          <div className="footer-content-left">
            <Link to="/">
              <img src={assets.logo} />
            </Link>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit at,
              libero repudiandae iure atque delectus cum ea ratione! Numquam,
              commodi.
            </p>
            <div className="footer-social-icons">
              <img src={assets.facebook_icon} />
              <img src={assets.twitter_icon} />
              <img src={assets.linkedin_icon} />
            </div>
          </div>
          <div className="footer-content-center">
            <h2>COMPANY </h2>
            <ul>
              <Link to="/">Home</Link>
              <li>About Us</li>
              <li>Delivery</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div className="footer-content-right">
            <h2>Contacts</h2>
            <ul>
              <li>9415625191</li>
              <li>hm2300439@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2026 @Tomato.com - All Rights Reserved.
      </p>
    </>
  );
};

export default Footer;
