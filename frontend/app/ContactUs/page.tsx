import React from "react";
import Header from "./../components/Header";
import Title from "./../components/Title";
import ContactInfo from "../components/ContactInfo";
import InquiryForm from "./../components/InquiryForm";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import styles from "./page.module.scss";

export default function ContactUs() {
  return (
    <>
      <Navbar />
      <Header />
      <Title text="CONTACT US" />
      <ContactInfo />
      <Title text="GOT ANY CONCERNS? WE'RE HERE!" />
      <InquiryForm />
      <Footer />
    </>
  );
}
