import axios from "axios";

export const sendEmail = async (to, subject, text) => {
  await axios.post(
    "https://send.api.mailtrap.io/api/send",
    {
      from: {
        email: "no-reply@demomailtrap.co",
        name: "CourseHub",
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      text: text,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Api-Token": process.env.MAILTRAP_API_TOKEN,
      },
    }
  );
};