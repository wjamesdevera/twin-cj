import FeedbackTable from "./feedback-table";
import s from "./page.module.scss";
const Page = () => {
  return (
    <div className={s["page_container"]}>
      <div className={s.page_header}>
        <h1 className={s.title}>Feedbacks</h1>
      </div>
      <div className={s.subheader_container}>
        <h2 className={s.subheader}>Select a Feedback to modify</h2>
      </div>
      <FeedbackTable />
    </div>
  );
};

export default Page;
