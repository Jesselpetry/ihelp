import type { LText } from "@/lib/i18n";

// Official course facts shown on the home page header.
export const COURSE = {
  code: "06066303",
  name: {
    th: "การแก้ปัญหาและการโปรแกรมคอมพิวเตอร์",
    en: "Problem Solving and Computer Programming",
  } as LText,
  degree: { th: "ปริญญาตรี", en: "Bachelor's degree" } as LText,
  credits: { th: "3 หน่วยกิต (2-2-5)", en: "3 credits (2-2-5)" } as LText,
  description: {
    th: "กลยุทธ์และหลักการแก้ปัญหา การคิดแบบขั้นตอนวิธี ผังงาน แนวคิดและเกริ่นนำการเขียนโปรแกรมคอมพิวเตอร์",
    en: "Problem solving strategies and concepts, algorithmic thinking, flowchart, concepts and introduction to computer programming.",
  } as LText,
  url: "https://www.it.kmitl.ac.th/th/subjects/06066303-problem-solving-and-computer-programming",
  instructors: [
    {
      name: {
        th: "รศ.ดร. โชติพัชร์ ภรณวลัย",
        en: "Assoc. Prof. Dr. Chotipat Pornavalai",
      } as LText,
      url: "https://www.it.kmitl.ac.th/th/staffs/s/chotipat-pornavalai",
    },
    {
      name: {
        th: "ผศ.ดร. สามารถ หมุดและ",
        en: "Asst. Prof. Dr. Samart Moodleah",
      } as LText,
      url: "https://www.it.kmitl.ac.th/th/staffs/s/samart-moodleah",
    },
  ],
};
