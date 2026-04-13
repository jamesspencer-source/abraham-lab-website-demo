import type { JonathanProfile } from "./types";

export const jonathanProfile = {
  name: "Jonathan Abraham, MD, PhD",
  title: "Associate Professor of Microbiology, Harvard Medical School",
  secondaryTitle: "HHMI Investigator",
  portrait: "/assets/images/people/jonathan-abraham.jpeg",
  portraitAlt: "Jonathan Abraham",
  portraitPosition: "center 22%",
  overview:
    "Jonathan Abraham leads a structural virology research program focused on how medically important viruses enter cells, engage antibodies, and replicate.",
  biography: [
    "Jonathan Abraham received a bachelor's degree in biochemical sciences from Harvard College, a PhD in biophysics from Harvard University, and an MD from Harvard Medical School through the Harvard-MIT MD-PhD Program.",
    "He completed residency training in Internal Medicine at Brigham and Women's Hospital and fellowship training in Infectious Diseases through the Brigham and Women's Hospital and Massachusetts General Hospital combined program.",
    "Supported early by a Burroughs Wellcome Career Award for Medical Scientists and an NIH Director's Early Independence Award, he launched the laboratory in the Department of Microbiology at Harvard Medical School in 2017. He also serves as an associate physician in the Division of Infectious Diseases at Brigham and Women's Hospital."
  ],
  appointments: [
    "Associate Professor of Microbiology, Harvard Medical School",
    "HHMI Investigator",
    "Associate Physician, Division of Infectious Diseases, Brigham and Women's Hospital"
  ],
  distinctions: [
    "HHMI Investigator",
    "Burroughs Wellcome Career Award for Medical Scientists",
    "NIH Director's Early Independence Award"
  ],
  focusAreas: [
    "Host receptor recognition by medically significant viruses",
    "Structural basis of antibody-mediated neutralization and escape",
    "Replication-complex organization and antiviral mechanism"
  ],
  representativeWork: [
    "Mechanisms of HSV-1 helicase-primase inhibition and replication fork complex assembly",
    "Molecular organization of the New World arenavirus spike glycoprotein complex",
    "Molecular basis for shifted receptor recognition by an encephalitic arbovirus",
    "Viral DNA polymerase structures reveal mechanisms of antiviral drug resistance"
  ]
} satisfies JonathanProfile;
