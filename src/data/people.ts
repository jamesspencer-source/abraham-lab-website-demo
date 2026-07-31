import type { PeopleData } from "./types";

export const peopleData = {
  currentMembers: [
    {
      name: "Jonathan Abraham, MD, PhD",
      title: "Professor of Microbiology, Harvard Medical School",
      group: "Leadership",
      image: "/assets/images/people/jonathan-abraham.jpeg",
      imageAlt: "Jonathan Abraham",
      imagePosition: "center 22%",
      order: 1
    },
    {
      name: "Pan Yang, Ph.D.",
      title: "Instructor of Microbiology",
      group: "Postdoctoral Fellows & Instructors",
      image: "/assets/images/people/pan-yang.jpg",
      imageAlt: "Pan Yang",
      order: 2
    },
    {
      name: "Wanyu Li, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      image: "/assets/images/people/wanyu-li.jpeg",
      imageAlt: "Wanyu Li",
      order: 3
    },
    {
      name: "Side Hu, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      image: "/assets/images/people/side-hu.jpg",
      imageAlt: "Side Hu",
      order: 4
    },
    {
      name: "Chenggong Ji, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      image: "/assets/images/people/chenggong-ji.png",
      imageAlt: "Chenggong Ji",
      order: 5
    },
    {
      name: "Zishuo Yu, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      image: "/assets/images/people/zishuo-yu.jpg",
      imageAlt: "Zishuo Yu",
      order: 6
    },
    {
      name: "Cristina Gutierrez-Vargas, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      image: "/assets/images/people/cristina-gutierrez-vargas.jpg",
      imageAlt: "Cristina Gutierrez-Vargas",
      order: 7
    },
    {
      name: "Biswajit Das, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      image: "/assets/images/people/biswajit-das.jpeg",
      imageAlt: "Biswajit Das",
      order: 8
    },
    {
      name: "Judy Huang, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      image: "/assets/images/people/judy-huang.jpeg",
      imageAlt: "Judy Huang",
      order: 9
    },
    {
      name: "Colin Mann, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows & Instructors",
      image: "/assets/images/people/colin-mann.jpg",
      imageAlt: "Colin Mann",
      order: 10
    },
    {
      name: "Jesse Plung",
      title: "Graduate Student (Virology)",
      programTags: ["Virology"],
      group: "Graduate Students",
      image: "/assets/images/people/jesse-plung.jpeg",
      imageAlt: "Jesse Plung",
      order: 11
    },
    {
      name: "Jessica Oros",
      title: "Graduate Student (Virology)",
      programTags: ["Virology"],
      group: "Graduate Students",
      image: "/assets/images/people/jessica-oros.jpg",
      imageAlt: "Jessica Oros",
      order: 12
    },
    {
      name: "Rick Li",
      title: "Graduate Student (MD-PhD, BBS)",
      programTags: ["MD-PhD / Biological and Biomedical Sciences"],
      group: "Graduate Students",
      image: "/assets/images/people/rick-li.jpeg",
      imageAlt: "Rick Li",
      order: 13
    },
    {
      name: "Laurentia Vianney Tjang",
      title: "Graduate Student (Virology)",
      programTags: ["Virology"],
      group: "Graduate Students",
      image: "/assets/images/people/laurentia-tjang.jpg",
      imageAlt: "Laurentia Vianney Tjang",
      order: 14
    },
    {
      name: "Corazón Núñez",
      title: "Graduate Student (Virology)",
      programTags: ["Virology"],
      group: "Graduate Students",
      image: "/assets/images/people/corazon-nunez.jpeg",
      imageAlt: "Corazón Núñez",
      order: 15
    },
    {
      name: "Alex Liu",
      title: "Graduate Student (Virology)",
      programTags: ["Virology"],
      group: "Graduate Students",
      portraitStatus: "pending",
      order: 16
    },
    {
      name: "Kevin Gong",
      title: "Graduate Student (Virology)",
      programTags: ["Virology"],
      group: "Graduate Students",
      portraitStatus: "pending",
      order: 17
    },
    {
      name: "James Spencer",
      title: "Lab Manager",
      group: "Operations & Strategy",
      image: "/assets/images/people/james-spencer.png",
      imageAlt: "James Spencer",
      order: 18
    }
  ],
  seasonalMembers: [
    {
      name: "Louella \"Ella\" Seo",
      title: "Summer Research Student"
    },
    {
      name: "Cecilia \"Cici\" Bradley",
      title: "Summer Research Technician"
    },
    {
      name: "Zaila Avant-garde",
      title: "Summer Research Student",
      program: "SHURP"
    }
  ],
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
        { name: "Taleen Dilanyan" }
      ]
    },
    {
      label: "Summer Students",
      entries: [
        { name: "Arya Akbarshahi" },
        { name: "Linzy Malcolm" }
      ]
    }
  ]
} satisfies PeopleData;
