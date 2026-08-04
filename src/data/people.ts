import type { PeopleData } from "./types";

export const peopleData = {
  currentMembers: [
    {
      name: "Jonathan Abraham, MD, PhD",
      title: "Professor of Microbiology, Harvard Medical School",
      group: "Leadership",
      order: 1
    },
    {
      name: "Pan Yang, Ph.D.",
      title: "Instructor of Microbiology",
      group: "Postdoctoral Fellows & Instructors",
      order: 2
    },
    {
      name: "Wanyu Li, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      order: 3
    },
    {
      name: "Side Hu, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      order: 4
    },
    {
      name: "Chenggong Ji, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      order: 5
    },
    {
      name: "Zishuo Yu, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      order: 6
    },
    {
      name: "Cristina Gutierrez-Vargas, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      order: 7
    },
    {
      name: "Biswajit Das, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      order: 8
    },
    {
      name: "Judy Huang, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      order: 9
    },
    {
      name: "Colin Mann, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      order: 10
    },
    {
      name: "Jesse Plung",
      title: "Graduate Student",
      programTags: ["Virology"],
      group: "Graduate Students",
      order: 11
    },
    {
      name: "Jessica Oros",
      title: "Graduate Student",
      programTags: ["Virology"],
      group: "Graduate Students",
      order: 12
    },
    {
      name: "Rick Li",
      title: "Graduate Student",
      programTags: ["MD-PhD / Biological and Biomedical Sciences"],
      group: "Graduate Students",
      order: 13
    },
    {
      name: "Laurentia Vianney Tjang",
      title: "Graduate Student",
      programTags: ["Virology"],
      group: "Graduate Students",
      order: 14
    },
    {
      name: "Corazón Núñez",
      title: "Graduate Student",
      programTags: ["Virology"],
      group: "Graduate Students",
      order: 15
    },
    {
      name: "Alex Liu",
      title: "Graduate Student",
      programTags: ["Virology"],
      group: "Graduate Students",
      order: 16
    },
    {
      name: "Kevin Gong",
      title: "Graduate Student",
      programTags: ["Virology"],
      group: "Graduate Students",
      order: 17
    },
    {
      name: "James Spencer",
      title: "Lab Manager",
      group: "Operations & Strategy",
      order: 18
    }
  ],
  seasonalMembers: [
    {
      name: "Louella \"Ella\" Seo",
      title: "Summer Research Student"
    }
  ] as PeopleData["seasonalMembers"],
  alumni: [
    {
      label: "Postdoctoral and Research Fellows",
      entries: [
        { name: "Dan Olal, Ph.D." },
        { name: "Poorna Goswami, Ph.D.", destination: "Lasell University" },
        { name: "Gabor Oroszán, Ph.D.", destination: "VRG Therapeutics" },
        { name: "Chieyu Lin, Ph.D." },
        { name: "Sundaresh Shankar, Ph.D." },
        { name: "Keshalini Sabaratnam, Ph.D." },
        { name: "Xiaoyi Fan, Ph.D." }
      ]
    },
    {
      label: "Graduate Students",
      entries: [
        { name: "Sarah Clark-Drake", destination: "Arcellx" },
        { name: "Lars Clark" },
        {
          name: "Katherine Nabel Smith",
          destination: "Penn Dermatology, University of Pennsylvania"
        },
        { name: "Haley Varnum, Ph.D." }
      ]
    },
    {
      label: "Research Assistant and Lab Manager",
      entries: [{ name: "Vesna Brusic" }]
    },
    {
      label: "Research Technicians",
      entries: [
        { name: "Adrian Coscia" },
        { name: "Taleen Dilanyan" },
        { name: "Cecilia \"Cici\" Bradley" }
      ]
    },
    {
      label: "Summer Students",
      entries: [
        { name: "Arya Akbarshahi" },
        { name: "Linzy Malcolm" },
        { name: "Zaila Avant-garde" }
      ]
    }
  ]
} satisfies PeopleData;
