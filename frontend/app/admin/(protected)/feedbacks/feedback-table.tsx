"use client";

import { getFeedbacksAdmin, updateFeedbackStatus } from "@/app/lib/api";
import React, { useState } from "react";
import useSWR from "swr";
import s from "@/app/table.module.scss";
import ts from "./feedback-table.module.scss";
import { Loading } from "@/app/components/loading";
import useSWRMutation from "swr/mutation";
import { Box, Modal } from "@mui/material";

const ITEMS_PER_PAGE = 10;

interface Feedback {
  id: number;
  name: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  status: {
    id: number;
  };
}

const formatDate = (isoString?: string) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const FeedbackStatusDropdown: React.FC<{
  id: number;
  defaultValue: number;
}> = ({ id, defaultValue }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 8,
    boxShadow: 24,
    p: 4,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusId, setStatusId] = useState(defaultValue.toString());
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const { trigger, isMutating } = useSWRMutation(
    id.toString(),
    (key: string, { arg }: { arg: { statusId: string } }) =>
      updateFeedbackStatus(key, Number(arg.statusId)),
    {
      onSuccess: () => {
        handleClose();
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusId(e.target.value);
    handleOpen();
  };

  const onConfirm = async () => {
    await trigger({ statusId });
  };

  const onCancel = async () => {
    setStatusId(defaultValue.toString());
    handleClose();
  };

  return (
    <>
      <select className={ts.select} value={statusId} onChange={handleChange}>
        <option value="1">For Review</option>
        <option value="2">Approved</option>
      </select>

      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 className={ts.modalTitle}>Confirm Status Change?</h2>
          <div className={ts.button_container}>
            <button
              className={ts.confirm_btn}
              onClick={onConfirm}
              disabled={isMutating}
            >
              {isMutating ? "Updating..." : "Confirm"}
            </button>
            <button className={ts.cancel_btn} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

const FeedbackTable = () => {
  const { data, isLoading } = useSWR("feedback", getFeedbacksAdmin);
  const { feedbacks = [] }: { feedbacks: Feedback[] } = data?.data || {};

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(feedbacks.length / ITEMS_PER_PAGE);

  const paginatedFeedbacks = feedbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const headers = ["Author", "Feedback", "Created At", "Updated At", "Status"];

  if (isLoading) return <Loading />;

  return (
    <div className={s.table_container}>
      <div className={s.table_wrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedFeedbacks.map((feedback: Feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.name}</td>
                <td>{feedback.text}</td>
                <td>{formatDate(feedback.createdAt)}</td>
                <td>{formatDate(feedback.updatedAt)}</td>
                <td>
                  <FeedbackStatusDropdown
                    defaultValue={feedback.status.id}
                    id={feedback.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {feedbacks.length > 0 && (
        <div className={s.pagination}>
          <button
            className={s.page_button}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span className={s.page_info}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={s.page_button}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackTable;
