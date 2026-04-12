import type { PeopleData } from "./types";

export const peopleData = {
  currentMembers: [
    {
      name: "Jonathan Abraham, M.D., Ph.D.",
      title: "Associate Professor of Microbiology, Harvard Medical School",
      note: "Structural virology, host receptor recognition, antiviral antibodies, and polymerase biology.",
      group: "Leadership",
      image: "/assets/images/people/jonathan-abraham.jpeg",
      imageAlt: "Jonathan Abraham",
      imagePosition: "center 22%",
      order: 1
    },
    {
      name: "Pan Yang, Ph.D.",
      title: "Instructor of Microbiology",
      note: "Instructor; structural and mechanistic studies in virology.",
      group: "Postdoctoral Fellows",
      image: "/assets/images/people/pan-yang.jpg",
      imageAlt: "Pan Yang",
      order: 2
    },
    {
      name: "Wanyu Li, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows",
      image: "/assets/images/people/wanyu-li.jpeg",
      imageAlt: "Wanyu Li",
      order: 3
    },
    {
      name: "Side Hu, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows",
      image: "/assets/images/people/side-hu.jpg",
      imageAlt: "Side Hu",
      order: 4
    },
    {
      name: "Chenggong Ji, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows",
      image: "/assets/images/people/chenggong-ji.png",
      imageAlt: "Chenggong Ji",
      order: 5
    },
    {
      name: "Zishuo Yu, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows",
      image: "/assets/images/people/zishuo-yu.jpg",
      imageAlt: "Zishuo Yu",
      order: 6
    },
    {
      name: "Xiaoyi Fan, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows",
      image: "/assets/images/people/xiaoyi-fan.jpg",
      imageAlt: "Xiaoyi Fan",
      order: 7
    },
    {
      name: "Cristina Gutierrez-Vargas, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows",
      image: "/assets/images/people/cristina-gutierrez-vargas.jpg",
      imageAlt: "Cristina Gutierrez-Vargas",
      order: 8
    },
    {
      name: "Biswajit Das, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows",
      image: "/assets/images/people/biswajit-das.jpeg",
      imageAlt: "Biswajit Das",
      order: 9
    },
    {
      name: "Judy Huang, Ph.D.",
      title: "Postdoctoral Fellow",
      group: "Postdoctoral Fellows",
      image: "/assets/images/people/judy-huang.jpeg",
      imageAlt: "Judy Huang",
      order: 10
    },
    {
      name: "Haley Varnum",
      title: "Graduate Student (MD-PhD, Biophysics)",
      group: "Graduate Students",
      image: "/assets/images/people/haley-varnum.jpg",
      imageAlt: "Haley Varnum",
      order: 11
    },
    {
      name: "Jesse Plung",
      title: "Graduate Student (Virology)",
      group: "Graduate Students",
      image: "/assets/images/people/jesse-plung.jpeg",
      imageAlt: "Jesse Plung",
      order: 12
    },
    {
      name: "Jessica Oros",
      title: "Graduate Student (Virology)",
      group: "Graduate Students",
      image: "/assets/images/people/jessica-oros.jpg",
      imageAlt: "Jessica Oros",
      order: 13
    },
    {
      name: "Rick Li",
      title: "Graduate Student (MD-PhD, BBS)",
      group: "Graduate Students",
      image: "/assets/images/people/rick-li.jpeg",
      imageAlt: "Rick Li",
      order: 14
    },
    {
      name: "Colin Mann",
      title: "Graduate Student (Virology)",
      group: "Graduate Students",
      image: "/assets/images/people/colin-mann.jpg",
      imageAlt: "Colin Mann",
      order: 15
    },
    {
      name: "Laurentia Vianney Tjang",
      title: "Graduate Student (Virology)",
      group: "Graduate Students",
      image: "/assets/images/people/laurentia-tjang.jpg",
      imageAlt: "Laurentia Vianney Tjang",
      order: 16
    },
    {
      name: "Corazón Núñez",
      title: "Graduate Student (Virology)",
      group: "Graduate Students",
      image: "/assets/images/people/corazon-nunez.jpeg",
      imageAlt: "Corazón Núñez",
      order: 17
    },
    {
      name: "James Spencer",
      title: "Lab Manager",
      note: "Laboratory operations, administration, and research coordination.",
      group: "Operations & Strategy",
      image: "/assets/images/people/james-spencer.png",
      imageAlt: "James Spencer",
      order: 18
    }
  ],
  alumni: [
    {
      label: "Postdoctoral and Research Fellows",
      entries: [
        { name: "Dan Olal, Ph.D." },
        { name: "Poorna Goswami, Ph.D.", destination: "Lasell University" },
        { name: "Gabor Oroszán, Ph.D.", destination: "VRG Therapeutics" },
        { name: "Chieyu Lin, Ph.D.", destination: "Beam Therapeutics" },
        {
          name: "Sundaresh Shankar, Ph.D.",
          destination: "Broad Institute of MIT and Harvard"
        },
        { name: "Keshalini Sabaratnam, Ph.D.", destination: "Kinapse" }
      ]
    },
    {
      label: "Graduate Students",
      entries: [
        { name: "Sarah Clark-Drake", destination: "Arcellx" },
        { name: "Lars Clark", destination: "Vertex Pharmaceuticals" },
        {
          name: "Katherine Nabel Smith",
          destination: "MGH/Brigham and University of Pennsylvania"
        }
      ]
    },
    {
      label: "Research Assistant and Lab Manager",
      entries: [{ name: "Vesna Brusic" }]
    },
    {
      label: "Research Technicians",
      entries: [
        {
          name: "Adrian Coscia",
          destination:
            "HST M.D.-Ph.D. Program; thesis labs of Stephen Harrison and Tomas Kirchhausen"
        },
        {
          name: "Taleen Dilanyan",
          destination: "Caltech Chemistry Ph.D. Program; thesis lab of Lior Pachter"
        }
      ]
    },
    {
      label: "Summer Students",
      entries: [
        { name: "Cecilia Bradley", destination: "Harvard SHURP, Amherst College" },
        { name: "Arya Akbarshahi", destination: "HHMI SURP, Emory University" },
        { name: "Linzy Malcolm", destination: "Harvard SHURP, Ohio State University" }
      ]
    }
  ]
} satisfies PeopleData;
