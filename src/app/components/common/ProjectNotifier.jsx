"use client";

import React, { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectNotifier = ({ projects }) => {
    useEffect(() => {
        const checkSubmission = () => {
            const today = new Date();

            projects?.forEach((project) => {
                const submissionDate = new Date(project.submitDate);

                // Check if the submission date is within the next month
                const oneMonthFromToday = new Date();
                oneMonthFromToday.setMonth(today.getMonth() + 1);

                if (submissionDate >= today && submissionDate <= oneMonthFromToday) {
                    toast.info(`Project due within 1 month: ${project.projectName}
          Submission Date: ${submissionDate.toLocaleDateString()}`);
                }
            });
        };

        const interval = setInterval(checkSubmission, 1000 * 30);

        return () => clearInterval(interval);
    }, [projects]);

    return null;
};

export default ProjectNotifier;
