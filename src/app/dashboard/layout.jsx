import React from 'react'
import Dashboard from '../components/pages/dashboard/Dashboard'
// import { GET_PROJECTS } from '../graphql/query/projects';
// import { serverApolloClient } from '../lib/apollo-client';
// import { cookies } from "next/headers";
// import { CREATE_NOTIFICATION } from '../graphql/mutation/notification';
// import ProjectNotifier from '../components/common/ProjectNotifier';

const Layout = async ({ children }) => {

    // const cookieStore = cookies();
    // const token = cookieStore.get("authToken")?.value;
    // const userCookie = cookieStore.get("user")?.value;
    // const manager = userCookie ? JSON.parse(userCookie) : null;
    // const client = serverApolloClient(token);

    // const { data, loading } = await client.query({
    //     query: GET_PROJECTS
    // })

    // if (loading) {
    //     <h1>Loading...</h1>
    // }

    // const checkSubmittion = async () => {
    //     const projects = data?.projects?.projects;
    //     const today = new Date();

    //     projects?.map((project) => {
    //         const submissionDate = new Date(project.submitDate);

    //         // Check if the submission date is between today and 1 month from today
    //         const oneMonthFromToday = new Date();
    //         oneMonthFromToday.setMonth(today.getMonth() + 1);

    //         if (submissionDate >= today && submissionDate <= oneMonthFromToday) {
    //             toast.info(`Project within 1-month gap: ${project.projectName}
    //             Submission Date: ${submissionDate.toLocaleDateString()},
    //             Today's Date: ${today.toLocaleDateString()}
    //                 `);
    //             console.log(
    //                 "Project within 1-month gap:",
    //                 project.projectName,
    //                 "Submission Date:",
    //                 submissionDate.toLocaleDateString(),
    //                 "Today's Date:",
    //                 today.toLocaleDateString()
    //             );
    //         }
    //         // return null;
    //     });

    // let notifiedDataFilter = notifiedData?.filter((project) => project !== null)?.map((project) => project?.id);

    // if (notifiedDataFilter?.length) {
    //     try {
    //         await client.mutate({
    //             mutation: CREATE_NOTIFICATION,
    //             variables: {
    //                 projectsId: notifiedDataFilter,
    //                 managerId: manager?.id,
    //                 managerEmail: manager?.email,
    //             }
    //         })
    //     } catch (error) {
    //         console.log("error", error);
    //     }
    // }

    // console.log("notifiedDataFilter", {
    //     projectsId: notifiedDataFilter,
    //     managerId: manager?.id,
    //     managerEmail: manager?.email
    // });

    // };

    // setInterval(() => {
    //     checkSubmittion();
    // }, 3000);

    return (
        <Dashboard>
            {/* <ProjectNotifier projects={data?.projects?.projects || []} /> */}
            {children}
        </Dashboard>
    )
}

export default Layout
